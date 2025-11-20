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
  const [inputValue, setInputValue] = useState("");
  // state for edit id
  const [editId, setEditId] = useState(null);
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
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    try {
      // if the edit id exists
      if (editId) {
        await updateItem(editId, "users", inputValue);
        setEditId(null);
      } else {
        // otherwise be add
        await addItem("users", inputValue);
      }
      getItems("users");
      setInputValue("");
    } catch (error) {
      console.error(`Error adding ${inputValue} ${e}`, error);
    }
  };
  const handleEdit = (item) => {
    setInputValue(item.name);
    setEditId(item.id);
  };
  const handleCancel = () => {
    setEditId(null);
    setInputValue("");
  };
  const handleDelete = async (id) => {
    try {
      await deleteItem(id, "users");
      getItems("users");
    } catch (error) {
      console.error(`Error Deleting ${id}`);
    }
  };
  useEffect(() => {
    // get data from backend
    fetchItems();
  }, []);
  return (
    // render all entries in the users collection
    <main>
      <header className="my-4">
        <h1>Firestore Example</h1>
      </header>
      <section className="my-4">
        <h2>Render information from firestore</h2>
        {items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="my-2">
                <h3 className="text-lg">{item.name}</h3>
                <p>{item.id}</p>
                <button
                  onClick={() => handleEdit(item)}
                  className="px-4 py-2 bg-yellow-600 mx-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-2 bg-red-500 mx-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>loading</p>
        )}
      </section>
      <section className="my-4">
        <h2 className="2xl font-bold">{editId ? "Edit Name" : "Add Name"}</h2>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            className="bg-slate-800"
          />
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 ${
              editId ? "bg-yellow-600" : "bg-green-500"
            } mx-2`}
          >
            {editId ? "Submit Edit" : "Submit Add"}
          </button>
          {editId && (
            <button
              onClick={handleCancel}
              className="bg-gray-500 px-4 py-2 my-2"
            >
              Cancel
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
// each user has an edit and delete button

// form to add new user --> conditionally use the same field for updating content
