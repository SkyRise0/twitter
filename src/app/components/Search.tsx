"use client"
import { api } from "@/lib/axios";
import { useQuery, useMutation} from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function Navigation() {

    const [searchData, setSearchData] = useState("");

    const searchUsers = useMutation({
        mutationFn: () => api.searchUsers({content: searchData})
    })

    return(
        <div className="p-4">
            <div className="flex gap-2">
                <input value={searchData} onChange={(e) => setSearchData(e.target.value)} placeholder="Search for users" className="p-2 bg-gray-200 rounded-full outline-none"/>
                <button onClick={() => searchUsers.mutate()} className="bg-sky-400 p-2 rounded-full w-2/3 text-white hover:bg-sky-500 text-center">Search</button>
            </div>
            <div className="flex flex-col">
                {!searchUsers.isSuccess ? (
                    <p>No results yet.</p>
                ) : (
                    <div className="flex flex-col">
                        <h2 className="font-semibold py-2">Results: </h2>
                        {searchUsers.data.map((user, index) => (
                            <Link href={"/app/profile/" + user.id} className="flex items-center gap-2" key={index}>
                                <img src={user.image} className="w-8 h-8 rounded-full"/>
                                <p>{user.name}</p>
                            </Link>
                        ))}
                    </div>
                )
                }
            </div>
        </div>
    );
}