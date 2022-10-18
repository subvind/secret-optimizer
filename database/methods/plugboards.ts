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
    let combinations = db.combinations.find({
      selector: {
        machine: this.machine
      },
      sort: [
        { createdAt: 'asc' } // always start in this order
      ]
    })

    // make nodes
    let firstLevelPorts = []
    let secondLevelPorts = []
    for (let i = 0; i < this.targetCombinationCount; i++) {
      firstLevelPorts.push(
        {
          order: combinations.firstLevelOrders[i],
          node: mechanics.structure.addVertex({ id: this.id, part: "plugboard" }),
          combination: combinations[i]
        }
      );
      secondLevelPorts.push(
        {
          order: combinations.secondLevelOrders[i],
          node: mechanics.structure.addVertex({ id: this.id, part: "plugboard" }),
          combination: combinations[i]
        }
      );
    }

    // align nodes
    firstLevelPorts = firstLevelPorts.sort((a, b) => {
      return a.order - b.order
    })
    secondLevelPorts = secondLevelPorts.sort((a, b) => {
      return a.order - b.order
    })
    for (const firstLevel of firstLevelPorts) {
      mechanics.nodes.push(firstLevel.node)
    }
    for (const secondLevel of secondLevelPorts) {
      mechanics.nodes.push(secondLevel.node)
    }

    // causeEdge.data // => {length: 0.5, combination: {a}, part: 'keyboard'}
    // effectEdge.data // => {length: 0.5, combination: {a}, part: 'lightboard'}

    // connect beginning to firstLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: 0,
        combination: firstLevelPorts[i].combination,
        part: 'keyboard'
      }
      mechanics.structure.addEdge(mechanics.nodes[0], firstLevelPorts[i].node, edge);
    }

    // connect firstLevel to secondLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: firstLevelPorts[i].order + secondLevelPorts[i].order,
        from: firstLevelPorts[i].combination,
        to: secondLevelPorts[i].combination,
        part: 'plugboard'
      }
      mechanics.structure.addEdge(firstLevelPorts[i].node, secondLevelPorts[i].node, edge);
    }

    // connect secondLevel to enterRotor
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        plugboardId: secondLevelPorts[i].combination.id,
        rotorGatewayId: enterRotor.crosswire.id,
        length: 0,
        type: 'gateway'
      }
      mechanics.nodes.push(
        mechanics.structure.addEdge(secondLevelPorts[i].node, enterRotor[i].node, edge)
      );
    }

    // connect exitRotor to secondLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        plugboardId: secondLevelPorts[i].combination.id,
        rotorGatewayId: enterRotor.crosswire.id,
        length: 0,
        type: 'gateway'
      }
      mechanics.nodes.push(
        mechanics.structure.addEdge(enterRotor.node, secondLevelPorts[i].node, edge)
      );
    }

    // connect secondLevel to firstLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: firstLevelPorts[i].order + secondLevelPorts[i].order,
        from: secondLevelPorts[i].combination,
        to: firstLevelPorts[i].combination,
        part: 'plugboard'
      }
      mechanics.structure.addEdge(secondLevelPorts[i].node, firstLevelPorts[i].node, edge);
    }

    // connect firstLevel to ending
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: 0,
        combination: firstLevelPorts[i].combination,
        part: 'lightboard'
      }
      mechanics.structure.addEdge(firstLevelPorts[i].node, mechanics.nodes[1].node, edge);
    }

    return {
      firstLevelPorts,
      secondLevelPorts
    }
  },
  async scramble (db: any) {
    // randomly order firstLevelCombinations and secondLevelCombinations
    let machine = await db.machines.findOne(this.machine).exec()
    let quorum = await db.quorums.findOne(machine.quorum).exec()
    let environment = `${quorum.environment.galaxy}:${quorum.environment.star}:${quorum.environment.core}`
    let seed = `${this.seed}:${environment}:machine-${machine.order}:plugboard:${machine.channelIndex}:${machine.keyPressCount}`
    let rng = seedrandom.xor4096(seed)
    console.log(seed)
  
    let firstLevelOrders = []
    let secondLevelOrders = []
    for (let i = 1; i <= this.targetCombinationCount; i++) {
      firstLevelOrders.push(rng())
      secondLevelOrders.push(rng())
    }

    let query = db.plugboards.findOne({
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