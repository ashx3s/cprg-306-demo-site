"use client";

import { useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase/config";

export function useFirstoreCollection(collectionName = "users") {
  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setIsDataLoading(false);
        setError(null);
      },
      (error) => {
        setError(error.message);
        setIsDataLoading(false);
      }
    );
    return unsubscribe;
  }, [collectionName]);
  return { data, isDataLoading, error };
}
