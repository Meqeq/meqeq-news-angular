import { HmacSha512 } from 'https://deno.land/std/hash/sha512.ts';
import { HmacSha256 } from 'https://deno.land/std/hash/sha256.ts'
import { encode as enc } from "https://deno.land/std/encoding/base64url.ts";
import { secretKey } from "./secret.ts";

export interface Header {
    typ: string;
    alg: string;
}

export interface TokenData {
    [key: string]: string | number;
}

export interface Token extends TokenData {
    exp: number;
    iat: number;
}

export const base64Url = (input: string) : string => {
    let str = btoa(input);

    return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export const createSignature = (token: string, algorithm: string, secret: string) => {

    switch(algorithm) {
        case "HS256":
            return enc(Uint8Array.from(new HmacSha256(secret).update(token).digest()));
        case "HS512":
            return enc(Uint8Array.from(new HmacSha512(secret).update(token).digest()));

        default:
            throw new Error("Uknown algorithm");
    }
}

export const create = (data: TokenData, algorithm: string, secret: string, exp: number) => {
    const token = {
        ...data,
        exp: Date.now() + exp*1000,
        iat: Date.now()
    }

    return encode(token, algorithm, secret);
}

export const encode = (data: Token, algorithm: string, secret: string) => {

    const header = {
        alg: algorithm,
        typ: "JWT"
    };

    const encodedHeader = base64Url(JSON.stringify(header));
    const encodedData = base64Url(JSON.stringify(data));

    let token = encodedHeader + "." + encodedData;

    const signature = createSignature(token, algorithm, secret);

    return token + "." + signature;
}

export const decode = (token: string, algorithm: string, secret: string) => {
    const [headerPart, dataPart, signature] = token.split(".");

    const header = <Header>JSON.parse(atob(headerPart));

    if(header.alg != algorithm) 
        throw new Error("Wrong algorithm");

    if(signature != createSignature(headerPart + "." + dataPart, algorithm, secret))
        throw new Error("Invalid signature");

    return <Token>JSON.parse(atob(dataPart));
}

export const getAuth = (bearer: string) => {
    const user = decode(bearer.split(" ")[1], "HS512", secretKey);

    console.log(user.exp, Date.now());

    /*if(user.exp > Date.now())
        throw new Error("Token expired");*/

    return user;
}



