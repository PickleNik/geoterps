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
app.post("/game", (req, res) => {
  const { difficulty } = req.body;
  // easy | medium | hard | mixed
  console.log(difficulty);
  let timer = 120;
  res.render("game", {
    timer: timer,
    image:
      "https://dbknews.s3.amazonaws.com/uploads/2022/09/abandonedumd.color_jr-1-1.jpg",
  });
});

app.post("/success", (req, res) => res.render("game", { result: "success" }));
app.post("/failure", (req, res) => res.render("game", { result: "failure" }));

app.listen(8000, () =>
  console.log(`Web server started and running at http://localhost:8000`)
);
