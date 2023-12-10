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
app.post("/success", async (req, res) => {
  const lat = req.body.lat;
  const lng = req.body.lng;
  const databaselat = "38.9891263587382";
  const databaselong = "-76.93646009768161";
  const url = `https://distance-calculator.p.rapidapi.com/distance/simple?lat_1=${lat}&long_1=${lng}&lat_2=${databaselat}&long_2=${databaselong}&unit=miles&decimal_places=2`;
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
    const score =
      distance > 0.05
        ? Math.min(
            Math.max((-1000 / Math.E) * Math.log(distance + 0.5), 0),
            1000
          )
        : Math.min(
            Math.max((-1000 / Math.E) * Math.log(distance + 0.06), 0),
            1000
          );
    console.log(score);
    res.render("game", {
      result: "success",
      point: JSON.stringify({ lat: lat, lng: lng }),
      coords: JSON.stringify({ lat: databaselat, lng: databaselong }),
      score: score,
      image:
        "https://dbknews.s3.amazonaws.com/uploads/2022/09/abandonedumd.color_jr-1-1.jpg",
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

app.post("/failure", (req, res) => res.render("game", { result: "failure" }));

app.listen(8000, () =>
  console.log(`Web server started and running at http://localhost:8000`)
);
