import { Api } from '@/lib/api';

import React, { createContext, useState, ReactNode, useContext, useEffect, useMemo } from 'react';
import { Profile } from '@/types/profile';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ApiChatwoot } from '@/lib/api_chatwoot';
import { ProfileChatwoot } from '@/types/profileChatwoot';

interface ChatwootProviderProps {
  children: ReactNode;
}

export const ChatwootContext = createContext<{
  token: string,
  tokenActive: boolean,
  userProfileChatwoot: ProfileChatwoot | null;
  handleChangeToken: (value: string) => void;
  handleChangeActiveToken: (value: boolean) => void;
}>({
  token: "",
  userProfileChatwoot: null,
  tokenActive: false,
  handleChangeToken: () => {},
  handleChangeActiveToken: () => {}
});

export const ChatwootProvider: React.FC<ChatwootProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>("");
  const [tokenActive, setTokenActive] = useState<boolean>(false);


  const [userProfileChatwoot, setUserProfileChatwoot] = useState<ProfileChatwoot | null>(null);

  useEffect(() => {
    const getDataProfile = async() => {
      try {
        const supabase = createClientComponentClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single()

        if (profile) {
          const api = new Api(profile.api_key)
          const response = await api.getToken()
          console.log(response)

          if(response.success && response.data){
            setTokenActive(true)
            setToken(response.data.userToken)
            const apiChatwoot = new ApiChatwoot(response.data.userToken)

            const res = await apiChatwoot.getProfileChatwoot()
            setUserProfileChatwoot(res)
          } else {
            setTokenActive(false)
            throw new Error('Token not found')
          }
        } else {
          throw new Error('User not found')
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error)
        setTokenActive(false)
      }
    }

    getDataProfile()
  }, [])

  const handleChangeToken = (value: string) => {
    setToken(value)
  }

  const handleChangeActiveToken = (value: boolean) => {
    setTokenActive(value)
  }

  return (
    <ChatwootContext.Provider value={{ userProfileChatwoot, token, handleChangeToken, tokenActive, handleChangeActiveToken }}>
      {children}
    </ChatwootContext.Provider>
  );
};

export const useChatwoot = () => {
  return useContext(ChatwootContext);
};
