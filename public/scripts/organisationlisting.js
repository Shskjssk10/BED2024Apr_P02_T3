document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }

  try {
    const response = await fetch("/auth/listings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);

    const listings = await response.json();
    console.log("Listings received:", listings);

    if (!response.ok) {
      throw new Error(listings.message || "Failed to load listings");
    }

    const listingsContainer = document.getElementById("listingsContainer");
    listingsContainer.innerHTML = ""; // Clear existing content

    listings.forEach((listing) => {
      const listingItem = document.createElement("div");
      listingItem.classList.add("listing-item");
      listingItem.innerHTML = `
          <div class="listingimage">
            <div class="placeholder-image"></div>
          </div>
          <div class="listinginfobox">
            <p class="listingname">${listing.ListingName}</p>
            <p class="listinginfo">${listing.Addr}</p>
            <p class="listinginfo">${listing.CauseArea}</p>
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
});
