// @flow

import Game from './model/Game'
import Brick from './model/Brick'

let game = new Game()

game.init()

let brick = new Brick({
  shape: [[1, 1, 1], [0, 0, 1]]
})

game.loadBrick(brick, [0, 0, 1])

game.log()

window.addEventListener('keyup', async function(e: KeyboardEvent): void {
  let arrow = {
    83: 'bottom',
    68: 'right',
    65: 'left',
    87: 'rotate'
  }

  await game.move(arrow[e.keyCode])
  game.log()
})

setInterval(async (): void => {
  await game.move('down')
  game.log()
}, 1000)
