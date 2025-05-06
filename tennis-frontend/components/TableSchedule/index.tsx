"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/context/RoleContext";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

export default function TableSchedule({ api }: { api: string }) {
  const { role } = useRole();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    console.log(api);
    fetchMatches();
  }, [role]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${api}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  return (
    <div className="p-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-left font-bold">
            Match Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-zinc-400 font-bold">
                  Tournament
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Player 1
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Player 2
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Referee
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {matches.map((match: any) => (
                <TableRow key={match.id}>
                  <TableCell>{match.tournamentName}</TableCell>
                  <TableCell>
                    {match.player1?.firstName} {match.player1?.lastName}
                  </TableCell>
                  <TableCell>
                    {match.player2?.firstName} {match.player2?.lastName}
                  </TableCell>
                  <TableCell>
                    {match.referee?.firstName} {match.referee?.lastName}
                  </TableCell>
                  <TableCell>{match.matchDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
