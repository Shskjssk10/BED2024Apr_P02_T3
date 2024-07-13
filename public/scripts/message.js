document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded");

  const chats = document.getElementById("chats");

  const response = await fetch("http://localhost:8080/volunteers");
  const volunteers = await response.json();
  console.log(volunteers);

  volunteers.forEach((volunteer) => {
    const box = document.createElement("div");
    box.style.display = "flex"; // Make the box a flex container

    // Create the image element for profile picture
    const profilePic = document.createElement("img");
    profilePic.style.width = "50px"; // Adjust width as needed
    profilePic.style.height = "50px"; // Adjust height as needed
    profilePic.style.marginLeft = "15px";
    profilePic.style.marginRight = "15px";
    profilePic.style.borderRadius = "50%"; // Add this line for circular image

    // Assuming you have a way to get the profile picture URL for each volunteer
    // based on the volunteer object (e.g., volunteer.ProfilePicUrl), set it here
    profilePic.src = `../images/default-pfp.png`; // Replace with your logic to get the URL
    box.appendChild(profilePic);

    // Create the username text element
    const username = document.createElement("span");
    username.innerText = volunteer.Username;
    box.appendChild(username);

    box.style.width = "100%";
    box.style.height = "80px";
    box.style.border = "1px solid #ddd";
    box.style.alignItems = "center";
    box.style.lineHeight = "80px";
    box.style.backgroundColor = "white";

    // Add click event listener to change color
    box.addEventListener("click", function () {
      // Reset the background color of all boxes
      document.querySelectorAll("#chats div").forEach((div) => {
        div.style.backgroundColor = "white";
      });
      // Set the background color of the clicked box
      box.style.backgroundColor = "#d3d3d3"; // Change to the desired color
    });

    chats.appendChild(box);
  });
});
