document.addEventListener("DOMContentLoaded", async () => {
  // Function to get a specific cookie by name
  function getCookie(name) {
    let matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  const username = sessionStorage.getItem("username");
  console.log(username);

  const accType = sessionStorage.getItem("AccType");
  console.log(accType);

  let fetchPath = "";
  if (accType === "Organisation"){ 
    document.getElementById("profile-link").href =
      "./organisationprofilemgmt.html";
    fetchPath = "/organisations"
  } else if (accType === "Volunteer") {
    document.getElementById("profile-link").href = "./userprofilemgmt.html";
    fetchPath = "/volunteers"
  }
  let account = "";
  try {
    const currentAccountID = parseInt(localStorage.getItem("userID"));
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
  const token = getCookie("authToken");

  console.log("authToken from cookie:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "login.html";
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
