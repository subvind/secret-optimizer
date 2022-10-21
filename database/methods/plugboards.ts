import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'
import com from '../../index'
import jkstra from 'jkstra'

export default {
  /**
   * from blueprints to concrete concept
   */
  async assemble (db: any, mechanics: any, enterRotor: any, exitRotor: any) {
    // all combinations
    let combinations = await db.combinations.find({
      selector: {
        machine: this.machine
      },
      sort: [
        { createdAt: 'asc' } // always start in this order
      ]
    }).exec()

    // make nodes
    let firstLevelInputPorts = []
    let secondLevelInputPorts = []
    let firstLevelOutputPorts = []
    let secondLevelOutputPorts = []
    for (let i = 0; i < this.targetCombinationCount; i++) {
      firstLevelInputPorts.push(
        {
          order: this.firstLevelOrders[i],
          node: mechanics.structure.addVertex({ id: this.id, combination: combinations[i], level: 1, part: "plugboard" }),
          combination: combinations[i]
        }
      );
      secondLevelInputPorts.push(
        {
          order: this.secondLevelOrders[i],
          node: mechanics.structure.addVertex({ id: this.id, combination: combinations[i], level: 2, part: "plugboard" }),
          combination: combinations[i]
        }
      );
      firstLevelOutputPorts.push(
        {
          order: this.firstLevelOrders[i],
          node: mechanics.structure.addVertex({ id: this.id, combination: combinations[i], level: 1, part: "plugboard" }),
          combination: combinations[i]
        }
      );
      secondLevelOutputPorts.push(
        {
          order: this.secondLevelOrders[i],
          node: mechanics.structure.addVertex({ id: this.id, combination: combinations[i], level: 2, part: "plugboard" }),
          combination: combinations[i]
        }
      );
    }

    // align nodes
    firstLevelInputPorts = firstLevelInputPorts.sort((a, b) => {
      return a.order - b.order
    })
    secondLevelInputPorts = secondLevelInputPorts.sort((a, b) => {
      return a.order - b.order
    })
    firstLevelOutputPorts = firstLevelOutputPorts.sort((a, b) => {
      return a.order - b.order
    })
    secondLevelOutputPorts = secondLevelOutputPorts.sort((a, b) => {
      return a.order - b.order
    })
    for (const firstLevel of firstLevelInputPorts) {
      mechanics.nodes.push(firstLevel.node)
    }
    for (const firstLevel of firstLevelOutputPorts) {
      mechanics.nodes.push(firstLevel.node)
    }
    // console.log('firstLevelInputPorts', mechanics.nodes.length)
    for (const secondLevel of secondLevelInputPorts) {
      mechanics.nodes.push(secondLevel.node)
    }
    for (const secondLevel of secondLevelOutputPorts) {
      mechanics.nodes.push(secondLevel.node)
    }
    // console.log('secondLevelInputPorts', mechanics.nodes.length)

    // causeEdge.data // => {length: 0.5, combination: {a}, part: 'keyboard'}
    // effectEdge.data // => {length: 0.5, combination: {a}, part: 'lightboard'}

    // input connect beginning to firstLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: 0,
        combination: combinations.filter((value) => { return value.id === firstLevelInputPorts[i].combination })[0],
        part: 'keyboard'
      }
      mechanics.structure.addEdge(mechanics.nodes[0], firstLevelInputPorts[i].node, edge);
    }

    // input connect firstLevel to secondLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: firstLevelInputPorts[i].order + secondLevelInputPorts[i].order,
        from: firstLevelInputPorts[i].combination,
        to: secondLevelInputPorts[i].combination,
        part: 'plugboard'
      }
      mechanics.structure.addEdge(firstLevelInputPorts[i].node, secondLevelInputPorts[i].node, edge);
    }

    // input connect secondLevel to enterRotor
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        plugboardId: secondLevelInputPorts[i].combination.id,
        rotorGatewayId: enterRotor.id,
        length: 0,
        part: 'gateway'
      }
      mechanics.structure.addEdge(secondLevelInputPorts[i].node, enterRotor.rotorRightPorts[i].node, edge)
    }

    // output connect exitRotor to secondLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        plugboardId: secondLevelOutputPorts[i].combination.id,
        rotorGatewayId: exitRotor.id,
        length: 0,
        part: 'gateway'
      }
      mechanics.structure.addEdge(exitRotor.rotorLeftPorts[i].node, secondLevelOutputPorts[i].node, edge)
    }

    // output connect secondLevel to firstLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: firstLevelOutputPorts[i].order + secondLevelOutputPorts[i].order,
        from: secondLevelOutputPorts[i].combination,
        to: firstLevelOutputPorts[i].combination,
        part: 'plugboard'
      }
      mechanics.structure.addEdge(secondLevelOutputPorts[i].node, firstLevelOutputPorts[i].node, edge);
    }

    // output connect firstLevel to ending
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: 0,
        combination: firstLevelOutputPorts[i].combination,
        part: 'lightboard'
      }
      mechanics.structure.addEdge(firstLevelOutputPorts[i].node, mechanics.nodes[1], edge);
    }

    return {
      firstLevelInputPorts,
      secondLevelInputPorts,
      firstLevelOutputPorts,
      secondLevelOutputPorts
    }
  },
  async scramble (db: any) {
    // randomly order firstLevelCombinations and secondLevelCombinations
    let machine = await db.machines.findOne(this.machine).exec()
    let quorum = await db.quorums.findOne(machine.quorum).exec()
    let environment = `${quorum.environment.galaxy}:${quorum.environment.star}:${quorum.environment.core}`
    let seed = `${this.seed}:${environment}:machine-${machine.order}:plugboard-${this.main}`
    let rng = seedrandom.xor4096(seed)
    console.log(seed)
  
    let firstLevelOrders = []
    let secondLevelOrders = []
    for (let i = 1; i <= this.targetCombinationCount; i++) {
      firstLevelOrders.push(rng())
      secondLevelOrders.push(rng())
    }

    let query = db.plugboards.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      $set: {
        firstLevelOrders,
        secondLevelOrders
      }
    })
  }
}