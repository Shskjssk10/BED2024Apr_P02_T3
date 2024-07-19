document.addEventListener("DOMContentLoaded", async function () {
  //console.log("DOM loaded");

  //need to read the user cant use data[0]
  //using data[0] now just to display

  const userID = parseInt(localStorage.getItem("userID"));
  //console.log(userID);
  const response = await fetch(`http://localhost:8080/volunteers/${userID}`);
  const data = await response.json();
  //console.log(data);

  const token = localStorage.getItem("authToken");
  //console.log(token);

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

  var email = document.getElementById("email");
  email.value = data.Email;

  var phoneNo = document.getElementById("phonenum");
  phoneNo.value = data.PhoneNo;

  var bio = document.getElementById("bio");
  bio.value = data.Bio;

  var password = document.getElementById("password");
  password.value = data.Password;

  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", async function (e) {
    e.preventDefault();
    //when submit button clicked
    //should send put req to db to update
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
      const updateResponse = await fetch(
        `http://localhost:8080/volunteers/${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

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
});
