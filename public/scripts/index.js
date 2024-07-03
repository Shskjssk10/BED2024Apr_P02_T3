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

  const token = getCookie("authToken");

  console.log("authToken from cookie:", token); // Add this line to log the token

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "login.html";
  }
});
