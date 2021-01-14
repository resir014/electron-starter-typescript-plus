export interface ServerHandlers {
  [key: string]: (args: any) => Promise<any>
}

export type AnyCallback = (args: any) => any
