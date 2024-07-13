document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded");

  //need to read the user cant use data[0]
  //using data[0] now just to display

  const response = await fetch("http://localhost:8080/organisations");
  const data = await response.json();
  console.log(data);

  //for the top card
  var username = document.getElementById("username");
  username.textContent = data[0].OrgName;
  ////

  //for the form
  var name = document.getElementById("name");
  name.value = data[0].OrgName;

  var address = document.getElementById("address");
  address.value = data[0].Addr;

  var unit = document.getElementById("unit");
  unit.value = data[0].AptFloorUnit;

  var website = document.getElementById("website");
  website.value = data[0].Website;

  var IA = document.getElementById("IA");
  IA.value = data[0].IssueArea;

  var email = document.getElementById("email");
  email.value = data[0].Email;

  var phoneNo = document.getElementById("phonenum");
  phoneNo.value = data[0].PhoneNo;

  var mission = document.getElementById("mission");
  mission.value = data[0].Mission;

  var password = document.getElementById("password");
  password.value = data[0].Password;

  var descr = document.getElementById("descr");
  descr.value = data[0].Descr;

  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("submit button clicked");
  });
});
