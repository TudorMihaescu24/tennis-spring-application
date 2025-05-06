import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { DoorClosed, DoorOpen, NotebookTabs, Table, User } from "lucide-react";
import Link from "next/link";

export default function PlayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <div className="flex flex-row items-center justify-center p-5 shadow-md">
        <Link href="/referee" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <DoorOpen />
            Available
          </Button>
        </Link>
        <Link href="/referee/joined" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <DoorClosed />
            Joined
          </Button>
        </Link>
        <Link href="/referee/schedule" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <Table />
            Schedule
          </Button>
        </Link>
        <Link href="/referee/score" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <NotebookTabs />
            Score
          </Button>
        </Link>
      </div>
      {children}
    </>
  );
}
