import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { DoorClosed, DoorOpen, Table, User } from "lucide-react";
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
        <Link href="/player" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <DoorOpen />
            Available
          </Button>
        </Link>
        <Link href="/player/joined" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <DoorClosed />
            Joined
          </Button>
        </Link>
        <Link href="/player/schedule" className="w-max h-max cursor-pointer">
          <Button variant="link">
            <Table />
            Schedule
          </Button>
        </Link>
      </div>
      {children}
    </>
  );
}
