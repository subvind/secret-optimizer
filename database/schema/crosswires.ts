export default {
  title: 'crosswire schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    inputCombination: {
      ref: 'combination',
      type: 'string'
    },
    outputCombination: {
      ref: 'combination',
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
  required: ['id', 'inputCombination', 'outputCombination', 'weight', 'rotor'],
  indexes: [
    ['inputCombination', 'rotor'],
    ['outputCombination', 'rotor']
  ]
}