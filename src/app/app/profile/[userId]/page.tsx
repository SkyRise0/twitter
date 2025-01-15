"use client"
import PageTitle from "@/app/components/PageTitle";
import Post from "@/app/components/Post";
import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";


export default function Profile () {
    const params = useParams();
    const { data: session } = useSession();

    const user = useQuery({
        queryKey: ["user", params.userId],
        queryFn: () => api.getUser(params.userId as string)
    })

    const posts = useQuery({
        queryKey: ["posts", params.userId],
        queryFn: () => api.getUserPosts(params.userId as string)
    });

    const followUser = useMutation({
        mutationFn: () => api.followUser(params.userId as string),
        onSuccess: user.refetch
    })

    if (user.isError) {
        return redirect("/app");
    }

    return (
        <>
            <header className="p-4 border-b-2 border-gray-300 flex flex-col">
                <h2 className="text-lg font-semibold pb-4">Profile</h2>
                {user.isLoading ? <p>Loading ...</p> : null}
                <section className="flex justify-between">
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <img src={user.data?.image} className="w-28 rounded-full" />
                        <p className="text-center text-2xl">{user.data?.name}</p>
                        <div className="flex gap-2">
                            <p className="text-gray-400"><span className="font-semibold text-black">{user.data?.following.length}</span> Following</p>
                            <p className="text-gray-400"><span className="font-semibold text-black">{user.data?.followed.length}</span> Followers</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        {user.data?.email === session?.user?.email ? (
                            <button className="p-2 px-6 bg-sky-400 rounded-full text-white hover:bg-sky-500">Edit Profile</button> 
                            ):
                            <>
                                <button className="p-2 px-6 bg-sky-400 rounded-full text-white hover:bg-sky-500" onClick={() => followUser.mutate()}>
                                    {user.data?.isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            </>
                        }
                    </div>
                </section>
            </header>
            {posts.isSuccess ? (
                <>
                    {posts.data.map((post: any, index: any) => (
                        <Post post={post} key={index} />
                    ))}
                </>
            ) : null}
        </>
    );
}