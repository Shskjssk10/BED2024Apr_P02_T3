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
    //change the 3 cannot hard code
    const currentAccountID = parseInt(localStorage.getItem("userID"));
    const volunteerResponse = await fetch(`/volunteerProfile/${currentAccountID}`, {
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
    const organisationResponse = await fetch("/organisations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      "Response status on ORGANISATION:",
      organisationResponse.status
    );
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
    let image = "";
    try {
      image = await fetch(`/image/${currentAccountID.MediaPath}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
    profileHeaderSection.innerHTML = `
      <img
        src="${image.url}"
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
        <a href="userprofilemgmt.html">
          <button class="edit-button">Edit</button>
        </a>
      </div>
    `;
    // Apending Posts Data
    const volunteerPosts = volunteer.posts;
    for (const post of volunteerPosts) {
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
    async function processSignedUpListing(listing){
      const listingContainer = document.createElement("a");
      listingContainer.classList.add("no-underline");
      listingContainer.href="userviewlisting.html";
      const orgName =
        organisations.find((org) => org.id === listing.PostedBy)?.OrgName ??
        null;
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
      listingContainer.innerHTML = `
        <div id=${listing.ListingID} class="listing-item">
          <div class="listingimage">
            <img src="${image.url}">
          </div>
          <div class="listinginfobox">
            <p class="listingname">${listing.ListingName}</p>
            <p class="listinginfo">${orgName}</p>
            <p class="listinginfo">${listing.Addr}</p>
          </div>
        </div>
      `;
      signUpListingContainer.appendChild(listingContainer);
    }
    // Preparing Saved Listings
    async function processSavedListing(listing){
      const listingContainer = document.createElement("a");
      listingContainer.classList.add("no-underline");
      listingContainer.href="organisationprofile.html";
      const orgName =
        organisations.find((org) => org.id === listing.PostedBy)?.OrgName ??
        null;
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
      listingContainer.innerHTML = `
        <div id=${listing.ListingID} class="listing-item">
          <div class="listingimage">
            <img src="${image.url}">
          </div>
          <div class="listinginfobox">
            <p class="listingname">${listing.ListingName}</p>
            <p class="listinginfo">${orgName}</p>
            <p class="listinginfo">${listing.Addr}</p>
          </div>
        </div>
      `;
      savedListingContainer.appendChild(listingContainer);
    }

    function updateListings(signUpListings, savedListings){
      const promises = signUpListings.map(processSignedUpListing) && savedListings.map(processSavedListing);
      Promise.all(promises).then(() => {
        let allListings = document.querySelectorAll(".no-underline");
        allListings.forEach((listing) => {
          listing.addEventListener("click", (event) => {
              event.preventDefault();
              const clickedListing = event.currentTarget.querySelector('.listing-item'); 
              const listingId = parseInt(clickedListing.id, 10); 
              console.log("🚀 ~ listing.addEventListener ~ listingId:", listingId)
              sessionStorage.removeItem("selectedListingID");
              sessionStorage.setItem("selectedListingID", listingId);
              window.location.href = "userviewlisting.html";
          });
        });
      });
    }
    updateListings(signUpListings, savedListings);

    const signUpHeader = document.createElement("h2");
    signUpHeader.innerHTML = "Signed Up Listings";
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
});
