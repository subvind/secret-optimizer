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
    main: {
      type: 'string',
    },
    alphabet: {
      type: 'string'
    },
    order: {
      type: 'number',
      default: 0.5
    },
    quorum: {
      ref: 'quorum',
      type: 'string'
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
  required: ['id', 'seed', 'main', 'alphabet', 'quorum', 'targetCombinationCount', 'targetRotorCount', 'createdAt'],
  indexes: [
    ['seed', 'quorum'],
    'main',
    'order',
    'createdAt',
  ]
}