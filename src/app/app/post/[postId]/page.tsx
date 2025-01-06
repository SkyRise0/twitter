"use client"
import Post from "@/app/components/Post";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";


export default function PostPage () {
    const params = useParams();
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const [replyData, setReplyData] = useState("");
    

    const user = useQuery({
        queryKey: ["user"],
        queryFn: api.getCurrentUser
    })

    const post = useQuery({
        queryKey: ["post", params.postId],
        queryFn: () => api.getPost(params.postId as string)
    })

    const replyToPost = useMutation({
        mutationFn: () => api.replyToPost(params.postId as string, { content: replyData}),
        onSuccess: () => {
            setReplyData("");
            queryClient.invalidateQueries();
        }
    })

    return (
        <div>
            {post.isLoading ? <p>Loading ...</p> : null}
            {post.isSuccess ?
                <>
                <Post post={post.data} />
                <div className="flex gap-2 p-4 items-center border-b-2 border-gray-300">
                    <img src={session?.user?.image ?? ""} className="w-12 rounded-full"/>
                    <div className="w-full">
                        <input placeholder="Write your reply" value={replyData} onChange={(e) => setReplyData(e.target.value)} className="w-full p-2 outline-none"/>
                    </div>
                    <button className="bg-sky-400 px-4 py-2 rounded-full text-white hover:bg-sky-500" onClick={() => replyToPost.mutate()}>Reply</button>
                </div>
                {post.data.replies.map((reply: any, index: number) => (
                    <div key={index} className="border-b-2 border-gray-300">
                        <header className="flex gap-4 items-center p-4">
                            <img src={reply.user.image} className="w-10 rounded-full"/>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <Link href={"/app/profile/" + reply.userId} className="font-semibold">{reply.user.name}</Link>
                                    <p className="text-sm text-gray-400">{reply.user.email}</p>
                                </div>
                                <p>{reply.content}</p>
                            </div>
                        </header>
                        <footer className="grid grid-cols-3 text-center text-sm">
                            <p className="border-t-2 border-gray-300 w-full py-2">Replies</p>
                            <p className="border-t-2 border-x-2 border-gray-300 w-full py-2"> Likes</p>
                            <p className="border-t-2 border-gray-300 w-full py-2">Share</p>
                        </footer>
                    </div>
                ))}
                </>
                : null
            }
        </div>
    );
}