import express from "express";
import dotenv from 'dotenv'
import { client } from "./DB/index";
import UserRouter from './routes/User'
import GenealApi from './routes/general'

const app: express.Application = express();
dotenv.config()

const PORT = process.env.PORT || 4000
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
async function run() {
    try {
        await client.connect();
        console.log("database connected sucessfully");
    } catch (error) {
        console.log(error);

    }
} run();


app.use("/api/User", UserRouter)
app.use("/api", GenealApi)

app.listen(PORT, () => {
    console.log(`Port is running on ${PORT}`);

})
