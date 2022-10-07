export default {
  title: 'machine schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    seed: {
      type: 'string'
    },
    alphabet: {
      type: 'string'
    },
    input: {
      ref: 'combination',
      type: 'string'
    },
    output: {
      ref: 'combination',
      type: 'string'
    },
    quorum: {
      ref: 'quorum',
      type: 'string'
    },
    keyPressCount: {
      type: 'number',
      default: 0
    },
    targetCombinationCount: {
      type: 'number',
      default: 26
    },
    combinations: {
      type: 'array',
      ref: 'combination',
      items: {
        type: 'string'
      }
    },
    plugboard: {
      ref: 'plugboard',
      type: 'string'
    },
    targetRotorCount: {
      type: 'number',
      default: 26
    },
    rotors: {
      type: 'array',
      ref: 'rotor',
      items: {
        type: 'string'
      }
    },
    reflector: {
      ref: 'reflector',
      type: 'string'
    },
    createdAt: {
      type: 'number'
    }
  },
  required: ['id', 'seed', 'alphabet', 'quorum', 'targetCombinationCount', 'targetRotorCount', 'createdAt'],
  indexes: [
    ['seed', 'quorum'],
    'createdAt',
  ]
}