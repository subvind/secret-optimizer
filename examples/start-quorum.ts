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

async function getMachine (id: string) {
  let db = await highlyScrambled.db()

  return await db.machines.findOne(id).exec()
}

// required storage system
(async function () {
  let database = await highlyScrambled.database(com.database.server)

  let quorum = await build('isTrav', 1, 26, 26)

  let machineId = quorum.machines[0]
  let machine = await getMachine(machineId)

  // any letter a-z
  let plainText: string = 'h' // 1 char limit
  console.log('plainText', plainText)

  // todo: work on this api
  let encrypted = machine.keyPress(db, plainText)
  console.log('encrypted', encrypted)

  let decrypted = machine.decrypt('isTrav', 1, plainText)
  console.log('decrypted', decrypted)
})()
