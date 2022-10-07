import { v4 as uuidv4 } from 'uuid';
import com from '../index'

// use library
let highlyScrambled = com.HighlyScrambled.getInstance()

// check version
console.log(`release: v${highlyScrambled.version()}`)

// example
async function build (topSecret: string, machineCount: number, rotorCount: number, crosswireCount: number) {
  let db = await highlyScrambled.db()

  console.log('quorum seed', topSecret)
  let quorum = await db.quorums.insert({
    id: uuidv4(),
    seed: topSecret,
    targetMemberCount: machineCount,
    targetRotorCount: rotorCount,
    targetCombinationCount: crosswireCount,
  })
  console.log('quorum', 1, quorum.id)

  await quorum.initMachines(db)

  return quorum
}

// required storage system
(async function () {
  let database = await highlyScrambled.database(com.database.server)
  let db = await highlyScrambled.db()

  let quorum = await build('isTrav', 1, 26, 26)

  let machine = await quorum.bestMachine(db)

  // must be letters seperated by spaces
  let message = 'hello world from austin texas'
  let value = await machine.channel(db, message)

  console.log('secretMessage', value)
})()
