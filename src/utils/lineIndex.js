import { rotateArray, matrixString } from '.'

let cache = {} // 添加一个缓存对象

module.exports = function(arg: matrix, bottom: boolean) {
  let key = matrixString(arg)

  if (cache[key]) return cache[key]

  return (cache[key] = rotateArray(arg).map(filterIndex(bottom)))
}

/**
 * 获取每一列对应的下标
 * @param {boolean} bottom
 */
function filterIndex(bottom: boolean) {
  return function(row: arr): number {
    let result = getIndex(bottom ? row : [].concat(row).reverse())
    return bottom
      ? result >= 0 ? row.length - result : result
      : result === -1 ? row.length : result
  }
}

/**
 * 获取当前下标，如果没有则返回-1
 * @param {martix} arr
 * @param {number} index
 */
function getIndex(arr: arr, index: number = 0): number {
  if (index >= arr.length) return -1

  return arr[index] ? index : getIndex(arr, index + 1)
}
