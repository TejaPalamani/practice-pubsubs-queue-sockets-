import {createClient} from "redis"
import express from 'express'

const app = express();
const redisClient = createClient();


(async () => {
    try {
        
        await redisClient.connect();
        console.log("Connected to Redis successfully!");
        app.listen(3000, () => {
            console.log("Express server is running on port 3000");
        });
    } catch (e) {
        console.error("Error connecting to Redis:", e.message);
        
        process.exit(1); 
    }
})();

app.use(express.json());
app.post("/add-to-que", async(req, res)=> {
    const body = req.body
   await redisClient.lPush("adding_to_que", JSON.stringify(body))
    console.log("work is done here(main_backend)",new Date().toLocaleString())
    res.status(200).send("enjoy")
});

