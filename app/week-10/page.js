"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFirstoreCollection } from "../hooks/useFirestoreCollection";
import {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} from "@/app/lib/controller";
const formDataSchema = {
  name: "",
  species: "",
  age: "",
  interests: [],
};

export default function Page() {
  const [formData, setFormData] = useState(formDataSchema);
  // state for edit id
  const [editId, setEditId] = useState(null);
  const { authUser, loading } = useAuth();
  const { data: items, isDataLoading, error } = useFirstoreCollection("users");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    // client side limit to only allow if input has a name
    if (!formData.name.trim()) return;
    try {
      // allows us to extend other information like the interests field and user ID
      const userData = { ...formData };
      // if the edit id exists
      if (editId) {
        await updateItem(editId, "users", formData);
        setEditId(null);
      } else {
        await addItem("users", userData);
        console.log(userData);
      }
      setFormData(formDataSchema);
    } catch (error) {
      console.error(`Error adding ${formData} ${e}`, error);
    }
  };
  // TODO Update edit values
  const handleEdit = (item) => {
    setEditId(item.id);
  };
  const handleCancel = () => {
    setEditId(null);
  };
  const handleDelete = async (id) => {
    try {
      await deleteItem(id, "users");
      getItems("users");
    } catch (error) {
      console.error(`Error Deleting ${id}`);
    }
  };

  // TODO: Specify loading as auth loading and make conditional render to show specific loading messages
  if (isDataLoading || loading) {
    return (
      <div>
        <p>Page Loading</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <h1>Rendering Error</h1>
        <p>{error}</p>
      </div>
    );
  }
  return (
    // render all entries in the users collection
    <main>
      <header className="my-4">
        <h1>Firestore Example</h1>
      </header>
      <section className="my-4">
        <h2>Render information from firestore</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id} className="my-2">
              <div>
                <h3 className="text-lg">{item.name}</h3>
                {item.age ? <p>{item.age}</p> : <p>No age entered</p>}
                {item.species ? (
                  <p>{item.species}</p>
                ) : (
                  <p>No species entered</p>
                )}
              </div>
              {authUser ? (
                <div>
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
                </div>
              ) : (
                ""
              )}
            </li>
          ))}
        </ul>
      </section>
      {/* Only show if authenticated user */}
      {authUser ? (
        <section className="my-4">
          <h2 className="2xl font-bold">{editId ? "Edit Name" : "Add Name"}</h2>
          <form onSubmit={handleSubmit}>
            {/* input name string */}
            <div>
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-slate-800 text-white my-2"
              />
            </div>
            {/* input species string */}
            <div>
              <label htmlFor="name">Species: </label>
              <input
                type="text"
                id="species"
                value={formData.species}
                onChange={(e) =>
                  setFormData({ ...formData, species: e.target.value })
                }
                className="bg-slate-800 text-white my-2"
              />
            </div>
            {/* input age string */}
            <div>
              <label htmlFor="name">Age: </label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: Number(e.target.value) })
                }
                className="bg-slate-800 text-white my-2"
              />
            </div>
            {/* submit button */}
            <button type="submit" className="bg-blue-500 px-4 py-2">
              Submit
            </button>
          </form>
        </section>
      ) : (
        <p>Must be authenticated to edit</p>
      )}
    </main>
  );
}
