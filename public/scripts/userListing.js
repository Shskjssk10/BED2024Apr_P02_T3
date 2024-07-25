document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }
  try {
    // Get all Listings
    const listingsResponse = await fetch("/listing", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    console.log("Response status:", listingsResponse.status);
    const listings = await listingsResponse.json();
    console.log("Listings received:", listings);
    if (!listingsResponse.ok) {
      throw new Error(listings.message || "Failed to load listings");
    }

    // Get all Organisations
    const organisationResponse = await fetch("/organisations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status:", organisationResponse.status);
    const organisations = await organisationResponse.json();
    console.log("organisations received:", organisations);
    if (!organisationResponse.ok) {
      throw new Error(organisations.message || "Failed to load organisations");
    }

    // Apending data into page
    const listingsContainer = document.querySelector(".userlistings");
    async function processListing(listing){
      const listingItem = document.createElement("a");
      listingItem.classList.add("no-underline");
      listingItem.href = "userviewlisting.html";
      const orgName =
        organisations.find((org) => org.AccID === listing.PostedBy)?.OrgName ?? null;
      let image = "";

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

      listingItem.innerHTML = `
          <div class="listings" id=${listing.ListingID}>
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
      listingsContainer.appendChild(listingItem);
    }
    function updateListings(listings){
      listingsContainer.innerHTML = ""; // Clear existing content

      const promises = listings.map(processListing); // Use the globally defined processListing
      Promise.all(promises).then(() => { // Wait for all promises to resolve
      let allListings = document.querySelectorAll(".no-underline");
      console.log("🚀 ~ updateListings ~ allListings:", allListings);
      allListings.forEach((listing) => {
        listing.addEventListener("click", (event) => {
            event.preventDefault();
            const clickedListing = event.currentTarget.querySelector('.listings'); 
            const listingId = parseInt(clickedListing.id, 10); 
            sessionStorage.removeItem("selectedListingID");
            sessionStorage.setItem("selectedListingID", listingId);
            window.location.href = "userviewlisting.html";
          });
        });
      });
    }
    
    updateListings(listings);

    const searchBar = document.querySelector(".search-bar");
    searchBar.addEventListener("input", async (event) => {
      const input = event.currentTarget.querySelector("input").value;
      // Get queried Listings
      const listingsQueriedResponse = await fetch(`/listing/${input}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response status:", listingsQueriedResponse.status);
      const queriedListing = await listingsQueriedResponse.json();
      console.log("Listings received:", queriedListing);
      if (!listingsQueriedResponse.ok) {
        throw new Error(queriedListing.message || "Failed to load listings");
      }
      updateListings(queriedListing);
    })
  } catch (error) {
    console.error("Error loading listings:", error);
    alert("Error loading listings: " + error.message);
  }
});
