import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/apiClient";
import type { User } from "../store/authStore";
import { useAuthStore } from "../store/authStore";

// Types for API responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "PROPERTY_OWNER" | "TENANT" | "SERVICE_PROVIDER";
}

// Auth API functions
const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/register", data);
    return response.data;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>("/auth/refresh");
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};

// React Query hooks for authentication
export const useLogin = () => {
  const { setAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
};

export const useRegister = () => {
  const { setAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: authApi.register,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached data on logout
    },
  });
};

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "currentUser"],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRefreshToken = () => {
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
};
