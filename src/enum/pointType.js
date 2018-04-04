import { buildEnum } from '../utils'

let obj = {
  empty: 0,
  newBrick: 1,
  oldBrick: 2
}

module.exports = buildEnum(obj)
