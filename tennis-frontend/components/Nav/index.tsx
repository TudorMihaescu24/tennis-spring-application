"use client";

import {
  LogInIcon,
  LogOutIcon,
  NotebookPenIcon,
  Plus,
  Settings,
  UserIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";

export default function Nav() {
  const { role } = useRole();

  const handleLogOut = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Logout failed");
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between border-b-1 p-5 shadow-md">
      <Link
        href="/"
        className="flex flex-row justify-center items-center w-max-content"
      >
        <span className="h-full text-3xl">🎾</span>
        <h1 className="text-2xl font-bold w-max h-max ml-4">
          tennis-application
        </h1>
      </Link>

      {(() => {
        switch (role) {
          case "GUEST":
            return (
              <div className="flex items-center">
                <Link href="/login" className="w-max h-max cursor-pointer">
                  <Button className="mr-2">
                    <LogInIcon className="mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="w-max h-max cursor-pointer">
                  <Button variant="outline" className="ml-2">
                    <NotebookPenIcon className="mr-2" />
                    Register
                  </Button>
                </Link>
              </div>
            );

          default:
            return (
              <div className="flex items-center">
                {role === "ADMIN" && (
                  <Link href="/admin" className="w-max h-max cursor-pointer">
                    <Button variant="destructive" className="mr-2">
                      <Settings className="mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                {role === "PLAYER" && (
                  <Link href="/player" className="w-max h-max cursor-pointer">
                    <Button
                      variant="destructive"
                      className="mr-4 bg-green-500 hover:bg-green-600"
                    >
                      <Plus className="mr-2" />
                      Join
                    </Button>
                  </Link>
                )}

                {role === "REFEREE" && (
                  <Link href="/referee" className="w-max h-max cursor-pointer">
                    <Button
                      variant="destructive"
                      className="mr-4 bg-green-500 hover:bg-green-600"
                    >
                      <Plus className="mr-2" />
                      Join
                    </Button>
                  </Link>
                )}
                <Link href="/profile" className="w-max h-max cursor-pointer">
                  <Button className="mr-2">
                    <UserIcon className="mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={() => handleLogOut()}
                >
                  <LogOutIcon className="mr-2" />
                  Logout
                </Button>
              </div>
            );
        }
      })()}
    </div>
  );
}
