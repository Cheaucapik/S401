import React from 'react';
import { Image, View } from 'react-native';
import DefaultPFP from '../assets/DefaultPFP';
import { ENDPOINTS } from '../config/api';
import {Colors} from '../constants/Colors'

interface AvatarProps {
    uri?: string | null;
    size: number;
}

const Avatar = ({ uri, size }: AvatarProps) => {
    if (!uri) {
        return <DefaultPFP size={size}/>;
    }

    return (
        <Image 
            source={{ uri: `${ENDPOINTS.API_URL}${uri}` }} 
            style={{ width: size, height: size, borderRadius: size / 2, backgroundColor : Colors.grey }} 
        />
    );
};

export default Avatar;