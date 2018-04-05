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
    refreshMatrix()
  }
})

let interval = setInterval(refreshMatrix, 500)

function refreshMatrix() {
  if (game.status === gameType.free) {
    loadBrick()
  } else if (game.status === gameType.over) {
    clearInterval(interval)
  } else {
    game.move('down')
  }
  renderCanvas.render(game)
}

function loadBrick() {
  let shape = getShape()
  let brick = new Brick({
    shape
  })

  game.loadBrick(brick, [(Math.random() * (8 - shape[0].length + 1)) | 0, 0])
}

document.querySelectorAll('.controller-btn').forEach(item => {
  item.addEventListener('click', function(e: any) {
    let { type } = e.target.dataset
    if (['bottom', 'rotate', 'left', 'right'].includes(type)) {
      game.move(type)
      renderCanvas.render(game)
    }
  })
})

// test shape
// [
//   [
//     pointType.newBrick,
//     pointType.newBrick,
//     pointType.newBrick,
//     pointType.newBrick
//   ]
// ]
