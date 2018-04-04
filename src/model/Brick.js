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

  // 旋转方块
  rotate(): void {
    this.shape = rotateArr(this.shape)
  }

  async move(pos: [number, number]): any {}
}

function rotateArr(arr: matrix): matrix {
  let rowLen = arr.length
  let colLen = arr[0].length

  let newArr = new Array(colLen).fill(0).map(_ => new Array(rowLen).fill(0))

  arr = [].concat(arr).reverse()

  newArr.forEach((row, rowIndex) => {
    row.forEach((_, col) => {
      newArr[rowIndex][col] = arr[col][rowIndex]
    })
  })

  return newArr
}
