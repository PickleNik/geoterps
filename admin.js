import "dotenv/config";
import ExifReader from "exifreader";
import { GridFSBucket, MongoClient, ServerApiVersion } from "mongodb";
import { createHash } from "crypto";
import { createReadStream, existsSync } from "fs";
import { readFile } from "fs/promises";

const [_0, _1, difficulty, path] = process.argv;
if (!["easy", "medium", "hard"].includes(difficulty) || !existsSync(path)) {
  console.log("usage: admin.js <easy|medium|hard> <path>");
  process.exit(1);
}

const id = createHash("sha256")
  .update(await readFile(path))
  .digest("hex");

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

const tags = await ExifReader.load(path);
const latitude = tags.GPSLatitude.description;
const longitude = tags.GPSLongitude.description;

createReadStream(path).pipe(bucket.openUploadStream(id));
await collection.insertOne({
  difficulty,
  id,
  latitude,
  longitude,
});

console.log(`uploaded ${id} (${difficulty})`);
process.exit(0);
