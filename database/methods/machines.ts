import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'

export default {

  // encrypt(topSecret: string, keyPressCount: number, message: string) {

  // },
  // decrypt(topSecret: string, keyPressCount: number, message: string) {

  // },
  resetKeyPressCount: async function(db: any) {
    // reset key press counter back to 0
    let query = db.machines.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      $set: {
        input: undefined,
        keyPressCount: 0
      }
    })

    // then update crosswires
    await this.scramble(db)
  },
  pressKey: async function (db: any, letter: string) {
    // find out what combination this letter is
    let combination = await db.combinations.findOne({
      selector: {
        letter: letter,
        machine: this.id
      }
    }).exec()

    if (combination) {
      // add details to machine
      let query = db.machines.find({
        selector: {
          id: this.id
        }
      })
      await query.update({
        $set: {
          input: combination.id,
          keyPressCount: this.keyPressCount + 1
        }
      })

      console.log('pressKey', letter, combination.id)
      await this.scramble(db)
      await this.processMessage(db)
    }
  },
  scramble: async function (db: any) {
    let machineRotors = await db.rotors.find({
      selector: {
        seed: this.seed,
        machine: this.id
      }
    }).exec()
    
    let rng = seedrandom.xor4096(`rotors:${this.seed}`)
    if (machineRotors) {
      machineRotors.forEach(async (rotor) => {
        // 

        await rotor.scramble(db)
      });
    }

    // swap rotors
    
  },
  processMessage: async function (db: any) {
    // start from keyboard
    // send through plugboard
    // send through rotors asc
    // go through reflector
    // send through rotors desc
    // send through plugboard
    // end at lightboard
  },
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