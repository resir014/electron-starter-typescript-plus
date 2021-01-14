import { ipcRenderer, remote } from 'electron'
import * as ipc from './server-ipc'
import serverHandlers from './server-handlers'

let isDev
let version

if (process.argv[2] === '--subprocess') {
  isDev = false
  // eslint-disable-next-line prefer-destructuring
  version = process.argv[3]

  const socketName = process.argv[4]
  ipc.init(socketName, serverHandlers)
} else {
  isDev = true
  version = remote.app.getVersion()

  ipcRenderer.on('set-socket', (_, { name }) => {
    ipc.init(name, serverHandlers)
  })
}

console.log('Project Sothis App Server')
console.log('Version:', version)
console.log('Development Mode?', isDev)
