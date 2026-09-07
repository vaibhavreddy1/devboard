const stacks = {
  react: {
    name: "React",
    description:
      "A JavaScript library for building user interfaces.",
    category: "Frontend",
  },

  nextjs: {
    name: "Next.js",
    description:
      "A React framework for building full-stack web applications.",
    category: "Full Stack",
  },

  nodejs: {
    name: "Node.js",
    description:
      "A JavaScript runtime built on Chrome's V8 JavaScript engine.",
    category: "Backend",
  },
};

export default function StackPage({ stack }) {
  return (
    <main>
      <h1>{stack.name}</h1>

      <p>{stack.description}</p>

      <p>
        <strong>Category:</strong> {stack.category}
      </p>

      <p>
        This page was statically generated at build time.
      </p>
    </main>
  );
}

export async function getStaticPaths() {
  const paths = Object.keys(stacks).map((slug) => ({
    params: {
      slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const stack = stacks[params.slug];

  return {
    props: {
      stack,
    },
  };
}