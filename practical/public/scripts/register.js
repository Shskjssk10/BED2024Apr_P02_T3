document.addEventListener("DOMContentLoaded", function () {
  console.log("dom loaded");

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const registerButton = document.getElementById("register");

  registerButton.addEventListener("click", function () {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Get all radio buttons with the name "role"
    const roleRadioButtons = document.querySelectorAll(
      'input[type="radio"][name="role"]'
    );

    // Find the selected radio button
    let selectedRole;
    for (const radioButton of roleRadioButtons) {
      if (radioButton.checked) {
        selectedRole = radioButton.value;
        break; // Exit the loop once a selected radio button is found
      }
    }

    console.log("Username:", username);
    console.log("Password:", password);

    if (selectedRole) {
      console.log("Selected Role:", selectedRole);
    } else {
      console.error("No role selected!"); // Handle the case where no radio button is selected
    }
  });
});
