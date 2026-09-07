import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home({ buildTime }) {
  const { data: session, status } = useSession();

  return (
    <main>
      <h1>{process.env.NEXT_PUBLIC_APP_NAME}</h1>

      <p>
        A Next.js rendering strategies assignment.
      </p>

      <p>
        Build time: {buildTime}
      </p>

      <hr />

      {status === "loading" && <p>Loading session...</p>}

      {status !== "loading" && !session && (
        <>
          <p>You are not signed in.</p>

          <button onClick={() => signIn("github")}>
            Sign in with GitHub
          </button>
        </>
      )}

      {session && (
        <>
          <p>
            Signed in as: <strong>{session.user.name}</strong>
          </p>

          <p>{session.user.email}</p>

          {session.user.image && (
            <Image
            src={session.user.image}
            alt={session.user.name}
            width={80}
            height={80}
          />
          )}

          <br />

          <button onClick={() => signOut()}>
            Sign out
          </button>
        </>
      )}
    </main>
  );
}

export async function getStaticProps() {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
  };
}