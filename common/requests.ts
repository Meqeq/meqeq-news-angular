export interface LoginRequest {
    login: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    password2: string;
    email: string;
    nick: string;
}