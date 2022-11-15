export default {
  title: 'scramble schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    key: {
      type: 'string',
      default: 'isTrav'
    },
    scramble: {
      type: 'string',
      default: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()'
    },
    machineCount: {
      type: 'number',
      default: 1
    },
    rotorCount: {
      type: 'number',
      default: 4
    },
    baseCount: {
      type: 'number',
      default: 26
    },
    stuffAmount: {
      type: 'number',
      default: 3
    },
    layerBy: {
      type: 'string',
      default: ' '
    },
    signalMarker: {
      type: 'string',
      default: '='
    },
  },
  required: ['id', 'key', 'scramble', 'machineCount', 'rotorCount', 'baseCount', 'stuffAmount', 'layerBy', 'signalMarker'],
  indexes: [
    'key'
  ]
}