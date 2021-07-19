import meqeq from './meqeq.ts';
import auth from './routes/auth.ts';
import { Panel, RssResponse } from '../common/rss.ts';
import { getAuth } from "./jwt.ts";
import { getByUserId, Panels, save, update } from './database/panels.ts';

const app = new meqeq(8000);

app.route("/api/auth", auth);


app.get("/", async (req, res) => {
    try {
        //const token = encode({kek: "lele"}, "HS512", "k00psko");

        //console.log(decode(token, "HS512", "k00psko"));
        
        //let kek = await delays();

        //res.json(kek);
        res.json({dawdawd: "AWDAWDAWD"});

        res.json({kek: "lele"});
    } catch(e) {
        console.log(e);
    }     
});

app.post("/api/rss", async(req, res, next, params) => {
    try {
        const user = getAuth(req.headers.get("Authorization") || "");

        const path = params.get("path");

        if(!path)
            return;

        const result = await fetch(path);

        const response : RssResponse = {
            text: await result.text()
        }

        res.json(response);

    } catch(e) {
        console.log(e);
    }
});

app.get("/api/panels", async(req, res, next, params) => {
    try {
        const user = getAuth(req.headers.get("Authorization") || "");

        const panels = await getByUserId(user.iss as string);

        const response: Panel[] = panels ? panels.panels : [];

        res.json(response);

    } catch(e) {
        console.log(e);
    }
});

app.post("/api/panels", async(req, res, next, params) => {
    try {

        const user = getAuth(req.headers.get("Authorization") || "");

        const panels = await getByUserId(user.iss as string);
        const input = params.get("panels") as unknown as Panel[];
        
        if(!panels) {
            let pans: Panels = {
                userId: user.iss as string,
                panels: input
            }
            
            await save(pans);
        } else {
            if(input) {
                panels.userId = user.iss as string;
                panels.panels = input;
            }

            await update(panels);
        }


        const response: Panel[] = panels ? panels.panels : [];

        res.json(response);

    } catch(e) {
        console.log(e);
    }
});

app.listen((port: number) => console.log(`Server started on port ${port}`));