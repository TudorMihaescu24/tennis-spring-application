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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";

export default function TableScore() {
  const { role } = useRole();
  const [matches, setMatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  useEffect(() => {
    fetchMatches();
  }, [role]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/match/referee`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch matches");

      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const handleUpdateScore = (match: any) => {
    setSelectedMatch(match);
    setScore1(match.scorePlayer1 || "");
    setScore2(match.scorePlayer2 || "");
    setOpen(true);
  };

  const handleSaveScore = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/match/score/${selectedMatch.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            scorePlayer1: parseInt(score1),
            scorePlayer2: parseInt(score2),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update match score");

      setOpen(false);
      setSelectedMatch(null);
      fetchMatches();
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <div className="p-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-left font-bold">
            Match Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>Referee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Option</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {matches
                .filter((match) => match.player1 && match.player2 && !match.scorePlayer1 && !match.scorePlayer2)
                .map((match: any) => (
                  <TableRow key={match.id}>
                    <TableCell>{match.tournamentName}</TableCell>
                    <TableCell>
                      {match.player1.firstName} {match.player1.lastName} vs{" "}
                      {match.player2.firstName} {match.player2.lastName}
                    </TableCell>
                    <TableCell>
                      {match.referee.firstName} {match.referee.lastName}
                    </TableCell>
                    <TableCell>{match.matchDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateScore(match)}
                      >
                        Edit Score
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedMatch && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Match Score</DialogTitle>
              <DialogDescription>
                Update the final score for the selected match.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="score1" className="text-right col-span-1">
                  {selectedMatch.player1.firstName}{" "}
                  {selectedMatch.player1.lastName}
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setScore1((prev) =>
                        Math.max(0, Number(prev) - 1).toString()
                      )
                    }
                  >
                    <MinusCircle />
                  </Button>
                  <Input
                    id="score1"
                    type="text"
                    disabled
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                    className="w-16 text-center"
                    min="0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setScore1((prev) =>
                        Math.min(3, Number(prev) + 1).toString()
                      )
                    }
                  >
                    <PlusCircle />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="score2" className="text-right col-span-1">
                  {selectedMatch.player2.firstName}{" "}
                  {selectedMatch.player2.lastName}
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setScore2((prev) =>
                        Math.max(0, Number(prev) - 1).toString()
                      )
                    }
                  >
                    <MinusCircle />
                  </Button>
                  <Input
                    id="score2"
                    type="text"
                    disabled
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                    className="w-16 text-center"
                    min="0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setScore2((prev) =>
                        Math.min(3, Number(prev) + 1).toString()
                      )
                    }
                  >
                    <PlusCircle />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSaveScore}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
