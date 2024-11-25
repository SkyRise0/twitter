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
        where: {id: userId},
        include: {followed: true, following: true}
    });

    if (!user) {
        return NextResponse.json({message: "User could not be found" }, {status: 402})
    }

    const follow = await prisma.follow.findFirst({
        where: {followedId: userId, followingId: requester?.id}
    });

    let userWithFollow;

    if (follow) {
        userWithFollow = {
            ...user,
            isFollowing: true
        }
    } else {
        userWithFollow = {
            ...user,
            isFollowing: false
        }
    }

    return NextResponse.json(userWithFollow, {status: 200});
}