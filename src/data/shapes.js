import { pointType } from '../enum'
import { rotateArray } from '../utils'

let { newBrick, empty } = pointType

let shapes = [
  [[newBrick, newBrick, newBrick], [empty, empty, newBrick]],
  [[newBrick, newBrick, newBrick, newBrick]],
  [[newBrick, newBrick, newBrick], [empty, newBrick, empty]],
  [[newBrick, newBrick, empty], [empty, newBrick, newBrick]],
  [[newBrick, newBrick], [newBrick, newBrick]]
]

shapes.forEach(item => {
  let rotate1 = rotateArray(item)
  let rotate2 = rotateArray(rotate1)
  let rotate3 = rotateArray(rotate2)
  shapes = shapes.concat([rotate1, rotate2, rotate3])
})

module.exports = shapes
