import shapes from '../data/shapes'

const len = shapes.length

export default function() {
  return shapes[(Math.random() * len) | 0]
}
