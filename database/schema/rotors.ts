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
    order: {
      type: 'number',
      default: 0.5
    },
    rotatePosition: {
      type: 'number',
      default: 0
    },
    movesPerKeyPress: {
      type: 'number',
      default: 1
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
  },
  required: ['id', 'seed', 'order', 'rotatePosition', 'movesPerKeyPress', 'targetCrosswireCount', 'machine'],
  indexes: [
    ['seed', 'machine']
  ]
}