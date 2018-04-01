// @flow

import Brick from './Brick'

declare type pos = [number, number]

// 游戏的核心控制
// 用来进行方块数据的移动
export default class Game {
  width: number
  height: number
  position: pos
  matrix: Array<Array<number>>

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
      .map(_ => new Array(this.width).fill(0))
    this.matrix = deepCopy(this.oldMatrix)
  }

  loadBrick(brick: Brick, position: pos) {
    let { matrix } = this
    this.brick = brick
    this.position = position

    let blend = (this.blend = brick.getShape())
    let [x, y] = position

    // can not put
    if (
      blend.some((arr, row) =>
        arr.some((item, col) => item && matrix[row + y][col + x])
      )
    ) {
      throw new Error('can not load new brick')
    }

    this.setup()
  }

  // 更新当前brick的位置
  updateMatrix(nextPosition: pos) {
    let { oldMatrix } = this

    this.matrix = deepCopy(this.oldMatrix)
    this.position = nextPosition

    this.setup()
  }

  setup() {
    let { matrix, position, blend } = this
    let [x, y] = position

    // put brick
    blend.forEach((arr, row) =>
      arr.forEach((item, col) => item && (matrix[row + y][col + x] = item))
    )
  }

  async move(pos: 'bottom' | 'left' | 'right') {
    let { position, brick, height } = this
    let [x, y] = position
    let nextPosition = null
    switch (pos) {
      case 'bottom':
        nextPosition = [x, height - 1]
      case 'left':
        nextPosition = [x - 1, y]
      case 'right':
        nextPosition = [x + 1, y]
    }
    await brick.move(nextPosition)
    this.updateMatrix(nextPosition)
  }

  log() {
    console.clear()
    console.log(this.matrix.map(arr => arr.join('')).join('\n'))
  }
}

function deepCopy(arg) {
  return [...arg.map(item => [...item])]
}
