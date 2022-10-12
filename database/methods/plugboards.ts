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
        { order: 'asc' } // always start in this order
      ]
    })

    // make nodes
    let firstLevelNodes = []
    let secondLevelNodes = []
    for (let i = 0; i < this.targetCombinationCount; i++) {
      firstLevelNodes.push(
        {
          order: combinations.firstLevelOrders[i],
          node: mechanics.structure.addVertex({ id: this.id, part: "plugboard" }),
          combination: combinations[i]
        }
      );
      secondLevelNodes.push(
        {
          order: combinations.secondLevelOrders[i],
          node: mechanics.structure.addVertex({ id: this.id, part: "plugboard" }),
          combination: combinations[i]
        }
      );
    }

    // align nodes
    firstLevelNodes = firstLevelNodes.sort((a, b) => {
      return a.order - b.order
    })
    secondLevelNodes = secondLevelNodes.sort((a, b) => {
      return a.order - b.order
    })
    for (const node of firstLevelNodes) {
      mechanics.nodes.push(node)
    }
    for (const node of secondLevelNodes) {
      mechanics.nodes.push(node)
    }

    // causeEdge.data // => {length: 0.5, combination: {a}, part: 'keyboard'}
    // effectEdge.data // => {length: 0.5, combination: {a}, part: 'lightboard'}

    // connect beginning to firstLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: 0,
        combination: firstLevelNodes[i].combination,
        part: 'keyboard'
      }
      mechanics.structure.addEdge(mechanics.nodes[0], firstLevelNodes[i], edge);
    }

    // connect firstLevel to secondLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: firstLevelNodes[i].order + secondLevelNodes[i].order,
        from: firstLevelNodes[i].combination,
        to: secondLevelNodes[i].combination,
        part: 'plugboard'
      }
      mechanics.structure.addEdge(firstLevelNodes[i], secondLevelNodes[i], edge);
    }

    // connect secondLevel to enterRotor

    // TODO

    // connect exitRotor to secondLevel

    // TODO

    // connect secondLevel to firstLevel
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: firstLevelNodes[i].order + secondLevelNodes[i].order,
        from: secondLevelNodes[i].combination,
        to: firstLevelNodes[i].combination,
        part: 'plugboard'
      }
      mechanics.structure.addEdge(secondLevelNodes[i], firstLevelNodes[i], edge);
    }

    // connect firstLevel to ending
    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        length: 0,
        combination: firstLevelNodes[i].combination,
        part: 'lightboard'
      }
      mechanics.structure.addEdge(firstLevelNodes[i], mechanics.nodes[1], edge);
    }

    mechanics.nodes.push(
      mechanics.structure.addVertex({ id: this.id, part: "plugboard" })
    );

    return {
      firstLevelNodes,
      secondLevelNodes
    }
  },
  async scramble (db: any) {
    // randomly order firstLevelCombinations and secondLevelCombinations
    let machine = await db.machine.findOne(this.machine).exec()
    let quorum = await db.quorums.findOne(machine.quorum).exec()
    let environment = `${quorum.environment.galaxy}:${quorum.environment.star}:${quorum.environment.core}`
    let seed = `${this.seed}:${environment}:machine-${machine.order}:plugboard:${machine.channelIndex}:${machine.keyPressCount}`
    let rng = seedrandom.xor4096(seed)
    console.log(seed)
    if (this.firstLevelCombinations.length) {
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
}