'use server';

import { db } from "@/lib/firebase-admin";
import type { SharedState } from "./state";

const JOURNEYS_COLLECTION = 'clientJourneys';

// Type for what's stored in Firestore
interface JourneyDocument {
  name: string;
  savedAt: FirebaseFirestore.Timestamp;
  journeyData: string; // Storing as a JSON string
}

// Type for what we send to the client
export interface JourneyListItem {
  id: string;
  name: string;
  savedAt: string; // ISO string
}

export async function saveJourney(journeyData: SharedState, name: string, id?: string): Promise<string> {
  // This check is crucial. If db initialization failed, db will be undefined.
  if (!db) {
    throw new Error("Firestore is not initialized. Check your FIREBASE_SERVICE_ACCOUNT environment variable.");
  }
  try {
    const dataToSave: Omit<JourneyDocument, 'savedAt'> = {
      name: name,
      journeyData: JSON.stringify(journeyData),
    };
    
    if (id) {
      // Update existing document
      const docRef = db.collection(JOURNEYS_COLLECTION).doc(id);
      await docRef.update({
        ...dataToSave,
        savedAt: new Date(),
      });
      console.log('Journey updated with ID: ', id);
      return id;
    } else {
      // Create new document
      const docRef = await db.collection(JOURNEYS_COLLECTION).add({
        ...dataToSave,
        savedAt: new Date(),
      });
      console.log('Journey saved with ID: ', docRef.id);
      return docRef.id;
    }
  } catch (e: any) {
    console.error("Error saving journey: ", e);
    // Re-throw the original error to be caught by the server action handler
    // This ensures the detailed error message is sent to the client.
    throw e;
  }
}

export async function getJourneys(): Promise<JourneyListItem[]> {
    if (!db) {
      throw new Error("Firestore is not initialized. Check your FIREBASE_SERVICE_ACCOUNT environment variable.");
    }
    try {
        const snapshot = await db.collection(JOURNEYS_COLLECTION).orderBy('savedAt', 'desc').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => {
            const data = doc.data() as JourneyDocument;
            return {
                id: doc.id,
                name: data.name,
                savedAt: data.savedAt.toDate().toISOString(),
            }
        });
    } catch (e) {
        console.error("Error getting journeys: ", e);
        throw e;
    }
}

export async function getJourney(id: string): Promise<SharedState | null> {
    if (!db) {
      throw new Error("Firestore is not initialized. Check your FIREBASE_SERVICE_ACCOUNT environment variable.");
    }
    try {
        const doc = await db.collection(JOURNEYS_COLLECTION).doc(id).get();
        if (!doc.exists) {
            console.log('No such document!');
            return null;
        }
        const data = doc.data() as JourneyDocument;
        return JSON.parse(data.journeyData) as SharedState;
    } catch(e) {
        console.error("Error getting journey: ", e);
        throw e;
    }
}
