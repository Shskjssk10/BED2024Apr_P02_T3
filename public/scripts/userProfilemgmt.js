document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded");

  //need to read the user cant use data[0]
  //using data[0] now just to display

  const response = await fetch("http://localhost:8080/volunteers");
  const data = await response.json();
  console.log(data);

  //for the top card
  var username = document.getElementById("username");
  username.textContent = data[0].Username;

  var FName = document.getElementById("FName");
  FName.textContent = data[0].FName;
  ////

  //for the form
  var fname = document.getElementById("fname");
  fname.value = data[0].FName;

  var lname = document.getElementById("lname");
  lname.value = data[0].LName;

  var username = document.getElementById("form-username");
  username.value = data[0].Username;

  var email = document.getElementById("email");
  email.value = data[0].Email;

  var phoneNo = document.getElementById("phonenum");
  phoneNo.value = data[0].PhoneNo;

  var bio = document.getElementById("bio");
  bio.value = data[0].Bio;

  var password = document.getElementById("password");
  password.value = data[0].Password;

  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("submit button clicked");
  });
});
