import { listenAndServe, ServerRequest } from "https://deno.land/std/http/server.ts";
import { writeResponse } from "http://deno.land/std/http/_io.ts";

interface Path {
    path: string[],
    params: Map<string, string>
}

type RequestCallback = (req:ServerRequest, res:Response, next:() => void, params:Map<string, string>) => void;

interface Handler {
    path: Path,
    callback: RequestCallback,
    next: () => void,
}

export const parsePath = (path: string) : Path => {
    let url = new URL(path.charAt(path.length-1) === "/" ? path.slice(0, -1) : path, "http://k.pl");
    let parts = url.pathname.match(/(?<=\/)[^\/?#]*/g) || [];

    let params: Map<string, string> = new Map();
    for(const [key, value] of url.searchParams) { params.set(key, value);};

    return {
        path: parts,
        params
    }
}

class Response {
    private req: ServerRequest;
    private headers: Headers = new Headers();

    constructor(req: ServerRequest) {
        this.req = req;
    }

    json(obj: any) : any {
        this.setHeader("Content-Type", "application/json");


        this.req.respond({ 
            headers: this.headers,
            body: JSON.stringify(obj) 
        });
    }

    text(str: string) {
        this.req.respond({
            headers: this.headers,
            body: str
        });
    }

    setHeader(name: string, value: string) : void {
        this.headers.set(name, value);
    }

    error(statusCode: number, errorMessage: string) {
        this.req.respond({
            status: statusCode,
            body: errorMessage,
            headers: this.headers
        });
    }

    jsonError(statusCode: number, message: unknown) {
        this.setHeader("Content-Type", "application/json");

        this.error(statusCode, JSON.stringify(message));
    }
}

export class Router {
    private _getHandlers: Handler[] = [];
    private _postHandlers: Handler[] = [];

    get(path: string, callback: RequestCallback) {
        this._getHandlers.push({
            path: parsePath(path),
            callback,
            next: () => {}
        });
    }

    post(path: string, callback: RequestCallback) {
        this._postHandlers.push({
            path: parsePath(path),
            callback,
            next: () => {}
        });
    }

    public get getHandlers() {
        return this._getHandlers;
    }

    public get postHandlers() {
        return this._postHandlers;
    }
}

class Meqeq {
    private port: number;
    private getHandlers: Handler[] = [];
    private postHandlers: Handler[] = [];

    constructor(port: number) {
        this.port = port;
    }


    get(path: string, callback: RequestCallback) {
        this.getHandlers.push({
            path: parsePath(path),
            callback,
            next: () => {}
        });
    }

    post(path: string, callback: RequestCallback) {
        this.postHandlers.push({
            path: parsePath(path),
            callback,
            next: () => {}
        });
    }

    route(path: string, router: Router) {
        router.getHandlers.forEach(value => {
            const rootPath = parsePath(path);

            rootPath.params.forEach((val, key) => value.path.params.set(key, val));

            this.getHandlers.push({
                path: {
                    path: [...rootPath.path, ...value.path.path],
                    params: value.path.params
                },
                callback: value.callback,
                next: value.next
            })
        });

        router.postHandlers.forEach(value => {
            const rootPath = parsePath(path);

            rootPath.params.forEach((val, key) => value.path.params.set(key, val));

            this.postHandlers.push({
                path: {
                    path: [...rootPath.path, ...value.path.path],
                    params: value.path.params
                },
                callback: value.callback,
                next: value.next
            });
        });
    }

    handleAll(path: string, callback: RequestCallback) {
        this.get(path, callback);
        this.post(path, callback);
    }

    listen(callback: (port:number) => void) {
        listenAndServe({ port: this.port }, async (req) => {
            let {url, method} = req;

            let requestPath = parsePath(url);

            let handlers: Handler[] = [];

            switch(method) {
                case "GET":
                    handlers = this.getHandlers;
                    break;
                case "POST":
                    handlers = this.postHandlers;
                    break;
                case "OPTIONS": {
                    const headers = new Headers();
                    headers.set("Access-Control-Allow-Origin", "http://localhost:4200");
                    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
                    headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

                    await req.respond({
                        headers,
                        status: 200
                    });
                    return;
                }
      
                default:
                    console.log("Unknown method");
            }

            requestPath.path.forEach((value, key) => {
                handlers = handlers.filter(handler => {
                    let path = handler.path.path;

                    if(typeof path[key] == "undefined")
                        return false;
                    
                    if(path[key] == "*") {
                        console.log(handler.path.path, requestPath.path);
                        handler.path.path = requestPath.path;
                        console.log(handler.path.path, requestPath.path);

                        return true;
                    }
                        
                    if(path[key].charAt(0) == ":") {
                        handler.path.params.set(path[key].slice(1), value);
                        return true;
                    }

                    return path[key] == value;
                });

            });

            const bodyParams = new Map<string, string>();

            if(req.contentLength) {
                const body = new Uint8Array(req.contentLength);

                await req.body.read(body);


                const type = req.headers.get("Content-Type");

                if(type && type == "application/json") {
                    const dec = new TextDecoder();
                    const requestBody = JSON.parse(dec.decode(body));

                    Object.keys(requestBody).forEach((key)=> {
                        bodyParams.set(key, requestBody[key]);
                    })
                }                
            }
            
            let response = new Response(req);

            response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

            if(!handlers.length) {
                req.respond({body: "Not found", status: 404});
                return;
            }

            let next = () => console.log("Next handler is not present");

            for(const handler of handlers.reverse()) {
                bodyParams.forEach((value, key) => {
                    handler.path.params.set(key, value);
                });
                
                let n = next;
                next = () => handler.callback(req, response, n, handler.path.params);
            }

            next();
        });

        callback(this.port);
    }
}

export default Meqeq;

/*
            let handlers: Handler[];
            if(method === "GET") handlers = this.getHandlers;
            else if(method === "POST") handlers = this.postHandlers;
            else handlers = [];

            handlers = handlers.filter(value => value.path.length === requestPath.path.length);

            requestPath.path.forEach((value, key) => {
                
                handlers = handlers.filter(handler => {
                    //if(!handler.path[key]) return false;
                    
                    if(handler.path[key].charAt(0) !== "$")
                        return handler.path[key] === value;
                    else {
                        handler.params[handler.path[key].slice(1)] = value;
                        return true;
                    }
                });
                
            });

            
*/