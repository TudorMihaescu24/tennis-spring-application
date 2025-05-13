import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Award, Bell, LogInIcon, Trophy, User } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <div className="flex flex-row items-center justify-center p-5 shadow-md">
        <Link href="/admin" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <User />
            Users
          </Button>
        </Link>
        <Link href="/admin/tournaments" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <Trophy />
            Tournaments
          </Button>
        </Link>
        <Link href="/admin/matches" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <Award />
            Matches
          </Button>
        </Link>{" "}
        <Link href="/admin/notification" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <Bell />
            Notifications
          </Button>
        </Link>
      </div>
      {children}
    </>
  );
}
