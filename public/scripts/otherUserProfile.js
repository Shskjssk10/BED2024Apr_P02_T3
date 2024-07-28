document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);
  if (!token) {
    window.location.href = "../html/login.html";
    alert("Please log in to access this page.");
    return;
  }
  try {
    const currentAccountID = sessionStorage.getItem("viewAccID");
    // Get Current Account
    const volunteerResponse = await fetch(`/volunteerProfile/${currentAccountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status on VOLUNTEER:", volunteerResponse.status);
    const volunteer = await volunteerResponse.json();
    console.log("🚀 ~ document.addEventListener ~ volunteer:", volunteer)
    // console.log("Volunteer received:", temp);
    if (!volunteerResponse.ok) {
      throw new Error(volunteer.message || "Failed to load volunteer");
    }
    // Get all Accounts
    const accountsResponse = await fetch(`/userFeedPage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status on ALL ACCOUNTS:", accountsResponse.status);
    let allAccounts = await accountsResponse.json();
    console.log(allAccounts);
    if (!accountsResponse.ok) {
      throw new Error(allAccounts.message || "Failed to load Accounts");
    }


    const profileSection = document.querySelector(".profile-header");
    const listingSection = document.querySelector(".listing-section");
    const postSection = document.querySelector(".posts");

    listingSection.innerHTML = "";
    postSection.innerHTML = "";
    let image = "";
    try {
      image = await fetch(`/image/${volunteer.info.MediaPath}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }

    const profilePicture = document.querySelector("#profile-link");
    profilePicture.src = image.url;

    profileSection.innerHTML = `
      <img
        src="${image.url}"
        alt="Profile Image"
        class="profile-image"
      />
      <div class="profile-info">
        <h1>${volunteer.info.Username}</h1>
        <p>
          ${volunteer.info.Bio}
        </p>
        <div class="profile-stats">
          <span>${volunteer.followersAndFollowing.Followers} Followers</span>
          <span>${volunteer.followersAndFollowing.Following} Following</span>
        </div>
      </div>
    `;

    const postModalContainer = document.querySelector(".post-modal-container");
    postModalContainer.innerHTML = "";
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

      //Appending Post Modal data
      const indivPostModalContainer = document.createElement("div");
      indivPostModalContainer.classList.add(`modal`);
      indivPostModalContainer.id = `modal${post.PostID}`;
      let pfp = "";
      pfp = await fetch(`/image/${volunteer.info.MediaPath}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      indivPostModalContainer.innerHTML = `
        <div class="modal-content">
          <div class="modal-body">
            <div class="modal-left">
              <a href="" class="no-underline">
                <div class="modal-header">
                  <img
                    src="${pfp.url}"
                    alt="Profile Picture"
                    class="profile-pic"
                  />
                  <span class="username">${volunteer.info.OrgName}</span>
                </div>
              </a>
              <img
                src="${pfp.url}"
                alt="Post Image"
                class="modal-image"
              />
            </div>
            <div class="modal-right">
              <div class="comments-container">
                <div class="comments" data-comment-container=${post.PostID}>
                </div>
              </div>
              <hr />
              <div class="comment-form">
                <input
                  type="text"
                  id="commentInput-${post.PostID}"
                  placeholder="Add a comment..."
                  required
                />
                <button class="post-button" id=${post.PostID}>Post</button>
              </div>
            </div>
          </div>
        </div>
      `;
      postModalContainer.appendChild(indivPostModalContainer);

      const commentContainer = document.querySelector(`.comments[data-comment-container="${post.PostID}"]`);
      // Get all comments
      let commentResponse = await fetch(`/comment/${post.PostID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let allComments = await commentResponse.json();
      if (allComments.length === 0){
        commentContainer.innerHTML = "There are no comments for this post. Be the first to comment!";
      }  
      else {
        allComments.forEach(async (comment) => {
          let targetAccount = allAccounts.find(account => account.AccID === comment.AccID);     
          const indivCommentContainer = document.createElement("div");
          const username = targetAccount.Username;
          indivCommentContainer.classList.add("comment");
          if (targetAccount.Username === undefined){
            if (targetAccount.MediaPath === null){
              pfp = "/public/images/default-pfp.png"
            } else {
              pfp = await fetch(`/image/${targetAccount.MediaPath}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              pfp = pfp.url
            }
            indivCommentContainer.innerHTML = `
              <img
                src="${pfp}"
                alt="User1"
                class="profile-pic small"
              />
              <p><strong>${targetAccount.OrgName}:</strong> ${comment.Comment}</p>
            `;
          }
          else {
            if (targetAccount.MediaPath === null){
              pfp = "/public/images/default-pfp.png"
            } else {
              pfp = await fetch(`/image/${targetAccount.MediaPath}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              pfp = pfp.url;
            }
            indivCommentContainer.innerHTML = `
              <img
                src="${pfp}"
                alt="User1"
                class="profile-pic small"
              />
              <p><strong>${username}:</strong> ${comment.Comment}</p>
            `;
          }
          commentContainer.appendChild(indivCommentContainer);
        })
      }
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
        allAccounts.find((org) => org.AccID === listing.PostedBy).OrgName;
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
      const targetOrganisation = allAccounts.find((org) => org.AccID === listing.PostedBy);
      let username = targetOrganisation.OrgName
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
    // Linking listings
    const listings = document.querySelectorAll(".no-underline");
    listings.forEach((listing) => {
      listing.addEventListener("click", (event) => {
        event.preventDefault();
        sessionStorage.removeItem("selectedListingID");
        sessionStorage.setItem("selectedListingID", listing.id);
        window.location.href = "userviewlisting.html";
      })
    })
    // Get all modal
    const modalContainer = document.querySelectorAll(".modal");
    modalContainer.forEach((container) => {
      container.addEventListener("click", (event) => {
        const id = `#${container.id}`;
        closeModal(id);
      })
    })
    const allPost = document.querySelectorAll(".post-item");
    allPost.forEach((post) => {
      post.addEventListener("click", (event) => {
        const currentPostID = post.id;
        openModal(`#modal${currentPostID}`);
      }) 
    })
    const allPostComment = document.querySelectorAll(".post-button")
    allPostComment.forEach((button)=> {
      button.addEventListener("click", async (event) => {
        const postButtonID = event.target.id;
        const userComment = document.querySelector(`#commentInput-${postButtonID}`).value;
        const postComment = {
          AccID : currentAccountID,
          PostID: postButtonID,
          Comment: userComment
        };
        console.log(postComment);
        const postCommentResponse = await fetch(`/userFeedPage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postComment),
        });
        let newComment = document.createElement("div");
        newComment.className = "comment";
        targetAccount = allAccounts.find(account => account.AccID === currentAccID);
        pfp = await fetch(`/userFeedPage`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        newComment.innerHTML =
          `<img src="${pfp.url}" alt="${currentUsername}" class="profile-pic small" /><p><strong>You:</strong>` +
          userComment +
          "</p>";

        var commentsSection = document.querySelector(`.comments[data-comment-container="${post.PostID}"`);
        commentsSection.appendChild(newComment);
      })
    });
    function openModal(postId) {
      document.querySelector(postId).style.display = "block";
      var posts = document.querySelectorAll(".post-content");
      for (var i = 0; i < posts.length; i++) {
        posts[i].style.display = "none";
      }
    }
    function closeModal(id) {
      const modal = document.querySelector(id);
      if (modal) {
        // Check if the click is NOT on the comment form
        if (!event.target.closest('.comment-form')) { 
          modal.style.display = "none";
        }
      }
    } 
  } catch (error) {
    console.error("Error loading SOMETHING:", error);
    alert("Error loading SOMETHING: " + error.message);
  }
});
