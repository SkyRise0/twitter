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
        where: {email: session.user?.email ?? ""}
    });

    if (!user) {
        return NextResponse.json({message: "User could not be found" }, {status: 402})
    }

    const notifications = await prisma.notification.findMany({
        where: {
            userId: user.id,
            read: false
        }
    })

    return NextResponse.json(notifications, {status: 200});
}