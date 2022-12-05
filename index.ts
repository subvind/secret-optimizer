import { SecretOptimizer } from './lib/secret-optimizer'
import { server } from './database/server'
import { browser } from './database/browser'
import * as channels from './channels/index'

let result = {
  SecretOptimizer: SecretOptimizer,
  database: {
    server,
    browser
  },
  channels: channels
}

export default result