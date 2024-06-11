document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  const changePfpButton = document.getElementById("change-pfp");

  changePfpButton.addEventListener("click", function () {
    console.log("Button clicked!");
  });
});
