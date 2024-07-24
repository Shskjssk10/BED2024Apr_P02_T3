document
  .getElementById("volunteerSignUpForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const volunteerData = {
      fname: document.getElementById("volunteerFirstName").value,
      lname: document.getElementById("volunteerLastName").value,
      username: document.getElementById("volunteerUsername").value,
      email: document.getElementById("volunteerEmail").value,
      phone_number: document.getElementById("volunteerPhoneNumber").value,
      gender: document.getElementById("volunteerGender").value,
      bio: document.getElementById("volunteerBio").value,
      password: document.getElementById("volunteerPassword").value,
    };

    if (volunteerData.username.length > 15) {
      alert("Username must be 15 characters or less.");
      return;
    } else if (
      volunteerData.fname.length > 20 ||
      volunteerData.lname.length > 20
    ) {
      alert("First and last name must be 20 characters or less.");
      return;
    } else if (volunteerData.bio.length > 150) {
      alert("Bio must be 150 characters or less.");
      return;
    } else if (volunteerData.phone_number.length > 8) {
      alert("Phone number must be 8 digit Singaporean phone number.");
      return;
    } else if (volunteerData.password.length > 255) {
      alert("Password must be 255 characters or less.");
      return;
    } else if (volunteerData.email.length > 255) {
      alert("Email must be 255 characters or less.");
      return;
    }

    try {
      const response = await fetch("/auth/signup/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volunteerData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      alert("Volunteer signed up successfully");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  });

document
  .getElementById("orgSignUpForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const orgData = {
      org_name: document.getElementById("orgName").value,
      email: document.getElementById("orgEmail").value,
      phone_number: document.getElementById("orgPhoneNumber").value,
      password: document.getElementById("orgPassword").value,
      issue_area: document.getElementById("orgIssueAreas").value,
      mission: document.getElementById("orgMission").value,
      description: document.getElementById("orgDescription").value,
      address: document.getElementById("orgAddress").value,
      apt_floor_unit: document.getElementById("orgAddress2").value,
      website: document.getElementById("orgWebsite").value,
    };

    try {
      const response = await fetch("/auth/signup/organisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orgData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Organisation signed up successfully");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  });
