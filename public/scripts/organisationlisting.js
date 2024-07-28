document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "login.html";
  }

  try {
    const response = await fetch("/auth/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid or expired token");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    alert("Invalid or expired token. Please log in again.");
    window.location.href = "../html/login.html";
    return;
  }

  // fetch organisation details
  try {
    const orgId = sessionStorage.getItem("userID");
    if (!orgId) {
      throw new Error("Organisation ID not found");
    }
    const response = await fetch(`/organisation/details/${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response status:", response.status);
    const orgDetails = await response.json();
    if (!response.ok) {
      throw new Error(
        orgDetails.message || "Failed to load organisation details"
      );
    }

    const organisationResponse = await fetch(`/organisations/${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response status:", organisationResponse.status);
    const organisation = await organisationResponse.json();
    if (!organisationResponse.ok) {
      throw new Error(
        organisation.message || "Failed to load organisation details"
      );
    }

    let profilePicture = await fetch(`/image/${organisation.MediaPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const profilePictureContainer = document.querySelector("#profile-link");
    const profileImageContainer = document.querySelector("#profile-image");
    console.log("🚀 ~ document.addEventListener ~ profilePictureContainer:", profilePictureContainer)
    // profileImageContainer.src = profilePicture.url;
    // profilePictureContainer.src = profilePicture.url;

    document.getElementById("orgName").textContent = orgDetails.OrgName;
    document.getElementById("orgMission").textContent = orgDetails.Mission;
    document.getElementById(
      "listingCount"
    ).textContent = `${orgDetails.NumListings} Listings`;
    document.getElementById(
      "followerCount"
    ).textContent = `${orgDetails.NumFollowers} Followers`;
    document.getElementById(
      "followingCount"
    ).textContent = `${orgDetails.NumFollowing} Following`;
  } catch (error) {
    console.error("Error loading organisation details:", error);
    alert("Error loading organisation details: " + error.message);
  }

  // fetch listings from organisation logged in
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
    const noListingsMessage = document.getElementById("noListingsMessage");
    const template = document.getElementById("listingItemTemplate");

    if (listings.length === 0) {
      noListingsMessage.style.display = "block";
    } else {
      noListingsMessage.style.display = "none";

      listings.forEach(async (listing) => {
        let listingImage = await fetch(`/image/${listing.MediaPath}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const listingItem = template.cloneNode(true);
        listingItem.style.display = "flex";
        listingItem.id = "";
        listingItem.querySelector(".listing-image").src =
        listingImage.url ||
          "https://storage.gignite.ai/mediaengine/model1/41096b32-b087-493f-94f3-f13aa79d2526.png";
        listingItem.querySelector(".listing-name").textContent =
          listing.ListingName;
        listingItem.querySelector(".listing-info p").textContent = listing.Addr;
        listingsContainer.appendChild(listingItem);
      });
    }

    document.getElementById(
      "listingCount"
    ).textContent = `${listings.length} Listings`;
  } catch (error) {
    console.error("Error loading listings:", error);
    alert("Error loading listings: " + error.message);
  }
});
