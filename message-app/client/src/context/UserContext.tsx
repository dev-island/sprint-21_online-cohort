import { useState, FC, createContext, ReactNode, useEffect } from "react";
import { IUser } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import * as api from "../api/users";


export type UserContextType = {
  currentUser: IUser | undefined;
  setCurrentUser: (user: IUser) => void;
  isLoadingUser: boolean;
  users: IUser[];
  addUser: (user: IUser) => void;
  updateCurrentUser: (user: IUser) => void;
  token?: string;
  setToken: (token: string) => void;
};

const initState: UserContextType = {
  currentUser: undefined,
  setCurrentUser: () => {},
  isLoadingUser: true,
  users: [],
  addUser: () => {},
  updateCurrentUser: () => {},
  token: undefined,
  setToken: () => {},
};

export const UserContext = createContext<UserContextType>(initState);

const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    isAuthenticated,
    isLoading,
    user: auth0User,
    getAccessTokenSilently,
  } = useAuth0();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const [users, setUsers] = useState<IUser[]>([]);
  const [token, setToken] = useState<string | undefined>(undefined);

  const addUser = (user: IUser) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const updateCurrentUser = (user: IUser) => {
    setCurrentUser(user);
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.sub === user.sub ? user : u))
    );
  };

  const fetchCurrentUser = async () => {
    if (isLoading || !isAuthenticated || !auth0User?.sub || !token) {
      return;
    }
    try {
      const { data } = await api.getUser(auth0User.sub, token);

      if (!data) {
        throw new Error("Failed to get current user");
      }
      setCurrentUser(data);
      // Keep a record of all the users we have fetched so we don't have to make multiple requests
      addUser(data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
    setIsLoadingUser(false);
  };

  const getToken = async () => {
    if (!isAuthenticated) {
      return;
    }
    const token = await getAccessTokenSilently();
    console.log("TOKEN", token);
    if (!token) {
      throw new Error("Failed to get token");
    }
    setToken(token);
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated || !auth0User) {
      setIsLoadingUser(false);
      return;
    }
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, auth0User]);

  useEffect(() => {
    if (!token) {
      return;
    }
    // Use the sub from the auth0User to fetch the user from our DB
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoadingUser,
        users,
        addUser,
        updateCurrentUser,
        token,
        setToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
