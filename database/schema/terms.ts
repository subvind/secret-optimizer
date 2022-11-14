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
      ref: 'oneTimePad',
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
  required: ['id', 'tColor', 'cColor', 'gColor', 'aColor', 'tCount', 'cCount', 'gCount', 'aCount'],
  indexes: []
}