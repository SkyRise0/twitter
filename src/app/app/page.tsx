"use client";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Post from "../components/Post";

export default function App() {

  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const [postData, setPostData] = useState("");

  const createPost = useMutation({
    mutationFn: () => api.createPost({ content: postData}),
    onSuccess: () => queryClient.invalidateQueries()
  });

  const posts = useQuery({
    queryKey: ["posts"],
    queryFn: api.getPosts
  })

  return (
    <>
        <div className="flex gap-2 p-4 items-center border-b-2 border-gray-300">
            <img src={session?.user?.image ?? ""} className="w-16 rounded-full"/>
            <div className="w-full">
                <input placeholder="What's happening?" onChange={(e) => setPostData(e.target.value)} className="w-full p-2 outline-none"/>
            </div>
            <button className="bg-sky-400 px-6 py-2 rounded-full text-white hover:bg-sky-500" onClick={() => createPost.mutate()}>Tweet</button>
        </div>
        <main className="flex flex-col">
            {posts.isSuccess ? (
                <>
                    {posts.data.map((post: any, index: any) => (
                        <Post post={post} key={index} />
                    ))}
                </>
            ) : null}
        </main>
    </>
  );
}
