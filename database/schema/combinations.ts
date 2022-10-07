export default {
  title: 'combination schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    letter: {
      type: 'string',
      default: 'a'
    },
    number: {
      type: 'number',
      default: 1
    },
    machine: {
      ref: 'machine',
      type: 'string'
    },
    createdAt: {
      type: 'number'
    }
  },
  required: ['id', 'letter', 'number', 'machine', 'createdAt'],
  indexes: [
    'machine',
    ['letter', 'machine'],
    ['number', 'machine'],
    'createdAt',
  ]
}