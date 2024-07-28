document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
      alert("Please log in to access this page.");
      window.location.href = "../html/login.html";
      return;
  }
  const listingInformation = JSON.parse(sessionStorage.getItem("listingInformation"));
  try {
    const organisationID = sessionStorage.getItem("userID");
    console.log("🚀 ~ document.addEventListener ~ organisationID:", organisationID)
    const organisationResponse = await fetch(`/organisations/${organisationID}`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
    });
    console.log("Response status on ORGANISATION:", organisationResponse.status);
    const organisation = await organisationResponse.json();
    // console.log("Organisation received:", organisation);
    if (!organisationResponse.ok) {
        throw new Error(organisation.message || "Failed to load listing");
    }
    console.log(listingInformation);

    let account = "";
    try {
      const accountResponse = await fetch(`/organisations/${organisationID}`, {
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
    let profilePicture = await fetch(`/image/${organisation.MediaPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    profilePictureContainer.src = profilePicture.url;

    const listingHeaderSection = document.querySelector(".listing-header");
    const mainContentSection = document.querySelector(".main-content");
    const sideBarSection = document.querySelector(".sidebar");

    // Appending Listing Header Info
    listingHeaderSection.innerHTML = `
      <h1>${listingInformation.ListingName}</h1>
      <p class="organization">Organisation: ${organisation.OrgName}</p>
    `;

    // Appending Main Content Info

    const aboutPara = listingInformation.About.split("\n\n");
    const descriptionContainer = document.createElement("div");
    aboutPara.forEach((paragraph) =>{
      const paraContainer = document.createElement("p");
      paraContainer.innerHTML = paragraph;
      descriptionContainer.appendChild(paraContainer); 
    })
    
    const imagePlaceHolder = document.createElement("div");
    imagePlaceHolder.classList.add("image-placeholder");

    const buttonContainer = document.createElement("div");
    const imageContainer = document.createElement("img");
    image = await fetch(`/image/${listingInformation.MediaPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    imageContainer.src =  image.url;
    imagePlaceHolder.appendChild(imageContainer);
    buttonContainer.classList.add("button-container")
    buttonContainer.innerHTML = `
      <a href="organisationcreatelisting.html">
        <button class="nav-button">Back</button>
      </a>
      <a href="organisationlisting.html">
        <button id="create-buttonn" class="nav-button">Create</button>
      </a>
    `;

    mainContentSection.innerHTML = "";
    
    mainContentSection.appendChild(descriptionContainer);
    mainContentSection.appendChild(imagePlaceHolder);
    mainContentSection.appendChild(buttonContainer);

    // Appending Side Bar Info
    const causeAreaContainer = document.createElement("div");

    const causeAreaHeader = document.createElement("h2");
    causeAreaHeader.innerHTML = "Cause Areas:";
    causeAreaContainer.appendChild(causeAreaHeader);

    const buttons = listingInformation.CauseArea.replace(/\s+/g, '').split(",");
    let count = 0;
    buttons.forEach((button) => {
      const causeAreaButtonContainer = document.createElement("button");
      causeAreaButtonContainer.classList.add("cause-area");
      causeAreaButtonContainer.innerHTML = button;
      causeAreaContainer.appendChild(causeAreaButtonContainer);
      count += 1;
    })
    
    const todaysDate = new Date().toLocaleDateString('en-GB');

    const detailsContainer = document.createElement("div");
    detailsContainer.innerHTML = `
      <h2>Start Date</h2>
      <p>${listingInformation.StartDate}</p>
      <h2>End Date</h2>
      <p>${listingInformation.EndDate}</p>
      <h2>Where:</h2>
      <p>${listingInformation.Addr}</p>
      <h2>Date Posted:</h2>
      <p>${todaysDate}</p>
      <h2>Skills:</h2>
    `;

    const allSkills = listingInformation.Skill.split(",")
    count = 0;
    const skillContainer = document.createElement("ul")
    allSkills.forEach((skill) => {
      const indivSkillContainer = document.createElement("li");
      indivSkillContainer.innerHTML = skill;
      skillContainer.appendChild(indivSkillContainer);
      count += 1 
    })

    detailsContainer.appendChild(skillContainer);

    const requirementContainer = document.createElement("div");
    const requirementHeader = document.createElement("h2");
    requirementHeader.innerHTML = "Requirements:"

    const allRequirements = listingInformation.Requirement.split(",")
    const allRequirementContainer = document.createElement("ul");
    count = 0;
    allRequirements.forEach((requirement) => {
      requirement = requirement.replace(/\s+/g, '')
      const indivRequirementContainer = document.createElement("li")
      indivRequirementContainer.innerHTML = requirement;
      allRequirementContainer.appendChild(indivRequirementContainer);
    })

    requirementContainer.appendChild(requirementHeader);
    requirementContainer.appendChild(allRequirementContainer);

    detailsContainer.appendChild(requirementContainer);
    sideBarSection.innerHTML = "";
    sideBarSection.appendChild(causeAreaContainer);
    sideBarSection.appendChild(detailsContainer);

    const createButton = document.querySelector("#create-buttonn");
    console.log("🚀 ~ document.addEventListener ~ createButton:", createButton)
    createButton.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log(listingInformation.PostedBy);
      try {
        const postListing = {
          ListingName: listingInformation.ListingName,
          PostedBy: listingInformation.PostedBy,
          Addr: listingInformation.Addr,
          StartDate: listingInformation.StartDate,
          EndDate: listingInformation.EndDate,
          CauseArea: listingInformation.CauseArea,
          Skill: listingInformation.Skill,
          Requirements: listingInformation.Requirement,
          About: listingInformation.About,
          MediaPath: listingInformation.MediaPath
        };
        console.log(postListing);
        const postListingResponse = await fetch(`/listing`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postListing),
        });
        if (!postListingResponse.ok) {
          throw new Error("Failed to post listing");
        }
  
        const updatedData = await postListingResponse.json();
        console.log(updatedData);
        console.log("Listing posted:", updatedData);
      } catch (error) {
        console.error("Error in posted:", error);
      }
    })

  } catch (error) {
    console.error("Error loading SOMETHING:", error);
    alert("Error loading SOMETHING: " + error.message);
  }
});
