// @flow

// 方块
export default class Brick {
  shape: Array<number>
  color: string

  constructor(configs: { shape: Array<Array<number>>, color: string | null }) {
    this.shape = configs.shape
    this.color = configs.color || 'gray'
  }

  // 获取方块的位置信息
  getShape(): Array<Array<number>> {
    return this.shape
  }

  async move(pos: [number, number]) {
    return true
  }
}
