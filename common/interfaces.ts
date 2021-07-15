
export interface LoginResponse {
    success: boolean;
    username: string;
    token: string;
    error: string;
    errorCode: number;
}

export interface LoginRequest {
    username: string;
    password: string;
}