document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }


  // fetch organisation details
  try {
    const orgId = sessionStorage.getItem("userID");
    if (!orgId) {
      throw new Error("Organisation ID not found");
    }
    const response = await fetch(`/organisation/details/${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);

    const orgDetails = await response.json();
    console.log("Organisation details received:", orgDetails);

    if (!response.ok) {
      throw new Error(orgDetails.message || "Failed to load organisation details");
    }
    document.getElementById("orgName").textContent = orgDetails.OrgName;
    document.getElementById("orgMission").textContent = orgDetails.Mission;
    document.getElementById("listingCount").textContent = `${orgDetails.NumListings} Listings`;
    document.getElementById("followerCount").textContent = `${orgDetails.NumFollowers} Followers`;
    document.getElementById("followingCount").textContent = `${orgDetails.NumFollowing} Following`;

  } catch (error) {
    console.error("Error loading organisation details:", error);
    alert("Error loading organisation details: " + error.message);
  }

  // fetch listings from organisation logged in
  try {
    const response = await fetch("/auth/listings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);

    const listings = await response.json();
    console.log("Listings received:", listings);

    if (!response.ok) {
      throw new Error(listings.message || "Failed to load listings");
    }

    const listingsContainer = document.getElementById("listingsContainer");
    listingsContainer.innerHTML = ""; // Clear existing content

    listings.forEach((listing) => {
      const listingItem = document.createElement("div");
      listingItem.classList.add("listing-item");
      listingItem.innerHTML = `
        <img src="${listing.ImagePath || 'https://storage.gignite.ai/mediaengine/model1/41096b32-b087-493f-94f3-f13aa79d2526.png'}" alt="Listing Image" class="listing-image" />
        <div class="listing-info-box">
          <div class="listing-name">${listing.ListingName}</div>
          <div class="listing-info">
            <p>${listing.Addr}</p>
          </div>
        </div>
      `;
      listingsContainer.appendChild(listingItem);
    });
      /*listingItem.innerHTML = `
          <div class="listingimage">
            <div class="placeholder-image"></div>
          </div>
          <div class="listinginfobox">
            <p class="listingname">${listing.ListingName}</p>
            <p class="listinginfo">${listing.Addr}</p>
            <p class="listinginfo">${listing.CauseArea}</p>
          </div>
        `;
      listingsContainer.appendChild(listingItem);
    });*/

    document.getElementById(
      "listingCount"
    ).textContent = `${listings.length} Listings`;
  } catch (error) {
    console.error("Error loading listings:", error);
    alert("Error loading listings: " + error.message);
  }
});
