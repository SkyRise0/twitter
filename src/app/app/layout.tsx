import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navigation from "../components/Navigation";
import Search from "../components/Search";

export default async function AppLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect ("/");
    }

    return (
        <div className="grid grid-cols-4 h-screen">
            <div>
                <Navigation />
            </div>
            <div className="col-span-2 border-x-2 border-gray-300">
                {children}
            </div>
            <div>
                <Search />
            </div>
        </div>
    );
  }