document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  if (!email) {
    console.error(
      "No email found in URL parameters. Google Login is required before you can access this page."
    );
    return;
  }

  try {
    const response = await fetch("/auth/check-google-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (result.exists) {
      sessionStorage.setItem("authToken", result.token);
      window.location.href = "/public/html/index.html";
    } else {
      document.getElementById("orgSignUpForm").style.display = "block";
      document.getElementById("volunteerSignUpForm").style.display = "block";
    }
  } catch (error) {
    console.error("Error during account check:", error);
  }
});

// validate that phone number is 8 digits long and starts with 8 or 9
const validatePhoneNumber = (phoneNumber) => {
  const phoneNumberRegex = /^[89]\d{7}$/;
  return phoneNumberRegex.test(phoneNumber);
};


document
  .getElementById("volunteerSignUpForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.email = new URLSearchParams(window.location.search).get("email"); // Add email to data
    if (!validatePhoneNumber(data.phone_number)) {
      alert("Phone number must be an 8 digit Singaporean phone number starting with 8 or 9.");
      return;
    }

    console.log("Volunteer sign-up data:", data); // Log form data to verify

    try {
      const response = await fetch("/auth/signup/google-volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Network response was not ok");
      }

      const result = await response.json();
      sessionStorage.setItem("authToken", result.token);
      alert("Volunteer sign-up successful!");
      window.location.href = "/public/html/index.html";
    } catch (error) {
      console.error("Error during volunteer sign-up:", error);
      alert("Error during volunteer sign-up: " + error.message);
    }
  });

document
  .getElementById("orgSignUpForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.email = new URLSearchParams(window.location.search).get("email"); // Add email to data
    if (!validatePhoneNumber(data.phone_number)) {
      alert("Phone number must be an 8 digit Singaporean phone number starting with 8 or 9.");
      return;
    }

    console.log("Organisation sign-up data:", data); // Log form data to verify

    try {
      const response = await fetch("/auth/signup/google-organisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        sessionStorage.setItem("authToken", result.token);
        throw new Error(result.message || "Network response was not ok");
      }

      const result = await response.json();
      alert("Organisation sign-up successful!");
      window.location.href = "/public/html/index.html";
    } catch (error) {
      console.error("Error during organisation sign-up:", error);
      alert("Error during organisation sign-up: " + error.message);
    }
  });