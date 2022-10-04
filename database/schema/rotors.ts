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
    machine: {
      ref: 'machine',
      type: 'string'
    },
    crosswires: {
      type: 'array',
      ref: 'crosswire',
      items: {
        type: 'string'
      }
    },
  },
  required: ['id', 'slug', 'token', 'namespace'],
  indexes: [
    ['slug', 'namespace']
  ]
}