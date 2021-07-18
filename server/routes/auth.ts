import { Router } from '../meqeq.ts';
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { getAll, save, getByUsername, getByEmail } from '../database/user.ts';
import { create } from '../jwt.ts';
import { AuthCodes, RegisterResponse, LoginResponse, ErrorResponse } from '../../common/auth.ts';
import { secretKey } from '../secret.ts';

class AuthError extends Error {
    readonly type = "auth";

    private _code: AuthCodes;
    private _httpCode: number;

    public get code() {
        return this._code;
    }

    public get httpCode() {
        return this._httpCode;
    }

    constructor(code: AuthCodes, httpCode: number, message: string) {
        super(message);
        this._code = code;
        this._httpCode = httpCode;
    }
}

const isAuthError = (err: unknown) : err is AuthError => {
    return (err as AuthError).type !== undefined && (err as AuthError).type === "auth";
}

const router = new Router();

router.post("/login", async (req, res, next, params) => {
    try {
        const username = params.get("username");
        const password = params.get("password");

        if(!username || !password) 
            throw new AuthError(AuthCodes.MissingParam, 400, "Missing param");

        if(username.length < 5 || username.length > 30)
            throw new AuthError(AuthCodes.BadParam, 400, "Incorrect size of username");

        if(password.length < 5 || password.length > 30)
            throw new AuthError(AuthCodes.BadParam, 400, "Incorrect size of password");

        const user = await getByUsername(username);

        if(!user) 
            throw new AuthError(AuthCodes.UserNotFound, 400, "Incorrect username");

        const result = await bcrypt.compare(password, user.password);

        if(!result)
            throw new AuthError(AuthCodes.WrongPassword, 400, "Incorrect username or password");

        const data = {
            iss: user._id.$oid,
        };

        const token = create(data, "HS512", secretKey, 60*60*24);

        const response : LoginResponse = {
            ok: true, token, username
        }

        res.json(response);
    } catch(e) {
        const response : ErrorResponse = {
            ok: false,
            errorCode: isAuthError(e) ? e.code : AuthCodes.ServerError
        }

        if(isAuthError(e))
            res.jsonError(e.httpCode, response);
        else
            res.jsonError(500, response);
    }
});

router.post("/register", async (req, res, next, params) => {
    try {
        const username = params.get("username");
        const password = params.get("password");
        const password2 = params.get("password2");
        const email = params.get("email");
        const nick = params.get("nick");

        if(!username || !password || !username || !password2 || !nick || !email)  
            throw new AuthError(AuthCodes.MissingParam, 400, "Missing param");

        if(password != password2)
            throw new AuthError(AuthCodes.DiffrentPasswords, 400, "Diffrent passwords");

        const [userName, userEmail ] = await Promise.all([getByUsername(username), getByEmail(email)]);

        if(userEmail)
            throw new AuthError(AuthCodes.EmailTaken, 400, "Email is already taken");
        
        if(userName)
            throw new AuthError(AuthCodes.UsernameTaken, 400, "Username is already taken");

        const hash = await bcrypt.hash(password);
    
        await save({
            username, email, nick, password: hash
        });

        const response : RegisterResponse = {
            ok: true
        }

        res.json(response);

    } catch(e) {
        const response : ErrorResponse = {
            ok: false,
            errorCode: isAuthError(e) ? e.code : AuthCodes.ServerError
        }

        if(isAuthError(e))
            res.jsonError(e.httpCode, response);
        else
            res.jsonError(500, response);
    }
});


export default router;