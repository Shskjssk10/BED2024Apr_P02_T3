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
        const listingsResponse = await fetch("http://localhost:8080/listing", {
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
        const organisationResponse = await fetch("http://localhost:8080/organisations", {
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
        listingsContainer.innerHTML = ""; // Clear existing content

        listings.forEach((listing) => {
            const listingItem = document.createElement("div");
            listingItem.classList.add("listings");
            const orgName = organisations.find(org => org.id === listing.PostedBy)?.OrgName ?? null
            listingItem.innerHTML = `
            <div class="listingimage"></div>
            <div class="listinginfobox">
                <p class="listingname">${listing.ListingName}</p>
                <p class="listinginfo">${orgName}</p>
                <p class="listinginfo">${listing.Addr}</p>
            </div>
            `;
            listingsContainer.appendChild(listingItem);
        });

        document.getElementById(
            "listingCount"
        ).textContent = `${listings.length} Listings`;
    } catch (error) {
        console.error("Error loading listings:", error);
        alert("Error loading listings: " + error.message);
    }
})