// @flow

import Game from './model/Game'
import Brick from './model/Brick'
;(async function() {
  let game = new Game()

  game.init()

  let brick = new Brick({
    shape: [[1, 1, 1], [0, 0, 1]]
  })

  game.loadBrick(brick, [0, 0])

  game.log()

  await game.move('right')

  setTimeout(game.log.bind(game), 2000)
})()
