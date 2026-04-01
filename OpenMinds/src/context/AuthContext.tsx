import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null,
        user: any | null,
        isLoading: boolean
    }>({
        token: null,
        user: null,
        isLoading: true
    });

    useEffect(() => {
        const loadStorage = async () => {
            const token = await AsyncStorage.getItem('userToken');
            const userData = await AsyncStorage.getItem('userData');
            if (token && userData) {
                const user = JSON.parse(userData);
                setAuthState({ token, user, isLoading: false });
            } else {
                setAuthState({ token: null, user: null, isLoading: false });
            }
        };
        loadStorage();
    }, []);

    const login = async (token: string, user: any) => {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        setAuthState({ token, user, isLoading: false });
    };

    const updateUser = async (newUserConfig: any) => {
        const updatedUser = { ...authState.user, ...newUserConfig };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        setAuthState(prev => ({ ...prev, user: updatedUser }));
    };

    const logout = async () => {
        await AsyncStorage.multiRemove(['userToken', 'userData']);
        setAuthState({ token: null, user: null, isLoading: false });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);