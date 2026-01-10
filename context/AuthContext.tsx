import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use relative path. Vite proxy handles this in dev, express static handles it in prod.
const API_BASE = '';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));

    const login = (newToken: string) => {
        localStorage.setItem('admin_token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { API_BASE };