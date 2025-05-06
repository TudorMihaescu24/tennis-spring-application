"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tournamentSchema = z.object({
  name: z.string().min(1, { message: "Tournament name is required" }),
  date: z.string().min(1, { message: "Tournament date is required" }),
  category: z.enum(["PROFESSIONAL", "AMATEUR"]),
  location: z.string().min(1, { message: "Tournament location is required" }),
  gender: z.enum(["male", "female"]),
});

export default function FormTournament({
  setIsDialogOpen,
}: {
  setIsDialogOpen?: (value: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(tournamentSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("http://localhost:5000/api/tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create tournament");
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  return (
    <CardContent className="max-h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tournament Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Tournament Date</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Tournament Location</Label>
          <Input id="location" {...register("location")} />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tournament Gender</Label>
          <Select
            onValueChange={(value) =>
              setValue("gender", value as "male" | "female")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tournament Type</Label>
          <Select
            onValueChange={(value) =>
              setValue("category", value as "PROFESSIONAL" | "AMATEUR")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Tournament Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PROFESSIONAL">PROFESSIONAL</SelectItem>
              <SelectItem value="AMATEUR">AMATEUR</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          onClick={() => setIsDialogOpen && setIsDialogOpen(false)}
        >
          Create Tournament
        </Button>
      </form>
    </CardContent>
  );
}
