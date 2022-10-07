import { v4 as uuidv4 } from 'uuid';

// 26 + 26 + 10 + 10 = 72 max
let main = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()' 

export default {
  bestMachine: async function(db: any) {
    return await db.machines.findOne({
      selector: {
        quorum: this.id
      },
      sort: [
        { createdAt: 'asc' } // always start in this order
      ]
    }).exec()
    
  },
  cleanupMachines: async function (db: any) {
    let oldMachines = await db.machines.find({
      selector: {
        seed: this.seed,
        quorum: this.id
      }
    }).exec()
    if (oldMachines) {
      for (const record of oldMachines) {
        await record.cleanupCombinations(db)
        await record.cleanupRotors(db)
    
        await record.remove()
      }
    }
  },
  initMachines: async function (db: any) {
    let machines = []

    // create machines
    for (let i = 1; i <= this.targetMemberCount; i++) {
      let machine = await db.machines.insert({
        id: uuidv4(),
        seed: this.seed,
        alphabet: main.substring(0, this.targetCombinationCount),
        quorum: this.id,
        targetCombinationCount: this.targetCombinationCount,
        targetRotorCount: this.targetRotorCount,
        createdAt: Date.now() + i
      })
      await machine.initCombinations(db)
      await machine.initRotors(db)
      machines.push(machine.id)
    }
    // console.log('quorum', this.id, 'machines', machines)

    // add machines to quorum list
    let query = db.quorums.find({
      selector: {
        id: this.id
      }
    })
    await query.update({
      $set: {
        machines: machines
      }
    })

    console.log('initMachines', 'quorum', this.id)
  }
}