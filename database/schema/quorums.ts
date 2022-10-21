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
    environment: {
      type: "object",
      properties: {
        galaxy: {
          type: 'string',
          default: 'a'
        },
        star: {
          type: 'string',
          default: 'a'
        },
        core: {
          type: 'string',
          default: 'a'
        },
      }
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
    machines: {
      type: 'array',
      ref: 'machine',
      items: {
        type: 'string'
      }
    },
  },
  required: ['id', 'seed', 'targetMemberCount', 'targetRotorCount', 'targetCombinationCount'],
  indexes: [
    'seed'
  ]
}