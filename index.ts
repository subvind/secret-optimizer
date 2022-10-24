import { SecretOptimizer } from './lib/secret-optimizer'
import * as database from './database/index'

let result = {
  SecretOptimizer: SecretOptimizer,
  database: database
}

export default result