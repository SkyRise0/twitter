import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST (request: NextRequest) {
    
    const session = await getServerSession(authOptions);
    const postData = await request.json();

    if (!session) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const user = await prisma.user.findUnique({
        where: {email: session.user?.email ?? ""}
    });

    if (!user) {
        return NextResponse.json({message: "User could not be found" }, {status: 402})
    }

    if (!postData.content) {
        return NextResponse.json({ message: "You've left empty fields"}, {status: 402})
    }

    const createPost = await prisma.post.create({
        data : {
            content: postData.content,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })  

    return NextResponse.json({ message: "Tweet has successefully been created"}, {status: 200});
}