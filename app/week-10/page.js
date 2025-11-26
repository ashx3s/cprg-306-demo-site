"use client";
import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
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
  const { authUser, loading } = useAuth();
  const [formData, setFormData] = useState(formDataSchema);
  // TODO: Set interests state
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [editId, setEditId] = useState(null);
  const { data: items, isDataLoading, dataError } = useFirestoreCollection();

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    // for loop, check that all required fields have content in them or return
    if (!formData.name.trim()) return;
    const userData = { ...formData, interests };
    try {
      if (editId) {
        console.log(`updating item: ${editId} with ${userData}`);
        await updateItem(editId, "users", userData);
        setEditId(null);
      } else {
        console.log(`Adding new item: ${userData}`);
        await addItem("users", userData);
      }
      setFormData(formDataSchema);
    } catch (error) {
      console.error(`Error adding ${userData}`, error);
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
  /*
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
*/
  if (isDataLoading || loading) {
    return (
      <div className="my-12">
        {/* TODO: if loading and not isloading say auth loading */}
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
                  <li>
                    <ul>
                      {character.interests.map((interest) => (
                        <li key={interest}>
                          {interest}
                          <span className="bg-yellow-600 cursor-pointer p-1 rounded-md mx-4">
                            X
                          </span>
                        </li>
                      ))}
                    </ul>
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
        {authUser ? (
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
            <div>
              <label htmlFor="interests">Interests: </label>
              <div>
                <ul>
                  {interests.map((interest) => (
                    <li key={interest}>{interest}</li>
                  ))}
                </ul>
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addInterest())
                  }
                  placeholder="Add interest"
                  className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className=" px-4 py-2 bg-blue-500 dark:bg-blue-800 mx-2"
                >
                  Add Interest
                </button>
              </div>
            </div>
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
        ) : (
          <p>not authorized to view the form</p>
        )}
      </section>
    </main>
  );
}
