import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCopyToClipboard } from "usehooks-ts";
import Link from "next/link";
import PageTitle from "./PageTitle";

export default function Post({ post }) {

    const queryClient = useQueryClient();

    const [value, copy] = useCopyToClipboard();

    const likePost = useMutation({
        mutationFn: () => api.likePost(post.id as string),
        onSuccess: () => queryClient.invalidateQueries()
    })

    return (
        <div className="flex flex-col mt-2 gap-2 border-b-2 border-gray-300">
            <PageTitle pageTitle="Post"/>
            <header className="flex gap-4 items-center p-4">
                <img src={post.user?.image} className="w-16 rounded-full"/>
                <div>
                    <Link href={"/app/profile/" + post.userId} className="text-lg font-semibold">{post.user?.name}</Link>
                    <p className="text-sm text-gray-400">{post.user?.email}</p>
                </div>
            </header>
            <main className="p-4">
                <p>{post.content}</p>
            </main>
            <footer className="flex justify-between text-center">
                <Link href={"/app/post/" + post.id} className="border-t-2 border-gray-300 w-full py-2">
                    {post.replies ? 
                        <p>({post.replies?.length}) Replies </p> : <p>(0) Replies </p>}
                </Link>
                <button onClick={() => likePost.mutate()} 
                    className={post.requesterHasLiked ? "text-sky-500 border-t-2 border-x-2 border-gray-300 w-full py-2" : "border-t-2 border-x-2 border-gray-300 w-full py-2"}>
                    {post.likes.length} Like
                </button>
                <button onClick={() => copy(process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/app/post/" + post.id)} className="border-t-2 border-gray-300 w-full py-2">
                    {value ? "Copied to Clipboard" : "Share"}
                </button>
            </footer>
        </div>
    );
}