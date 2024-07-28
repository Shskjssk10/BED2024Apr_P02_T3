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
    // Get Organisation Details
    const organisationResponse = await fetch(`/organisationProfile/${currentAccountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      "Response status on ORGANISATION:",
      organisationResponse.status
    );
    const organisation = await organisationResponse.json();
    if (!organisationResponse.ok) {
      throw new Error(organisation.message || "Failed to load organisation");
    }


    const profileSection = document.querySelector(".profile-header");
    const listingSecetion = document.querySelector(".listings-section");
    const postSection = document.querySelector(".posts");

    listingSecetion.innerHTML = "";
    postSection.innerHTML = "";
    let image = "";
    try {
      image = await fetch(`/image/${organisation.info.MediaPath}`, {
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
        <h1>${organisation.info.OrgName}</h1>
        <p>
          ${organisation.info.Mission}
        </p>
        <div class="profile-stats">
          <span>${organisation.listings.length} Listings</span>
          <span>${organisation.followersAndFollowing.Followers} Followers</span>
          <span>${organisation.followersAndFollowing.Following} Following</span>
        </div>
      </div>
    `;

    // Apending Listings Data
    const listingsContainer = document.createElement("div");
    listingsContainer.classList.add("listings");
    
    const allListings = organisation.listings;
    for (const listing of allListings) {
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
      const indivListingContainer = document.createElement("a");
      indivListingContainer.classList.add("no-underline");
      indivListingContainer.href = "userviewlisting.html"
      indivListingContainer.id = listing.ListingID;
      indivListingContainer.innerHTML = `
        <div class="listing-item">
          <div class="listingimage">
            <img src="${image.url}">
          </div>
          <div class="listinginfobox">
            <p class="listingname">${listing.ListingName}</p>
            <p class="listinginfo">${organisation.info.OrgName}</p>
            <p class="listinginfo">${listing.Addr}</p>
          </div>
        </div>
    `;
    listingsContainer.appendChild(indivListingContainer);
    }

    const listingHeader = document.createElement("h2");
    listingHeader.innerHTML = "Listings";
    const listingSubHeader = document.createElement("p");
    listingSubHeader.innerHTML = "Your most recent Listings:";
    const listingFooter = document.createElement("div");
    listingFooter.classList.add("listings-footer");


    listingSecetion.appendChild(listingHeader);
    listingSecetion.appendChild(listingSubHeader);
    listingSecetion.appendChild(listingsContainer);

    // Posts Data
    const allPosts = organisation.posts;
    const postModalContainer = document.querySelector(".post-modal-container");
    postModalContainer.innerHTML = "";
    for (const post of allPosts) {
      // Appending Post data to page
      const postItemContainer = document.createElement("div");
      postItemContainer.classList.add("post-item");
      postItemContainer.id = `${post.PostID}`;
      let MediaPath = post.MediaPath;
      image = await fetch(`/image/${MediaPath}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      postItemContainer.innerHTML = `
        <img src="${image.url}">
      `;
      postSection.appendChild(postItemContainer);

      //Appending Post Modal data
      const indivPostModalContainer = document.createElement("div");
      indivPostModalContainer.classList.add(`modal`);
      indivPostModalContainer.id = `modal${post.PostID}`;
      let pfp = "";
      pfp = await fetch(`/image/${organisation.info.MediaPath}`, {
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
                  <span class="username">${organisation.info.OrgName}</span>
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
        console.log("🚀 ~ post.addEventListener ~ currentPostID:", currentPostID)
        openModal(`#modal${currentPostID}`);
      }) 
    })
    const allPostComment = document.querySelectorAll(".post-button")
    allPostComment.forEach((button)=> {
      button.addEventListener("click", async (event) => {
        const postButtonID = event.target.id;
        const userComment = document.querySelector(`#commentInput-${postButtonID}`).value;
        const postComment = {
          AccID : currentAccID,
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
        console.log("🚀 ~ button.addEventListener ~ postCommentResponse:", postCommentResponse)
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
