import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST (request: NextRequest, { params }: { params: { replyId: string}}) {

    const replyId = params.replyId;
    const postData = await request.json();

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const reply = await prisma.reply.findUnique({
        where: {id: replyId}
    });

    const requester = await prisma.user.findUnique({
        where: {email: session.user?.email ?? ""}
    });

    if (!reply) {
        return NextResponse.json({message: "Reply could not be found" }, {status: 404});
    };

    if (!requester) {
        return NextResponse.json({message: "User could not be found" }, {status: 404});
    };

    if (!postData.content) {
        return NextResponse.json({ message: "You've left empty fields"}, { status: 402})
    }

    await prisma.reply.create({
        data: {
            post: {
                connect: {
                    id: reply.id
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