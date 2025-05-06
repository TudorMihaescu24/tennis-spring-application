"use client";

import { useState } from "react";
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

const baseSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string(),
  yearsOfExperience: z.coerce
    .number()
    .min(0, { message: "Must be a positive number" })
    .optional(),
});

export default function FormReferee({
  user,
  setIsDialogOpen,
  fetchUsers,
}: {
  user: any;
  setIsDialogOpen?: (value: boolean) => void;
  fetchUsers?: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "male",
      yearsOfExperience: user.yearsOfExperience || "",
    },
  });

  const [birthDay, setBirthDay] = useState(
    user.dateOfBirth?.slice(8, 10) || ""
  );
  const [birthMonth, setBirthMonth] = useState(
    user.dateOfBirth?.slice(5, 7) || ""
  );
  const [birthYear, setBirthYear] = useState(
    user.dateOfBirth?.slice(0, 4) || ""
  );

  const updateDateOfBirth = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      setValue("dateOfBirth", dob);
    }
  };

  const handleBirthDayChange = (value: string) => {
    setBirthDay(value);
    updateDateOfBirth(value, birthMonth, birthYear);
  };

  const handleBirthMonthChange = (value: string) => {
    setBirthMonth(value);
    updateDateOfBirth(birthDay, value, birthYear);
  };

  const handleBirthYearChange = (value: string) => {
    setBirthYear(value);
    updateDateOfBirth(birthDay, birthMonth, value);
  };

  const onSubmit = async (data: any) => {
    const dob = `${birthYear}-${birthMonth.padStart(
      2,
      "0"
    )}-${birthDay.padStart(2, "0")}`;

    const requestBody = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: dob,
      yearsOfExperience: data.yearsOfExperience,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/referee/${user.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update player");
      }

      if (fetchUsers) fetchUsers();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const years = Array.from(
    { length: 100 },
    (_, i) => `${new Date().getFullYear() - i}`
  );

  return (
    <CardContent className="max-h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={watch("gender")}
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
          <Label>Date of Birth</Label>
          <div className="flex gap-2">
            <Select value={birthDay} onValueChange={handleBirthDayChange}>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={birthMonth} onValueChange={handleBirthMonthChange}>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={birthYear} onValueChange={handleBirthYearChange}>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.dateOfBirth && (
            <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            min="0"
            {...register("yearsOfExperience")}
            placeholder="Enter number of years"
          />
          {errors.yearsOfExperience && (
            <p className="text-sm text-red-500">
              {errors.yearsOfExperience.message as string}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          onClick={() => setIsDialogOpen && setIsDialogOpen(false)}
        >
          Save
        </Button>
      </form>
    </CardContent>
  );
}
