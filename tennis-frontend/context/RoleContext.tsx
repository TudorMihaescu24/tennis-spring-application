"use client";

import { set } from "date-fns";
import { createContext, useContext, useEffect, useState } from "react";

interface RoleContextType {
  role: string | null;
  setRole: (role: string | null) => void;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);

  const setUserRole = (role: string) => {
    localStorage.setItem("role", role);
    document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days expiration
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
          setUserRole(data.role);
        } else {
          setRole("GUEST");
        }
      } catch (error) {
        console.error("Failed to fetch role:", error);
        setRole("GUEST");
      }
    };

    fetchRole();
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
