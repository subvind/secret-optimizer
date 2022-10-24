import chat from '../index'

// not recomended
require('events').EventEmitter.prototype._maxListeners = 250;

// use library
let secretOptimizer = chat.SecretOptimizer.getInstance()

// check version
console.log(`release: v${secretOptimizer.version()}`);

// demo
(async function () {
  // init 
  let database = await secretOptimizer.database(chat.database.server)
  let db = await secretOptimizer.db()

  // 26 + 26 + 10 + 10 = 72 max combinations
  let main = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()';

  // specification
  let demo = {
    key: 'isTrav',
    scramble: main,
    machineCount: 1,
    rotorCount: 4,
    baseCount: 26,
    layerBy: ' ',
    environment: {
      galaxy: 'a', // shift cipher
      star: 'a', // modulo cipher
      core: 'a' // route cipher
    }
  }

  // construct
  let quorum = await secretOptimizer.build(demo)
  let machine = await quorum.bestMachine(db)

  // run calculation:
  // only "main" combinations allowed
  let message = 'hello world from austin texas'
  let secret = await machine.channel(db, message)

  // answer
  console.log(secret)
})()

// {
//   original: 'hello world from austin texas',
//   scrambled: 'vassg jgyst cygq ebldkp dazel',
//   messages: [
//     { original: 'hello', scrambled: 'vassg', code: [Array] },
//     { original: 'world', scrambled: 'jgyst', code: [Array] },
//     { original: 'from', scrambled: 'cygq', code: [Array] },
//     { original: 'austin', scrambled: 'ebldkp', code: [Array] },
//     { original: 'texas', scrambled: 'dazel', code: [Array] }
//   ]
// }