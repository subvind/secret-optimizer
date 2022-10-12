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
    firstLevelOrders: {
      type: 'array',
      items: {
        type: 'number'
      }
    },
    firstLevelCombinations: {
      type: 'array',
      ref: 'combination',
      items: {
        type: 'string'
      }
    },
    secondLevelOrders: {
      type: 'array',
      items: {
        type: 'number'
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