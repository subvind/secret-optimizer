import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'

export default {
  /**
   * a way to transmit words within a sentence
   */
  async channel (db: any, chunks: string) {
    let streams = chunks.split(' ')
    let that = this

    let messages = []
    let index: number = 0
    for (const stream of streams) {
      index++ // for every stream
      let value = await that.stream(db, stream, index)
      messages.push(value)
    }

    let scrambled = []
    messages.forEach((value, index) => {
      scrambled.push(value.scrambled)
    })

    return {
      original: chunks,
      scrambled: scrambled.join(' '),
      messages
    }
  },
  /**
   * a way to transmit letters within a word
   */
  async stream (db: any, chunk: string, channelIndex: number) {
    let letters = chunk.split('')
    let code = []
    let that = this
      
    let index = 0
    for (const letter of letters) {
      index++ // for every letter

      // any letter a-z
      let plainText: string = letter // 1 char limit
      // console.log('plainText', plainText) // noisy
    
      let keyPressCount = index
      let encrypted = await that.encrypt(db, channelIndex, keyPressCount, plainText)
      // console.log('encrypted', encrypted) // noisy
    
      // todo: leave this out for speed and move to a different mothod
      // let decrypted = await that.decrypt(db, channelIndex, keyPressCount, plainText)
      // // console.log('decrypted', decrypted) // noisy

      code.push({
        plainText,
        encrypted
      })
    }

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
  /**
   * a way to transform 1 letter into another letter 
   */
  async cipher(db: any, channelIndex: number, keyPressCount: number, letter: string) {
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
          channelIndex: channelIndex,
          keyPressCount: keyPressCount
        }
      })

      // console.log('encrypt', keyPressCount, combination.id) // noisy
      await this.scramble(db)
      await this.processMessage(db)
    }

    return 'b'
  },
  async encrypt(db: any, channelIndex: number, keyPressCount: number, letter: string) {
    return await this.cipher(db, channelIndex, keyPressCount, letter)
  },
  async decrypt(db: any, channelIndex: number, keyPressCount: number, letter: string) {
    return await this.cipher(db, channelIndex, keyPressCount, letter)
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
  /**
   * a way to randomly organize things
   */
  scramble: async function (db: any) {
    let machineRotors = await db.rotors.find({
      selector: {
        seed: this.seed,
        machine: this.id
      },
      sort: [
        { createdAt: 'asc' } // always start in this order
      ]
    }).exec()
    
    // randomly order rotors
    let quorum = await db.quorums.findOne(this.quorum).exec()
    let environment = `${quorum.environment.galaxy}:${quorum.environment.star}:${quorum.environment.core}`
    let seed = `${this.seed}:${environment}:machine-${this.order}:${this.channelIndex}:${this.keyPressCount}`
    let rng = seedrandom.xor4096(seed)
    console.log(seed)
    if (machineRotors) {
      for (const rotor of machineRotors) {
        let query = db.rotors.findOne({
          selector: {
            id: rotor.id
          }
        })
        await query.update({
          $set: {
            order: rng(),
            channelIndex: this.channelIndex
          }
        })

        await rotor.scramble(db)
        // console.log('scramble rotor', rotor.id) // noisy
      }
    }
  },
  processMessage: async function (db: any) {
    // start from keyboard
    // send through plugboard
    // send through rotors asc
    // go through reflector
    // send through rotors desc
    // send through plugboard
    // end at lightboard
    return
  },
  cleanupCombinations: async function (db: any) {
    let oldCombinations = await db.combinations.find({
      selector: {
        machine: this.id
      }
    }).exec()

    if (oldCombinations) {
      for (const record of oldCombinations) {
        await record.remove()
      }
    }
  },
  initCombinations: async function (db: any) {
    let combinations = []
    // console.log('machine', this.id, 'alphabet', this.alphabet)
    
    // create combinations
    let chars = this.alphabet.split('')

    let index = 0
    for (const char of chars) {
      index++ // increase per letter
      let combination = await db.combinations.insert({
        id: uuidv4(),
        letter: char,
        number: index + 1,
        machine: this.id,
        createdAt: Date.now() + index
      })
      combinations.push(combination.id)
    }
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
    let oldRotors = await db.rotors.find({
      selector: {
        seed: this.seed,
        machine: this.id
      }
    }).exec()

    if (oldRotors) {
      for (const record of oldRotors) {
        await record.cleanupCrosswires(db)
        await record.remove()    
      }
    }
  },
  initRotors: async function (db: any) {
    let rotors = []

    // create rotors
    for (let i = 1; i <= this.targetRotorCount; i++) {
      let rotor = await db.rotors.insert({
        id: uuidv4(),
        seed: this.seed,
        machine: this.id,
        targetCrosswireCount: this.targetCombinationCount,
        createdAt: Date.now() + i
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

    console.log('initRotors', 'machine', this.id)
  }
}