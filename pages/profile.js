import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Image from "next/image";

export default function Profile({ user }) {
  return (
    <main>
      <h1>Profile</h1>

      <Image
  src={user.image}
  alt={user.name}
  width={100}
  height={100}
/>

      <h2>{user.name}</h2>

      <p>
        <strong>Username:</strong> {user.login}
      </p>

      <p>
        <strong>Email:</strong> {user.email || "Not available"}
      </p>

      <p>
        <strong>GitHub Profile:</strong>{" "}
        <a
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
        >
          View GitHub Profile
        </a>
      </p>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const response = await fetch(
    `https://api.github.com/user`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
    return {
      props: {
        user: {
          name: session.user.name,
          login: session.user.name,
          email: session.user.email,
          image: session.user.image,
          html_url: "https://github.com",
        },
      },
    };
  }

  const user = await response.json();

  return {
    props: {
      user,
    },
  };
}