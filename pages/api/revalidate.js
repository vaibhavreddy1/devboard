export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const secret = req.headers["x-revalidate-secret"];

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    await res.revalidate("/todos");

    return res.status(200).json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error revalidating /todos",
    });
  }
}