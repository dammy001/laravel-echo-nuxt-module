export type Arrayable<T> = T | Array<T>

export type BroadcasterOption =
  | 'pusher'
  | 'socket.io'
  | 'null'
  | ((option: ModuleOptions) => void)

export type TransportOption = 'ws' | 'wss'

export interface ModuleOptions {
  options?: EchoOptions
  configPath?: Arrayable<string>
}

export interface EchoOptions {
  /**
   * Pusher client.
   */
  Pusher?: (key: EchoOptions['key'], options: EchoOptions) => void

  broadcaster?: BroadcasterOption

  key?: string | null

  auth?: {
    headers?: {
      Authorization?: string
      [key: string]: string
    }
  }

  authEndpoint?: string

  userAuthentication?: {
    endpoint?: string
    headers?: Record<string, any>
  }

  csrfToken?: string | null

  bearerToken?: string | null

  host?: string | null

  namespace?: string | null

  wsHost?: string

  wsPort?: number

  wssPort?: number

  forceTLS?: boolean

  enabledTransports?: Array<TransportOption>

  encrypted?: boolean

  cluster?: string

  withoutInterceptors?: boolean

  client?: string
}
