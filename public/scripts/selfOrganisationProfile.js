document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);
  if (!token) {
    window.location.href = "../html/login.html";
    alert("Please log in to access this page.");
    return;
  }
  try {
    // Get Organisation Details
    const currentAccountID = parseInt(localStorage.getItem("userID"));
    const organisationResponse = await fetch(`/organisationProfile/${currentAccountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      "Response status on ORGANISATION:",
      organisationResponse.status
    );
    const organisation = await organisationResponse.json();
    if (!organisationResponse.ok) {
      throw new Error(organisation.message || "Failed to load organisation");
    }

    const profileSection = document.querySelector(".profile-header");
    const listingSecetion = document.querySelector(".listings-section");
    const postSection = document.querySelector(".posts");

    listingSecetion.innerHTML = "";
    postSection.innerHTML = "";
    let image = "";
    try {
      image = await fetch(`/image/${organisation.info.MediaPath}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }

    const profilePicture = document.querySelector("#profile-link");
    profilePicture.src = image.url

    profileSection.innerHTML = `
      <img
        src="${image.url}"
        alt="Profile Image"
        class="profile-image"
      />
      <div class="profile-info">
        <h1>${organisation.info.OrgName}</h1>
        <p>
          ${organisation.info.Mission}
        </p>
        <div class="profile-stats">
          <span>${organisation.listings.length} Listings</span>
          <span>${organisation.followersAndFollowing.Followers} Followers</span>
          <span>${organisation.followersAndFollowing.Following} Following</span>
        </div>
        <a href="organisationprofilemgmt.html"
          <button href="organisationprofilemgmt.html" class="edit-button">Edit</button>
        </a>
      </div>
    `;

    // Apending Listings Data
    const listingsContainer = document.createElement("div");
    listingsContainer.classList.add("listings");

    const allListings = organisation.listings;
    for (const listing of allListings) {
      try {
        image = await fetch(`/image/${listing.MediaPath}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error(error);
      }
      const indivListingContainer = document.createElement("div");
      indivListingContainer.classList.add("listing-item");

      indivListingContainer.innerHTML = `
      <div class="listingimage">
        <img src="${image.url}">
      </div>
      <div class="listinginfobox">
        <p class="listingname">${listing.ListingName}</p>
        <p class="listinginfo">${organisation.info.OrgName}</p>
        <p class="listinginfo">${listing.Addr}</p>
      </div>
    `;
      listingsContainer.appendChild(indivListingContainer);
    }

    const listingHeader = document.createElement("h2");
    listingHeader.innerHTML = "Listings";
    const listingSubHeader = document.createElement("p");
    listingSubHeader.innerHTML = "Your most recent Listings:";
    const listingFooter = document.createElement("div");
    listingFooter.classList.add("listings-footer");
    listingFooter.innerHTML = `
      <a href="organisationcreatelisting.html">
        <button s="add-button">+</button>
      </a>
      <a href="organisationlisting.html">
        <button class="view-all-button">View all</button>
      </a>
  `;

    listingSecetion.appendChild(listingHeader);
    listingSecetion.appendChild(listingSubHeader);
    listingSecetion.appendChild(listingsContainer);
    listingSecetion.appendChild(listingFooter);

    // Posts Data
    const allPosts = organisation.posts;
    for (const post of allPosts) {
      const postItemContainer = document.createElement("div");
      postItemContainer.classList.add("post-item");
      image = await fetch(`/image/${post.MediaPath}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      postItemContainer.innerHTML = `
        <img src="${image.url}">
      `;
      postSection.appendChild(postItemContainer);
    }
  } catch (error) {
    console.error("Error loading SOMETHING:", error);
    alert("Error loading SOMETHING: " + error.message);
  }
});
