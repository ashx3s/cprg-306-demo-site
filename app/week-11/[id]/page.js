"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useAuth } from "@/app/contexts/AuthContext";
export default function Page({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { authUser, loading: authLoading } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "blog-posts", unwrappedParams.id);
        const docSnap = await getDoc(docRef);
        console.log(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Post not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [unwrappedParams.id]);

  if (loading || authLoading) {
    return <div className="mx-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="mx-4">
        <p>Error: {error}</p>
        <Link href="/week-11" className="text-blue-500 underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-4">
        <p>Post not found.</p>
        <Link href="/week-11" className="text-blue-500 underline">
          Back to Blog
        </Link>
      </div>
    );
  }
  return (
    <main>
      <header>
        <h1>Individual Dynamically Generated Blog Page</h1>
      </header>
      <article>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </article>
    </main>
  );
}
