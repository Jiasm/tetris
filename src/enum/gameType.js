import { buildEnum } from '../utils'

let obj = {
  start: 1,
  over: 0,
  free: 2, // 空闲状态，等待新方块的插入
  running: 3 // 正常运行中
}

module.exports = buildEnum(obj)
