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
    const listingsResponse = await fetch("/listing/byListingID/2", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status on LISTING:", listingsResponse.status);
    const temp = await listingsResponse.json();
    // console.log("Listings received:", temp);
    if (!listingsResponse.ok) {
      throw new Error(temp.message || "Failed to load listing");
    }
    const listing = temp[0];

    // Get Associated Organisation
    const organisationResponse = await fetch(
      `/organisations/${listing.PostedBy}`,
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
      `/listing/byOrgId/${organisation.id}`,
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
    // Get More Related Listings
    const organisationsResponse = await fetch(`/organisations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      "Response status on ALL ORGANISATIONS:",
      organisationsResponse.status
    );
    const organisations = await organisationsResponse.json();
    // console.log("Related Listing received:", relatedListing);
    if (!organisationsResponse.ok) {
      throw new Error(
        organisations.message || "Failed to load related organisations"
      );
    }

    const listingHeader = document.querySelector(".listing-header");
    const mainContentContainer = document.querySelector(".main-content");
    const sideBarContainer = document.querySelector(".sidebar");
    // Apending listingHeader content
    listingHeader.innerHTML = `
            <h1>${listing.ListingName}</h1>
            <p class="organization">Organisation: ${organisation.OrgName}</p>
        `;
    // Appending main content
    mainContentContainer.innerHTML = `
      <h2>Description:</h2>
      <p>${currentListing.About}</p>
      <div class="image-placeholder">
        <img src="${image.url}">
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
    for (const relListing of relatedListing) {
      if (relListing.ListingID !== listing.ListingID) {
        const listingItem = document.createElement("div");
        listingItem.classList.add("listing-item");
        const orgName =
          organisations.find((org) => org.id === listing.PostedBy)?.OrgName ??
          null;
        listingItem.innerHTML = `
                <div class="listingimage"></div>
                <div class="listinginfobox">
                    <p class="listingname">${listing.ListingName}</p>
                    <p class="listinginfo">${orgName}</p>
                    <p class="listinginfo">${listing.Addr}</p>
                </div>
                `;
        listingsContainer.appendChild(listingItem);
      }
    }
    if (listingsContainer.innerHTML === "") {
      listingsContainer.innerHTML = "Please wait for more opportunities!!! :D";
    }

    // Prepare cause area buttons
    const causeAreas = listing.CauseArea;
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
            <button class="cause-area">${listing.CauseArea}</button>
            <h2>When:</h2>
            <p>${listing.StartDate} - ${listing.EndDate}</p>
            <h2>Where:</h2>
            <p>${listing.Addr}</p>
            <h2>Skills:</h2>
            <p>${listing.Skill}</p>
            <h2>Looking for:</h2>
            <p>${listing.Requirements}</p>
        `;
  } catch (error) {
    console.error("Error loading listings:", error);
    alert("Error loading listings: " + error.message);
  }
});
