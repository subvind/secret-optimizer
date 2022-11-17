import so from '../index'

// use library
let secretOptimizer = so.SecretOptimizer.getInstance()

// check version
console.log(`release: v${secretOptimizer.version()}`);

// demo
(async function () {
  // init 
  // let database = await secretOptimizer.database(so.database.server)
  // let db = await secretOptimizer.db()

  // server
  let secret = process.env.SECRET || '6shiidf3t9im3loq'
  let webSocketServer = await secretOptimizer.webSocketServer(so.channels.key, secret, so.channels.server)
  let wss = await secretOptimizer.wss()

  // message
  let channel = 'signaling'
  let event = 'exchange'
  let message = {
    test: true
  }

  // establish
  wss.trigger(channel, event, message)
})()
