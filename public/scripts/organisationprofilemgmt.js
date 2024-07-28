document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded");
  const userID = parseInt(sessionStorage.getItem("userID"));
  const response = await fetch(`/organisations/${userID}`);
  console.log(userID);
  const data = await response.json();
  console.log(data);

  const profilePictureContainer = document.querySelector("#profile-link");
    let profilePicture = await fetch(`/image/${data.MediaPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  profilePictureContainer.src = profilePicture.url;

  const token = localStorage.getItem("authToken");
  //console.log(token);
  
  var profilePhoto = document.querySelector("#card-photo");
  profilePhoto.src = profilePicture.url;

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
      const updateResponse = await fetch(`/organisations/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedOrg),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update user data");
      }

      const updatedData = await updateResponse.json();
      console.log(updatedData);
      console.log("Updated successfully:", updatedData);
    } catch (error) {
      console.error("Error updating data:", error);
    }

    // Cheryl's part
    if (password.value) {
      try {
        const updatePasswordResponse = await fetch(
          `/organisations/${userID}/password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ newPassword: password.value }),
          }
        );

        if (!updatePasswordResponse.ok) {
          throw new Error("Failed to update password");
        }

        const passwordData = await updatePasswordResponse.json();
        console.log("Password updated successfully:", passwordData);
      } catch (error) {
        console.error("Error updating password:", error);
      }
    } // end of Cheryl's part
  }); 

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

    // const userID = sessionStorage.getItem("userID");
    // console.log(userID);

    //delete by user id
    //HENDRIK DELETE
    await fetch(`/organisations/${userID}`, {
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
