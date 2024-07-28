document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }
  try {
    const accountID = localStorage.getItem("userID");
    const submittonButton = document.querySelector(".post-button");
    submittonButton.addEventListener('click', async (event) => {
      event.preventDefault();
      alert("Post has been posted!")
      const caption = document.querySelector("#caption").value;
      const randomInt = Math.floor(Math.random() * 3) + 1;
      const postPost = {
        "PostedBy" : accountID,
        "MediaPath" : `random${randomInt}-post.jpg`,
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