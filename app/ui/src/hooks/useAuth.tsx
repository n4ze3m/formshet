import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCookie } from "./useCookie";
import { useLocalStorage } from "@mantine/hooks";
import React from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

type Profile = {
  name: string;
  email: string;
  avatar: string;
};

type LocalProfile = {
  name: string;
  email: string;
  userId: string;
};

interface AppContextInterface {
  profile: Profile | null;
  isLogged: boolean;
  login: (token: any, profile: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AppContextInterface>({
  profile: {
    name: "...",
    email: "...",
    avatar:
      "https://avatars.dicebear.com/api/jdenticon/formshet.svg?background=%230000ff",
  },
  isLogged: false,
  login: () => {},
  logout: () => {},
});
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userToken, setUserToken] = useCookie("formshet_token");
  const [localProfile, setLocalProfile] = useLocalStorage<LocalProfile | null>({
    key: "formshet_profile",
    serialize: (value) => JSON.stringify(value),
    deserialize: (value) => JSON.parse(value),
    getInitialValueInEffect: true,
    defaultValue: null,
  });

  const [profile, setProfile] = React.useState<Profile | null>(null);

  React.useEffect(() => {
    if (localProfile) {
      setProfile({
        name: localProfile.name,
        email: localProfile.email,
        avatar: `https://avatars.dicebear.com/api/jdenticon/${localProfile.userId}.svg?background=%230000ff`,
      });
    }
  }, [localProfile]);

  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: string, profile: any) => {
    setUserToken(data);
    setLocalProfile(profile);
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUserToken(null);
    navigate("/auth/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      isLogged: !!userToken,
      profile,
      login,
      logout,
    }),
    [userToken, profile]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
