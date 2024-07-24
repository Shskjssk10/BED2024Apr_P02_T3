document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }
  try {
    const accountID = 6;
    const imageName = "/post/imageName.jpg";
    const submittonButton = document.querySelector(".post-button");
    submittonButton.addEventListener('click', async (event) => {
      event.preventDefault();
      console.log("Post has been clicked!!!")
      const caption = document.querySelector("#caption").value;
      const postPost = {
        "PostedBy" : accountID,
        "MediaPath" : imageName,
        "Caption" : caption
      }
      const postPostResponse = await fetch(
        `http://localhost:8080/postCreation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postPost),
        }
      );
      const updatedData = await postPostResponse.json();
      console.log(updatedData);
      console.log("Post posted:", updatedData);
    })

  } catch (error) {
    console.error("Error deleting follow:", error);
    alert("Error deleting follow: " + error.message);
  }
});