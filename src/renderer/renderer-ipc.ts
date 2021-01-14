import { AnyCallback } from 'interfaces/common'

// State
const replyHandlers = new Map()
const listeners = new Map()
let messageQueue: string[] = []
let socketClient: any = null

// Functions
function connectSocket(socketName: string, onOpen: () => void) {
  window.ipcConnect(socketName, (client: any) => {
    client.on('message', (data: any) => {
      const msg = JSON.parse(data)

      if (msg.type === 'error') {
        // Up to you whether or not to care about the error
        const { id } = msg
        replyHandlers.delete(id)
      } else if (msg.type === 'reply') {
        const { id, result } = msg

        const handler = replyHandlers.get(id)
        if (handler) {
          replyHandlers.delete(id)
          handler.resolve(result)
        }
      } else if (msg.type === 'push') {
        const { name, args } = msg

        const listens = listeners.get(name)
        if (listens) {
          listens.forEach((listener: AnyCallback) => {
            listener(args)
          })
        }
      } else {
        throw new Error(`Unknown message type: ${JSON.stringify(msg)}`)
      }
    })

    client.on('connect', () => {
      socketClient = client

      // Send any messages that were queued while closed
      if (messageQueue.length > 0) {
        messageQueue.forEach(msg => client.emit('message', msg))
        messageQueue = []
      }

      onOpen()
    })

    client.on('disconnect', () => {
      socketClient = null
    })
  })
}

// Init
export async function init(): Promise<void> {
  const socketName = await window.getServerSocket()

  if (typeof socketName === 'string') {
    connectSocket(socketName, () => {
      console.log(`Socket connected: ${socketName}`)
    })
  }
}

// Send
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function send<T = unknown>(name: string, args: any): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = window.nanoid()
    replyHandlers.set(id, { resolve, reject })
    if (socketClient) {
      socketClient.emit('message', JSON.stringify({ id, name, args }))
    } else {
      messageQueue.push(JSON.stringify({ id, name, args }))
    }
  })
}

// Listen
export function listen(name: string, cb: (arg: any) => void): () => void {
  if (!listeners.get(name)) {
    listeners.set(name, [])
  }
  listeners.get(name).push(cb)

  return () => {
    const arr = listeners.get(name)
    listeners.set(
      name,
      arr.filter((cb_: any) => cb_ !== cb)
    )
  }
}

// Unlisten
export function unlisten(name: string): void {
  listeners.set(name, [])
}
