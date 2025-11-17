import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/app/firebase/config";

// CRUD Operations

// Create new entry
export const addItem = async (collectionName, itemName) => {
  try {
    await addDoc(collection(db, collectionName), {
      name: itemName,
    });
  } catch (error) {
    console.error(`Error adding ${itemName} to ${collectionName} \n`, error);
  }
};
// Read all entries
export const getItems = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error reading collection: ${collectionName} \n`, error);
  }
};
// Update an entry
export const updateItem = async (id, collectionName, newName) => {
  try {
    const itemDoc = doc(db, collectionName, id);
    await updateDoc(itemDoc, { name: newName });
  } catch (error) {
    console.error(
      `Error updating ${id} to ${newName} in ${collectionName} \n`,
      error
    );
  }
};
// Delete an entry
export const deleteItem = async (id, collectionName) => {
  try {
    const itemDoc = doc(db, collectionName, id);
    await deleteDoc(itemDoc);
  } catch (error) {
    console.error(`Error Deleting ${id} from ${collectionName} \n`, error);
  }
};
