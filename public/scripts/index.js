document.addEventListener("DOMContentLoaded", async () => {
  const username = sessionStorage.getItem("username");
  console.log(username);

  const accType = sessionStorage.getItem("AccType");
  console.log(accType);

  if (accType === "Organisation") {
    document.getElementById("profile-link").href =
      "./G_organisationprofilemgmt.html";
  } else if (accType === "Volunteer") {
    document.getElementById("profile-link").href = "./userprofilemgmt.html";
  }

  const token = sessionStorage.getItem("authToken");

  console.log("authToken from cookie:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
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
  const profileLink = document.getElementById("profile-link");
});
