import "dotenv/config";
import express from "express";
import { resolve } from "path";
import { GridFSBucket, MongoClient, ServerApiVersion } from "mongodb";

const cl = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const db = cl.db(process.env.MONGODB_DB);
const bucket = new GridFSBucket(db);
const collection = db.collection(process.env.MONGODB_COLLECTION);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.get("/", (_, res) => res.render("index"));
app.post("/game", async (req, res) => {
  const { difficulty } = req.body;
  let pipeline = [];
  if (difficulty != "mixed") {
    pipeline.push({ $match: { difficulty } });
  }
  pipeline.push({ $sample: { size: 1 } });
  const { id } = await collection.aggregate(pipeline).tryNext();
  let timer = 120;
  res.render("game", {
    result: "playing",
    timer: timer,
    id,
  });
});

app.get("/game.js", (_, res) => {
  res.type("javascript");
  res.sendFile(resolve("game.js"));
});

app.get("/image/:id", async (req, res) => {
  try {
    res.type("jpeg");
    bucket.openDownloadStreamByName(req.params.id).pipe(res);
  } catch (_) {
    res.status(404);
    console.log(404);
  }
});

app.post("/success", async (req, res) => {
  const { id, lat, lng } = req.body;
  console.log(req.body);
  const correct = await collection.findOne({ id });
  console.table(correct);
  const url = `https://distance-calculator.p.rapidapi.com/distance/simple?lat_1=${lat}&long_1=${lng}&lat_2=${correct.latitude}&long_2=${correct.longitude}&unit=miles&decimal_places=2`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": "distance-calculator.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    const json = await JSON.parse(result);
    const distance = json.distance;
    const score = Math.round(
      Math.min(Math.max(1000 * Math.exp(-8 * distance + 0.05), 0), 1000)
    );
    console.log(score);
    res.send({
      result: "success",
      point: JSON.stringify({ lat: lat, lng: lng }),
      // coords: JSON.stringify(correct),
      id,
      score: score,
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

app.listen(8000, () =>
  console.log(`Web server started and running at http://localhost:8000`)
);
