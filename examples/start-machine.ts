import { v4 as uuidv4 } from 'uuid';
import com from '../index'

// use library
let highlyScrambled = com.HighlyScrambled.getInstance()

// check version
console.log(`release: v${highlyScrambled.version()}`)

// example
async function build (topSecret: string) {
  let db = await highlyScrambled.db()

  let machine = await db.machines.insert({
    id: uuidv4(),
    seed: topSecret
  })
  console.log('machine', machine.id)
}

// required storage system
(async function () {
  let database = await highlyScrambled.database(com.database.server)

  build('isTrav')
})()

