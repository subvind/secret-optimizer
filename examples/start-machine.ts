import { v4 as uuidv4 } from 'uuid';
import com from '../index'

// use library
let highlyScrambled = com.HighlyScrambled.getInstance()

// check version
console.log(`release: v${highlyScrambled.version()}`)

// example
async function build (topSecret: string, machineCount, rotorCount, crosswireCount) {
  let db = await highlyScrambled.db()

  let quorum = await db.machines.insert({
    id: uuidv4(),
    seed: topSecret,
    targetMemberCount: 26,
    targetRotorCount: 26,
    targetCombinationCount: 26,
  })

  quorum.initMachines(db)
}

// required storage system
(async function () {
  let database = await highlyScrambled.database(com.database.server)

  build('isTrav', 26, 26, 26)
})()

