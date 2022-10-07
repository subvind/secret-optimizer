export default {
  title: 'rotor schema',
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
    channelIndex: {
      type: 'number',
      default: 0
    },
    order: {
      type: 'number',
      default: 0.5
    },
    targetCrosswireCount: {
      type: 'number',
      default: 26
    },
    crosswires: {
      type: 'array',
      ref: 'crosswire',
      items: {
        type: 'string'
      }
    },
    machine: {
      ref: 'machine',
      type: 'string'
    },
    createdAt: {
      type: 'number'
    }
  },
  required: ['id', 'seed', 'targetCrosswireCount', 'machine', 'createdAt'],
  indexes: [
    ['seed', 'machine'],
    'createdAt',
  ]
}