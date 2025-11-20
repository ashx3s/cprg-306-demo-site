function simpleFormSection() {
  return (
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
        <button onClick={handleCancel} className="bg-gray-500 px-4 py-2 my-2">
          Cancel
        </button>
      )}
    </div>
  );
}
