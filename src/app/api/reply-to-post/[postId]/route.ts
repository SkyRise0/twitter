import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST (request: NextRequest, { params }: { params: { postId: string}}) {

    const postId = params.postId;
    const postData = await request.json();

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const post = await prisma.post.findUnique({
        where: {id: postId}
    });

    const requester = await prisma.user.findUnique({
        where: {email: session.user?.email ?? ""}
    });

    if (!post) {
        return NextResponse.json({message: "Post could not be found" }, {status: 404});
    };

    if (!requester) {
        return NextResponse.json({message: "User could not be found" }, {status: 404});
    };

    if (!postData.content) {
        return NextResponse.json({ message: "You've left empty fields"}, { status: 402})
    }

    await prisma.postreply.create({
        data: {
            post: {
                connect: {
                    id: post.id
                }
            },
            user: {
                connect: {
                    id: requester.id
                }
            },
            content: postData.content
        }
    })

    return NextResponse.json({ message: "Reply posted!"}, { status: 200});

}