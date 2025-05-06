"use client";

import Nav from "@/components/Nav";
import TableMatch from "@/components/TableMatch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table } from "lucide-react";
import { useState, useEffect } from "react";

export default function JoinedReferee() {
  const [tournaments, setTournaments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/tournament/referee/joined",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch tournaments");

      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const handleViewMatches = (id: number) => {
    setSelectedTournamentId(id);
    setOpen(true);
  };

  return (
    <div className="p-10">
      <h1 className="font-bold text-2xl">Joined</h1>
      <div className="mt-4 grid gap-10 grid-cols-3">
        {tournaments.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <div className="flex flex-row justify-between items-center w-full h-10">
                <h1 className="font-semibold text-lg">{t.name}</h1>
                <Button onClick={() => handleViewMatches(t.id)}>
                  <Table className="mr-2" />
                  Matches
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col">
              <h1>
                <strong>Category: </strong>
                {t.category}
              </h1>
              <h1>
                <strong>Gender: </strong>
                {t.gender}
              </h1>
              <h1>
                <strong>Date: </strong>
                {new Date(t.date).toLocaleDateString()}
              </h1>
              <h1>
                <strong>Referee: </strong>
                {t.refereeName || "None"}
              </h1>
              <h1>
                <strong>Players: </strong>
                {t.playerNames?.join(", ") || "None"}
              </h1>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80%]">
          <DialogHeader>
            <DialogTitle>Matches</DialogTitle>
            <DialogDescription>Matches for this tournament.</DialogDescription>
          </DialogHeader>
          {selectedTournamentId && <TableMatch id={selectedTournamentId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
