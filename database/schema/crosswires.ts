export default {
  title: 'crosswire schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    order: {
      type: 'number',
      default: 0.5
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
    },
    createdAt: {
      type: 'number'
    }
  },
  required: ['id', 'order', 'inputCombination', 'outputCombination', 'weight', 'rotor', 'createdAt'],
  indexes: [
    'rotor',
    ['inputCombination', 'rotor'],
    ['outputCombination', 'rotor'],
    'createdAt',
  ]
}