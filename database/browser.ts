import { createRxDatabase, addRxPlugin } from 'rxdb';
import addCollectionsToDatabase from './index';

export async function browser () {
  // @ts-ignore
  let dexiePlugin: any = (await import('rxdb/plugins/dexie'));
  // @ts-ignore
  let RxDBUpdatePlugin: any = (await import('rxdb/plugins/update')).RxDBUpdatePlugin;

  addRxPlugin(RxDBUpdatePlugin);

  const rxdb = await createRxDatabase({
    name: 'data/istrav.chat',
    storage: dexiePlugin.getRxStorageDexie()
  });

  return await addCollectionsToDatabase(rxdb)
}