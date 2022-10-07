import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'

export default {
  async channel (db: any, chunks: string) {
    let streams = chunks.split(' ')
    let that = this

    let code = []
    streams.forEach(async (stream) => {
      let code = await that.stream(db, stream)
      code.push(code)
    })

    let scrambled = []
    code.forEach((value, index) => {
      scrambled.push(value.scrambled)
    })

    return {
      original: chunks,
      scrambled: scrambled.join(' '),
      code
    }
  },
  async stream (db: any, chunk: string) {
    let letters = chunk.split('')
    let code = []
    let that = this
    letters.forEach(async (letter, index) => {
      // any letter a-z
      let plainText: string = letter // 1 char limit
      console.log('plainText', plainText)
    
      let encrypted = await that.encrypt(db, index, plainText)
      console.log('encrypted', encrypted)
    
      let decrypted = await that.decrypt(db, index, plainText)
      console.log('decrypted', decrypted)

      code.push({
        plainText,
        encrypted,
        decrypted
      })
    })

    let scrambled = []
    code.forEach((value, index) => {
      scrambled.push(value.encrypted)
    })

    return {
      original: chunk,
      scrambled: scrambled.join(''),
      code
    }
  },
  async cipher(db: any, keyPressCount: number, letter: string) {
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
          keyPressCount: keyPressCount
        }
      })

      console.log('encrypt', keyPressCount, combination.id)
      await this.scramble(db)
      await this.processMessage(db)
    }

    return this.output
  },
  async encrypt(db: any, keyPressCount: number, letter: string) {
    return await this.cipher(db, keyPressCount, letter)
  },
  async decrypt(db: any, keyPressCount: number, letter: string) {
    return await this.cipher(db, keyPressCount, letter)
  },
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
  scramble: async function (db: any) {
    let machineRotors = await db.rotors.find({
      selector: {
        seed: this.seed,
        machine: this.id
      }
    }).exec()
    
    // randomly order rotors
    let rng = seedrandom.xor4096(`rotors:${this.seed}:${this.keyPressCount}`)
    if (machineRotors) {
      machineRotors.forEach(async (rotor) => {
        let query = db.rotors.findOne({
          selector: {
            id: rotor
          }
        })
        await query.update({
          $set: {
            order: rng()
          }
        })

        await rotor.scramble(db)
      });
    }
    console.log('scramble rotors', this.id)
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