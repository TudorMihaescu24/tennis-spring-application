"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

export default function TableMatch({ id }: { id: number }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchMatches = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/match/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log("Matches data:", data);
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [id]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-zinc-400 font-bold">ID</TableHead>
          <TableHead className="text-zinc-400 font-bold">Tournament</TableHead>
          <TableHead className="text-zinc-400 font-bold">Date</TableHead>
          <TableHead className="text-zinc-400 font-bold">Player 1</TableHead>
          <TableHead className="text-zinc-400 font-bold">Score 1</TableHead>
          <TableHead className="text-zinc-400 font-bold">Player 2</TableHead>
          <TableHead className="text-zinc-400 font-bold">Score 2</TableHead>
          <TableHead className="text-zinc-400 font-bold">Referee</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.isArray(matches) && matches.length > 0 ? (
          matches.map((match: any) => (
            <TableRow key={match.id}>
              <TableCell>{match.id}</TableCell>
              <TableCell>{match.tournamentName}</TableCell>
              <TableCell>
                {new Date(match.matchDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {match.player1?.firstName} {match.player1?.lastName}
              </TableCell>
              <TableCell>{match.scorePlayer1}</TableCell>
              <TableCell>
                {match.player2?.firstName} {match.player2?.lastName}
              </TableCell>
              <TableCell>{match.scorePlayer2}</TableCell>
              <TableCell>
                {match.referee?.firstName} {match.referee?.lastName}
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
  );
}
