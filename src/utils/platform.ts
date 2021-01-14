/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const isWindows = () => process.platform === 'win32'

export const isMac = process.platform === 'darwin'

export const isLinux = () => process.platform === 'linux'
