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
        const listingsResponse = await fetch("http://localhost:8080/listing/byListingID/2", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        console.log("Response status:", listingsResponse.status);
        const temp = await listingsResponse.json();
        console.log("Listings received:", temp);
        if (!listingsResponse.ok) {
            throw new Error(temp.message || "Failed to load listing");
        }
        const listing = temp[0];

        // Get Associated Organisation
        const organisationResponse = await fetch(`http://localhost:8080/organisations/${listing.PostedBy}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        console.log("Response status:", organisationResponse.status);
        const organisation = await organisationResponse.json();
        console.log("Listings received:", organisation);
        if (!organisationResponse.ok) {
            throw new Error(organisation.message || "Failed to load listing");
        }

        const listingHeader = document.querySelector(".listing-header");
        const descriptionContainer = document.querySelector(".main-content");
        const sideBarContainer = document.querySelector(".sidebar");

        console.log(listing.ListingName);
        console.log(organisation);
        console.log(organisation.orgName);

        listingHeader.innerHTML = `
            <h1>${listing.ListingName}</h1>
            <p class="organization">Organisation: ${organisation.OrgName}</p>
        `; 
        descriptionContainer.innerHTML = "";
        sideBarContainer.innerHTML = "";
    } catch (error) {
        console.error("Error loading listings:", error);
        alert("Error loading listings: " + error.message);
    }
})