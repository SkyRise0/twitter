"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {

  const { data: session } = useSession();

  if (session) {
    return (
    <div>
      <p>Hello, {session.user?.name}</p>
      <img src={session.user?.image ?? ""} className="w-32"/>
      <button className="bg-red-500 p-2 rounded-xl" onClick={() => signOut()}>Sign Out</button>
    </div>
  );
  }

  return (
    <div>
      <p>You're not logged in</p>
      <button className="bg-emerald-500 p-2 rounded-xl" onClick={() => signIn("github")}>Sign In</button>
    </div>
  );
}
