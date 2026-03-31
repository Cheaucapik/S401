const DEV_IP = "10.0.2.2";
const PORT = "3000";

export const API_BASE_URL = `http://${DEV_IP}:${PORT}/api`;

export const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/login`,
    SIGNUP: `${API_BASE_URL}/register`,
    SUIVI: `${API_BASE_URL}/suivi`,
    FORMATIONS : `${API_BASE_URL}/formations`,
    THEMATIQUES : `${API_BASE_URL}/thematiques`,
    SESSIONS : `${API_BASE_URL}/session`,
    PARTICIPANTS : `${API_BASE_URL}/participants`
};