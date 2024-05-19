import { MongoClient, ServerApiVersion } from "mongodb";


const uri: string = `mongodb://localhost:27017/taskmangement`;
export const client: MongoClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});


