module.exports = function(arg: matrix): matrix {
  let rowLen = arg.length
  let colLen = arg[0].length

  let newArg = new Array(colLen).fill(0).map(_ => new Array(rowLen).fill(0))

  arg = [].concat(arg).reverse()

  newArg.forEach((row, rowIndex) => {
    row.forEach((_, col) => {
      newArg[rowIndex][col] = arg[col][rowIndex]
    })
  })

  return newArg
}
