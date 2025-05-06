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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export default function Matches() {
  const { role } = useRole();
  const [open, setOpen] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);

  const [fileType, setFileType] = useState("csv");
  const [gender, setGender] = useState("ALL");
  const [category, setCategory] = useState("ALL");

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/match/`, {
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
  }, []);

  const handleDownload = async () => {
    try {
      const params = new URLSearchParams({
        type: fileType,
        gender,
        category,
      });

      const response = await fetch(
        `http://localhost:5000/api/match/download?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `matches.${fileType}`;
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download error:", error);
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
            Matches List
            <Button onClick={() => setOpen(true)}>
              <Download />
              Download
            </Button>
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
                <TableHead className="text-zinc-400 font-bold">Date</TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Player 1
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Score 1
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Player 2
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Score 2
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Referee
                </TableHead>
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
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">Matches</DialogTitle>
            <DialogDescription>Matches for this tournament.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col w-full gap-y-5">
            <div>
              <Label className="mb-2">File Type</Label>
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="txt">TXT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="AMATEUR">Amateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="mt-4" onClick={handleDownload}>
            <Download />
            Download
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
