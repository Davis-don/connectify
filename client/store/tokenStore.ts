import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TokenData {
  refresh: string;
  access: string;
  role?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

interface TokenState {
  tokenData: TokenData | null;
  isAuthenticated: boolean;

  setTokens: (tokenData: TokenData) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getRole: () => string | null;
  getEmail: () => string | null;
  getFirstName: () => string | null;
  getLastName: () => string | null;
  refreshAccessToken: (newAccessToken: string) => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      tokenData: null,
      isAuthenticated: false,

      setTokens: (tokenData: TokenData) => {
        set({
          tokenData,
          isAuthenticated: true,
        });
      },

      clearTokens: () => {
        set({
          tokenData: null,
          isAuthenticated: false,
        });
      },

      getAccessToken: () => get().tokenData?.access || null,
      getRefreshToken: () => get().tokenData?.refresh || null,
      getRole: () => get().tokenData?.role || null,
      getEmail: () => get().tokenData?.email || null,
      getFirstName: () => get().tokenData?.first_name || null,
      getLastName: () => get().tokenData?.last_name || null,

      refreshAccessToken: (newAccessToken: string) => {
        const currentTokenData = get().tokenData;
        if (currentTokenData) {
          set({
            tokenData: {
              ...currentTokenData,
              access: newAccessToken,
            },
          });
        }
      },
    }),
    {
      name: 'helpr-token-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
