import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'

export default {
  /**
   * a way to randomly organize things
   */
  scramble: async function (db: any) {
    // 

    // scramble crosswires
    let rotorCrosswires = await db.crosswires.find({
      selector: {
        seed: this.seed,
        rotor: this.id
      },
      sort: [
        { createdAt: 'asc' } // always start in this order
      ]
    }).exec()

    // randomly order crosswires
    let machine = await db.machines.findOne(this.machine).exec() 
    let quorum = await db.quorums.findOne(machine.quorum).exec()
    let environment = `${quorum.environment.galaxy}:${quorum.environment.star}:${quorum.environment.core}`
    let rng = seedrandom.xor4096(`${this.seed}:${environment}:machine-${machine.order}:rotor-${this.order}:${this.channelIndex}:${machine.keyPressCount}`)
    if (rotorCrosswires) {
      for (const crosswire of rotorCrosswires) {
        let query = db.crosswires.findOne({
          selector: {
            id: crosswire.id
          }
        })
        await query.update({
          $set: {
            order: rng()
          }
        })
      }
      // console.log('scramble crosswires', this.id) // noisy
    }
  },
  cleanupCrosswires: async function (db: any) {
    let oldCrosswires = await db.crosswires.find({
      selector: {
        seed: this.seed,
        machine: this.id
      }
    }).exec()

    if (oldCrosswires) {
      for (const record of oldCrosswires) {
        await record.remove()
      }
    }
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
        rotor: this.id,
        createdAt: Date.now() + i
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