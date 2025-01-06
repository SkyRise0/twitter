import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET (request: NextRequest, { params }: { params: { userId: string}}) {

    const userId = params.userId;

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

    const user = await prisma.user.findUnique({
        where: {id: userId }
    })

    if (!user) {
        return NextResponse.json({message: "User could not be found" }, {status: 402})
    }

    const userPosts = await prisma.post.findMany({
        where: { userId: user.id },
        include: { user: true, likes: true},
        orderBy: {
            created_at: "desc"
        }
    });
    
    let response = []
    for (const post of userPosts) {

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
        response.push(filteredPostsWithLikeStatus);
    }

    return NextResponse.json(response, { status: 200 })
}