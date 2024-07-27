document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);
  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }

  try {
    // Get Listing Details
    const listingID = sessionStorage.getItem("selectedListingID");
    const currentAccID = localStorage.getItem("userID");
    const listingsResponse = await fetch(`/listing/byListingID/${listingID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status on LISTING:", listingsResponse.status);
    let currentListing = await listingsResponse.json();
    if (!listingsResponse.ok) {
      throw new Error(currentListing.message || "Failed to load listing");
    }
    currentListing = currentListing[0];

    // Get Associated Organisation
    const organisationResponse = await fetch(
      `/organisations/${currentListing.PostedBy}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "Response status on ORGANISATION:",
      organisationResponse.status
    );
    const organisation = await organisationResponse.json();
    // console.log("Organisation received:", organisation);
    if (!organisationResponse.ok) {
      throw new Error(organisation.message || "Failed to load listing");
    }

    // Get More Related Listings
    const relatedListingsResponse = await fetch(
      `/listing/byOrgId/${organisation.AccID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "Response status on RELATED LISTING:",
      relatedListingsResponse.status
    );
    const relatedListing = await relatedListingsResponse.json();
    // console.log("Related Listing received:", relatedListing);
    if (!relatedListingsResponse.ok) {
      throw new Error(
        relatedListing.message || "Failed to load related listing"
      );
    }

    let applyButtonHTML = "Unapply";
    // Applied or Not 
    const appliedResponse = await fetch(
      `/signUp/${currentAccID}/${currentListing.ListingID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response status on applied:",appliedResponse.status);
    const appliedRes = await appliedResponse.json();
    // console.log("Related Listing received:", relatedListing);
    if (!appliedResponse.ok) {
      throw new Error(
        appliedRes.message || "Failed to load related listing"
      );
    }
    if (appliedRes.length === 0){
      applyButtonHTML = "Apply";
    }

    let savedButtonHTML = "Unsave";
    // Saved or not
    const savedResponse = await fetch(
      `/savedListing/${currentAccID}/${currentListing.ListingID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response status on applied:",savedResponse.status);
    const savedRes = await savedResponse.json();
    // console.log("Related Listing received:", relatedListing);
    if (!savedResponse.ok) {
      throw new Error(
        savedRes.message || "Failed to load related listing"
      );
    }
    console.log("🚀 ~ document.addEventListener ~ savedRes:", savedRes)
    if (savedRes.length === 0){
      savedButtonHTML = "Save";
    }

    const listingHeader = document.querySelector(".listing-header");
    const mainContentContainer = document.querySelector(".main-content");
    const sideBarContainer = document.querySelector(".sidebar");
    // Apending listingHeader content
    listingHeader.innerHTML = `
      <h1>${currentListing.ListingName}</h1>
      <p class="organization">Organisation: ${organisation.OrgName}</p>
    `;
    // Appending main content
    let image = "";
    try {
      image = await fetch(`/image/${currentListing.MediaPath}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
    mainContentContainer.innerHTML = `
      <h2>Description:</h2>
      <p>${currentListing.About}</p>
      <div class="image-placeholder">
        <img>
      </div>
      <div class="applybookmark">
        <a href="userlisting.html">
          <button class="apply-button">Back</button>
        </a>
        <button id="apply-button" class="apply-button">${applyButtonHTML}</button>
        <button id="saved-button" class="apply-button">${savedButtonHTML}</button>
      </div>
      <h3>Other opportunities with EcoVolunteers</h3>
      <div class="other-listings"></div>
      <h3>More about EcoVolunteers:</h3>
      <p>Location: ${organisation.Addr}</p>
      <p>
      Description: ${organisation.Mission}
      </p>
  `;
    // Adding Related Listings
    const listingsContainer = document.querySelector(".other-listings");

    async function processListing(listing){
      const listingItem = document.createElement("a");
        listingItem.classList.add("no-underline");
        listingItem.href="userviewlisting.html";
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
        console.log(image);
        listingItem.innerHTML = `
          <div id="${listing.ListingID}" class="listing-item">
            <div class="listingimage">
              <img src="${image.url}">
            </div>
            <div class="listinginfobox">
              <p class="listingname">${listing.ListingName}</p>
              <p class="listinginfo">${organisation.OrgName}</p>
              <p class="listinginfo">${listing.Addr}</p>
            </div>
            </div>
            `;
        listingsContainer.appendChild(listingItem);
    }
    function updateListing(relatedListing){
      relatedListing = relatedListing.filter(listing => listing.ListingID !== currentListing.ListingID);
      const promises = relatedListing.map(processListing);
      Promise.all(promises).then(() => {
      let allListings = document.querySelectorAll(".no-underline");
      allListings.forEach((listing) => {
        listing.addEventListener("click", (event) => {
            event.preventDefault();
            const clickedListing = event.currentTarget.querySelector('.listing-item'); 
            const listingId = parseInt(clickedListing.id, 10); 
            sessionStorage.removeItem("selectedListingID");
            sessionStorage.setItem("selectedListingID", listingId);
            window.location.href = "userviewlisting.html";
          });
        });
      });
    }
    updateListing(relatedListing);

    // Prepare cause area buttons
    const causeAreas = currentListing.CauseArea;
    // const listOfCauseAreas = causeAreas.split(",");
    // const causeAreaDisplay = "";
    // listOfCauseAreas.foreach((causeArea) => {
    //     const causeAreaButton = document.createElement("button");
    //     causeAreaButton.classList.add("cause-area");
    //     causeAreaButton.textContent = causeArea;
    //     causeAreaDisplay += causeAreaButton.outerHTML;
    // })

    sideBarContainer.innerHTML = `
      <h2>Cause Areas:</h2>
      <button class="cause-area">${currentListing.CauseArea}</button>
      <h2>When:</h2>
      <p>${currentListing.StartDate} - ${currentListing.EndDate}</p>
      <h2>Where:</h2>
      <p>${currentListing.Addr}</p>
      <h2>Skills:</h2>
      <p>${currentListing.Skill}</p>
      <h2>Looking for:</h2>
      <p>${currentListing.Requirements}</p>
    `;

    const applyButton = document.querySelector("#apply-button");
    applyButton.addEventListener("click", async (event) => {
      if (applyButton.innerHTML === "Apply"){
        const postSignUp = {
          "AccID" : currentAccID,
          "ListingID" : currentListing.ListingID
        };
        const postSignUpResponse = await fetch(`/signUp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postSignUp),
        });
        applyButton.innerHTML = "Unapply";
        if (!postSignUpResponse.ok) {
          throw new Error("Failed to post Sign Up");
        }
        const updatedData = await postSignUpResponse.json();
        console.log(updatedData);
        console.log("Follow posted:", updatedData);
      }
      else {
        const deleteSignUp = {
          "AccID": currentAccID,
          "ListingID": currentListing.ListingID,
        };
        const deleteSignUpResponse = await fetch(`/signUp`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(deleteSignUp),
        });
        applyButton.innerHTML = "Apply";
        if (!deleteSignUpResponse.ok) {
          throw new Error("Failed to post sign up");
        }
      }
    })

    const savedButton = document.querySelector("#saved-button");
    savedButton.addEventListener("click", async (event) => {
      if (savedButton.innerHTML === "Save"){
        const postSave = {
          "AccID" : currentAccID,
          "ListingID" : currentListing.ListingID
        };
        const postSaveResponse = await fetch(`/savedListing`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postSave),
        });
        savedButton.innerHTML = "Unsave";
        if (!postSaveResponse.ok) {
          throw new Error("Failed to post Sign Up");
        }
        const updatedData = await postSaveResponse.json();
        console.log(updatedData);
        console.log("Follow posted:", updatedData);
      }
      else {
        const deleteSaved = {
          "AccID": currentAccID,
          "ListingID": currentListing.ListingID,
        };
        const deleteSavedResponse = await fetch(`/savedListing`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(deleteSaved),
        });
        savedButton.innerHTML = "Save";
        if (!deleteSavedResponse.ok) {
          throw new Error("Failed to post sign up");
        }
      }
    })
  } catch (error) {
    console.error("Error loading listings:", error);
    alert("Error loading listings: " + error.message);
  }
});
