import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (serviceAccountString) {
    try {
        const serviceAccount = JSON.parse(serviceAccountString);
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }
        db = admin.firestore();
    } catch (e: any) {
        console.error('Failed to parse Firebase service account:', e);
    }
} else {
    console.warn('FIREBASE_SERVICE_ACCOUNT environment variable not set. Firestore functionality will be disabled.');
}

// @ts-ignore
export { db };
