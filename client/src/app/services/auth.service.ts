import { HttpClient, HttpErrorResponse, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, pipe, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthCodes, ErrorResponse, isErrorResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../../../common/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly api = "http://localhost:8000/api";

    private _token = new BehaviorSubject("");
    private _username = new BehaviorSubject("");
    private _logged = new BehaviorSubject(false);

    get token() {
        return this._token.asObservable();
    }

    get username() {
        return this._username.asObservable();
    }

    get logged() {
        return this._logged.asObservable();
    }
  
    constructor(private http : HttpClient) { 
        const data = localStorage.getItem("loginData");

        if(data) {
            this.setLogin(JSON.parse(data), false);
        }
    }

    register(data: RegisterRequest) {
        return this.http.post<RegisterResponse>(this.api + "/auth/register", data)
            .pipe(catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse) {
        const error = err.error;

        if(isErrorResponse(error)) {
            return throwError(error);
        } else {
            const errorResponse: ErrorResponse = {
                ok: false, errorCode: AuthCodes.UnknownError
            }

            return throwError(errorResponse);
        }
    }

    private setLogin = (res: LoginResponse, setLocal: boolean = true) => {
        this._logged.next(res.ok);
        this._token.next(res.token);
        this._username.next(res.username);

        if(setLocal)
            localStorage.setItem("loginData", JSON.stringify(res));
    }

    login(data: LoginRequest) {
        return this.http.post<LoginResponse>(this.api + "/auth/login", data).pipe(
            catchError(this.handleError),
            tap(this.setLogin)
        )
    }

    fetchApiGet<T>(url: string) {
        return this.http.get<T>(this.api + url, {
            headers: {
                "Authorization": "Bearer " + this._token.getValue()
            }
        });
    }

    fetchApiPost<T>(url: string, body?: any) {
        return this.http.post<T>(this.api + url, body, {
            headers: {
                "Authorization": "Bearer " + this._token.getValue()
            }
        });
    }

    logout() {
        this._logged.next(false);
        this._token.next("");
        this._username.next("res.username");

        localStorage.removeItem("loginData");

        
    }
}