// @flow

import Brick from './Brick'

declare type pos = [number, number]
declare type matrix = Array<Array<number>>

// 游戏的核心控制
// 用来进行方块数据的移动
export default class Game {
  width: number
  height: number
  position: pos
  brick: Brick
  matrix: matrix
  oldMatrix: matrix
  blend: matrix

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
    this.oldMatrix = new Array(this.height)
      .fill(0)
      .map((_: number): Array<number> => new Array(this.width).fill(0))
    this.matrix = deepCopy(this.oldMatrix)
  }

  loadBrick(brick: Brick, position: pos) {
    let { matrix } = this
    this.brick = brick
    this.position = position

    let blend = (this.blend = brick.getShape())
    let [x, y: string] = position

    // can not put
    if (
      blend.some((arr: Array<number>, row: number): boolean =>
        arr.some(
          (item: number, col: number): boolean =>
            !!(item && matrix[row + y][col + x])
        )
      )
    ) {
      throw new Error('can not load new brick')
    }

    this.setup()
  }

  // 更新当前brick的位置
  updateMatrix(nextPosition: pos) {
    let { oldMatrix } = this

    this.matrix = deepCopy(oldMatrix)
    this.position = nextPosition

    this.setup()
  }

  setup() {
    let { matrix, position, blend } = this
    let [x, y] = position

    // put brick
    blend.forEach((arr: Array<number>, row: number): void =>
      arr.forEach(
        (item: number, col: number): any =>
          item && (matrix[row + y][col + x] = item)
      )
    )
  }

  async move(pos: 'down' | 'left' | 'right' | 'bottom') {
    let { position, brick, height } = this
    let [x, y] = position
    let nextPosition = null
    switch (pos) {
      case 'down':
        nextPosition = [x, 0 + 1]
        break
      case 'left':
        nextPosition = [x - 1, y]
        break
      case 'right':
        nextPosition = [x + 1, y]
        break
      case 'bottom':
        nextPosition = [x, height - 1]
        break
      // case 'rotate':
      default:
        return
    }
    await brick.move(nextPosition)
    this.updateMatrix(nextPosition)
  }

  log() {
    console.clear()
    console.log(
      this.matrix.map((arr: Array<number>): string => arr.join('')).join('\n')
    )
  }
}

function deepCopy(arg: Array<Array<number>>): Array<Array<number>> {
  return [...arg.map((item: Array<number>): Array<number> => [...item])]
}
