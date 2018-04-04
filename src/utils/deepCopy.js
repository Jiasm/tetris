/**
 * 一个针对性很强的深拷贝
 * @param {matrix} arg
 */
module.exports = function(arg: matrix): matrix {
  return [...arg.map((row: arr): arr => [...row])]
}
