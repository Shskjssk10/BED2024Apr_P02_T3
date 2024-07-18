document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);
  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  } 
  try {
    // Get Volunteer Details
    const volunteerResponse = await fetch("http://localhost:8080/volunteers/3", {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status on VOLUNTEER:", volunteerResponse.status);
    const volunteer = await volunteerResponse.json();
    // console.log("Volunteer received:", temp);
    if (!volunteerResponse.ok) {
      throw new Error(volunteer.message || "Failed to load volunteer");
    }
  } catch (error) {
    console.error("Error loading SOMETHING:", error);
    alert("Error loading SOMETHING: " + error.message);
  }
})