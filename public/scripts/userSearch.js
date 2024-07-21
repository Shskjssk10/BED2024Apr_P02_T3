document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }
  try {
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
  const userListSection = document.querySelector(".user-list");
  userListSection.innerHTML = "";

  // Appending Users
  for (const user of account){
    const userProfileContainer = document.createElement("a");
    userProfileContainer.classList.add("no-underline");
    // '0' will be the current logged in user AccID
    if (user.OrgName === undefined && user.AccID !== 0) {
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
    } else if (user.AccID !== user.AccID !== 0){
      userProfileContainer.innerHTML = `
      <div class="user">
        <img src="path/to/shskjsk10-profile.jpg" alt="${user.Username} profile picture" />
        <div class="user-details">
          <span class="username">${user.OrgName}</span>
          <span class="fullname">${user.Website}</span>
        </div>
        <button class="follow-btn">Follow</button>
      </div>
    `;
    }
    userListSection.appendChild(userProfileContainer);
  }


  } catch (error) {
    console.error("Error loading Account:", error);
    alert("Error loading Account: " + error.message);
  }
});