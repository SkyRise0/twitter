"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {

  const { data: session } = useSession();

  if (session) {
    return redirect ("/app");
  }

  return (
    <div className="grid grid-cols-2 p-2 h-screen">
      <div className="flex items-center justify-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/934px-Logo_of_Twitter.svg.png" className="w-2/3"/>
      </div>
      <section className="flex flex-col ml-4 mt-14">
        <h2 className="text-5xl font-bold py-8">Happening Now</h2>
        <p className="text-3xl font-semibold py-4">Sign up today.</p>

        <button className="p-2 rounded-full bg-sky-400 text-white w-5/12 mt-4 text-md hover:bg-sky-500" onClick={() => signIn("github")}>
          <div className="flex justify-center items-center">
            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-8"/>
            <p className="pl-2">Sign in with Github</p>
          </div>
        </button>
        <button className="p-2 rounded-full bg-sky-400 text-white w-5/12 mt-4 text-md hover:bg-sky-500" onClick={() => signIn("google")}>
          <div className="flex justify-center items-center">
            <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" className="w-8"/>
            <p className="pl-2">Sign in with Google</p>
          </div>
        </button>

        <p>Dont have an account. Sign up <a href="https://github.com" target="_blank" className="underline">here</a></p>
      </section>
    </div>
  );
}