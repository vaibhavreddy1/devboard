import { useState } from "react";

export default function Todos({ initialTodos, generatedAt }) {
  const [todos, setTodos] = useState(initialTodos);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function addTodo(e) {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const newTodo = await response.json();

      setTodos((currentTodos) => [
        ...currentTodos,
        newTodo,
      ]);

      setTitle("");
    } catch (error) {
      console.error(error);
      alert("Failed to add todo");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTodo(id) {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete todo");
    }
  }

  return (
    <main>
      <h1>Devboard Todos</h1>

      <p>
        ISR generated at:
        <br />
        <strong>{generatedAt}</strong>
      </p>

      <hr />

      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Enter a todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </form>

      <hr />

      {todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <span>{todo.title}</span>

              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export async function getStaticProps() {
  const response = await fetch(
    `${process.env.API_BASE_URL}/todos`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  const todos = await response.json();

  return {
    props: {
      initialTodos: todos,
      generatedAt: new Date().toISOString(),
    },

    revalidate: 60,
  };
}