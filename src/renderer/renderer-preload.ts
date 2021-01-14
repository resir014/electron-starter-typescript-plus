import { ipcRenderer } from 'electron'
import isDev from 'electron-is-dev'
import ipc from 'node-ipc'
import { nanoid } from 'nanoid'

type ResolveSocketPromise = (value?: string) => void

let resolveSocketPromise: ResolveSocketPromise | undefined
const socketPromise = new Promise((resolve: ResolveSocketPromise) => {
  resolveSocketPromise = resolve
})

window.__IS_DEV__ = isDev

window.getServerSocket = () => {
  return socketPromise
}

ipcRenderer.on('set-socket', (_, { name }) => {
  if (resolveSocketPromise) {
    resolveSocketPromise(name)
  }
})

window.ipcConnect = (id, func) => {
  ipc.config.silent = true
  ipc.connectTo(id, () => {
    func(ipc.of[id])
  })
}

window.nanoid = nanoid
