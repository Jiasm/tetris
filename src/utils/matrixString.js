/**
 * 将一个矩阵转换为字符串，主要用来获取方块坐标信息的缓存使用
 * @param {matrix} arr
 */
export default function(arr: matrix): string {
  return arr.map(row => row.join('')).join('|')
}
