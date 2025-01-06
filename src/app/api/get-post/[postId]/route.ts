import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET (request: NextRequest, { params }: { params: { postId: string}}) {

    const postId = params.postId;

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const requester = await prisma.user.findUnique({
        where: {email: session.user?.email ?? ""}
    });

    if (!requester) {
        return NextResponse.json({message: "User could not be found" }, {status: 404});
    };

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            user: true, 
            likes: true, 
            replies: {
                include: {user: true},
                orderBy: {
                    created_at: "desc"
                }
            }
        }
    });

    if (!post) {
        return NextResponse.json({ message: "User post not found" }, { status: 404 })
    }

    let filteredPostsWithLikeStatus = {
        ...post,
        requesterHasLiked: false
    }
    for (const like of post.likes){
        if (like.userId === requester.id){
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

    return NextResponse.json(filteredPostsWithLikeStatus, {status: 200});
}