document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("Please log in to access this page.");
      window.location.href = "login.html";
    }
  
    // Add other functionality here, if needed
    // Example: Load user-specific data
  
    document.querySelector(".logout-button").addEventListener("click", () => {
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
    });
  });
  