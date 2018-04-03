// @flow

// 方块
export default class Brick {
  shape: matrix
  color: string

  constructor(configs: { shape: matrix, color?: string }) {
    this.shape = configs.shape
    this.color = configs.color || 'gray'
  }

  // 获取方块的位置信息
  getShape(): matrix {
    return this.shape
  }

  async move(pos: [number, number]): any {}
}
