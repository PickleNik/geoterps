import "dotenv/config";
import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";

const {
  MONGO_COLLECTION: collection,
  MONGO_DB_NAME: db,
  MONGO_DB_PASSWORD: password,
  MONGO_DB_USERNAME: username,
} = process.env;

const uri = `mongodb+srv://${username}:${password}@cluster0.rvktjyh.mongodb.net/?retryWrites=true&w=majority`;
// const cl = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });
// cl.connect();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.get("/", (_, res) => res.render("index"));
// TODO: pull images from database, select a random one, and display it
app.get("/game", (_, res) => res.render("game"));

app.post("/success", (req, res) => res.render("game", { result: "success" }));
app.post("/failure", (req, res) => res.render("game", { result: "failure" }));

app.listen(8000);
console.log(`Web server started and running at http://localhost:8000`);
