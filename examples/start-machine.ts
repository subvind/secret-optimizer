import { v4 as uuidv4 } from 'uuid';
import com from '../index'

// use library
let highlyScrambled = com.HighlyScrambled.getInstance()

// check version
console.log(`release: v${highlyScrambled.version()}`)

// example
async function build (topSecret: string, machineCount, rotorCount, crosswireCount) {
  let db = await highlyScrambled.db()

  let machine = await db.machines.insert({
    id: uuidv4(),
    seed: topSecret
  })
  console.log('machine', machine.seedRotors())

  let rotors = await db.rotors.find({
    selector: {
      machine: machine.id,
    }
  })

  rotors.forEach(rotor => {
    rotor.seedCrosswires()
  });
}

// required storage system
(async function () {
  let database = await highlyScrambled.database(com.database.server)

  build('isTrav', 26, 26, 26)
})()

