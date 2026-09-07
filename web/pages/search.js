import { useEffect, useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search GitHub users in the browser
  useEffect(() => {
    if (!debouncedQuery) {
      return;
    }

    const searchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://api.github.com/search/users?q=${encodeURIComponent(
            debouncedQuery
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to search GitHub users");
        }

        const data = await response.json();

        setUsers(data.items || []);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch GitHub users.");
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

  const showResults = debouncedQuery !== "";

  return (
    <main>
      <h1>Search GitHub Users</h1>

      <input
        type="text"
        placeholder="Search GitHub users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Searching...</p>}

      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        showResults &&
        users.length === 0 && <p>No GitHub users found.</p>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img
              src={user.avatar_url}
              alt={user.login}
              width="40"
              height="40"
            />

            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
            >
              {user.login}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}