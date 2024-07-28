document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved token:", token);

  if (!token) {
      alert("Please log in to access this page.");
      window.location.href = "../html/login.html";
      return;
  }

  const currentAccountID = parseInt(localStorage.getItem("userID"));
  const listingInformation = JSON.parse(sessionStorage.getItem("listingInformation"));
  let listingNameInput = document.querySelector("#listing-name").value;
  let addrInput = document.querySelector("#address").value;
  let startDateInput = document.querySelector("#start-date").value;
  let endDateInput = document.querySelector("#end-date").value;    
  let causeAreaInput = document.querySelector("#cause-areas").value;
  let skillsInput = document.querySelector("#skills").value;
  let requirementsInput = document.querySelector("#requirements").value;
  let aboutInput = document.querySelector("#description").value;
  if (listingInformation){
    document.querySelector("#listing-name").value = listingInformation.ListingName || "";
    document.querySelector("#address").value = listingInformation.Addr
    document.querySelector("#start-date").value = listingInformation.StartDate
    document.querySelector("#end-date").value = listingInformation.EndDate
    document.querySelector("#cause-areas").value = listingInformation.CauseArea
    document.querySelector("#skills").value = listingInformation.Skill
    document.querySelector("#requirements").value = listingInformation.Requirement
    document.querySelector("#description").value = listingInformation.About
  }

  const form = document.querySelector('.form-container form');
  const previewButton = document.querySelector('.preview-button');
  previewButton.disabled = true;

  form.addEventListener('input', () => {
    const allFieldsFilled = Array.from(form.elements)
      .filter(element => element.hasAttribute('required'))
      .every(element => element.value.trim() !== '');
    const today = new Date(); // Get today's date

    listingNameInput = document.querySelector("#listing-name").value;
    addrInput = document.querySelector("#address").value;
    startDateInput = document.querySelector("#start-date").value;
    endDateInput = document.querySelector("#end-date").value;    
    causeAreaInput = document.querySelector("#cause-areas").value;
    skillsInput = document.querySelector("#skills").value;
    requirementsInput = document.querySelector("#requirements").value;
    aboutInput = document.querySelector("#description").value;

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    const isValidStartDate = startDate > today;
    const isValidEndDate = endDate >= startDate;
    // Enable/disable preview button based on filled fields AND valid dates
    previewButton.disabled = !(allFieldsFilled && isValidStartDate && isValidEndDate);
  });
  previewButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const randomInt = Math.floor(Math.random() * 3) + 1;
    listing = new Object();
    listing.PostedBy = currentAccountID;
    listing.ListingName = listingNameInput;
    listing.Addr = addrInput;
    listing.StartDate = startDateInput;
    listing.EndDate = endDateInput;
    listing.CauseArea = causeAreaInput;
    listing.Skill = skillsInput;
    listing.Requirement = requirementsInput;
    listing.About = aboutInput;
    listing.MediaPath = `random${randomInt}-listing.jpg`;
    sessionStorage.setItem("listingInformation", JSON.stringify(listing));
    window.location.href="organisationpreviewlisting.html";
  });
});