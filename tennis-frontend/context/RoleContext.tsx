"use client";

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
