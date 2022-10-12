import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'
import com from '../../index'
import jkstra from 'jkstra'

export default {
  /**
   * from blueprints to working concept
   */
  async assemble (db: any) {
    let highlyScrambled = com.HighlyScrambled.getInstance()
    let mechanics = await highlyScrambled.createMechanics(this)

    /**
     * begin: 0
     */
     mechanics.nodes.push(
      mechanics.structure.addVertex({ id: uuidv4(), length: 0, part: "genesis" })
    );

    /**
     * end: 1
     */
     mechanics.nodes.push(
      mechanics.structure.addVertex({ id: uuidv4(), length: Infinity, part: "infinity" })
    );

    // fabric: 2, 3, 4...

    /**
     * rotors from right to left
     */
    let rotorsRTL = await db.rotors.find({
      selector: {
        seed: this.seed,
        machine: this.id
      },
      sort: [
        { order: 'desc' } // always start in this order for RTL
      ]
    }).exec()
    
    let enterRotor
    let inRotor
    if (rotorsRTL) {
      let direction = true // signals go inward to reflector
      let index = 0
      for (const rotor of rotorsRTL) {
        let part = await rotor.assemble(db, mechanics, direction, index, rotorsRTL)
        if (index === 0) {
          enterRotor = part // first rotor
        } else if (index === rotorsRTL.length - 1) {
          inRotor = part // last rotor
        }
        index++
      }
    }

    /**
     * rotors from left to right
     */
    let rotorsLTR = await db.rotors.find({
      selector: {
        seed: this.seed,
        machine: this.id
      },
      sort: [
        { order: 'asc' } // always start in this order for LTR
      ]
    }).exec()

    let outRotor
    let exitRotor
    if (rotorsLTR) {
      let direction = false // signals go outward from reflector
      let index = 0
      for (const rotor of rotorsLTR) {
        let part = await rotor.assemble(db, mechanics, direction, index, rotorsLTR)
        if (index === 0) {
          outRotor = part // first rotor
        } else if (index === rotorsLTR.length - 1) {
          exitRotor = part // last rotor
        }
        index++
      }
    }

    /**
     * reflector
     */
    let reflector = await db.reflectors.findOne({
      selector: {
        seed: this.seed,
        machine: this.id
      }
    }).exec()

    let mainReflector
    if (reflector) {
      mainReflector = await reflector.assemble(db, mechanics, inRotor, outRotor)
    }

    /**
     * plugboard
     */
    let plugboard = await db.plugboards.findOne({
      selector: {
        seed: this.seed,
        machine: this.id
      }
    }).exec()

    let mainPlugboard
    if (plugboard) {
      mainPlugboard = await plugboard.assemble(db, mechanics, enterRotor, exitRotor)
    }

    /**
     * bundle parts
     */


    return mechanics
  },

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

    let ciphertext: string = ''
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
      await this.assemble(db)
      ciphertext = await this.processMessage(db, letter)
    }

    return ciphertext
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

    function randomIntFromInterval(randomSpin, min, max) { // min and max included 
      return Math.floor(randomSpin * (max - min + 1) + min)
    }
    
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
            channelIndex: this.channelIndex,
            shift: randomIntFromInterval(rng(), 1, this.targetCombinationCount) - 1 // random spin: pick a number between 0 (min) and X (max) of total combinations
          }
        })

        await rotor.scramble(db)
        // console.log('scramble rotor', rotor.id) // noisy
      }
    }
  },
  processMessage: async function (db: any, letter: string) {
    // grab machine from mechanics
    let highlyScrambled = com.HighlyScrambled.getInstance()

    let mechanics = await highlyScrambled.getMechanics(this)
    // let workingParts = {
    //   blueprint: machine.id,
    //   structure: graph,
    //   nodes: [],
    //   completeId: 1,
    // }
    let dijkstra = new jkstra.algos.Dijkstra(mechanics.structure);

    // find graph starting node based on letter
    let startNode = mechanics.nodes.findIndex((value, index) => {
      return value.keyboardLetter === letter
    })

    // computes the shortestPath between nodes 0 and 1,
    // using the single number stored in each as its cost
    let path = dijkstra.shortestPath(startNode, mechanics.completeId, {
      edgeCost: function (e) {
        return e.data.length;
      },
    });

    // causeNode.data // => {id: 42, length: 0.5, keyboardLetter: 'a', part: 'plugboard'}
    // effectNode.data // => {id: 1337, length: 0.5, lightboardLetter: 'a', part: 'plugboard'}
    let route = path
      .map(function (e) {
        return e.data;
      })
      .join()

    // the second to last node is our answer
    let cipherNode = route[route.length - 2]

    return cipherNode.lightboardLetter
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
  },
  initReflector: async function (db: any) {
    // create reflector
    let reflector = db.reflectors.insert({
      id: uuidv4(),
      seed: this.seed,
      targetCombinationCount: this.targetCombinationCount,
      machine: this.id,
    })

    // add reflector to machine
    let query = db.machines.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      $set: {
        reflector: reflector.id
      }
    })

    console.log('initReflector', 'machine', this.id)
  },
  initPlugboard: async function (db: any) {
    // create plugboard
    let plugboard = db.plugboards.insert({
      id: uuidv4(),
      seed: this.seed,
      targetCombinationCount: this.targetCombinationCount,
      machine: this.id,
    })

    // add plugboard to machine
    let query = db.machines.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      $set: {
        plugboard: plugboard.id
      }
    })

    console.log('initPlugboard', 'machine', this.id)
  }
}