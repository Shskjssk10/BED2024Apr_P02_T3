document.addEventListener("DOMContentLoaded", () => {
  const username = sessionStorage.getItem("username");
  console.log(username);

  const token = sessionStorage.getItem("authToken");

  console.log("authToken from session storage:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
  }

  const profileLink = document.getElementById("profile-link");
});
