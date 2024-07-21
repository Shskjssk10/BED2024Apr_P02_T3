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
    console.log("Response status: THIS IS RUNNING", followerRelationsResponse.status);
    const allFollowerRelations = await followerRelationsResponse.json();
    console.log("Follows received:", allFollowerRelations);

    if (!followerRelationsResponse.ok) {
      throw new Error(allFollowerRelations.message || "Failed to load Follows");
    }

    const userListSection = document.querySelector(".user-list");
    userListSection.innerHTML = "";

    const listOfFollowedBy = [];
    const listOfFollowing = [];
    
    for (const relation of allFollowerRelations){
      console.log(relation.Follower);
      if (relation.Follower === 6){
        listOfFollowedBy.push(relation.FollowedBy);
      }
      else if (relation.FollowedBy === 6){
        listOfFollowing.push(relation.Follower);
      }
    }


    // Appending Users
    for (const user of account){
      const userProfileContainer = document.createElement("a");
      userProfileContainer.classList.add("no-underline");
      // '0' will be the current logged in user AccID

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
              <button class="follow-btn">Unfollow</button>
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
              <button class="follow-btn">Follow Back</button>
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
              <button class="follow-btn">Follow</button>
            </div>
          `;
        }
      // True if the user is an organisation
      } else if (user.id !== 6){
        if (listOfFollowing.includes(user.AccID)){
          userProfileContainer.innerHTML = `
            <div class="user">
              <img src="path/to/shskjsk10-profile.jpg" alt="${user.OrgName} profile picture" />
              <div class="user-details">
                <span class="username">${user.OrgName}</span>
                <span class="fullname">${user.Website}}</span>
              </div>
              <button class="follow-btn">Unfollow</button>
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
              <button class="follow-btn">Follow Back</button>
            </div>
          `;
        }
        else if (listOfFollowing.includes(user.AccID)){
          userProfileContainer.innerHTML = `
            <div class="user">
              <img src="path/to/shskjsk10-profile.jpg" alt="${user.OrgName} profile picture" />
              <div class="user-details">
                <span class="username">${user.OrgName}</span>
                <span class="fullname">${user.Website}}</span>
              </div>
              <button class="follow-btn">Unfollow</button>
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
              <button class="follow-btn">Follow</button>
            </div>
          `;
        }
      }
    userListSection.appendChild(userProfileContainer);
    }
  } catch (error) {
    console.error("Error loading Account:", error);
    alert("Error loading Account: " + error.message);
  }
});