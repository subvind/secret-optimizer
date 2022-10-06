export default {
  title: 'quorum schema',
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
    targetMemberCount: {
      type: 'number',
      default: 26
    },
    targetRotorCount: {
      type: 'number',
      default: 26
    },
    targetCombinationCount: {
      type: 'number',
      default: 26
    },
    machines: {
      type: 'array',
      ref: 'machine',
      items: {
        type: 'string'
      }
    },
  },
  required: ['id', 'seed', 'targetMemberCount'],
  indexes: [
    'seed'
  ]
}