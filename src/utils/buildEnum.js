module.exports = function(obj) {
  let newObj = {}

  Object.entries(Object.assign(newObj, obj)).forEach(
    ([value, key]) => (newObj[key] = value)
  )

  return newObj
}
