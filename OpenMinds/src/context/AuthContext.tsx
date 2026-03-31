import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({children} : any) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userType, setUserType] = useState('ADMINISTRATEUR');

    useEffect(() => {
    const loadToken = async () => {
        const token = await AsyncStorage.getItem('userToken');
        
        setUserToken(token);
        setIsLoading(false);
    };
    loadToken();
    }, []);

    return (
    <AuthContext.Provider value={{ userToken, setUserToken, isLoading, setUserType, userType }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);