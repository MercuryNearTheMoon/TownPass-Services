// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCfNNfKYfssl9jZPlicWi6HnSxv9D22ym4',
  authDomain: 'townpass-service.firebaseapp.com',
  projectId: 'townpass-service',
  storageBucket: 'townpass-service.appspot.com',
  messagingSenderId: '698335808024',
  appId: '1:698335808024:web:569268497d907b26a8516d'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collectionName = 'pregnancy-health';
const colRef = collection(db, collectionName);

export async function insertDocument(date, week, weight, bloodPressure) {
  try {
    // Add a new document with the data
    const docRef = await addDoc(colRef, {
      date,
      week,
      weight,
      bloodPressure
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef.id; // Return the document ID
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
}

export async function getAllDocuments() {
  try {
    // Get all documents from the collection
    const querySnapshot = await getDocs(colRef);
    // Map through each document and extract the data
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Documents retrieved: ', documents);
    return documents; // Return all document data
  } catch (error) {
    console.error('Error fetching documents: ', error);
    throw error;
  }
}
