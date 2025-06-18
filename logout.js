// logout.js

// 🔐 Universal Logout Function
function logoutUser() {
  // 🧹 Clear localStorage tokens & data for all portals
  localStorage.removeItem("ownerToken");
  localStorage.removeItem("sellerToken");
  localStorage.removeItem("customerToken");
  localStorage.removeItem("deliveryToken");

  localStorage.removeItem("ownerData");
  localStorage.removeItem("sellerData");
  localStorage.removeItem("customerData");
  localStorage.removeItem("deliveryData");

  // 🔁 Clear sessionStorage if any
  sessionStorage.clear();

  // 🚪 Redirect to respective login page based on folder/portal
  const path = window.location.pathname.toLowerCase();

  if (path.includes("owner")) {
    window.location.href = "login.html";
  } else if (path.includes("seller")) {
    window.location.href = "../seller/login.html";
  } else if (path.includes("customer")) {
    window.location.href = "../customer/login.html";
  } else if (path.includes("delivery")) {
    window.location.href = "../delivery/login.html";
  } else {
    // Default fallback
    window.location.href = "login.html";
  }
}

// 🔘 Event listener (only if logout button exists)
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn") || document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const confirmLogout = confirm("🔒 Are you sure you want to logout?");
      if (confirmLogout) logoutUser();
    });
  }
});
