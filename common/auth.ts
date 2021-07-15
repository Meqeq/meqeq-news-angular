
export enum AuthCodes {
    Success, MissingParam, DiffrentPasswords, EmailTaken, UsernameTaken, 
    ServerError, UserNotFound, WrongPassword, BadParam, UnknownError
};

export interface RegisterRequest {
    username: string;
    password: string;
    password2: string;
    email: string;
    nick: string;
}

export interface RegisterResponse {
    ok: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    ok: boolean;
    token: string;
    username: string;
}

export interface ErrorResponse {
    ok: boolean;
    errorCode: AuthCodes;
}

export const isErrorResponse = (err: unknown): err is ErrorResponse => {
    return (err as ErrorResponse).ok !== undefined && (err as ErrorResponse).errorCode !== undefined;
}