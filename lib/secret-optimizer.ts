import { v4 as uuidv4 } from 'uuid';
import { version } from '../package.json';
import jkstra from 'jkstra'
import PusherJS from 'pusher-js'
import Pusher from 'pusher'

export class SecretOptimizer {
  private rxdb: any = null;
  private wsClient: any = null;
  private wsServer: any = null;
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
          console.log('loaded database')
          clearInterval(interval)
          resolve(that.rxdb);
        } else {
          console.log('loading database', that.rxdb)
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

  public wsc (): Promise<any> {
    // check if loaded every 0.2 seconds
    let that = this
    return new Promise((resolve) => {
      let interval = setInterval(async () => {
        if (that.wsClient !== null) {
          console.log('loaded client web socket')
          clearInterval(interval)
          resolve(that.wsClient);
        } else {
          console.log('loading client web socket', that.wsClient)
        }
      }, 200)
    });
  }

  async webSocketClient (key: string, config: any) {
    // only allow one to be loaded
    if (this.wsClient === null) {
      this.wsClient = new PusherJS(key, config);
    }
    return this.wsClient
  }

  public wss (): Promise<any> {
    // check if loaded every 0.2 seconds
    let that = this
    return new Promise((resolve) => {
      let interval = setInterval(async () => {
        if (that.wsServer !== null) {
          console.log('loaded server web socket')
          clearInterval(interval)
          resolve(that.wsServer);
        } else {
          console.log('loading server web socket', that.wsServer)
        }
      }, 200)
    });
  }

  async webSocketServer (key: string, secret: string, config: any) {
    // only allow one to be loaded
    if (this.wsServer === null) {
      this.wsServer = new Pusher({key, secret, ...config});
    }
    return this.wsServer
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