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
    // console.log('machine', this.id, 'alphabet', this.alphabet)
    
    // create combinations
    let chars = this.alphabet.split('')
    await Promise.all(chars.map(async (char, index) => {
      let combination = await db.combinations.insert({
        id: uuidv4(),
        letter: char,
        number: index + 1,
        machine: this.id
      })
      combinations.push(combination.id)
    }));
    // console.log('machine', this.id, 'combinations', combinations)

    // add combinations to machine list
    let query = db.machines.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      $set: {
        combinations: combinations
      }
    })

    console.log('initCombinations', 'machine', this.id)
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
      await rotor.initCrosswires(db)
      rotors.push(rotor.id)
    }
    // console.log('machine', this.id, 'rotors', rotors)

    // add rotors to machine list
    let query = db.machines.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      $set: {
        rotors: rotors
      }
    })

    console.log('intiRotors', 'machine', this.id)
  }
}