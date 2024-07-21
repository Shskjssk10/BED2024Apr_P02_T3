document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded");

  //need to read the user cant use data[0]
  //using data[0] now just to display

  const userID = parseInt(localStorage.getItem("userID"));
  //console.log(userID);
  const response = await fetch(`http://localhost:8080/organisations/${userID}`);
  const data = await response.json();
  console.log(data);

  const token = localStorage.getItem("authToken");
  //console.log(token);

  //for the top card
  var username = document.getElementById("username");
  username.textContent = data.OrgName;
  ////

  //for the form
  var orgName = document.getElementById("name");
  orgName.value = data.OrgName;

  var address = document.getElementById("address");
  address.value = data.Addr;

  var unit = document.getElementById("unit");
  unit.value = data.AptFloorUnit;

  var website = document.getElementById("website");
  website.value = data.Website;

  var IA = document.getElementById("IA");
  IA.value = data.IssueArea;

  var email = document.getElementById("email");
  email.value = data.Email;

  var phoneNo = document.getElementById("phonenum");
  phoneNo.value = data.PhoneNo;

  var mission = document.getElementById("mission");
  mission.value = data.Mission;

  var descr = document.getElementById("descr");
  descr.value = data.Descr;

  var password = document.getElementById("password");
  password.value = data.Password;

  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", async function (e) {
    e.preventDefault();
    //when submit button clicked
    //should send put req to db to update
    console.log("submit button clicked");

    //PUT update works now
    //here now
    const updatedOrg = [
      {
        OrgName: orgName.value,
        Addr: address.value,
        AptFloorUnit: unit.value,
        Website: website.value,
        IssueArea: IA.value,
        Mission: mission.value,
        Email: email.value,
        PhoneNo: phoneNo.value,
        Descr: descr.value,
        Password: password.value,
      },
    ];
    console.log("Updated Org Data: ", updatedOrg);
    try {
      const updateResponse = await fetch(
        `http://localhost:8080/organisations/${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedOrg),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update user data");
      }

      const updatedData = await updateResponse.json();
      console.log(updatedData);
      console.log("Updated successfully:", updatedData);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  });
});
