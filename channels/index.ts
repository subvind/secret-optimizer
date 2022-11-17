// https://docs.soketi.app/getting-started/client-configuration/pusher-sdk

export let key = 'z8hxd1e3kb69q2sql188vhsjk8yhgs7w'

export let client = {
  appId: 'default',
  wssHost: 'web-sockets.istrav.live',
  wssPort: 443, // 6001,
  forceTLS: true,
  enabledTransports: ['wss'],
}

export let server = {
  appId: 'default',
  host: 'web-sockets.istrav.live',
  port: 443, // 6001,
  useTLS: true,
  scheme: 'http',
  // encrypted: true
  timeout: 10000
}