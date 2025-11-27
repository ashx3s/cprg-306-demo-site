"use client";

// form schema with editable data to use for reset and init

export default function Page() {
  //get our auth user
  // state for form data to be pushed to firebase
  // fetch blog data with our new custom hook

  // form submit function
  // sanitize and error handle
  // generate slug
  // get postdata from the form
  // add item from our controller with specification of the blog-posts collection
  // reset form data
  return (
    <main>
      <header>
        <h1>Blog Posts Example</h1>
      </header>
      <section>
        <h2>Blog Post Creator Form</h2>
        <form>
          {/* title */}
          {/* body */}
          {/* submit */}
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
                {/* show the post title as text */}
                {/* show the data using our formatDate  Utility */}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
