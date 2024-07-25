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
const storage = new Storage({keyFilename: keyFile});
async function downloadIntoMemory(fileName) {
  // Downloads the file into a buffer in memory.
  const profilePicture = await storage.bucket(bucketName).file(fileName).download();
  
  console.log(
    `I got the pfp!!!`
  );
  return profilePicture;
}
// Not working, needs fixing

// async function uploadImages(images) {
//   const options = {
//     destination: images,
//   };
//   await storage.bucket(bucketName).upload()
// }
let profilePicture = downloadIntoMemory().catch(console.error);
console.log("🚀 ~ profilePicture:", profilePicture)

//appendIntoFile(profilePicture);

module.exports = {
  downloadIntoMemory
}