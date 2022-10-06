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

    // randomly order crosswires
    let rng = seedrandom.xor4096(`crosswires:${this.seed}:${this.keyPressCount}`)
    if (rotorCrosswires) {
      rotorCrosswires.forEach(async (crosswire) => {
        let query = db.crosswires.findOne({
          selector: {
            id: crosswire
          }
        })
        await query.update({
          $set: {
            order: rng()
          }
        })
      });
      console.log('scramble crosswires', this.id)
    }
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