import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: number; 
    email: string; 
    is_admin: boolean; 
    is_approved: boolean; 
    exp: number; 
}

export const isAdmin = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.is_admin;
    } catch (error) {
        console.error('Invalid token:', error);
        return false;
    }
};
