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

  // client
  let webSocketClient = await secretOptimizer.webSocketClient(so.channels.key, so.channels.client)
  let wsc = await secretOptimizer.wsc()

  // $8
  let channel = wsc.subscribe('signaling')
  let exchange = {
    initiate: 'travis.burandt@gmail.com',
    return: 'john.doe@gmail.com'
  }

  // verified by firebase
  let userId = 'sdclks93eiowdwd9wd8h9'

  // my personal mailbox
  channel.bind(`account-${userId}`, (message) => {
    console.log(message)
  });

  // listen to everything
  channel.bind('exchange', (message) => {
    console.log(message)
  });

})()

// stall process
setInterval(() => {
  console.log('waiting...')
}, 10000)
