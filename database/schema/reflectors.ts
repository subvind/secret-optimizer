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