document.addEventListener("DOMContentLoaded", async function () {
  //retrieve the user id from local storage
  const userID = parseInt(localStorage.getItem("userID"));
  //HENDRIK GET
  //GET request using the user id from local storage
  const response = await fetch(`/volunteers/${userID}`);
  const data = await response.json();
  const token = localStorage.getItem("authToken");

  const profilePictureContainer = document.querySelector("#profile-link");
  const profilePictureCard = document.querySelector("#profile-picture")
  let profilePicture = await fetch(`/image/${data.MediaPath}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  profilePictureContainer.src = profilePicture.url;
  profilePictureCard.src = profilePicture.url;

  //dynamically display the user data based on user id
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
    //listen for submit button clicked
    console.log("submit button clicked");

    //HENDRIK PUT
    //sending out the json to update the user data
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
      //PUT request
      const updateResponse = await fetch(`/volunteers/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          //auth to update
          Authorization: `Bearer ${token}`,
        },
        //send the updates
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

    // Cheryl's part
    if (password.value) {
      try {
        const updatePasswordResponse = await fetch(`/volunteers/${userID}/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword: password.value }),
        });

        if (!updatePasswordResponse.ok) {
          throw new Error("Failed to update password");
        }

        const passwordData = await updatePasswordResponse.json();
        console.log("Password updated successfully:", passwordData);
      } catch (error) {
        console.error("Error updating password:", error);
      }
    }
  }); // end of Cheryl's part

  const deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", async function (e) {
    console.log("button clicked");
    //listen for delete
    //ask for confirmation
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    const userID = sessionStorage.getItem("userID");

    //delete by user id
    //HENDRIK DELETE
    await fetch(`/volunteers/${userID}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Account deleted successfully.");
          //redirect the user to login page
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
