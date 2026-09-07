export default async function handler(req, res) {
  const baseUrl = process.env.API_BASE_URL;

  try {
    if (req.method === "POST") {
      const response = await fetch(`${baseUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: req.body.title,
          completed: false,
        }),
      });

      if (!response.ok) {
        return res.status(response.status).json({
          error: "Failed to create todo",
        });
      }

      const todo = await response.json();

      await res.revalidate("/todos");

      return res.status(201).json(todo);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          error: "Todo id is required",
        });
      }

      const response = await fetch(
        `${baseUrl}/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        return res.status(response.status).json({
          error: "Failed to delete todo",
        });
      }

      await res.revalidate("/todos");

      return res.status(200).json({
        success: true,
        id,
      });
    }

    res.setHeader("Allow", ["POST", "DELETE"]);

    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}