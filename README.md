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

with each key press:
- universe: in a visible environment 26 galaxies expand apart
- galaxy: in a gravitational environment 26 stars go around a single point
- star: in a ranking environment 26 quorums layered by onion model
- quorum: in a trustless environment 26 machines move geospatialy
- machine: in a semitrust environment 26 rotors swap and rotate
- rotor: in a trustful environment 26 crosswires defrequency
- crosswire: in a secure environment 26 letters plain text transmit

> note: we will be encoding and decoding within machines; the number of possible combinations here is 1 machine with 26 rotors each with 26 crosswires each with 26 letters each // MATH: 26^26^26... = Infinity

The space that exists between machines must never contain plain text messages. Instead every message between each machine must be encoded, transmitted, and then decoded. One important thing that needs to be established between machines is a consensus (important for leader election) amongst one another. There could be 100s of machines out there however the default is a quorum (min # of memberships) of 26 needed in order esablish valid rules; which is a great number for confusion because there are also only 26 possible letters.


```js
var rotors = seedrandom.xor4096('machine seed here...')
console.log('rotor 1', rotors());                // Always 0.9282578795792454
console.log('rotor 2', rotors());                // Always 0.3752569768646784
console.log('rotor 3', rotors());                // Always 0.1483929823472782
// etc...
```