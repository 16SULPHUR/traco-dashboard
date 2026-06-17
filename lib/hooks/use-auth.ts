"use client";

import { useEffect, useState, useCallback } from "react";

export interface User {
  id: string;
  email: string;
  created_at?: string;
  user_metadata?: {
    display_name?: string;
  };
}

function parseJwt(token: string): { sub: string; email: string } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("traco_token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        const displayName = localStorage.getItem("traco_display_name") || undefined;
        const createdAt = localStorage.getItem("traco_created_at") || undefined;
        setUser({
          id: decoded.sub,
          email: decoded.email,
          created_at: createdAt,
          user_metadata: { display_name: displayName },
        });
      } else {
        localStorage.removeItem("traco_token");
        localStorage.removeItem("traco_display_name");
        localStorage.removeItem("traco_created_at");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((token: string, userData: { id: string; email: string; displayName?: string; createdAt?: string }) => {
    localStorage.setItem("traco_token", token);
    if (userData.displayName) {
      localStorage.setItem("traco_display_name", userData.displayName);
    } else {
      localStorage.removeItem("traco_display_name");
    }
    if (userData.createdAt) {
      localStorage.setItem("traco_created_at", userData.createdAt);
    } else {
      localStorage.removeItem("traco_created_at");
    }
    setUser({
      id: userData.id,
      email: userData.email,
      created_at: userData.createdAt,
      user_metadata: { display_name: userData.displayName },
    });
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem("traco_token");
    localStorage.removeItem("traco_display_name");
    localStorage.removeItem("traco_created_at");
    setUser(null);
  }, []);

  /** Get the current access token for API calls. */
  const getToken = useCallback(async (): Promise<string> => {
    const token = localStorage.getItem("traco_token");
    if (!token) throw new Error("Not authenticated");
    return token;
  }, []);

  return { user, loading, signOut, getToken, login };
}
