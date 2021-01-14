/* eslint-disable global-require */

import * as path from 'path'
import { app, BrowserWindow } from 'electron'
import { fork, ChildProcess } from 'child_process'
import isDev from 'electron-is-dev'
import findOpenSocket from 'utils/find-open-socket'
import setMenu from 'utils/menu'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null
let serverWindow: BrowserWindow | null
let serverProcess: ChildProcess | null

function createWindow(socketName: string) {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: RENDERER_PRELOAD_WEBPACK_ENTRY,
      enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(RENDERER_WEBPACK_ENTRY)
  setMenu(mainWindow)

  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow) {
      mainWindow.webContents.send('set-socket', {
        name: socketName
      })
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function createBackgroundWindow(socketName: string) {
  const win = new BrowserWindow({
    x: 500,
    y: 300,
    width: 700,
    height: 500,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  win.loadURL(SERVER_WEBPACK_ENTRY)

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('set-socket', { name: socketName })
  })

  serverWindow = win

  serverWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    serverWindow = null
  })
}

function createBackgroundProcess(socketName: string) {
  serverProcess = fork(path.resolve(__dirname, '../renderer/server/index.js'), [
    '--subprocess',
    app.getVersion(),
    socketName
  ])

  serverProcess.on('message', msg => {
    console.log(msg)
  })
}

const bootstrap = async () => {
  const serverSocket = await findOpenSocket()

  createWindow(serverSocket)

  if (isDev) {
    createBackgroundWindow(serverSocket)
  } else {
    createBackgroundProcess(serverSocket)
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', bootstrap)

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill()
    serverProcess = null
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    bootstrap()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
