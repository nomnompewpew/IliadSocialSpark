import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;

// This is a more robust way to initialize Firebase Admin SDK.
// It checks for the environment variable and attempts to parse it.
// If anything fails, it throws a clear error instead of failing silently.

try {
  // Check if the app is already initialized
  if (!admin.apps.length) {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountString) {
      throw new Error('Firebase credentials are not set. Please provide the FIREBASE_SERVICE_ACCOUNT environment variable.');
    }
    
    // The service account can be a complex JSON object, so we need to parse it.
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  
  db = admin.firestore();

} catch (e: any) {
  // Catch any errors during initialization (e.g., invalid JSON)
  console.error('Failed to initialize Firebase Admin SDK:', e);
  // We don't have a db object here, but we'll let the functions that use it handle the error.
  // This helps in providing a specific error message to the user when an action is attempted.
}

// We export the initialized db instance. If initialization failed, db will be undefined,
// and any attempt to use it will result in an error that we can catch in our server actions.
// @ts-ignore
export { db };
