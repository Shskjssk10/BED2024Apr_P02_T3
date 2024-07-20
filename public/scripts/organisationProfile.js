document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);
  if (!token) {
    window.location.href = "../html/login.html";
    alert("Please log in to access this page.");
    return;
  } 
  try {
    // Get Volunteer Details
    const organisationResponse = await fetch("http://localhost:8080/organisationProfile/2", {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Response status on ORGANISATION:", organisationResponse.status);
  const organisation = await organisationResponse.json();
  if (!organisationResponse.ok) {
    throw new Error(organisation.message || "Failed to load organisation");
  }

  const profileSection = document.querySelector(".profile-header");
  const listingSecetion = document.querySelector(".listings-section");
  const postSection = document.querySelector(".posts");

  listingSecetion.innerHTML = "";
  postSection.innerHTML = "";

  profileSection.innerHTML = `
    <img
      src="path/to/profile-image.jpg"
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
      <button href="organisationprofilemgmt.html" class="edit-button">Edit</button>
    </div>
  `;

  // Apending Listings Data
  const listingsContainer = document.createElement("div");
  listingsContainer.classList.add("listings");

  const allListings = organisation.listings;
  for (const listing of allListings){
    const indivListingContainer = document.createElement("div");
    indivListingContainer.classList.add("listing-item");

    indivListingContainer.innerHTML = `
      <div class="listingimage"></div>
      <div class="listinginfobox">
        <p class="listingname">${listing.ListingName}</p>
        <p class="listinginfo">${organisation.OrgName}</p>
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
    <button class="add-button">+</button>
    <button class="view-all-button">View all</button>
  `;


  listingSecetion.appendChild(listingHeader);
  listingSecetion.appendChild(listingSubHeader);
  listingSecetion.appendChild(listingsContainer);
  listingSecetion.appendChild(listingFooter);

  // Posts Data
  const allPosts = organisation.posts;
  for (const post of allPosts){
    const postItemContainer = document.createElement("div");
    postItemContainer.classList.add("post-item");
    postSection.appendChild(postItemContainer);
  }
  
} catch (error) {
  console.error("Error loading SOMETHING:", error);
  alert("Error loading SOMETHING: " + error.message);
}
});

