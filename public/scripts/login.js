document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Login attempt:", email, password);

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (response.ok) {
        localStorage.setItem("userID", result.id);
        localStorage.setItem("authToken", result.token);

        const data = await fetch(`/volunteers/${result.id}`);
        const indivData = await data.json();
        console.log(indivData.Username);
        sessionStorage.setItem("username", indivData.Username);

        document.cookie = `authToken=${result.token}; path=/;`;
        alert("Login successful");
        window.location.href = "../html/index.html";
      } else {
        alert("Login failed: " + (result.message || result));
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed: " + error.message);
    }
  });
});
