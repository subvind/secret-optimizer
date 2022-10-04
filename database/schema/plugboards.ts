export default {
  title: 'plugboard schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    a: {
      type: 'number',
      default: 1
    },
    b: {
      type: 'number',
      default: 2
    },
    c: {
      type: 'number',
      default: 3
    },
    d: {
      type: 'number',
      default: 4
    },
    e: {
      type: 'number',
      default: 5
    },
    f: {
      type: 'number',
      default: 6
    },
    g: {
      type: 'number',
      default: 7
    },
    h: {
      type: 'number',
      default: 8
    },
    i: {
      type: 'number',
      default: 9
    },
    j: {
      type: 'number',
      default: 10
    },
    k: {
      type: 'number',
      default: 11
    },
    l: {
      type: 'number',
      default: 12
    },
    m: {
      type: 'number',
      default: 13
    },
    n: {
      type: 'number',
      default: 14
    },
    o: {
      type: 'number',
      default: 15
    },
    p: {
      type: 'number',
      default: 16
    },
    q: {
      type: 'number',
      default: 17
    },
    r: {
      type: 'number',
      default: 18
    },
    s: {
      type: 'number',
      default: 19
    },
    t: {
      type: 'number',
      default: 20
    },
    u: {
      type: 'number',
      default: 21
    },
    v: {
      type: 'number',
      default: 22
    },
    w: {
      type: 'number',
      default: 23
    },
    x: {
      type: 'number',
      default: 24
    },
    y: {
      type: 'number',
      default: 25
    },
    z: {
      type: 'number',
      default: 26
    },
    machine: {
      ref: 'machine',
      type: 'string'
    }
  },
  required: ['id', 'machine'],
  indexes: [
    ['slug', 'namespace']
  ]
}