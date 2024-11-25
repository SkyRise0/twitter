import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST (request: NextRequest, { params }: { params: { userId: string}}) {

    const userId = await params.userId;

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const user = await prisma.user.findUnique({
        where: {id: userId}
    });

    const requester = await prisma.user.findUnique({
        where: {email: session.user?.email ?? ""}
    });

    if (!user) {
        return NextResponse.json({message: "User could not be found" }, {status: 404});
    };

    if (!requester) {
        return NextResponse.json({message: "User could not be found" }, {status: 404});
    };

    if (user.id === requester.id) {
        return NextResponse.json({ message: "You cannot follow yourself"}, {status: 402});
    };

    const follow = await prisma.follow.findFirst({
        where: {followedId: user.id, followingId: requester?.id}
    });

    if (follow) {
        await prisma.follow.delete({
            where: { id: follow.id}
        });

        return NextResponse.json({ message: "Unfollowed user"}, {status: 200});
    } else {

        const follow = await prisma.follow.create({
            data: {
                followed: {
                    connect: {
                        id: user.id
                    }
                },
                following: {
                    connect: {
                        id: requester.id
                    }
                }
            }
        });

        return NextResponse.json({ message: "Followed user"}, { status: 200});
    }

}