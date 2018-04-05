// @flow

import Game from './model/Game'
import Brick from './model/Brick'
import { pointType, gameType } from './enum'
import { RenderCanvas } from './view'
import { getShape } from './data'

let game = new Game()
let renderCanvas = new RenderCanvas(document.getElementById('canvas'))

game.init()
loadBrick()
renderCanvas.render(game)

window.addEventListener('keyup', function(e: KeyboardEvent) {
  if (game.status === gameType.over) return
  let arrow = {
    '83': 'bottom',
    '68': 'right',
    '65': 'left',
    '87': 'rotate'
  }

  game.move(arrow[e.keyCode])
  renderCanvas.render(game)
  if (game.status === gameType.free) {
    // refreshMatrix()
  }
})

let interval = setInterval(refreshMatrix, 500)

function refreshMatrix() {
  if (game.status === gameType.free) {
    loadBrick()
  } else if (game.status === gameType.over) {
    // clearInterval(interval)
  } else {
    game.move('down')
  }
  renderCanvas.render(game)
}

function loadBrick() {
  let brick = new Brick({
    shape: getShape()
  })

  game.loadBrick(brick, [0, 0])
}

// test shape
// [
//   [
//     pointType.newBrick,
//     pointType.newBrick,
//     pointType.newBrick,
//     pointType.newBrick
//   ]
// ]
