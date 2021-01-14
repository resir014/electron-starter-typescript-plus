/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { nanoid } from 'nanoid'
import { init, send } from './renderer-ipc'

import './index.css'

declare global {
  interface Window {
    __IS_DEV__?: boolean
    getServerSocket: () => Promise<string | undefined>
    ipcConnect: (name: string, callback: (client: any) => any) => void
    nanoid: typeof nanoid
  }
}

init()

console.log('👋 This message is being logged by "renderer.js", included via webpack')

const $output = document.querySelector('#output')
const $factorial = document.querySelector('#factorial')
const $call = document.querySelector('#call')

if ($factorial) {
  $factorial.addEventListener('click', async () => {
    const result = await send<number>('make-factorial', { num: 5 })
    if ($output) {
      $output.innerHTML = result.toString()
    }
  })
}

if ($call) {
  $call.addEventListener('click', async () => {
    const result = await send<string>('ring-ring', { message: 'this is james' })
    if ($output) {
      $output.innerHTML = result
    }
  })
}
