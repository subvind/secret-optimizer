// import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

import combinations from './schema/combinations'
import crosswires from './schema/crosswires'
import machines from './schema/machines'
import machineMethods from './methods/machines'
import members from './schema/members'
import oneTimePads from './schema/oneTimePads'
import plugboards from './schema/plugboards'
import plugboardMethods from './methods/plugboards'
import quorums from './schema/quorums'
import quorumMethods from './methods/quorums'
import reflectors from './schema/reflectors'
import reflectorMethods from './methods/reflectors'
import rotors from './schema/rotors'
import rotorMethods from './methods/rotors'
import scramble from './schema/scramble'
import terms from './schema/terms'

export default async function addCollectionsToDatabase (database) {
  return await database.addCollections({
    combinations: {
      schema: combinations
    },
    crosswires: {
      schema: crosswires
    },
    machines: {
      schema: machines,
      methods: machineMethods
    },
    members: {
      schema: members,
    },
    oneTimePads: {
      schema: oneTimePads,
    },
    plugboards: {
      schema: plugboards,
      methods: plugboardMethods
    },
    quorums: {
      schema: quorums,
      methods: quorumMethods
    },
    reflectors: {
      schema: reflectors,
      methods: reflectorMethods
    },
    rotors: {
      schema: rotors,
      methods: rotorMethods
    },
    scramble: {
      schema: scramble,
    },
    terms: {
      schema: terms,
    },
  });
}