document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);
  if (!token) {
    alert("Please log in to access this page.");
    window.location.href = "../html/login.html";
    return;
  }
  try {
    const currentAccID = parseInt(localStorage.getItem("userID"));

    // Get all posts from followed acounts
    const postResponse = await fetch(`/followedPost/${currentAccID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status on POST:", postResponse.status);
    let allPost = await postResponse.json();
    console.log(allPost);
    if (!postResponse.ok) {
      throw new Error(allPost.message || "Failed to load Posts");
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

    let currentAcc = allAccounts.find(account => account.AccID === parseInt(currentAccID));
    let currentUsername = "";
    if (currentAcc.Username === undefined){
      currentUsername = currentAcc.OrgName;
    } else {
      currentUsername = currentAcc.Username;
    }

    let account = "";
    try {
      const accountResponse = await fetch(`/organisations/${currentAccID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response status on VOLUNTEER:", accountResponse.status);
      account = await accountResponse.json();
    } catch (error) {
      console.error(error);
    }
  
    const profilePictureContainer = document.querySelector("#profile-link");
    console.log("🚀 ~ document.addEventListener ~ profilePictureContainer:", profilePictureContainer)
    let profilePicture = await fetch(`/image/${account.MediaPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    profilePictureContainer.src = profilePicture.url;

    const feedContainer = document.querySelector(".feed-container");
    const postModalContainer = document.querySelector(".post-modal-container");
    feedContainer.innerHTML = "";
    postModalContainer.innerHTML = "";
    for (targetPost of allPost){
      // Creation of post in Main 
      const postContainer = document.createElement("div");
      let targetAccount = allAccounts.find(account => account.AccID === targetPost.PostedBy);
      postContainer.classList.add("post");
      let pfp = await fetch(`/image/${targetAccount.MediaPath}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // let postImage = await fetch(`/image/${post.MediaPath}`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      let noOfLikesResponse = await fetch(`/likes/${targetPost.PostID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let likes = await noOfLikesResponse.json();
      postContainer.innerHTML = `
        <a href="" class="no-underline">
          <div class="post-header">
            <img
              src="${pfp.url}"
              alt="Profile Picture"
              class="profile-pic"
            />
            <span class="username">${targetAccount.Username}</span>
          </div>
        </a>
        <img
          src="${pfp.url}"
          alt="Post Image"
          class="post-image"
        />
        <div class="post-footer">
          <div class="post-actions">
            <label id="${targetPost.PostID}" class="container like-button">
              <input type="checkbox" />
              <svg class="checkmark" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="#000"
                  fill="none"
                />
              </svg>
            </label>
            <img
              src="../images/comment.png"
              alt="comment"
              class="icon comment-btn"
              id=${targetPost.PostID}
            />
          </div>
          <span class="likes">${likes.NoOfLikes} Likes</span>
          <p class="caption">
            ${targetPost.Caption}
          </p>
        </div>
      `;
      feedContainer.appendChild(postContainer);

      // Creation of post in modal container
      const indivPostModalContainer = document.createElement("div");
      indivPostModalContainer.classList.add("modal");
      indivPostModalContainer.id = `modal${targetPost.PostID}`;
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
                  <span class="username">${targetAccount.Username}</span>
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
                <div class="comments" data-comment-container=${targetPost.PostID}>
                </div>
              </div>
              <hr />
              <div class="comment-form">
                <input
                  type="text"
                  id="commentInput-${targetPost.PostID}"
                  placeholder="Add a comment..."
                  required
                />
                <button class="post-button" id=${targetPost.PostID}>Post</button>
              </div>
            </div>
          </div>
        </div>
      `;
      postModalContainer.appendChild(indivPostModalContainer);

      const commentContainer = document.querySelector(`.comments[data-comment-container="${targetPost.PostID}"]`);
      // Get all comments
      let commentResponse = await fetch(`/comment/${targetPost.PostID}`, {
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
          targetAccount = allAccounts.find(account => account.AccID === comment.AccID);     
          const indivCommentContainer = document.createElement("div");
          const username = targetAccount.Username;
          indivCommentContainer.classList.add("comment");
          if (targetAccount.Username === undefined){
            pfp = await fetch(`/image/${targetAccount.MediaPath}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            indivCommentContainer.innerHTML = `
              <img
                src="${pfp.url}"
                alt="User1"
                class="profile-pic small"
              />
              <p><strong>${targetAccount.OrgName}:</strong> ${comment.Comment}</p>
            `;
          }
          else {
            let pfp = await fetch(`/image/${targetAccount.MediaPath}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            indivCommentContainer.innerHTML = `
              <img
                src="${pfp.url}"
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
    // Get all modal
    const modalContainer = document.querySelectorAll(".modal");
    modalContainer.forEach((container) => {
      container.addEventListener("click", (event) => {
        const id = `#${container.id}`;
        closeModal(id);
      })
    })
    const allCommentButton = document.querySelectorAll(".comment-btn");
    allCommentButton.forEach((commentButton) => {
      commentButton.addEventListener("click", (event) => {
        const currentPostID = event.target.id;
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

        var commentsSection = document.querySelector(`.comments[data-comment-container="${targetPost.PostID}"`);
        commentsSection.appendChild(newComment);
      })
    })
    const allLikeButtons = document.querySelectorAll(".like-button");
    allLikeButtons.forEach((likeButton) => {
      likeButton.addEventListener("click", async (event) => {
        const postLike = {
          AccID : currentAccID,
          PostID: likeButton.id
        };
        const postCommentResponse = await fetch(`/likes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postLike),
        });
      })
    })

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
    console.error(error);
  }
});