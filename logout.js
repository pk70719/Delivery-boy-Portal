// ✅ logout.js — Universal Logout Handler for Suriyawan Saffari Portals

function logoutUser() {
  // 🔐 Clear all stored tokens
  localStorage.removeItem("ownerToken");
  localStorage.removeItem("sellerToken");
  localStorage.removeItem("customerToken");
  localStorage.removeItem("deliveryToken");

  // 🧹 Clear any cached user data
  localStorage.removeItem("ownerData");
  localStorage.removeItem("sellerData");
  localStorage.removeItem("customerData");
  localStorage.removeItem("deliveryData");

  // 🗑️ Clear sessionStorage as well
  sessionStorage.clear();

  // 🔁 Redirect to respective portal login
  const path = window.location.pathname.toLowerCase();

  if (path.includes("owner")) {
    window.location.href = "login.html";
  } else if (path.includes("seller")) {
    window.location.href = "../seller/login.html";
  } else if (path.includes("customer")) {
    window.location.href = "../customer/login.html";
  } else if (path.includes("delivery")) {
    window.location.href = "../delivery-boy-portal/login.html";
  } else {
    window.location.href = "login.html";
  }
}

// 🔘 Attach logout handler on page load
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
