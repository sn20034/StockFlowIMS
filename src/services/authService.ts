import api from "./api";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: AuthUser;
}

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<RegisterResponse> => {
    const res = await api.post("/auth/register", data);
    return res.data.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data.data;
  },

  googleLogin: async (credential: string): Promise<AuthResponse> => {
    const res = await api.post("/auth/google", { credential });
    return res.data.data;
  },

  verifyEmail: async (token: string): Promise<void> => {
    await api.get(`/auth/verify-email?token=${token}`);
  },

  resendVerification: async (email: string): Promise<void> => {
    await api.post("/auth/resend-verification", { email });
  },

  getMe: async (): Promise<AuthUser> => {
    const res = await api.get("/auth/me");
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },
};
