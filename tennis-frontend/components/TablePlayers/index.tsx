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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

export default function TablePlayers() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchPlayers();
  }, [genderFilter, categoryFilter]);

  const fetchPlayers = async () => {
    try {
      const params = new URLSearchParams();
      if (genderFilter) params.append("gender", genderFilter);
      if (categoryFilter) params.append("category", categoryFilter);

      const queryString = params.toString();
      const url = `http://localhost:5000/api/player/${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Could not fetch users");
    }
  };

  return (
    <div className="p-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between text-3xl text-left font-bold">
            Players
            <div className="flex items-center gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="gender-filter">Gender Filter</Label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-[180px]" id="gender-filter">
                    <SelectValue placeholder="All genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" defaultChecked>
                      All genders
                    </SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category-filter">Category Filter</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]" id="category-filter">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" defaultChecked>
                      All categories
                    </SelectItem>
                    <SelectItem value="Amateur">Amateur</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-zinc-400 font-bold">ID</TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  First Name
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Last Name
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Gender
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Date Of Birth
                </TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Category
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.isArray(players) && players.length > 0 ? (
                players.map((p: any, index: number) => (
                  <TableRow key={p.id || `player-${index}`}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.firstName}</TableCell>
                    <TableCell>{p.lastName}</TableCell>
                    <TableCell>{p.gender}</TableCell>
                    <TableCell>{p.dateOfBirth}</TableCell>
                    <TableCell>{p.category}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No players found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
