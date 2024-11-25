"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function App() {

  const { data: session } = useSession();

  

  
  return (
    <div> Home </div>
  );
}
