document.addEventListener("DOMContentLoaded", () => {
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

  if (accType === "Organisation") {
    document.getElementById("profile-link").href =
      "./organisationprofilemgmt.html";
  } else if (accType === "Volunteer") {
    document.getElementById("profile-link").href = "./userprofilemgmt.html";
  }

  const token = getCookie("authToken");

  console.log("authToken from cookie:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "login.html";
  } else {
    document.querySelector(".logout-button").addEventListener("click", () => {
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "login.html";
    });
  }

  const profileLink = document.getElementById("profile-link");
});
