import { v4 as uuidv4 } from 'uuid';

import seedrandom from 'seedrandom'
import com from '../../index'
import jkstra from 'jkstra'

export default {
  /**
   * from blueprints to concrete concept
   */
  async assemble (db: any, mechanics: any, inRotor: any, outRotor: any) {
    // mirror:
    // connect a to z
    // connect b to y
    // connect c to x
    // etc...
    let inPorts = inRotor.rotorLeftPorts
    let outPorts = outRotor.rotorLeftPorts.reverse()

    for (let i = 0; i < this.targetCombinationCount; i++) {
      let edge = {
        inPortOrder: inPorts[i].crosswire.leftPortOrder,
        outPortOrder: outPorts[i].crosswire.leftPortOrder,
        length: 0,
        part: 'reflector'
      }
      mechanics.structure.addEdge(inPorts[i].node, outPorts[i].node, edge)
    }

    // flip back
    outRotor.rotorLeftPorts.reverse()
  }
}