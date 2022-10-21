import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'

export default {
  /**
   * from blueprints to concrete concept
   */
  assemble: async function (db: any, mechanics: any, direction: boolean) {
    // these crosswires
    let rotorCrosswires = await db.crosswires.find({
      selector: {
        rotor: this.id
      },
      sort: [
        { order: 'asc' } // always start in this order
      ]
    }).exec()

    // for (const rotorCrosswire of rotorCrosswires) {
    //   console.log('rotorCrosswire.length', rotorCrosswire.length) // noisy
    // }

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
    function arrayRotate(arr: Array<any>, reverse: boolean, count: number) {
      for (let i = 0; i < count; i++) {
        if (reverse) {
          let elm = arr.pop() // removes the last element from an array
          arr.unshift(elm) // add to the beginning of an array
        } else {
          let elm = arr.shift() // removes the first element from an array
          arr.push(elm) // add to the ending of an array
        }
      }
      return arr;
    }
    rotorRightPorts = arrayRotate(rotorRightPorts, this.direction, this.shift)
    rotorLeftPorts = arrayRotate(rotorLeftPorts, this.direction, this.shift)

    // debug
    // console.log('rotorRightPorts', rotorRightPorts.length)
    // console.log('rotorLeftPorts', rotorLeftPorts.length)

    for (const port of rotorRightPorts) {
      mechanics.nodes.push(port.node)
    }
    // console.log('rotorRightPorts', mechanics.nodes.length)
    for (const port of rotorLeftPorts) {
      mechanics.nodes.push(port.node)
    }
    // console.log('rotorLeftPorts', mechanics.nodes.length)

    // connect crosswires
    for (let i = 0; i < this.targetCrosswireCount; i++) {
      let edge = {
        id: rotorCrosswires[i].id,
        length: rotorLeftPorts[i].crosswire.length + rotorLeftPorts[i].crosswire.length,
        part: 'crosswire'
      }
      // true: flow is left to right
      // false: flow is right to left
      if (direction) {
        mechanics.structure.addEdge(rotorLeftPorts[i].node, rotorRightPorts[i].node, edge)
      } else {
        mechanics.structure.addEdge(rotorRightPorts[i].node, rotorLeftPorts[i].node, edge)
      }
      // console.log('edge', edge) // noisy
    }

    return {
      id: this.id, // used for rotorGatewayId
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
        // seed: this.seed, // use rotor seed instead
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
    for (const crosswire of rotorCrosswires) {
      let query = db.crosswires.find({
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