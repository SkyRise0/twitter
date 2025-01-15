import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST (request: NextRequest) {
    
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const user = await prisma.user.findUnique({
        where: {email: session.user?.email ?? ""}
    });

    if (!user) {
        return NextResponse.json({message: "User could not be found" }, {status: 402})
    }

    await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: {
            read: true
        }
    })

    return NextResponse.json({ message: "Read all notifications."}, {status: 200});
}