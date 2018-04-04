// @flow

import Game from './model/Game'
import Brick from './model/Brick'
import { pointType, gameType } from './enum'

let game = new Game()

game.init()

let brick = new Brick({
  shape: [
    [pointType.newBrick, pointType.newBrick, pointType.newBrick],
    [pointType.empty, pointType.empty, pointType.newBrick]
  ]
})

game.loadBrick(brick, [0, 0])

game.log()

window.addEventListener('keyup', async function(e: KeyboardEvent) {
  if (game.status === gameType.over) return
  let arrow = {
    '83': 'bottom',
    '68': 'right',
    '65': 'left',
    '87': 'rotate'
  }

  await game.move(arrow[e.keyCode])
  game.log()
})

let interval = setInterval(async () => {
  await game.move('down')
  game.log()

  if (game.status === gameType.over) {
    clearInterval(interval)
  }
}, 1000)
