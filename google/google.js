require('dotenv').config();
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = process.env.BUCKET_NAME;

// The ID of your GCS file
const fileName = 'image.jpg';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({keyFilename: process.env.KEYFILENAME});

async function downloadIntoMemory() {
  // Downloads the file into a buffer in memory.
    const profilePicture = await storage.bucket(bucketName).file(fileName).download();
    
    console.log(
        `I got the pfp!!!`
    );
    return profilePicture;
}
// async function appendIntoFile(profilePicture) {
//     // Create the image element
//     const imgElement = document.createElement("img");

//     // Load the profile picture into the image element
//     imgElement.src = profilePicture; // Assuming profilePicture is a valid image URL or data URL

//     // Create the container div (optional, depending on your structure)
//     const containerDiv = document.createElement("div");

//     // Append the image to the container div
//     containerDiv.appendChild(imgElement);

//     // Get the target element in your HTML where you want to insert the image
//     const targetElement = document.getElementById("image-container"); // Replace 'image-container' with your actual ID

//     // Append the container div to the target element
//     targetElement.appendChild(containerDiv);
// }

let profilePicture = downloadIntoMemory().catch(console.error);
//appendIntoFile(profilePicture);