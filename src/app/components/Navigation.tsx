"use client"
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {

    const user = useQuery({
        queryKey: ["user"],
        queryFn: api.getCurrentUser
    })

    return(
        <nav className="flex flex-col w-full gap-4 pt-6 ml-6">
            <div className="flex flex-col gap-4 pl-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/934px-Logo_of_Twitter.svg.png" className="w-12"/>
                <Link href={"#"} className="text-xl font-semibold hover:underline">Home</Link>
                <Link href={user.isSuccess ? "/app/profile/" + user.data.id : "/app"} className="text-xl font-semibold hover:underline">Profile</Link>
                <Link href={"#"} className="text-xl font-semibold hover:underline">Notifications</Link>
                <button onClick={() => signOut()} className="text-xl font-semibold hover:underline text-left">Sign Out</button>
            </div>
            <button className="bg-sky-400 p-2 rounded-full w-2/3 text-white hover:bg-sky-500">Tweet</button>
        </nav>
    );
}