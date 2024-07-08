document.addEventListener("DOMContentLoaded", function () {
  const registerButton = document.getElementById("register");
  registerButton.addEventListener("click", function () {
    window.location.href = "./register.html";
  });

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const loginButton = document.getElementById("login");
  loginButton.addEventListener("click", function () {
    const username = usernameInput.value;
    const password = passwordInput.value;

    console.log("Username:", username);
    console.log("Password:", password);
  });
});
