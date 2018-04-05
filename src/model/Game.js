// @flow

import Brick from './Brick'
import { deepCopy, lineIndex } from '../utils'
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

  constructor(
    configs: Object = {
      width: 8,
      height: 20
    }
  ) {
    this.width = configs.width
    this.height = configs.height
  }

  init() {
    // width: 2 height: 4
    // [
    //   [0, 0],
    //   [0, 0],
    //   [0, 0],
    //   [0, 0]
    // ]

    this.status = gameType.start

    this.oldMatrix = new Array(this.height)
      .fill(0)
      .map((_: number): arr => new Array(this.width).fill(pointType.empty))

    // test
    this.oldMatrix[this.height - 2] = new Array(this.width).fill(
      pointType.oldBrick
    )
    this.oldMatrix[this.height - 1] = new Array(this.width).fill(
      pointType.oldBrick
    )
    this.matrix = deepCopy(this.oldMatrix)
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
      blend.some((arr: arr, row: number): boolean =>
        arr.some(
          (item: number, col: number): boolean =>
            !!(item && matrix[row + y][col + x])
        )
      )
    ) {
      this.status = gameType.over
      return
      // throw new Error('can not load new brick')
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
    blend.forEach((arr: arr, row: number): void =>
      arr.forEach(
        (item: number, col: number): any =>
          item && (matrix[row + y][col + x] = item)
      )
    )

    this.bottomDetection()
  }

  async move(pos: 'down' | 'left' | 'right' | 'bottom') {
    let { position, brick, height, width, matrix, blend, status } = this

    if (!position || !brick || !blend || status === gameType.over) return

    let [x, y] = position
    this.nextPosition = null
    switch (pos) {
      case 'down':
        this.nextPosition = [x, y + 1]
        break
      case 'left':
        if (x <= 0) return
        this.nextPosition = [x - 1, y]
        break
      case 'right':
        if (x >= width - blend[0].length) return
        this.nextPosition = [x + 1, y]
        break
      case 'bottom':
        let topLine = lineIndex(this.oldMatrix, false)
        let deep = Math.min.apply(
          Math,
          lineIndex(this.blend, true).map(
            (deep, colIndex) => topLine[x + colIndex] - deep
          )
        )
        this.nextPosition = [x, deep]
        break
      case 'rotate':
        this.nextPosition = position
        brick.rotate()
        this.blend = brick.getShape()
        break
      default:
        return
    }
    this.nextPosition && (await brick.move(this.nextPosition))
    this.updateMatrix()
  }

  // 触底检测
  bottomDetection() {
    let { matrix, position, status } = this

    if (!position || status === gameType.over) return

    let [x, y] = position
    let blIndex = lineIndex(this.blend, true) // 这里边获取的下标 + 当前方块的坐标，如果对应的在矩阵中有值，就说明触底了。

    let blPos = blIndex.map((index, colIndex) => [x + colIndex, y + index])

    let result = blPos.some(
      ([col, row]) => matrix[row][col] === pointType.oldBrick
    )

    if (result) {
      this.status = gameType.free

      // merge brick
      this.mergeBrick()

      // unload brick
      this.unloadBrick()
    }
  }

  // 触底后进行合并，将之前的方块塞入背景中，移除方块的引用，等待新的方块
  mergeBrick() {
    let { matrix, blend, position, status } = this

    if (!position || status !== gameType.free) return

    let [x, y] = position

    blend &&
      blend.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          let yPos = rowIndex + y
          let xPos = colIndex + x
          if (col) {
            this.oldMatrix[yPos][xPos] = this.matrix[yPos][xPos] =
              pointType.oldBrick
          }
        })
      })
  }

  unloadBrick() {
    this.brick = null
    this.blend = null
    this.position = null
    this.nextPosition = null
  }

  log() {
    console.clear()
    console.log(this.matrix.map((arr: arr): string => arr.join('')).join('\n'))
  }
}
