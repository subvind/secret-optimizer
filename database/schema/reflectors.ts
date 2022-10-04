export default {
  title: 'reflector schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    slug: {
      type: 'string'
    },
    token: {
      type: 'string'
    },
    namespace: {
      ref: 'namespace',
      type: 'string'
    }
  },
  required: ['id', 'slug', 'token', 'namespace'],
  indexes: [
    ['slug', 'namespace']
  ]
}