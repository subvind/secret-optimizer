import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'

export default {
  scramble: async function (db: any) {
    // scramble crosswires
    let rotorCrosswires = await db.crosswires.find({
      selector: {
        seed: this.seed,
        rotor: this.id
      }
    }).exec()

    if (rotorCrosswires) {
      rotorCrosswires.forEach(async (crosswire) => {
        await crosswire.scramble(db)
      });
    }
    
    // spin rotors
    let rng = seedrandom.xor4096(`crosswires:${this.seed}`)
  },
  cleanupCrosswires: async function (db: any) {
    let query = db.crosswires.find({
      selector: {
        seed: this.seed,
        machine: this.id
      }
    })

    await query.remove()
  },
  initCrosswires: async function (db: any) {
    let crosswires = []

    // create crosswires
    for (let i = 1; i <= this.targetCrosswireCount; i++) {
      let crosswire = await db.crosswires.insert({
        id: uuidv4(),
        inputCombination: i,
        outputCombination: i,
        weight: 0.5,
        rotor: this.id
      })
      crosswires.push(crosswire.id)
    }
    // console.log('rotor', this.id, 'crosswires', crosswires)

    // add crosswires to rotors list
    let query = db.rotors.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      $set: {
        crosswires: crosswires
      }
    })

    console.log('initCrosswires', 'rotor', this.id)
  }
}