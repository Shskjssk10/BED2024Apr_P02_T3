document.addEventListener("DOMContentLoaded", async function () {
  const userID = parseInt(localStorage.getItem("userID"));
  const response = await fetch(`/volunteers/${userID}`);
  const data = await response.json();
  const token = localStorage.getItem("authToken");

  //for the top card
  var username = document.getElementById("username");
  username.textContent = data.Username;

  var FName = document.getElementById("FName");
  FName.textContent = data.FName;
  ////

  //for the form
  var fname = document.getElementById("fname");
  fname.value = data.FName;

  var lname = document.getElementById("lname");
  lname.value = data.LName;

  var username = document.getElementById("form-username");
  username.value = data.Username;

  var phoneNo = document.getElementById("phonenum");
  phoneNo.value = data.PhoneNo;

  var email = document.getElementById("email");
  email.value = data.Email;

  var bio = document.getElementById("bio");
  bio.value = data.Bio;

  var password = document.getElementById("password");
  password.value = data.Password;

  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", async function (e) {
    e.preventDefault();
    console.log("submit button clicked");

    //PUT update works now
    const updatedUser = [
      {
        FName: fname.value,
        LName: lname.value,
        Username: username.value,
        Email: email.value,
        PhoneNo: phoneNo.value,
        Bio: bio.value,
        Password: password.value,
      },
    ];
    console.log("Updated User Data: ", updatedUser);
    try {
      const updateResponse = await fetch(`/volunteers/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update user data");
      }

      const updatedData = await updateResponse.json();
      console.log(updatedData);
      console.log("User updated successfully:", updatedData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  });

  const deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", async function (e) {
    console.log("button clicked");

    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    const userID = localStorage.getItem("userID");

    await fetch(`/volunteers/${userID}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Account deleted successfully.");
          // Optionally redirect the user to another page
          window.location.href = "./login.html";
        } else {
          alert("Failed to delete account.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  });
});
