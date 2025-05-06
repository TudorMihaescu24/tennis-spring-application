"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRole } from "@/context/RoleContext";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

export default function Referee() {
  const { role } = useRole();
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    fetchTournaments();
  }, [role]);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/tournament/referee",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch tournaments");

      const data = await response.json();
      console.log(data);
      setTournaments(data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const joinTournament = async (tournamentId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tournament/referee/join/${tournamentId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to join tournament");
      fetchTournaments();
    } catch (error) {
      console.error("Error joining tournament:", error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="font-bold text-2xl">Tournaments</h1>

      <div className="mt-4 grid gap-10 grid-cols-3">
        {tournaments.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <div className="flex flex-row justify-between items-center w-full h-10">
                <h1 className="font-semibold text-lg">{t.name}</h1>
                <Button
                  onClick={() => joinTournament(t.id)}
                  className="mr-4 bg-green-500 hover:bg-green-600"
                >
                  <Plus className="mr-2" />
                  Join
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
                {t.playerNames && t.playerNames.length > 0
                  ? t.playerNames.join(", ")
                  : "None"}
              </h1>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
