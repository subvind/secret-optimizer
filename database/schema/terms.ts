export default {
  title: 'term schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    oneTimePads: {
      type: 'array',
      ref: 'oneTimePads',
      items: {
        type: 'string'
      }
    },
    tColor: {
      type: 'string'
    },
    cColor: {
      type: 'string'
    },
    gColor: {
      type: 'string'
    },
    aColor: {
      type: 'string'
    },
    tCount: {
      type: 'number'
    },
    cCount: {
      type: 'number'
    },
    gCount: {
      type: 'number'
    },
    aCount: {
      type: 'number'
    },
  },
  required: ['id', 'term', 'orbit', 'color', 'number', 'spin', 'event'],
  indexes: [
    ['term', 'event', 'number'],
  ]
}