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

async function stream (machine: any, chunk: string) {
  let db = await highlyScrambled.db()
  
  return await machine.stream(db, machine, chunk)
}

// required storage system
(async function () {
  let database = await highlyScrambled.database(com.database.server)

  let quorum = await build('isTrav', 1, 26, 26)

  let machineId = quorum.machines[0]
  let machine = await getMachine(machineId)

  let message = 'hello'
  let value = await stream(machine, message)

  console.log('secretMessage', value)
})()
