import { v4 as uuidv4 } from 'uuid';
import machines from '../database/schema/machines';
import { version } from '../package.json';

export class HighlyScrambled {
  private rxdb: any = null;
  private static instance: HighlyScrambled;

  private constructor() {}

  public static getInstance(): HighlyScrambled {
    if (!HighlyScrambled.instance) {
      HighlyScrambled.instance = new HighlyScrambled();
    }

    return HighlyScrambled.instance;
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

  calculate(machineId: string) {
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

  version() {
    return version // 1.0.2
  }
}