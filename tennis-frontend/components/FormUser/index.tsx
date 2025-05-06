"use client";

import { useEffect, useState } from "react";
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
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

const parseDateParts = (dateStr: string | undefined) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
    return { day: "", month: "", year: "" };

  const [year, monthRaw, dayRaw] = dateStr.split("-");
  const day = dayRaw.startsWith("0") ? dayRaw[1] : dayRaw;
  const month = monthRaw.startsWith("0") ? monthRaw[1] : monthRaw;

  return { day, month, year };
};

export default function FormUser({
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
    },
  });

  const { day, month, year } = parseDateParts(user.dateOfBirth);
  console.log(day, month, year);

  const [birthDay, setBirthDay] = useState(day);
  const [birthMonth, setBirthMonth] = useState(month);
  const [birthYear, setBirthYear] = useState(year);

  useEffect(() => {
    if (birthDay && birthMonth && birthYear) {
      const dob = `${birthYear}-${birthMonth.padStart(
        2,
        "0"
      )}-${birthDay.padStart(2, "0")}`;
      setValue("dateOfBirth", dob);
    }
  }, [birthDay, birthMonth, birthYear, setValue]);

  const onSubmit = async (data: any) => {
    const requestBody = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/${user.id}`,
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
      if (setIsDialogOpen) setIsDialogOpen(false);
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
            <p className="text-sm text-red-500">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-red-500">
              {errors.firstName.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-red-500">
              {errors.lastName.message as string}
            </p>
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
            <p className="text-sm text-red-500">
              {errors.gender.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <div className="flex gap-2">
            <Select value={birthDay} onValueChange={setBirthDay}>
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
            <Select value={birthMonth} onValueChange={setBirthMonth}>
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
            <Select value={birthYear} onValueChange={setBirthYear}>
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
            <p className="text-sm text-red-500">
              {errors.dateOfBirth.message as string}
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
