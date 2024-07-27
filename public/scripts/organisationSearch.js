document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }
  try {
    // Getting current account ID
    const currentAccountID = parseInt(localStorage.getItem("userID"));
    
    // Get All Accounts
    const accountResponse = await fetch("/searchPage", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status:", accountResponse.status);
    let account = await accountResponse.json();
    account = account.filter(specificAccount => specificAccount.AccID !== currentAccountID);
    console.log("Account received:", account);
    if (!accountResponse.ok) {
      throw new Error(account.message || "Failed to load Account");
    }

    // Getting All Follower Relations
    const followerRelationsResponse = await fetch(`/searchPage/allFollower`, {
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

    // Filters all accounts User has followed or is followed by
    const listOfFollowedBy = []; // Accounts that follow the User
    const listOfFollowing = []; // Accounts that the user followed
    for (const relation of allFollowerRelations) {
      if (relation.Follower === currentAccountID) {
        listOfFollowedBy.push(relation.FollowedBy);
      } else if (relation.FollowedBy === currentAccountID) {
        listOfFollowing.push(relation.Follower);
      }
    }
    console.log(listOfFollowedBy);
    console.log(listOfFollowing);

    let allFollowButtons = "";
    // Appending Users into page

    async function processAccounts(user){
      const userProfileContainer = document.createElement("a");
      userProfileContainer.classList.add("no-underline");

      //True if the user is a volunteer
      let followButtonHTML = "";
      if (user.OrgName === undefined && user.AccID !== currentAccountID) {
        if (listOfFollowing.includes(user.AccID)) {
          followButtonHTML = "Unfollow";
        } else if (listOfFollowedBy.includes(user.AccID)) {
          followButtonHTML = "Follow Back";
        } else {
          followButtonHTML = "Follow";
        }
        userProfileContainer.innerHTML = `
          <div class="user">
            <a class ="user-account" id=${user.AccID} href="userprofile.html">
              <img src="" alt="profile picture" />
              <div class="user-details">
                <span class="username">${user.Username}</span>
                <span class="fullname">${user.FName} ${user.LName}</span>
              </div>
            </a>
            <button class="follow-btn" id="${user.AccID}">${followButtonHTML}</button>
          </div>
        `;
        // True if the user is an organisation
      } else if (user.AccID !== currentAccountID) {
        if (listOfFollowing.includes(user.AccID)) {
          followButtonHTML = "Unfollow";
        } else if (listOfFollowedBy.includes(user.AccID)) {
          followButtonHTML = "Follow Back";
        } else {
          followButtonHTML = "Follow";
        }
        userProfileContainer.innerHTML = `
          <div class="user">
            <a class ="user-account" id=${user.AccID} href="">
              <img src="" alt="${user.OrgName} profile picture" />
              <div class="user-details">
                <span class="username">${user.OrgName}</span>
                <span class="fullname">${user.Website}</span>
              </div>
            </a>
            <button class="follow-btn" id="${user.AccID}">${followButtonHTML}</button>
          </div>
        `;
      }
      userListSection.appendChild(userProfileContainer);
    }

    function updateAccounts(account){
      userListSection.innerHTML = "";
      const promises = account.map(processAccounts);
      Promise.all(promises).then(() => { 
        allFollowButtons = document.querySelectorAll(".follow-btn")
        allFollowButtons.forEach((button) => {
          button.addEventListener("click", async (event) => {
            const follower = parseInt(event.target.id);
            if (
              button.innerHTML === "Follow Back" ||
              button.innerHTML === "Follow"
            ) {
              try {
                const postFollow = {
                  follower: follower,
                  followedBy: currentAccountID,
                };
                console.log(postFollow);
                const postFollowResponse = await fetch(`/searchPage/postFollow`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(postFollow),
                });
                button.innerHTML = "Unfollow";
                if (!postFollowResponse.ok) {
                  throw new Error("Failed to post follow");
                }
    
                const updatedData = await postFollowResponse.json();
                console.log(updatedData);
                console.log("Follow posted:", updatedData);
              } catch (error) {
                console.error("Error in posted:", error);
              }
            } else {
              const deleteFollow = {
                follower: follower,
                followedBy: currentAccountID,
              };
              console.log(deleteFollow);
              const deleteFollowResponse = await fetch(`/searchPage/deleteFollow`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(deleteFollow),
              });
    
              if (!deleteFollowResponse.ok) {
                throw new Error("Failed to post follow");
              }
              console.log(
                "is this true",
                listOfFollowedBy.includes(event.target.id)
              );
              console.log(listOfFollowedBy);
              if (listOfFollowedBy.includes(event.target.id)) {
                button.innerHTML = "Follow Back";
              } else {
                button.innerHTML = "Follow";
              }
    
              const updatedData = await deleteFollowResponse.json();
              console.log(updatedData);
              console.log("Follow deleted successfully:", updatedData);
            }
          });
        });
        allAccounts = document.querySelectorAll(".user-account");
        allAccounts.forEach((account) => {
          account.addEventListener("click", async (event) => {
            event.preventDefault();
            const targetAccountID = parseInt(account.id);
            sessionStorage.removeItem("viewAccID");
            sessionStorage.setItem("viewAccID", targetAccountID);
            window.location.href = account.href;
          })
        })
      });
    }
    
    updateAccounts(account);

    //Code for searching account
    const searchBar = document.querySelector(".search-bar");

    searchBar.addEventListener("input", async (event) => {
      let query = event.target.value;
      // // Get Account Based on query
      const filteredQueryResponse = await fetch(`/searchPage/${query}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
      });
      console.log("Response status:", filteredQueryResponse.status);
      const searchedAccount = await filteredQueryResponse.json();
      if (!filteredQueryResponse.ok) {
        throw new Error(searchedAccount.message || "Failed to load Searched Account");
      }
      const accountsToUpdate = Array.isArray(searchedAccount) ? searchedAccount : [searchedAccount];
      updateAccounts(accountsToUpdate);
    });
  } catch (error) {
    console.error("Error deleting follow:", error);
    alert("Error deleting follow: " + error.message);
  }
});
