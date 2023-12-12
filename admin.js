import ExifReader from "exifreader";

const tags = await ExifReader.load(process.argv[2]);

console.log(tags.GPSLatitude.description);
console.log(tags.GPSLongitude.description);
