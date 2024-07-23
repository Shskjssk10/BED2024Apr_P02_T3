document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Login attempt:", email, password);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("Login result:", result);
      localStorage.setItem("userID", result.id);
      localStorage.setItem("authToken", result.token);

      const data = await fetch(`http://localhost:8080/volunteers/${result.id}`);
      const indivData = await data.json();
      console.log(indivData.Username);
      sessionStorage.setItem("username", indivData.Username);

      if (response.ok) {
        document.cookie = `authToken=${result.token}; path=/;`;
        alert("Login successful");
        window.location.href = "../html/index.html";
      } else {
        alert("Login failed: " + result.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });
});
