// ✅ Delivery Boy Portal Script – Suriyawan Saffari

const BASE_URL = "https://suriyawan-backend-68z3.onrender.com";
const token = localStorage.getItem("deliveryToken");

// D1: DOM Load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("welcome-msg").innerText = "🚚 Delivery Portal Connected!";
  document.getElementById("status-msg").innerText = "✅ Ready to operate.";
  loadAssignedDeliveries();
  loadSalary();
  checkReferralBonus();
});

// D2: Load Assigned Deliveries
function loadAssignedDeliveries() {
  if (!token) return (window.location.href = "login.html");

  fetch(`${BASE_URL}/api/delivery/assignments`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => renderDeliveries(data.assignments || []))
    .catch(err => console.error("❌ Delivery Load Failed:", err));
}

// D3: Render Delivery Cards
function renderDeliveries(deliveries) {
  const container = document.getElementById("delivery-list");
  if (!container) return;

  container.innerHTML = "";
  if (deliveries.length === 0) {
    container.innerHTML = "<p>📭 No deliveries assigned currently.</p>";
    return;
  }

  deliveries.forEach(order => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>📦 Order #${order.trackingId}</h3>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Phone:</strong> <a href="tel:${order.phone}">${order.phone}</a></p>
      <p><strong>COD:</strong> ₹${order.cod}</p>
      <button onclick="markPickedUp('${order._id}')">✅ Picked Up</button>
      <button onclick="markDelivered('${order._id}')">📬 Delivered</button>
      <button onclick="navigateTo('${order.lat}','${order.lng}')">📍 Navigate</button>
      <button onclick="collectCash('${order._id}', ${order.cod})">💰 Cash Received</button>
      <input type="file" accept="image/*" onchange="uploadProof(event, '${order._id}')" />
    `;
    container.appendChild(div);
  });
}

// D4: Mark Order Picked Up
function markPickedUp(id) {
  fetch(`${BASE_URL}/api/delivery/pickup/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(() => {
      alert("✅ Pickup marked.");
      loadAssignedDeliveries();
    });
}

// D5: Mark Delivered
function markDelivered(id) {
  fetch(`${BASE_URL}/api/delivery/delivered/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(() => {
      alert("📬 Delivery completed.");
      loadAssignedDeliveries();
    });
}

// D6: Upload Delivery Proof
function uploadProof(event, id) {
  const file = event.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("image", file);

  fetch(`${BASE_URL}/api/delivery/proof/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
    .then(res => res.json())
    .then(() => alert("📸 Proof uploaded."));
}

// D7: Google Maps Navigation
function navigateTo(lat, lng) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
}

// D8: Collect COD Cash
function collectCash(id, amount) {
  fetch(`${BASE_URL}/api/delivery/collect/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount })
  })
    .then(res => res.json())
    .then(() => alert("💰 Cash collection updated."));
}

// D9: Chat AI
function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input?.value.trim();
  const responseBox = document.getElementById("chatResponse");
  if (!message) return (responseBox.innerText = "❗ Type something.");

  fetch(`${BASE_URL}/api/ai/delivery-chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => {
      responseBox.innerText = "🤖 " + (data.reply || "No reply.");
      input.value = "";
    });
}

// D10: Salary Info
function loadSalary() {
  fetch(`${BASE_URL}/api/delivery/salary`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const salaryBox = document.getElementById("salary-box");
      if (salaryBox) salaryBox.innerText = `💼 Salary: ₹${data.total || 0}`;
    });
}

// D11: Start Shift
function startShift() {
  fetch(`${BASE_URL}/api/delivery/start-shift`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(() => alert("🚦 Shift Started."));
}

// D12: End Shift
function endShift() {
  fetch(`${BASE_URL}/api/delivery/end-shift`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(() => alert("🏁 Shift Ended."));
}

// D13: Auto Notification Polling
setInterval(() => {
  fetch(`${BASE_URL}/api/delivery/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      if (data.newAssignment) {
        alert("🆕 New Delivery Assigned!");
        loadAssignedDeliveries();
      }
    });
}, 10000);

// D14: Referral Bonus Check
function checkReferralBonus() {
  fetch(`${BASE_URL}/api/delivery/referral-bonus`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const bonusBox = document.getElementById("bonus-box");
      if (bonusBox) bonusBox.innerText = `🎁 Bonus: ₹${data.bonus || 0}`;
    });
}
