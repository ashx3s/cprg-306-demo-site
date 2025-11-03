"use client";
import { useUser } from "../contexts/UserContext";

export default function SimpleContextSection() {
  const { localUser, toggleLocalUserLogin } = useUser();
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold">User: {localUser.name} </h2>
      <p>
        Logged In Status{" "}
        <span className="font-bold">
          {localUser.loggedIn ? "Logged In" : "NOT Logged in"}
        </span>
      </p>
      <p>Demonstrate Context with a locally made user</p>
      <button
        onClick={toggleLocalUserLogin}
        className="px-4 py-2 bg-blue-500 cursor-pointer"
      >
        Toggle User Login
      </button>
    </section>
  );
}
