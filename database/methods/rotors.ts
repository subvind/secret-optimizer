import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'

export default {
  /**
   * from blueprints to concrete concept
   */
  assemble: async function (db: any, mechanics: any) {
    // these crosswires
    let rotorCrosswires = await db.crosswires.find({
      selector: {
        seed: this.seed,
        rotor: this.id
      },
      sort: [
        { order: 'asc' } // always start in this order
      ]
    }).exec()

    // make nodes
    let rotorRightPorts = []
    let rotorLeftPorts = []

    for (let i = 0; i < this.targetCrosswireCount; i++) {
      rotorRightPorts.push(
        {
          crosswire: rotorCrosswires[i],
          node: mechanics.structure.addVertex({ id: rotorCrosswires[i].id, part: "port" }),
        }
      );
      rotorLeftPorts.push(
        {
          crosswire: rotorCrosswires[i],
          node: mechanics.structure.addVertex({ id: rotorCrosswires[i].id ,part: "port" }),
        }
      );
    }

    // align nodes by
    // spin rotors by shift and direction
    function arrayRotate(arr, reverse, count) {
      for (let i = 0; 0 < count; i++) {
        if (reverse) {
          arr.unshift(arr.pop());
        } else {
          arr.push(arr.shift());
        }
      }
      return arr;
    }
    rotorRightPorts = arrayRotate(rotorRightPorts, this.direction, this.shift)
    rotorLeftPorts = arrayRotate(rotorLeftPorts, this.direction, this.shift)
    for (const port of rotorRightPorts) {
      mechanics.nodes.push(port.node)
    }
    for (const port of rotorLeftPorts) {
      mechanics.nodes.push(port.node)
    }

    // connect crosswires
    for (let i = 0; i < this.targetCrosswireCount; i++) {
      let edge = {
        id: rotorCrosswires[i].id,
        length: rotorCrosswires[i].length,
        part: 'crosswire'
      }
      mechanics.structure.addEdge(rotorRightPorts[i].node, rotorLeftPorts[i].node, edge)
    }

    return {
      rotorRightPorts,
      rotorLeftPorts
    }
  },

  /**
   * a way to randomly organize things
   */
  scramble: async function (db: any) {
    // scramble these crosswires
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
    let seed = `${this.seed}:${environment}:machine-${machine.order}:rotor-${this.order}:${this.channelIndex}:${machine.keyPressCount}`
    let rng = seedrandom.xor4096(seed)
    // console.log(seed, rng) // noisy
    if (rotorCrosswires) {
      for (const crosswire of rotorCrosswires) {
        let query = db.crosswires.findOne({
          selector: {
            id: crosswire.id
          }
        })
        await query.update({
          $set: {
            order: rng(),
            length: rng(),
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
        length: 0.5,
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

    // console.log('initCrosswires', 'rotor', this.id) // noisy
  }
}