import meqeq from './meqeq.ts';
import auth from './routes/auth.ts';
import { TextResponse } from '../common/responses.ts';


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
        const path = params.get("path");

        if(!path)
            return;

        const result = await fetch(path);

        const response : TextResponse = {
            text: await result.text()
        }

        res.json(response);

    } catch(e) {
        console.log(e);
    }
});

app.listen((port: number) => console.log(`Server started on port ${port}`));