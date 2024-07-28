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
    const currentAccountID = parseInt(localStorage.getItem("userID"));
    const volunteerResponse = await fetch(`/volunteerProfile/${currentAccountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status on VOLUNTEER:", volunteerResponse.status);
    const volunteer = await volunteerResponse.json();
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

    const profilePictureContainer = document.querySelector("#profile-picture");
    let pfp = await fetch(`/image/${volunteer.info.MediaPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    profilePictureContainer.src = pfp.url;
    
    const profileHeaderSection = document.querySelector(".profile-header");
    const postSection = document.querySelector(".posts");
    const listingSection = document.querySelector(".listings-section");
    postSection.innerHTML = "";
    listingSection.innerHTML = "";
    // Appending Profile Data
    let image = "";
    if (volunteer.info.MediaPath === null) {
      image = "/public/images/default-pfp.png";
    } else {
      try {
        image = await fetch(`/image/${volunteer.info.MediaPath}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        image = image.url;
      } catch (error) {
        console.error(error);
      }
    }

    const profilePicture = document.querySelector("#profile-picture");
    profilePicture.src = image;

    profileHeaderSection.innerHTML = `
      <img
        src="${image}"
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
      postContainer.id = post.PostID;
      image = await fetch(`/image/${post.MediaPath}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const imageContainer = document.createElement("img");
      imageContainer.src = image.url;
      postContainer.appendChild(imageContainer);
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
    async function processSignedUpListing(listing) {
      const listingContainer = document.createElement("a");
      listingContainer.classList.add("no-underline");
      listingContainer.href = "userviewlisting.html";
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
    async function processSavedListing(listing) {
      const listingContainer = document.createElement("a");
      listingContainer.classList.add("no-underline");
      listingContainer.href = "organisationprofile.html";
      const targetOrganisation = organisations.find(
        (org) => org.AccID === listing.PostedBy
      );
      let username = targetOrganisation.OrgName;
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
            <p class="listinginfo">${username}</p>
            <p class="listinginfo">${listing.Addr}</p>
          </div>
        </div>
      `;
      savedListingContainer.appendChild(listingContainer);
    }

    function updateListings(signUpListings, savedListings) {
      const promises =
        signUpListings.map(processSignedUpListing) &&
        savedListings.map(processSavedListing);
      Promise.all(promises).then(() => {
        let allListings = document.querySelectorAll(".no-underline");
        allListings.forEach((listing) => {
          listing.addEventListener("click", (event) => {
            event.preventDefault();
            const clickedListing =
              event.currentTarget.querySelector(".listing-item");
            const listingId = parseInt(clickedListing.id, 10);
            console.log(
              "🚀 ~ listing.addEventListener ~ listingId:",
              listingId
            );
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
