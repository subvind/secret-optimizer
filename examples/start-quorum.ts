import { v4 as uuidv4 } from 'uuid';
import com from '../index'

// not recomended
require('events').EventEmitter.prototype._maxListeners = 250;

// use library
let highlyScrambled = com.HighlyScrambled.getInstance()

// check version
console.log(`release: v${highlyScrambled.version()}`);

// 26 + 26 + 10 + 10 = 72 max
let main = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()';

// required storage system
(async function () {
  let database = await highlyScrambled.database(com.database.server)
  let db = await highlyScrambled.db()

  let demo = {
    key: 'isTrav',
    scramble: main,
    machineCount: 1,
    rotorCount: 4,
    baseCount: 26,
    environment: {
      galaxy: 'a', // shift cipher
      star: 'a', // modulo cipher
      core: 'a' // route cipher
    }
  }

  let quorum = await highlyScrambled.build(demo)
  let machine = await quorum.bestMachine(db)

  // must be letters seperated by spaces
  let message = 'hello world from austin texas' // 5.5.4.6.5
  let value = await machine.channel(db, message)

  console.log('secret', value)
})()
