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
      password: document.getElementById("volunteerPassword").value,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/auth/signup/volunteer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(volunteerData),
        }
      );
      const result = await response.json();
      console.log("Volunteer Sign Up Result:", result);
    } catch (error) {
      console.error("Error during volunteer sign up:", error);
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
    };

    try {
      const response = await fetch(
        "http://localhost:8080/auth/signup/organisation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orgData),
        }
      );
      const result = await response.json();
      console.log("Organisation Sign Up Result:", result);
    } catch (error) {
      console.error("Error during organisation sign up:", error);
    }
  });
