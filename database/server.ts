import { createRxDatabase, addRxPlugin } from 'rxdb';
import addCollectionsToDatabase from './index';

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