"use client";

import { useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";

export function useUserBlogPosts(userId) {
  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [blogError, setBlogError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setData([]);
      setIsDataLoading(false);
      return;
    }
    const q = query(
      collection(db, "blog-posts"),
      where("authorUID", "==", userId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(posts);
        setIsDataLoading(false);
        setBlogError(null);
      },
      (error) => {
        setBlogError(error.message);
        setIsDataLoading(false);
      }
    );
    return unsubscribe;
  }, [userId]);
  return { data, isDataLoading, blogError };
}
