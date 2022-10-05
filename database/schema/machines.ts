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
    plugboard: {
      ref: 'plugboard',
      type: 'string'
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
  },
  required: ['id', 'seed'],
  indexes: [
    ['seed', 'quorum']
  ]
}