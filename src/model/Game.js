// @flow

import Brick from './Brick'
import { deepCopy, lineIndex, rotateArray } from '../utils'
import { pointType, gameType } from '../enum'

// 游戏的核心控制
// 用来进行方块数据的移动
export default class Game {
  width: number
  height: number
  status: number
  position: pos | null
  nextPosition: pos | null
  brick: Brick | null
  matrix: matrix
  oldMatrix: matrix
  blend: matrix | null
  oldBrickColor: string
  backColor: string
  removeLines: number

  constructor(configs: Object = {}) {
    this.width = configs.width || 8
    this.height = configs.height || 20
    this.oldBrickColor = configs.oldBrickColor || '#4caf50'
    this.backColor = configs.backColor || '#9e9e9e'
  }

  init() {
    this.status = gameType.start

    this.oldMatrix = new Array(this.height)
      .fill(0)
      .map((_: number): arr => new Array(this.width).fill(pointType.empty))

    this.matrix = deepCopy(this.oldMatrix)
    this.removeLines = 0
  }

  loadBrick(brick: Brick, position: pos) {
    let { matrix, status } = this

    if (status === gameType.over) return

    this.brick = brick
    this.nextPosition = position
    this.status = gameType.running

    let blend = (this.blend = brick.getShape())
    let [x, y] = position

    // can not put
    if (
      blend.some(
        (arr: arr, row: number): boolean =>
          !!arr &&
          arr.some((item: number, col: number): boolean => {
            let matrixRow = matrix[row + y]
            return !!(item && matrixRow && matrixRow[col + x])
          })
      )
    ) {
      this.status = gameType.over
      return
    }

    this.updateMatrix()
  }

  // 更新当前brick的位置
  updateMatrix() {
    let { oldMatrix, nextPosition, status } = this

    if (status === gameType.over) return

    this.matrix = deepCopy(oldMatrix)
    this.position = nextPosition

    this.setup()
  }

  // 将当前活动的方块装载到矩阵中
  setup() {
    let { matrix, position, blend } = this

    if (!blend || !position) return

    let [x, y] = position

    // put brick
    blend.forEach(
      (arr: arr, row: number) =>
        arr &&
        arr.forEach((item: number, col: number) => {
          let matrixRow = matrix[row + y]
          if (item && matrixRow) {
            matrixRow[col + x] = item
          }
        })
    )
  }

  // 进行移动的操作
  move(pos: 'down' | 'left' | 'right' | 'bottom') {
    let {
      position,
      brick,
      height,
      width,
      matrix,
      oldMatrix,
      blend,
      status
    } = this

    if (!position || !brick || !blend || status === gameType.over) return

    let firstRow = blend[0]

    if (!firstRow) return

    let brickWidth = firstRow.length

    let [x, y] = position
    this.nextPosition = null
    switch (pos) {
      case 'down': // 自然下降
        this.nextPosition = [x, y + 1]
        break
      case 'left': // 左移
        if (
          x <= 0 ||
          blend.some((row, rowIndex) => {
            let _pos = oldMatrix[y + rowIndex]
            return row && row[0] && _pos && _pos[x - 1]
          })
        )
          return // 左侧有障碍物，无法移动
        this.nextPosition = [x - 1, y]
        break
      case 'right': // 右移
        if (
          x >= width - brickWidth ||
          blend.some((row, rowIndex) => {
            let _pos = oldMatrix[y + rowIndex]
            return row && row[brickWidth - 1] && _pos && _pos[x + brickWidth]
          })
        )
          return // 右侧有障碍物，无法移动
        this.nextPosition = [x + 1, y]
        break
      case 'bottom': // 下降到底部
        let topLine = lineIndex(this.oldMatrix, false)
        let deep = Math.min.apply(
          Math,
          lineIndex(this.blend, true).map((deep, colIndex) => {
            return topLine[x + colIndex] - deep
          })
        ) // 获取最多可以下降到的坐标
        this.nextPosition = [x, deep]
        break
      case 'rotate': // 旋转
        let newBlend = rotateArray(this.blend)

        let newFirstRow = newBlend[0]

        let rangeLen = newFirstRow ? newFirstRow.length + x - width : 0

        if (
          newBlend.some((row, rowIndex) => {
            let _pos = oldMatrix[y + rowIndex]
            return (
              row &&
              _pos &&
              row.some((col, colIndex) => col && _pos[colIndex + x])
            )
          })
        ) {
          return // console.log('有障碍物')
        } else if (rangeLen > 0) {
          this.nextPosition = [x - rangeLen, y]
        } else {
          this.nextPosition = position
        }

        this.blend = newBlend
        break
      default:
        // 其余情况不处理
        return
    }
    this.updateMatrix()

    this.bottomDetection()
  }

  // 触底检测
  bottomDetection() {
    let { matrix, position, status, blend, height } = this

    if (!blend || !position || status === gameType.over) return

    let [x, y] = position
    let blIndex = lineIndex(blend, true) // 这里边获取的下标 + 当前方块的坐标，如果对应的在矩阵中有值，就说明触底了。

    let blPos = blIndex.map((index, colIndex) => [x + colIndex, y + index])

    let result = blPos.some(
      ([col, row]) => row === height || matrix[row][col] === pointType.oldBrick
    )

    if (result) {
      // merge brick
      this.mergeBrick()

      // unload brick
      this.unloadBrick()

      this.removeFullLine()
    }
  }

  // 触底后进行合并，将之前的方块塞入背景中，移除方块的引用，等待新的方块
  mergeBrick() {
    let { matrix, oldMatrix, blend, position, status } = this

    if (!position || !blend) return

    let [x, y] = position

    blend.forEach((row, rowIndex) => {
      row &&
        row.forEach((col, colIndex) => {
          let yPos = rowIndex + y
          let xPos = colIndex + x

          let oldMatrixRow = this.oldMatrix[yPos]
          let matrixRow = this.matrix[yPos]
          if (col && oldMatrixRow && matrixRow) {
            oldMatrixRow[xPos] = matrixRow[xPos] = pointType.oldBrick
          }
        })
    })
  }

  // 移除整行的方块
  removeFullLine() {
    let { oldMatrix, width } = this

    let fullLineCount = 0
    oldMatrix.forEach((row, rowIndex) => {
      if (
        !!row &&
        row.every(_ => _ === pointType.oldBrick || _ === pointType.newBrick)
      ) {
        oldMatrix[rowIndex] = null
        fullLineCount++
      }
    })

    // 如果有移除的行
    if (fullLineCount) {
      this.oldMatrix = new Array(fullLineCount)
        .fill(0)
        .map(_ => new Array(width).fill(pointType.empty))
        .concat(oldMatrix.filter(_ => _))
      this.updateMatrix()

      this.removeLines += fullLineCount
    }
  }

  // 卸载方块
  unloadBrick() {
    this.status = gameType.free
    this.brick = null
    this.blend = null
    this.position = null
    this.nextPosition = null
  }

  // 调试用的方法，也可以作为console版本游戏来看待
  log() {
    console.clear()
    console.log(
      this.matrix
        .map((arr: arr): string => (arr ? arr.join('') : ''))
        .join('\n')
    )
  }
}
