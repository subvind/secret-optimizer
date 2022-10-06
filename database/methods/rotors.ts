import { v4 as uuidv4 } from 'uuid';

export default {
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

    // add crosswires to rotors list
    let query = db.rotors.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      crosswires: crosswires
    })
  }
}