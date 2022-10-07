import { v4 as uuidv4 } from 'uuid';
import com from '../index'

// not recomended
require('events').EventEmitter.prototype._maxListeners = 250;

// use library
let highlyScrambled = com.HighlyScrambled.getInstance()

// check version
console.log(`release: v${highlyScrambled.version()}`);

// required storage system
(async function () {
  let database = await highlyScrambled.database(com.database.server)
  let db = await highlyScrambled.db()

  let key = 'isTrav'
  let environment = {
    galaxy: 'a', // shift cipher
    star: 'a', // modulo cipher
    core: 'a' // route cipher
  }
  let quorum = await highlyScrambled.build(key, environment, 1, 26, 26)

  let machine = await quorum.bestMachine(db)

  // must be letters seperated by spaces
  let message = 'hello world from austin texas' // 5.5.4.6.5
  let value = await machine.channel(db, message)

  console.log('secret', value)
})()
