export default {
  title: 'plugboard schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    seed: {
      type: 'string',
    },
    targetCombinationCount: {
      type: 'number',
      default: 26
    },
    firstLevelCombinations: {
      type: 'array',
      ref: 'combination',
      items: {
        type: 'string'
      }
    },
    secondLevelCombinations: {
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