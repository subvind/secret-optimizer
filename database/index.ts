
import { createRxDatabase, addRxPlugin } from 'rxdb';
// import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

import crosswires from './schema/crosswires'
import machines from './schema/machines'
import machineMethods from './methods/machines'
import plugboards from './schema/plugboards'
import reflectors from './schema/reflectors'
import rotors from './schema/rotors'

async function addCollectionsToDatabase (database) {
  return await database.addCollections({
    crosswires: {
      schema: crosswires
    },
    machines: {
      schema: machines,
      methods: machineMethods
    },
    plugboards: {
      schema: plugboards
    },
    reflectors: {
      schema: reflectors
    },
    rotors: {
      schema: rotors
    },
  });
}

export async function server () {
  let { getRxStoragePouch, addPouchPlugin } = require('rxdb/plugins/pouchdb');
  let { RxDBUpdatePlugin } = require('rxdb/plugins/update');

  const leveldown = require('leveldown');

  addPouchPlugin(require('pouchdb-adapter-leveldb'));
  
  addRxPlugin(RxDBUpdatePlugin);

  const rxdb = await createRxDatabase({
    name: 'data/istrav.chat',
    storage: getRxStoragePouch(leveldown)
  });

  return await addCollectionsToDatabase(rxdb)
}

export async function browser () {
  let dexiePlugin = (await import('rxdb/plugins/dexie'));
  let RxDBUpdatePlugin: any = (await import('rxdb/plugins/update')).RxDBUpdatePlugin;

  addRxPlugin(RxDBUpdatePlugin);

  const rxdb = await createRxDatabase({
    name: 'data/istrav.chat',
    storage: dexiePlugin.getRxStorageDexie()
  });

  return await addCollectionsToDatabase(rxdb)
}