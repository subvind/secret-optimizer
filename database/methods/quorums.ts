import { v4 as uuidv4 } from 'uuid';

// 26 + 26 + 10 + 10 = 72 max
let main = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()' 

export default {
  cleanupMachines: async function (db: any) {
    let query = db.machines.find({
      selector: {
        seed: this.seed,
        quorum: this.id
      }
    })

    await query.remove()
  },
  initMachines: async function (db: any) {
    let machines = []

    // create machines
    for (let i = 1; i <= this.targetMemberCount; i++) {
      let machine = await db.machines.insert({
        id: uuidv4(),
        seed: this.seed,
        quorum: this.id,
        targetCombinationCount: this.targetCombinationCount,
        targetRotorCount: this.targetRotorCount,
        alphabet: main.substring(0, this.targetCombinationCount)
      })
      machine.initCombinations(db)
      machine.initRotors(db)
      machines.push(machine.id)
    }

    // add machines to quorum list
    let query = db.quorums.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      machines: machines
    })
  }
}