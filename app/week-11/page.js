"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useUserBlogPosts } from "../hooks/useUserBlogPosts";
import { addItem } from "../lib/controller";
import { generateSlug, formatDate } from "../lib/blogHelpers";
import { serverTimestamp } from "firebase/firestore";

// form schema with editable data to use for reset and init
const formDataSchema = {
  title: "",
  body: "",
};

export default function Page() {
  //get our auth user
  const { authUser, loading } = useAuth();

  // state for form data to be pushed to firebase
  const [formData, setFormData] = useState(formDataSchema);
  // fetch blog data with our new custom hook
  const {
    data: posts,
    isDataLoading,
    blogError,
  } = useUserBlogPosts(authUser?.uid);

  // form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    // sanitize and error handle
    if (!formData.title.trim() || !formData.body.trim()) {
      alert("please fill in both title and body");
    }
    if (!authUser?.uid) {
      alert("Must be Logged In to create a post");
      return;
    }
    try {
      const slug = generateSlug(formData.title);
      const postData = {
        title: formData.title,
        body: formData.body,
        slug: slug,
        authorUID: authUser.uid,
        createdAt: serverTimestamp(),
      };
      await addItem("blog-posts", postData);
      setFormData(formDataSchema);
    } catch (error) {
      console.error("Error creating post: ", error);
      alert("Failed to create a post");
    }
  };

  // Return Logic and variations
  if ((isDataLoading, loading)) {
    return <p>Loading...</p>;
  }
  if (blogError) {
    return (
      <div>
        <h3>
          <strong>Blog Loading Error</strong>
        </h3>
        <p>{blogError}</p>
      </div>
    );
  }
  if (!authUser) {
    return <h1>Please login to create and manage blog</h1>;
  }
  return (
    <main>
      <header>
        <h1>Blog Posts Example</h1>
      </header>

      <section>
        <h2>Blog Post Creator Form</h2>
        <form onSubmit={handleSubmit}>
          {/* title */}
          <div>
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          {/* body */}
          <div>
            <label htmlFor="title">body: </label>
            {/* replace with textarea and create implementation with wysywig editor */}
            <textarea
              type="text"
              name="body"
              id="body"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              rows="6"
              placeholder="Write your post content here"
            />
          </div>
          <button type="submit">Submit Blog Post</button>
        </form>
      </section>
      <section>
        <h2>Show Blog Posts</h2>
        {/* conditional message for when there is non vs when there are posts */}
        {posts.length === 0 ? (
          <p>No Posts yet, create your first post above</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                {/* Link to the post based on its id */}
                <Link href={`/blog/${post.id}`}>
                  {/* show the post title as text */}
                  <h3>{post.title}</h3>
                  {/* show the data using our formatDate  Utility */}
                  <p>{formatDate(post.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
