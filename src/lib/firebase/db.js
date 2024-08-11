import { db } from './client';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Function to check if a key exists in the 'secret' collection
export async function checkSecretKeyExists(cleanedKey) {
  try {
    // Query the 'secret' collection where the 'key' matches the cleanedKey
    const q = query(collection(db, 'secret'), where('key', '==', cleanedKey), where('exists', '==', true));
    const querySnapshot = await getDocs(q);

    // Return true if a document with the key exists and has 'exists' set to true
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking secret key:', error);
    throw error;
  }
}
