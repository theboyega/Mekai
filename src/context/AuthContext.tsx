import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { isValidAccessCode, isRevokedAccessCode } from '../data/accessCodes';

interface AuthContextType {
  isAuthenticated: boolean;
  activeCode: string | null;
  technicianName: string;
  login: (code: string, name?: string) => { success: boolean; error?: string };
  logout: () => void;
  updateTechnicianName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_CODE = 'mekai_workshop_code';
const STORAGE_KEY_NAME = 'mekai_technician_name';
const DEFAULT_NAME = 'Adeyemi Tomiwa';

function getStoredValidCode(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CODE);
    if (!raw) return null;
    const normalized = raw.trim().toUpperCase();
    if (isValidAccessCode(normalized)) {
      return normalized;
    }
    localStorage.removeItem(STORAGE_KEY_CODE);
    return null;
  } catch {
    return null;
  }
}

function getStoredName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_NAME) || DEFAULT_NAME;
  } catch {
    return DEFAULT_NAME;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeCode, setActiveCode] = useState<string | null>(() => getStoredValidCode());
  const [technicianName, setTechnicianName] = useState<string>(() => getStoredName());

  const isAuthenticated = useMemo(() => {
    return !!activeCode && isValidAccessCode(activeCode);
  }, [activeCode]);

  useEffect(() => {
    try {
      if (activeCode) {
        localStorage.setItem(STORAGE_KEY_CODE, activeCode);
      } else {
        localStorage.removeItem(STORAGE_KEY_CODE);
      }
    } catch {
      // ignore
    }
  }, [activeCode]);

  const login = (code: string, name?: string) => {
    const normalized = code.trim().toUpperCase();
    if (isRevokedAccessCode(normalized)) {
      return { success: false, error: 'This workshop access credential has expired or been revoked.' };
    }
    if (!isValidAccessCode(normalized)) {
      return { success: false, error: 'Invalid workshop access key. Format must be CST-XXXX-XXXX.' };
    }

    setActiveCode(normalized);
    if (name && name.trim()) {
      const cleanName = name.trim();
      setTechnicianName(cleanName);
      try {
        localStorage.setItem(STORAGE_KEY_NAME, cleanName);
      } catch {
        // ignore
      }
    }
    return { success: true };
  };

  const logout = () => {
    setActiveCode(null);
    try {
      localStorage.removeItem(STORAGE_KEY_CODE);
    } catch {
      // ignore
    }
  };

  const updateTechnicianName = (name: string) => {
    const clean = name.trim() || DEFAULT_NAME;
    setTechnicianName(clean);
    try {
      localStorage.setItem(STORAGE_KEY_NAME, clean);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      activeCode,
      technicianName,
      login,
      logout,
      updateTechnicianName,
    }),
    [isAuthenticated, activeCode, technicianName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
