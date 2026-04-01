import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,

      // Profiles state
      profiles: [],
      pagination: {
        page: 1,
        limit: 6,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      searchTerm: "",

      // UI state
      isLoading: false,
      error: null,

      // Auth actions
      setAuth: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken, error: null }),

      setAccessToken: (accessToken) => set({ accessToken }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          profiles: [],
          searchTerm: "",
          pagination: {
            page: 1,
            limit: 6,
            total: 0,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }),

      // Profile actions
      setProfiles: (profiles, pagination) => set({ profiles, pagination }),

      addProfile: (profile) =>
        set((state) => ({
          profiles: [profile, ...state.profiles],
          pagination: {
            ...state.pagination,
            total: state.pagination.total + 1,
          },
        })),

      updateProfile: (id, updated) =>
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? updated : p)),
        })),

      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          pagination: {
            ...state.pagination,
            total: Math.max(0, state.pagination.total - 1),
          },
        })),

      // Pagination & search
      setPage: (page) =>
        set((state) => ({ pagination: { ...state.pagination, page } })),

      setSearch: (searchTerm) =>
        set((state) => ({
          searchTerm,
          pagination: { ...state.pagination, page: 1 },
        })),

      // UI helpers
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      // Getters (computed via selectors at component level)
      getIsAuthenticated: () => Boolean(get().accessToken),
    }),
    {
      name: "task-manager-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useStore;
