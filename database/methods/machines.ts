import { v4 as uuidv4 } from 'uuid';

export default {
  cleanupRotors: async function (db: any) {
    let query = db.rotors.find({
      selector: {
        seed: this.seed,
        machine: this.id
      }
    })

    await query.remove()
  },
  initRotors: async function (db: any) {
    let rotors = []

    // create rotors
    for (let i = 1; i <= this.targetRotorCount; i++) {
      let rotor = await db.rotors.insert({
        id: uuidv4,
        seed: this.seed,
        machine: this.id,
        targetCrosswireCount: this.targetCombinationCount
      })
      rotor.initCrosswires(db)
      rotors.push(rotor.id)
    }

    // add machines to quorum list
    let query = db.machines.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      rotors: rotors
    })
  }
}