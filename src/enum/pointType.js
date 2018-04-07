import buildEnum from '../utils/buildEnum'

let obj = {
  empty: 0,
  newBrick: 1,
  oldBrick: 2
}

module.exports = buildEnum(obj)
