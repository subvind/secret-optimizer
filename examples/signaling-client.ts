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
    initiate: 'c u l8er', // travis.burandt@gmail.com
    return: 'isTrav' // something@nothing.com
  }

  // verified by firebase
  let token 
  if (localStorage) {
    token = localStorage.getItem('firebase')
  } else {
    token = { uid: 'bwgEftCZ2QNaRlDZo1PyP3ejEgq2' }
  }

  // my personal mailbox
  channel.bind(`account-${token.uid}`, (message) => {
    console.log(message)
  });

  // watch the news
  channel.bind('exchange', (message) => {
    console.log(message)
  });
})()

// stall process
setInterval(() => {
  console.log('waiting...')
}, 10000)