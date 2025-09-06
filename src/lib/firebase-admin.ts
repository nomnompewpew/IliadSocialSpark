import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!admin.apps.length) {
  if (!serviceAccountString) {
      console.warn('FIREBASE_SERVICE_ACCOUNT environment variable not set. Firestore functionality will be disabled.');
      // Set db to a mock/dummy object or handle appropriately
  } else {
      try {
          const serviceAccount = JSON.parse(serviceAccountString);
          admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
          });
          db = admin.firestore();
      } catch (e: any) {
          console.error('Failed to parse Firebase service account. Check .env file format:', e);
      }
  }
} else {
  db = admin.firestore();
}

// @ts-ignore
export { db };
