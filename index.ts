import { SecretOptimizer } from './lib/secret-optimizer'
import * as database from './database/index'
import * as channels from './channels/index'

let result = {
  SecretOptimizer: SecretOptimizer,
  database: database,
  channels: channels
}

export default result