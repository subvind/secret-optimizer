export default {
  title: 'crosswire schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    leftPortOrder: {
      type: 'number',
      default: 0.5
    },
    rightPortOrder: {
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
    length: {
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
  required: ['id', 'order', 'inputCombination', 'outputCombination', 'length', 'rotor', 'createdAt'],
  indexes: [
    'rotor',
    'leftPortOrder',
    'rightPortOrder',
    ['inputCombination', 'rotor'],
    ['outputCombination', 'rotor'],
    'createdAt',
  ]
}