import { v4 as uuidv4 } from 'uuid';
import { version } from '../package.json';
import jkstra from 'jkstra'

export class SecretOptimizer {
  private rxdb: any = null;
  private static instance: SecretOptimizer;
  private mechanics: Array<any> = []

  private constructor() {}

  public static getInstance(): SecretOptimizer {
    if (!SecretOptimizer.instance) {
      SecretOptimizer.instance = new SecretOptimizer();
    }

    return SecretOptimizer.instance;
  }

  public db(): Promise<any> {
    // check if loaded every 0.2 seconds
    let that = this
    return new Promise((resolve) => {
      let interval = setInterval(async () => {
        if (that.rxdb !== null) {
          console.log('loaded')
          clearInterval(interval)
          resolve(that.rxdb);
        } else {
          console.log('loading', that.rxdb)
        }
      }, 200)
    });
  }

  async database(rxdb: any) {
    // only allow one to be loaded
    if (this.rxdb === null) {
      this.rxdb = await rxdb()
    }
    return this.rxdb
  }

  // blueprint and structure
  createMechanics (machine: any) {
    var graph = new jkstra.Graph();

    let mechanics = this.mechanics.filter((value, index) => {
      return value.blueprint !== machine.id
    })
    
    let workingParts = {
      blueprint: machine.id,
      structure: graph,
      nodes: [],
      completeId: 1,
    }
    mechanics.push(workingParts)
    this.mechanics = mechanics
    return workingParts
  }

  getMechanics (machine: any) {
    let mechanics = this.mechanics.filter((value, index) => {
      return value.blueprint === machine.id
    })

    return mechanics[0]
  }

  calculate(machineGraph: string) {
    let that = this
    return {
      encode(text: string) {

      },
      decode(text: string) {

      }
    }
  }

  machines(seed: string) {
    let that = this
    return {
      insert: (options) => {
        return that.rxdb.machines.insert({
          ...options,
          seed: seed,
          id: uuidv4(),
        })
      }
    }
  }

  async build (spec: any) {
    // remove existing
    const oldQuorum = await this.rxdb.quorums.findOne({
      selector: {
        seed: spec.key
      }
    }).exec()
    if (oldQuorum) {
      console.log('cleanup quorum', oldQuorum.id)
      await oldQuorum.cleanupMachines(this.rxdb)
      await oldQuorum.remove();
    }

    // create new
    console.log('key', spec.key)
    let quorum = await this.rxdb.quorums.insert({
      id: uuidv4(),
      seed: spec.key,
      main: spec.scramble,
      environment: spec.environment,
      layerBy: spec.layerBy,
      targetMemberCount: spec.machineCount,
      targetRotorCount: spec.rotorCount,
      targetCombinationCount: spec.baseCount,
    })
    console.log('quorum', quorum.id)

    await quorum.initMachines(this.rxdb, spec.scramble)

    return quorum
  }

  version(): string {
    return version // 1.0.2
  }
}