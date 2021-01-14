import ipc from 'node-ipc'
import { ServerHandlers } from 'interfaces/common'

export function init(socketName: string, handlers: ServerHandlers): void {
  ipc.config.id = socketName
  ipc.config.silent = true

  ipc.serve(() => {
    ipc.server.on('message', (data, socket) => {
      const msg = JSON.parse(data)
      const { id, name, args } = msg

      if (handlers[name]) {
        handlers[name](args).then(
          result => {
            ipc.server.emit(socket, 'message', JSON.stringify({ type: 'reply', id, result }))
          },
          error => {
            // Up to you how to handle errors, if you want to forward
            // them, etc
            ipc.server.emit(socket, 'message', JSON.stringify({ type: 'error', id }))
            throw error
          }
        )
      } else {
        console.warn(`Unknown method: ${name}`)
        ipc.server.emit(socket, 'message', JSON.stringify({ type: 'reply', id, result: null }))
      }
    })
  })

  ipc.server.start()
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function send(name: string, args: any): void {
  ;(ipc.server as any).broadcast('message', JSON.stringify({ type: 'push', name, args }))
}
