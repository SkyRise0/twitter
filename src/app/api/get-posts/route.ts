import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET (request: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const user = await prisma.user.findUnique({
        where: {email: session.user?.email ?? ""},
        include: { following: true }
    });

    if (!user) {
        return NextResponse.json({message: "User could not be found" }, {status: 402})
    }
    
    const posts = await prisma.post.findMany({
        include: {
            user: true, 
            likes: true,
            replies: {
                orderBy: {
                    created_at: "desc"
                }
            }},
        orderBy: {
            created_at: "desc"
        }
    });

    let filteredPosts = [];
    for (const post of posts){
        let filteredPostsWithLikeStatus = {
            ...post,
            requesterHasLiked: false
        }
        for (const like of post.likes){
            if (like.userId === user.id){
                filteredPostsWithLikeStatus = {
                    ...post,
                    requesterHasLiked: true
                }
            } else {
                filteredPostsWithLikeStatus = {
                    ...post,
                    requesterHasLiked: false
                }
            }
        }


        for (const follow of user.following) {
            if (follow.followedId === post.userId) {
                filteredPosts.push(filteredPostsWithLikeStatus);
            }
        }

        if (post.userId === user.id){
            filteredPosts.push(filteredPostsWithLikeStatus);
        }
    }

    return NextResponse.json(filteredPosts, {status: 200});
}