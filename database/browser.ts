import { createRxDatabase, addRxPlugin } from 'rxdb';
import addCollectionsToDatabase from './index';

// pass in these modules...
// let dexiePlugin: any = (await import('rxdb/plugins/dexie'));
// let RxDBUpdatePlugin: any = (await import('rxdb/plugins/update')).RxDBUpdatePlugin;

export async function browser (dexiePlugin: any, RxDBUpdatePlugin: any) {
  addRxPlugin(RxDBUpdatePlugin);

  const rxdb = await createRxDatabase({
    name: 'data/istrav.chat',
    storage: dexiePlugin.getRxStorageDexie()
  });

  return await addCollectionsToDatabase(rxdb)
}