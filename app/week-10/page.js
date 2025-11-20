"use client";
import { useState, useEffect } from "react";
import { useFirestoreCollection } from "@/app/hooks/useFirestoreCollection";
import {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} from "@/app/lib/controller";

// create form schema for starter data
const formDataSchema = {
  name: "",
  species: "",
  age: null,
  interests: [],
};
export default function Page() {
  const [formData, setFormData] = useState(formDataSchema);
  // TODO: Set interests state
  const [editId, setEditId] = useState(null);
  const { data: items, isDataLoading, dataError } = useFirestoreCollection();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    // for loop, check that all required fields have content in them or return
    if (!formData.name.trim()) return;
    try {
      if (editId) {
        console.log(`updating item: ${editId} with ${formData}`);
        await updateItem(editId, "users", formData);
        setEditId(null);
      } else {
        console.log(`Adding new item: ${formData}`);
        await addItem("users", formData);
      }
      setFormData(formDataSchema);
    } catch (error) {
      console.error(`Error adding ${formData}`, error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      species: item.species || "",
      age: item.age || null,
      interests: [],
    });
    setEditId(item.id);
  };
  const handleCancel = () => {
    setEditId(null);
    setFormData(formDataSchema);
    setInterests([]);
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id, "users");
      // TODO Implement graceful delete update
      alert("Deleted!");
    } catch (error) {
      console.error(`Error Deleting ${id}`);
    }
  };

  const fetchItems = async () => {
    try {
      const data = await getItems("users");
      if (!data) {
        throw new Error("No data from users");
      }
    } catch (error) {
      console.error(`Error fetching items from users`, error);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);

  if (isDataLoading) {
    return (
      <div className="my-12">
        <p className="text-lg py-8">Data Loading</p>
      </div>
    );
  }
  if (dataError) {
    return (
      <p className="text-2xl font-bold text-red my-8">ERROR: {dataError}</p>
    );
  }
  return (
    <main>
      <header>
        <h1 className="text-4xl">Next + Firestore CRUD</h1>
      </header>
      {/* // section to show all the content in the collection  */}
      <section className="my-4">
        <h2 className="text-2xl">List of Data Items</h2>
        <ul>
          {items.length > 0 ? (
            items.map((character) => (
              <li key={character.id} className="my-4 flex gap-6">
                <h3 className="text-lg font-medium">{character.name}</h3>
                <ul>
                  <li>{character.age ? character.age : "No age specified"}</li>
                  <li>
                    {character.species
                      ? character.species
                      : "No Species Specified"}
                  </li>
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(character)}
                    className="px-4 py-2 m-2 rounded-md bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(character.id)}
                    className="px-4 py-2 m-2 rounded-md bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No Data</p>
          )}
        </ul>
      </section>
      <section className="my-8">
        <h2 className="text-lg">{editId ? "Edit User" : "Add User"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border-1 mx-2  p-2"
            />
          </div>
          <div>
            <label htmlFor="species">Species: </label>
            <input
              type="text"
              id="species"
              value={formData.species}
              onChange={(e) =>
                setFormData({ ...formData, species: e.target.value })
              }
              className="border-1 mx-2  p-2"
            />
          </div>
          <div>
            <label htmlFor="age">Age: </label>
            <input
              type="number"
              id="age"
              value={formData.age || ""}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className="border-1 mx-2  p-2"
            />
          </div>
          <div>{/* TODO: interests */}</div>
          <input
            type="submit"
            className={`px-4 py-2 m-2 rounded-md ${
              editId ? "bg-blue-500" : "bg-blue-700"
            }`}
            value={editId ? "edit user" : "add user"}
          />
          {editId && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 m-2 rounded-md bg-gray-700"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </section>
      {/* <section>
        <label htmlFor="input-name">{editId ? "Edit User" : "Add User"}</label>
        <input
          type="text"
          id="input-name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="border-1 mx-2  p-2"
        />
        <button
          onClick={() => handleSubmit()}
          className={`px-4 py-2 m-2 rounded-md ${
            editId ? "bg-blue-500" : "bg-blue-700"
          }`}
        >
          {editId ? "Edit" : "Add"}
        </button>
        {editId && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 m-2 rounded-md bg-gray-700"
          >
            Cancel Edit
          </button>
        )}
      </section>
 */}
    </main>
  );
}
