export default {
  title: 'reflector schema',
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
    targetCombinationCount: {
      type: 'number',
      default: 26
    },
    inputCombinations: {
      type: 'array',
      ref: 'combination',
      items: {
        type: 'string'
      }
    },
    outputCombinations: {
      type: 'array',
      ref: 'combination',
      items: {
        type: 'string'
      }
    },
    machine: {
      ref: 'machine',
      type: 'string'
    }
  },
  required: ['id', 'seed', 'machine'],
  indexes: [
    ['seed', 'machine']
  ]
}