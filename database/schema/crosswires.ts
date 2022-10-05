export default {
  title: 'crosswire schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    input: {
      type: 'string'
    },
    output: {
      type: 'string'
    },
    weight: {
      type: 'number',
      default: 1
    },
    rotor: {
      ref: 'rotor',
      type: 'string'
    }
  },
  required: ['id', 'input', 'output', 'weight', 'rotor'],
  indexes: [
    ['input', 'rotor'],
    ['output', 'rotor']
  ]
}