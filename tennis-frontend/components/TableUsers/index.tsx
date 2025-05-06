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
import { Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FormUser from "../FormUser";
import FormPlayer from "../FormPlayer";
import FormReferee from "../FormReferee";

export default function TableUsers() {
  const { role } = useRole();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (role === "ADMIN") {
      fetchUsers();
    }
  }, [role]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Could not fetch users");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Could not delete user");
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setOpen(true);
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
          <CardTitle className="text-3xl text-left font-bold">
            Users List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-zinc-400 font-bold">ID</TableHead>
                <TableHead className="text-zinc-400 font-bold">Email</TableHead>
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
                <TableHead className="text-zinc-400 font-bold">Role</TableHead>
                <TableHead className="text-zinc-400 font-bold">
                  Options
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.dateOfBirth}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-4">
                      <Trash
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDelete(user.id)}
                      />
                      <Edit
                        className="cursor-pointer text-blue-500"
                        onClick={() => handleEdit(user)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedUser && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit {selectedUser.role} User</DialogTitle>
              <DialogDescription>
                Here you can edit details of the selected user.
              </DialogDescription>
            </DialogHeader>

            {selectedUser.role === "PLAYER" && (
              <FormPlayer
                user={selectedUser}
                setIsDialogOpen={setOpen}
                fetchUsers={fetchUsers}
              />
            )}

            {selectedUser.role === "REFEREE" && (
              <FormReferee
                user={selectedUser}
                setIsDialogOpen={setOpen}
                fetchUsers={fetchUsers}
              />
            )}

            {selectedUser.role === "ADMIN" && (
              <FormUser
                user={selectedUser}
                setIsDialogOpen={setOpen}
                fetchUsers={fetchUsers}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
