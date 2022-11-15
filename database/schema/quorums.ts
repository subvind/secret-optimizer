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
    layerBy: {
      type: 'string',
      default: ' '
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
    stuffAmount: {
      type: 'number',
      default: 3
    },
    machines: {
      type: 'array',
      ref: 'machine',
      items: {
        type: 'string'
      }
    },
  },
  required: ['id', 'seed', 'layerBy', 'targetMemberCount', 'targetRotorCount', 'targetCombinationCount', 'stuffAmount'],
  indexes: [
    ['seed', 'layerBy', 'targetMemberCount', 'targetRotorCount', 'targetCombinationCount', 'stuffAmount']
  ]
}