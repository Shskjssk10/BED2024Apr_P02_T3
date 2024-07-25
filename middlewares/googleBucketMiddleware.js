require('dotenv').config();
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = process.env.BUCKET_NAME;
const keyFile = process.env.KEYFILENAME

// The ID of your GCS file

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
let fileName = "";
const storage = new Storage({keyFilename: keyFile});
async function downloadIntoMemory(fileName) {
  // Downloads the file into a buffer in memory.
  const profilePicture = await storage.bucket(bucketName).file(fileName).download();
  return profilePicture;
}

async function uploadFromMemory(image) {
  const destFileName = "Something-New.jpg"
  await storage.bucket(bucketName).file(destFileName).save(image);

  console.log(
    `The file has been successfully uploaded!.`
  );
}

module.exports = {
  downloadIntoMemory,
  uploadFromMemory,
}