import { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const api = useMemo(() => axios.create({
        baseURL: import.meta.env.VITE_API_URL || '/api',
    }), []);

    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({ token });
        } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
        }
        setLoading(false);

        // Add interceptor to handle expiration
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [token, api]);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const signup = async (email, password) => {
        const res = await api.post('/auth/signup', { email, password });
        return res.data; // Don't set token yet
    };

    const verifyEmail = async (email, otp) => {
        const res = await api.post('/auth/verify-email', { email, otp });
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, verifyEmail, logout, loading, api }}>
            {children}
        </AuthContext.Provider>
    );
};
