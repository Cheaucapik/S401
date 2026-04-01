import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null,
        role: string | null,
        isLoading: boolean
    }>({
        token: null,
        role: null,
        isLoading: true
    });

    useEffect(() => {
        const loadStorage = async () => {
            const token = await AsyncStorage.getItem('userToken');
            const userData = await AsyncStorage.getItem('userData');
            if (token && userData) {
                const user = JSON.parse(userData);
                setAuthState({ token, role: user.role, isLoading: false });
            } else {
                setAuthState({ token: null, role: null, isLoading: false });
            }
        };
        loadStorage();
    }, []);

    const login = async (token: string, user: any) => {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        setAuthState({ token, role: user.role, isLoading: false });
    };

    const logout = async () => {
    try {
        await AsyncStorage.multiRemove(['userToken', 'userData']);
        setAuthState({
            token: null,
            role: null,
            isLoading: false
        });
    } catch (e) {
        console.error("Erreur logout:", e);
    }
};

    return (
        <AuthContext.Provider value={{ ...authState, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);