import { v4 as uuidv4 } from 'uuid';

export default {
  cleanupCombinations: async function (db: any) {
    let query = db.combinations.find({
      selector: {
        machine: this.id
      }
    })

    await query.remove()
  },
  initCombinations: async function (db: any) {
    let combinations = []
    
    // create combinations
    let chars = this.alphabet.split('')
    chars.forEach(async (char, index) => {
      let combination = await db.combinations.insert({
        id: uuidv4(),
        letter: char,
        number: index + 1,
        machine: this.id
      })
      combinations.push(combination.id)
    });

    // add combinations to machine list
    let query = db.machines.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      combinations: combinations
    })
  },
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
        id: uuidv4(),
        seed: this.seed,
        machine: this.id,
        targetCrosswireCount: this.targetCombinationCount
      })
      rotor.initCrosswires(db)
      rotors.push(rotor.id)
    }

    // add rotors to machine list
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