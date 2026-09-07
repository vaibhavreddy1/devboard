import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav>
      <Link href="/">Devboard</Link>{" "}
      |{" "}
      <Link href="/search">Search</Link>{" "}
      |{" "}
      <Link href="/stack/react">React</Link>{" "}
      |{" "}
      <Link href="/stack/nextjs">Next.js</Link>{" "}
      |{" "}
      <Link href="/stack/nodejs">Node.js</Link>{" "}
      |{" "}
      <Link href="/todos">Todos</Link>{" "}
      |{" "}
      <Link href="/profile">Profile</Link>{" "}
      |{" "}
      {session ? (
        <button onClick={() => signOut()}>
          Sign out
        </button>
      ) : (
        <button onClick={() => signIn("github")}>
          Sign in
        </button>
      )}
    </nav>
  );
}