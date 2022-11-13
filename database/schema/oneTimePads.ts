export default {
  title: 'oneTimePad schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    term: {
      ref: 'term',
      type: 'string'
    },
    orbit: {
      type: 'number'
    },
    color: {
      type: 'string'
    },
    number: {
      type: 'number'
    },
    spin: {
      type: 'number'
    },
    event: {
      type: 'string'
    }
  },
  required: ['id', 'term', 'orbit', 'color', 'number', 'spin', 'event'],
  indexes: [
    ['term', 'event', 'number'],
  ]
}