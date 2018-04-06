import Controller from './controller'
import './css/index.scss'

// resize canvas

let $game = document.getElementById('game')
let $canvas = document.getElementById('canvas')
let $controller = document.getElementById('controller')

let gamputedStyle = getComputedStyle($game)
let gameHeight = parseInt(gamputedStyle.height)
let gameWidth = gameHeight * 0.4

$game.style.height = gameHeight + 'px'
$canvas.style.width = gameWidth + 'px'
$canvas.style.height = gameHeight + 'px'
$canvas.width = gameWidth
$canvas.height = gameHeight

let qs = getQs(location.href.replace(/.*\?/g, ''))

let { width = 8, height = 20 } = qs

new Controller($canvas, {
  handlerKeyboard: true,
  board: [Number(width), Number(height)],
  scoreBoard: document.querySelector('#score-val')
}).start()

function getQs(qs) {
  let obj = {}
  if (/\w+=\w+/.test(qs)) {
    qs.replace(/(\w+)=(\w+)/g, (_, key, value) => {
      obj[key] = value
    })
  }

  return obj
}
