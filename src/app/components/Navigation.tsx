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
            <div className="flex flex-col gap-4 pl-6 justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/934px-Logo_of_Twitter.svg.png" className="w-12"/>
                <Link href="/app" className="text-xl font-semibold hover:underline grid grid-cols-2 items-center w-1/2">
                    <img src="https://cdn.pixabay.com/photo/2017/01/13/01/22/icon-1976100_1280.png" className="w-10 scale-150" />
                    Home
                </Link>
                <Link href={user.isSuccess ? "/app/profile/" + user.data.id : "/app"} className="text-xl font-semibold hover:underline grid grid-cols-2 items-center w-1/2">
                    <img src={user.data?.image} className="w-10 rounded-full"/>
                    Profile
                </Link>
                <Link href={"#"} className="text-xl font-semibold hover:underline grid grid-cols-2 items-center w-1/2">
                    <img src="https://icones.pro/wp-content/uploads/2022/02/icone-de-cloche-grise.png" className="w-10"/>
                    Notifications
                </Link>
                <button onClick={() => signOut()} className="text-xl font-semibold hover:underline text-left text-nowrap grid grid-cols-2 items-center justify-center w-1/2">
                    <img src="https://cdn0.iconfinder.com/data/icons/command-buttons/512/Left-512.png" className="w-10"/>
                    Sign Out
                </button>
            </div>
            <Link href="/app" className="bg-sky-400 p-2 rounded-full w-2/3 text-white hover:bg-sky-500 text-center">Tweet</Link>
        </nav>
    );
}