import { app, Menu, dialog, MenuItemConstructorOptions } from 'electron'
import { isMac } from './platform'

/**
 * Build the main menu of our app.
 */
function createMenu(_win: Electron.BrowserWindow) {
  const macOSAppMenu: MenuItemConstructorOptions[] = isMac
    ? [
        {
          label: app.name,
          submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }]
        }
      ]
    : []

  const template: MenuItemConstructorOptions[] = [
    ...macOSAppMenu,
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'About Project Sothis',
          click: () => {
            dialog.showMessageBox({
              title: 'About Project Sothis',
              message: 'Project Sothis',
              detail:
                "You're running a development copy of Project Sothis. Stuff might not exist yet."
            })
          }
        }
      ]
    }
  ]

  return Menu.buildFromTemplate(template)
}

export default function setMenu(win: Electron.BrowserWindow): void {
  Menu.setApplicationMenu(createMenu(win))
}
