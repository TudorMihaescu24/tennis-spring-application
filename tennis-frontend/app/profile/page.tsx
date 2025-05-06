"use client";

import FormPlayer from "@/components/FormPlayer";
import FormReferee from "@/components/FormReferee";
import FormUser from "@/components/FormUser";
import Nav from "@/components/Nav";
import { Card, CardHeader } from "@/components/ui/card";
import { useRole } from "@/context/RoleContext";
import { useState, useEffect } from "react";

export default function Profile() {
  const { role } = useRole();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const roleToFetch = role === "ADMIN" ? "user" : role?.toLowerCase();
        const response = await fetch(
          `http://localhost:5000/api/${roleToFetch}/one`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const userData = await response.json();
        setData(userData);
        console.log(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (role) {
      fetchUserData();
    }
  }, [role]);

  return (
    <section className="w-screen max-h-screen">
      <Nav />
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Card className="w-lg mt-30">
          <CardHeader>
            {(() => {
              switch (role) {
                case "PLAYER":
                  return <h1 className="text-4xl">Edit Details</h1>;
                case "REFEREE":
                  return <h1>Edit Details</h1>;
                case "ADMIN":
                  return <h1 className="text-2xl font-bold">Edit Details</h1>;
              }
            })()}
          </CardHeader>

          {(() => {
            switch (role) {
              case "PLAYER":
                return data ? (
                  <FormPlayer user={data} />
                ) : (
                  <div>Loading...</div>
                );
              case "REFEREE":
                return data ? (
                  <FormReferee user={data} />
                ) : (
                  <div>Loading...</div>
                );
              case "ADMIN":
                return data ? <FormUser user={data} /> : <div>Loading...</div>;
              default:
                return <div>No valid role found</div>;
            }
          })()}
        </Card>
      </div>
    </section>
  );
}
