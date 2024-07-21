document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }
  try {
    // Get All Accounts
    const accountResponse = await fetch("http://localhost:8080/searchPage", {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
    });
    console.log("Response status:", accountResponse.status);
    const account = await accountResponse.json();
    console.log("Account received:", account);
    if (!accountResponse.ok) {
      throw new Error(account.message || "Failed to load Account");
    }

    // Getting All Follower Relations
    const followerRelationsResponse = await fetch(`http://localhost:8080/searchPage/allFollower`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
    });
    console.log("Response status:", followerRelationsResponse.status);
    const allFollowerRelations = await followerRelationsResponse.json();
    console.log("Follows received:", allFollowerRelations);

    if (!followerRelationsResponse.ok) {
      throw new Error(allFollowerRelations.message || "Failed to load Follows");
    }

    const userListSection = document.querySelector(".user-list");
    userListSection.innerHTML = "";

    // Filters all accounts User has followed or is followed by 
    const listOfFollowedBy = []; // Accounts that follow the User
    const listOfFollowing = []; // Accounts that the user followed
        for (const relation of allFollowerRelations){
      if (relation.Follower === 6){
        listOfFollowedBy.push(relation.FollowedBy);
      }
      else if (relation.FollowedBy === 6){
        listOfFollowing.push(relation.Follower);
      }
    }
    console.log(listOfFollowedBy);
    console.log(listOfFollowing);

    let allFollowButtons = "";
    // Appending Users into page
    for (const user of account){
      const userProfileContainer = document.createElement("a");
      userProfileContainer.classList.add("no-underline");
      // '6' will be the current logged in user AccID

      //True if the user is a volunteer
      if (user.OrgName === undefined && user.AccID !== 6 ){
        if (listOfFollowing.includes(user.AccID)){
          userProfileContainer.innerHTML = `
            <div class="user">
              <img src="path/to/shskjsk10-profile.jpg" alt="${user.Username} profile picture" />
              <div class="user-details">
                <span class="username">${user.Username}</span>
                <span class="fullname">${user.FName} ${user.LName}</span>
              </div>
              <button class="follow-btn" id="${user.AccID}">Unfollow</button>
            </div>
          `;
        }
        else if (listOfFollowedBy.includes(user.AccID)){
          userProfileContainer.innerHTML = `
            <div class="user">
              <img src="path/to/shskjsk10-profile.jpg" alt="${user.Username} profile picture" />
              <div class="user-details">
                <span class="username">${user.Username}</span>
                <span class="fullname">${user.FName} ${user.LName}</span>
              </div>
              <button class="follow-btn" id="${user.AccID}">Follow Back</button>
            </div>
          `;
        }
        else {
          userProfileContainer.innerHTML = `
            <div class="user">
              <img src="path/to/shskjsk10-profile.jpg" alt="${user.Username} profile picture" />
              <div class="user-details">
                <span class="username">${user.Username}</span>
                <span class="fullname">${user.FName} ${user.LName}</span>
              </div>
              <button class="follow-btn" id="${user.AccID}">Follow</button>
            </div>
          `;
        }
      // True if the user is an organisation
      } else if (user.AccID !== 6){
        if (listOfFollowing.includes(user.AccID)){
          userProfileContainer.innerHTML = `
            <div class="user">
              <img src="path/to/shskjsk10-profile.jpg" alt="${user.OrgName} profile picture" />
              <div class="user-details">
                <span class="username">${user.OrgName}</span>
                <span class="fullname">${user.Website}}</span>
              </div>
              <button class="follow-btn" id="${user.AccID}">Unfollow</button>
            </div>
          `;
        }
        else if (listOfFollowedBy.includes(user.AccID)){
          userProfileContainer.innerHTML = `
            <div class="user">
              <img src="path/to/shskjsk10-profile.jpg" alt="${user.OrgName} profile picture" />
              <div class="user-details">
                <span class="username">${user.OrgName}</span>
                <span class="fullname">${user.Website}}</span>
              </div>
              <button class="follow-btn" id="${user.AccID}">Follow Back</button>
            </div>
          `;
        }
        else {
          userProfileContainer.innerHTML = `
            <div class="user">
              <img src="path/to/shskjsk10-profile.jpg" alt="${user.OrgName} profile picture" />
              <div class="user-details">
                <span class="username">${user.OrgName}</span>
                <span class="fullname">${user.Website}}</span>
              </div>
              <button class="follow-btn" id="${user.AccID}">Follow</button>
            </div>
          `;
        }
      }
      userListSection.appendChild(userProfileContainer);
    }
    
    allFollowButtons = document.querySelectorAll(".follow-btn");
    console.log("🚀 ~ allFollowButtons:", allFollowButtons)
    allFollowButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const follower = parseInt(event.target.id) 
        if (button.innerHTML === "Follow Back" || button.innerHTML === "Follow"){
          try {
            const postFollow = {
              "follower" : follower,
              "followedBy" : 6
            }
            console.log(postFollow);
            const postFollowResponse = await fetch(
              `http://localhost:8080/searchPage/postFollow`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postFollow),
              }
            );
            button.innerHTML = "Unfollow"
            if (!postFollowResponse.ok) {
              throw new Error("Failed to post follow");
            }
            
            const updatedData = await postFollowResponse.json();
            console.log(updatedData);
            console.log("Follow posted:", updatedData);
          } catch (error) {
            console.error("Error in posted:", error);
          }
        }
        else {
          const deleteFollow = {
            "follower" : follower,
            "followedBy" : 6
          }
          console.log(deleteFollow);
          const deleteFollowResponse = await fetch(
            `http://localhost:8080/searchPage/deleteFollow`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(deleteFollow),
            }
          );
    
          if (!deleteFollowResponse.ok) {
            throw new Error("Failed to post follow");
          }
          console.log("is this true", listOfFollowedBy.includes(event.target.id));
          console.log(listOfFollowedBy);
          if (listOfFollowedBy.includes(event.target.id)){
            button.innerHTML = "Follow Back";
          }
          else {
            button.innerHTML = "Follow";
          }

          const updatedData = await deleteFollowResponse.json();
          console.log(updatedData);
          console.log("Follow deleted successfully:", updatedData);
        }
      });
    });
  } catch (error) {
    console.error("Error deleting follow:", error);
    alert("Error deleting follow: " + error.message);
  }
});