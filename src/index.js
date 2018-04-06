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

new Controller($canvas, {
  handlerKeyboard: true,
  board: [16, 40],
  scoreBoard: document.querySelector('#score-val')
}).start()
