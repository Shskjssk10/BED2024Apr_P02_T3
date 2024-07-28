document
  .getElementById("volunteerSignUpForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const randomInt = Math.floor(Math.random() * 3) + 1;
    const volunteerData = {
      fname: document.getElementById("volunteerFirstName").value,
      lname: document.getElementById("volunteerLastName").value,
      username: document.getElementById("volunteerUsername").value,
      email: document.getElementById("volunteerEmail").value,
      phone_number: document.getElementById("volunteerPhoneNumber").value,
      gender: document.getElementById("volunteerGender").value,
      bio: document.getElementById("volunteerBio").value,
      password: document.getElementById("volunteerPassword").value,
      mediapath: `random${randomInt}-pfp.jpg`
    };

    const phoneRegex = /^[89]\d{7}$/;

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
    } else if (!phoneRegex.test(volunteerData.phone_number)) {
      alert(
        "Phone number must be 8 digit Singaporean phone number starting with 8 or 9."
      );
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
      window.location.href = "../html/login.html";
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
      mediapath: `random${randomInt}-pfp.jpg`
    };

    const phoneRegex = /^[89]\d{7}$/;

    if (orgData.org_name.length > 20) {
      alert("Organisation name must be 20 characters or less.");
      return;
    } else if (orgData.issue_area.length > 50) {
      alert("Issue area must be 50 characters or less.");
      return;
    } else if (orgData.mission.length > 255) {
      alert("Mission must be 255 characters or less.");
      return;
    } else if (orgData.address.length > 255) {
      alert("Address must be 255 characters or less.");
      return;
    } else if (orgData.apt_floor_unit.length > 50) {
      alert("Apt/Floor/Unit must be 50 characters or less.");
      return;
    } else if (!phoneRegex.test(orgData.phone_number)) {
      alert(
        "Phone number must be an 8 digit Singaporean number starting with 8 or 9."
      );
      return;
    } else if (orgData.email.length > 255) {
      alert("Email must be 255 characters or less.");
      return;
    }

    try {
      const response = await fetch("/auth/signup/organisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orgData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      alert("Organisation signed up successfully");
      window.location.href = "../html/login.html";
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  });
