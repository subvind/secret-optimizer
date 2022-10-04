highly-scrambled
========

every machine has a secret that remains at the top level:
- https://www.npmjs.com/package/seedrandom

sub secrets are created and used to configure each rotor:
```js
var rotors = seedrandom.xor4096('machine seed here...')
console.log('rotor 1', rotors());                // Always 0.9282578795792454
console.log('rotor 2', rotors());                // Always 0.3752569768646784
console.log('rotor 3', rotors());                // Always 0.1483929823472782
// etc...
```