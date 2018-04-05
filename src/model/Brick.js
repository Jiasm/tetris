// @flow
import { rotateArray } from '../utils'

const deafultColors = [
  '#ffc107',
  '#2196f3',
  '#673ab7',
  '#f44336',
  '#009688',
  '#ffeb3b'
]

// 方块
export default class Brick {
  shape: matrix
  color: string

  constructor(configs: { shape: matrix, color?: string }) {
    this.shape = configs.shape
    this.color =
      configs.color || deafultColors[(Math.random() * deafultColors.length) | 0]
  }

  // 获取方块的位置信息
  getShape(): matrix {
    return this.shape
  }
}
