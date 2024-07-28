document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("authToken");
  console.log("authToken from cookie:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "login.html";
  } 
  
  const username = sessionStorage.getItem("username");
  console.log(username);

  const accType = sessionStorage.getItem("AccType");
  console.log(accType);

  let fetchPath = "";
  if (accType === "Organisation"){ 
    document.getElementById("pfp-navbar").href =
      "selforganisationprofile.html";
    fetchPath = "/organisations"
  } else if (accType === "Volunteer") {
    document.getElementById("pfp-navbar").href = "selfuserprofile.html";
    fetchPath = "/volunteers"
  }
  let account = "";
  try {
    const currentAccountID = parseInt(sessionStorage.getItem("userID"));
    const accountResponse = await fetch(`${fetchPath}/${currentAccountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status on VOLUNTEER:", accountResponse.status);
    account = await accountResponse.json();
  } catch (error) {
    console.error(error);
  }

  console.log("authToken from session storage:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "login.html";
  } 

  try {
    const response = await fetch("/auth/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid or expired token");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    alert("Invalid or expired token. Please log in again.");
    window.location.href = "../html/login.html";
    return;
  }

  const profilePictureContainer = document.querySelector("#profile-link");
  console.log("🚀 ~ document.addEventListener ~ profilePictureContainer:", profilePictureContainer)
  let pfp = await fetch(`/image/${account.MediaPath}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  profilePictureContainer.src = pfp.url;
});
