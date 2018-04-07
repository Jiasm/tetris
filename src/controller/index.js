// @flow

import { Game, Brick } from '../model'
import { pointType, gameType } from '../enum'
import { RenderCanvas } from '../view'
import { getShape } from '../data'

export default class Controller {
  game: Game
  render: RenderCanvas
  showKeyboard: boolean
  handlerKeyboard: boolean
  rate: number
  interval: IntervalID
  board: [number, number]
  status: number
  scoreBoard: HTMLElement

  constructor($canvas: any, config: Object = {}) {
    if (!$canvas) throw new Error('can not get $canvas')

    this.showKeyboard = config.showKeyboard
    this.handlerKeyboard = config.handlerKeyboard
    this.rate = config.rate || 500 // ms
    this.scoreBoard = config.scoreBoard
    let [width, height] = (this.board = config.board || [8, 20]) // [width, height]

    let game = (this.game = new Game({
      width,
      height
    }))
    let renderCanvas = (this.render = new RenderCanvas($canvas))

    game.init()
    renderCanvas.init()
    renderCanvas.loadGame(game)
  }

  refreshMatrix() {
    let { game, render } = this
    if (game.status === gameType.free) {
      this.loadBrick()
    } else if (game.status === gameType.over) {
      this.interval && clearInterval(this.interval)
      alert('游戏结束！')
    } else {
      game.move('down')
    }
    render.render()
    this.scoreBoard.innerHTML = game.removeLines
  }

  loadBrick() {
    let { game } = this
    let shape = getShape()
    let brick = new Brick({
      shape
    })

    game.loadBrick(brick, [(Math.random() * (8 - shape[0].length + 1)) | 0, 0])
  }

  start() {
    let { game, render, rate, handlerKeyboard } = this

    if (handlerKeyboard) {
      window.addEventListener('keyup', (e: KeyboardEvent) => {
        if (game.status === gameType.over) return
        let arrow = {
          '83': 'bottom',
          '68': 'right',
          '65': 'left',
          '87': 'rotate'
        }

        game.move(arrow[e.keyCode])
        render.render()
        if (game.status === gameType.free) {
          this.refreshMatrix()
        }
      })
    }

    let show = type => {
      let tags = {
        start: document.querySelector('.controller-btn[data-type="start"]'),
        pause: document.querySelector('.controller-btn[data-type="pause"]'),
        continue: document.querySelector(
          '.controller-btn[data-type="continue"]'
        )
      }

      // fucking stupid flowtype
      Object.entries(tags).map(([key, tag]) => {
        type === key
          ? (tag.style.display = 'block')
          : (tag.style.display = 'none')
      })
    }

    document.querySelectorAll('.controller-btn').forEach(item => {
      item.addEventListener(
        'ontouchend' in window ? 'touchend' : 'click',
        (e: any) => {
          let { type } = e.target.dataset

          switch (type) {
            case 'bottom':
            case 'rotate':
            case 'right':
            case 'left':
              if (this.status === gameType.pause) return
              game.move(type)
              render.render()
              break
            case 'start':
              this.loadBrick()
              render.render()

              this.interval = setInterval(this.refreshMatrix.bind(this), rate)
              this.status = gameType.running
              show('pause')
              break
            case 'pause':
              clearInterval(this.interval)
              this.status = gameType.pause
              show('continue')
              break
            case 'continue':
              this.interval = setInterval(this.refreshMatrix.bind(this), rate)
              this.status = gameType.running
              show('pause')
              break
          }
        }
      )
    })

    // prevent scale
    if ('ontouchend' in window) {
      window.addEventListener('touchend', e => e.preventDefault(), true)
    }
  }
}
