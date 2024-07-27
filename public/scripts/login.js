document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Login attempt:", email, password);

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      const userID = result.id;
      console.log(userID);
      console.log("Login result:", result);
      sessionStorage.setItem("userID", result.id);
      sessionStorage.setItem("authToken", result.token);

      async function checkAccType(userID) {
        try {
          const orgResponse = await fetch(`/organisations/${userID}`);
          if (orgResponse.ok) {
            const orgData = await orgResponse.json();
            console.log("Organisation data:", orgData);
            sessionStorage.setItem("username", orgData.OrgName);
            sessionStorage.setItem("AccType", "Organisation");
            const accType = sessionStorage.getItem("AccType");
            console.log(accType);
          } else if (orgResponse.status === 404) {
            // Organization not found, check for volunteer
            console.log("Organization not found. Checking volunteer data...");
            const volResponse = await fetch(`/volunteers/${userID}`);
            if (volResponse.ok) {
              const volData = await volResponse.json();
              console.log("Volunteer data:", volData);
              sessionStorage.setItem("username", volData.Username);
              sessionStorage.setItem("AccType", "Volunteer");
              const accType = sessionStorage.getItem("AccType");
              console.log(accType);
            } else {
              // Handle the case where neither organization nor volunteer is found
              console.warn("No matching account found for user ID:", userID);
            }
          } else {
            // Handle other HTTP errors
            console.error(
              "Error fetching organization data:",
              orgResponse.statusText
            );
          }
        } catch (err) {
          console.error("Error checking account type:", err);
        }
      }

      await checkAccType(userID); // Ensure we wait for checkAccType to complete

      if (response.ok) {
        document.cookie = `authToken=${result.token}; path=/;`;
        alert("Login successful");
        window.location.href = "../html/index.html";
      } else {
        alert("Login failed: " + result.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });
});
