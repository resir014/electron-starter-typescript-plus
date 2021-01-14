/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import ipc from 'node-ipc'

function isSocketTaken(name: string, _fn?: () => void) {
  return new Promise((resolve, _reject) => {
    ipc.connectTo(name, () => {
      ipc.of[name].on('error', () => {
        ipc.disconnect(name)
        resolve(false)
      })

      ipc.of[name].on('connect', () => {
        ipc.disconnect(name)
        resolve(true)
      })
    })
  })
}

async function findOpenSocket(): Promise<string> {
  let currentSocket = 1
  console.log('checking', currentSocket)
  while (await isSocketTaken(`sothis:${currentSocket}`)) {
    currentSocket++
    console.log('checking', currentSocket)
  }
  console.log('found socket', currentSocket)
  return `sothis:${currentSocket}`
}

export default findOpenSocket
