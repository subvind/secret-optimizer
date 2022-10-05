highly-scrambled
========
this fixes all of enigmas problems.

enigma flaws:
- a) pushing the same key over and over again revealed machine settings.
- b) pushing some key "X" would never return itself "X"; instead it returned any key but "X".
- c) settings changed with each keystroke rather than by which keystrokes were being pressed.
- d) configuration relied on a central authority to startup and reestablish connections.

every generated object starts from a seed:
- https://www.npmjs.com/package/seedrandom

which includes:
- generating machines
- generating rotors
- generating crosswires

> goal: because each layer of the system may be initialized from a seed that means
we can share settings in a simple way. So rather than telling someone crosswire
charts, rotor positions, and what not... instead tell them a code word and
then they can take that seed, update their config, and resume communications with you.

encoding and decoding:
- https://github.com/bbecquet/jkstra
- wiring is done manually using a graph data structure
- signals are passed through the machine by path routing

calculating sortest path:
- user -> keyboard letter
- keyboard letter -> reflector
- reflector -> lightboard letter
- lightboard letter -> user

> goal: we want to be able to press a single keyboard letter, have the signal 
bounce through the machine off the reflector and back so that we see a single 
lightboard letter show up.



```js
var rotors = seedrandom.xor4096('machine seed here...')
console.log('rotor 1', rotors());                // Always 0.9282578795792454
console.log('rotor 2', rotors());                // Always 0.3752569768646784
console.log('rotor 3', rotors());                // Always 0.1483929823472782
// etc...
```