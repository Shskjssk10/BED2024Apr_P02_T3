document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  if (!email) {
    console.error("No email found in URL parameters.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/auth/check-google-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (result.exists) {
      localStorage.setItem("authToken", result.token);
      window.location.href = "http://localhost:5500/public/html/index.html";
    } else {
      document.getElementById("orgSignUpForm").style.display = "block";
      document.getElementById("volunteerSignUpForm").style.display = "block";
    }
  } catch (error) {
    console.error("Error during account check:", error);
  }
});

document
  .getElementById("volunteerSignUpForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.email = new URLSearchParams(window.location.search).get("email"); // Add email to data

    console.log("Volunteer sign-up data:", data); // Log form data to verify

    try {
      const response = await fetch(
        "http://localhost:8080/auth/signup/google-volunteer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      alert("Volunteer sign-up successful!");
      window.location.href = "http://localhost:5500/public/html/index.html";
    } catch (error) {
      console.error("Error during volunteer sign-up:", error);
      alert("Error: " + error.message);
    }
  });

document
  .getElementById("orgSignUpForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.email = new URLSearchParams(window.location.search).get("email"); // Add email to data

    console.log("Organisation sign-up data:", data); // Log form data to verify

    try {
      const response = await fetch(
        "http://localhost:8080/auth/signup/google-organisation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      alert("Organisation sign-up successful!");
      window.location.href = "http://localhost:5500/public/html/index.html";
    } catch (error) {
      console.error("Error during organisation sign-up:", error);
      alert("Error: " + error.message);
    }
  }); 
