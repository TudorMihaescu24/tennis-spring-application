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
import { Plus, TableIcon, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import FormTournament from "../FormTournament";
import TableMatch from "../TableMatch";

export default function TableTournaments() {
  const { role } = useRole();
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (role === "ADMIN") {
      fetchTournaments();
    }
  }, [role]);

  const handleViewMatches = (id: number) => {
    setSelectedTournamentId(id);
    setOpen(true);
  };

  const fetchTournaments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tournament/", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch tournaments");

      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setError("Could not fetch tournaments");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/tournament/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete tournament");

      fetchTournaments();
    } catch (error) {
      console.error("Error deleting tournament:", error);
      setError("Could not delete tournament");
    }
  };

  if (role !== "ADMIN") {
    return (
      <div className="text-center mt-10 text-red-500 font-bold text-lg">
        You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="p-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-left font-bold flex flex-row justify-between">
            Tournaments List
            <Button onClick={() => setOpen(true)}>
              <Plus />
              New
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-zinc-400 font-bold">ID</TableHead>
                <TableHead className="text-zinc-400 font-bold">Name</TableHead>
                <TableHead className="text-zinc-400 font-bold">Date</TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Category
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Gender
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Options
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tournaments.map((tournament: any) => (
                <TableRow key={tournament.id}>
                  <TableCell>{tournament.id}</TableCell>
                  <TableCell>{tournament.name}</TableCell>
                  <TableCell>{tournament.date}</TableCell>
                  <TableCell>{tournament.category}</TableCell>
                  <TableCell>{tournament.gender}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-4">
                      <TableIcon
                        className="mr-2 cursor-pointer"
                        onClick={() => handleViewMatches(tournament.id)}
                      >
                        View Matches
                      </TableIcon>
                      <Trash
                        className="crursor-pointe text-red-500"
                        onClick={() => handleDelete(tournament.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
