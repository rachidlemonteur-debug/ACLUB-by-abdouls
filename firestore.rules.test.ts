import { readFileSync } from 'fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { setLogLevel } from 'firebase/firestore';

setLogLevel('error');

const PROJECT_ID = 'gen-lang-client-0149638302';

describe('Firestore Security Rules', () => {
  let testEnv: any;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('allows public read to categories', async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertSucceeds(db.collection('categories').get());
  });

  it('prevents anonymous write to categories', async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(db.collection('categories').add({ name: 'Test' }));
  });

  it('allows admin write to categories', async () => {
    const context = testEnv.authenticatedContext('admin_uid_123');
    const db = context.firestore();
    await assertSucceeds(db.collection('categories').add({ name: 'Test' }));
  });
});
