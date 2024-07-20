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
    const volunteerResponse = await fetch("http://localhost:8080/volunteerProfile/3", {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status on VOLUNTEER:", volunteerResponse.status);
    const volunteer = await volunteerResponse.json();
    // console.log("Volunteer received:", temp);
    if (!volunteerResponse.ok) {
      throw new Error(volunteer.message || "Failed to load volunteer");
    }
    // Get Organisations
    const organisationResponse = await fetch("http://localhost:8080/organisations", {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Response status on ORGANISATION:", organisationResponse.status);
  const organisations = await organisationResponse.json();
  if (!organisationResponse.ok) {
    throw new Error(organisations.message || "Failed to load organisation");
  }
  
  const profileHeaderSection = document.querySelector(".profile-header");
  const postSection = document.querySelector(".posts");
  const listingSection = document.querySelector(".listings-section");
  postSection.innerHTML = "";
  listingSection.innerHTML = "";
  // Appending Profile Data
    profileHeaderSection.innerHTML = `
      <img
        src="../images/profile-pic.png"
        alt="Profile Picture"
        class="profile-image"
      />
      <div class="profile-info">
        <h1>${volunteer.info.Username}</h1>
        <p>${volunteer.info.FName} ${volunteer.info.LName}</p>
        <p>${volunteer.info.Bio}</p>
        <div class="profile-stats">
          <span>${volunteer.followersAndFollowing.Followers} Followers</span> •
          <span>${volunteer.followersAndFollowing.Following} Following</span>
        </div>
        <button class="edit-button">Edit</button>
      </div>
    `;
    // Apending Posts Data
    const volunteerPosts = volunteer.posts;
    for (const post of volunteerPosts){
      const postContainer = document.createElement("div");
      postContainer.classList.add("post-item");

      const imageContainer = document.createElement("img");
      postContainer.textContent = imageContainer;

      postSection.appendChild(postContainer);
    }
    // Appending Sign Up Listings Data
    const signUpListings = volunteer.signUpListings;
    const savedListings = volunteer.savedListings;

    const signUpListingContainer = document.createElement("div");
    const savedListingContainer = document.createElement("div");
    signUpListingContainer.classList.add("listings");
    savedListingContainer.classList.add("listings");

    //Preparing Sign Up Listings
    for (const listing of signUpListings){
      const listingContainer = document.createElement("div");
      listingContainer.classList.add("listing-item");
      const orgName = organisations.find(org => org.id === listing.PostedBy)?.OrgName ?? null
      listingContainer.innerHTML = `
        <div class="listingimage"></div>
        <div class="listinginfobox">
          <p class="listingname">${listing.ListingName}</p>
          <p class="listinginfo">${orgName}</p>
          <p class="listinginfo">${listing.Addr}</p>
        </div>
      `;
      signUpListingContainer.appendChild(listingContainer);
    }

    // Preparing Saved Listings
    for (const listing of savedListings){
      const listingContainer = document.createElement("div");
      listingContainer.classList.add("listing-item");
      const orgName = organisations.find(org => org.id === listing.PostedBy)?.OrgName ?? null
      listingContainer.innerHTML = `
        <div class="listingimage"></div>
        <div class="listinginfobox">
          <p class="listingname">${listing.ListingName}</p>
          <p class="listinginfo">${orgName}</p>
          <p class="listinginfo">${listing.Addr}</p>
        </div>
      `;
      savedListingContainer.appendChild(listingContainer);
    }
    
    const signUpHeader = document.createElement("h2");
    signUpHeader.innerHTML = "Signed Up Listings"
    const savedListingHeader = document.createElement("h2");
    savedListingHeader.innerHTML = "Saved Listings";

    listingSection.appendChild(signUpHeader);
    listingSection.appendChild(signUpListingContainer);
    listingSection.appendChild(savedListingHeader);
    listingSection.appendChild(savedListingContainer);

  } catch (error) {
    console.error("Error loading SOMETHING:", error);
    alert("Error loading SOMETHING: " + error.message);
  }
})