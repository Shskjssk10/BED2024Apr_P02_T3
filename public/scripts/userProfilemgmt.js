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
    console.log("submit button clicked");

    const response = await fetch("http://localhost:8080/volunteers");
    const data = await response.json();
    console.log("l50", data);
  });
});
