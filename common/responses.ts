export interface LoginResponse {
    ok: boolean;
    token: string;
    username: string;
}

export interface SimpleResponse {
    ok: boolean;
    message: string;
    errorCode: number;
}


export interface ErrorResponse {
    errorCode: number;
    message: string;
}

export interface SuccessResponse {
    ok: boolean;
    message: string;
}

export interface TextResponse {
    text: string;
}