"use client";
import { useEffect, useState } from "react";
import { useRole } from "@/context/RoleContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

export default function Notification() {
  const [fileType, setFileType] = useState("csv");
  const [gender, setGender] = useState("ALL");
  const [category, setCategory] = useState("ALL");

  const [pending, setPending] = useState([]);

  const fetchPendingPlayers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tournament/pending-players`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log("Pending players data:", data);
      setPending(data);
    } catch (error) {
      console.error("Error fetching pending players:", error);
    }
  };

  useEffect(() => {
    fetchPendingPlayers();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tournament/accept/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept player");
      }

      // Refresh the list of pending players
      fetchPendingPlayers();
    } catch (error) {
      console.error("Error accepting player:", error);
    }
  };

  const handleDeny = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tournament/deny/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to deny player");
      }

      fetchPendingPlayers();
    } catch (error) {
      console.error("Error denying player:", error);
    }
  };

  return (
    <div className="p-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-left font-bold flex flex-row justify-between">
            Pending Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-zinc-400 font-bold">ID</TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Tournament
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Player
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Options
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.isArray(pending) && pending.length > 0 ? (
                pending.map((p: any) => (
                  <TableRow key={p}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.tournamentName}</TableCell>
                    <TableCell>{p.playerName}</TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center">
                        <Button
                          className="bg-green-500 mr-4"
                          onClick={() => handleAccept(p.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeny(p.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>No matches available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
