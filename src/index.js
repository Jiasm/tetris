// @flow

import Game from './model/Game'
import Brick from './model/Brick'

let game = new Game()

game.init()

let brick = new Brick({
  shape: [[1, 1, 1], [0, 0, 1]]
})

game.loadBrick(brick, [0, 0])

game.log()

window.addEventListener('keyup', async function(e: KeyboardEvent) {
  let arrow = {
    '83': 'bottom',
    '68': 'right',
    '65': 'left',
    '87': 'rotate'
  }

  console.log(arrow[e.keyCode])
  await game.move(arrow[e.keyCode])
  game.log()
})

// setInterval(async () => {
//   await game.move('down')
//   game.log()
// }, 1000)
