"use client";
import { useState, useEffect } from "react";
import {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} from "@/app/lib/controller";

export default function Page() {
  // state for input value
  // state for edit id
  // state for items TODO: Change to custom hook
  const [items, setItems] = useState([]);
  const fetchItems = async () => {
    try {
      const data = await getItems("users");
      setItems(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };
  useEffect(() => {
    // get data from backend
    fetchItems();
  }, []);
  return (
    // render all entries in the users collection
    <main>
      <header>
        <h1>Firestore Example</h1>
      </header>
      <section>
        <h2>Render information from firestore</h2>
        <ul>{/* map through items here */}</ul>
      </section>
    </main>
  );
}
// each user has an edit and delete button

// form to add new user --> conditionally use the same field for updating content
