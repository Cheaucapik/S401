const DEV_IP = "192.168.1.32";
const PORT = "3000";

export const API_BASE_URL = `http://${DEV_IP}:${PORT}/api`;

export const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/login`,
    SIGNUP: `${API_BASE_URL}/signup`,
    SUIVI: `${API_BASE_URL}/suivi`,
    FORMATIONS : `${API_BASE_URL}/formations`,
    THEMATIQUES : `${API_BASE_URL}/thematiques`,
    SESSIONS : `${API_BASE_URL}/session`,
    PARTICIPANTS : `${API_BASE_URL}/participants`,
    UPDATE_USER: `${API_BASE_URL}/user`, 
    UPDATE_PASSWORD: `${API_BASE_URL}/password`,
    UPLOAD_PFP : `${API_BASE_URL}/upload_pfp`,
    API_URL : `http://${DEV_IP}:${PORT}`
};