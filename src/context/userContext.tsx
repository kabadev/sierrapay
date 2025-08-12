"use client";

import { getUserDetail } from "@/app/actions/userActions";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  clerkId: string;
  email: string;
  username?: string;
  photo: string;
  firstName?: string;
  lastName?: string;
  balance: number;
}

interface UserContextType {
  currentUserDetail: User | null;
  isLoading: boolean;
  fetchUserDetails: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUserDetail, setCurrentUserDetail] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const currentUserDetail: any = await getUserDetail();
      setCurrentUserDetail(currentUserDetail);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUserDetail,
        isLoading,
        fetchUserDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
