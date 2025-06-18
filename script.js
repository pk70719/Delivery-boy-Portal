// Delivery Boy Portal Script (D1–D25)

// 👇 Backend base URL
const BASE_URL = "https://suriyawan-saffari-backend.onrender.com";

// D1: DOM Load
document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcome-msg");
  if (welcome) {
    welcome.innerText = "🚚 Delivery Boy Dashboard Connected to Backend!";
  }

  loadAssignedDeliveries();
  loadSalary();
  checkReferralBonus();
});

// D2: Load Assigned Deliveries
function loadAssignedDeliveries() {
  const token = localStorage.getItem("deliveryToken");
  if (!token) return;

  fetch(`${BASE_URL}/api/delivery/assignments`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      console.log("📦 Assigned Deliveries:", data);
      renderDeliveries(data);
    })
    .catch(err => {
      console.error("❌ Error fetching deliveries:", err);
    });
}

// D3: Render Delivery Cards
function renderDeliveries(deliveries) {
  const container = document.getElementById("delivery-list");
  if (!container) return;

  container.innerHTML = "";
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
    method: "POST"
  })
    .then(res => res.json())
    .then(() => {
      alert("✅ Pickup marked");
      loadAssignedDeliveries();
    });
}

// D5: Mark Order Delivered
function markDelivered(id) {
  fetch(`${BASE_URL}/api/delivery/delivered/${id}`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(() => {
      alert("📬 Delivery marked");
      loadAssignedDeliveries();
    });
}

// D6: Upload Proof Image
function uploadProof(event, id) {
  const file = event.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append("image", file);

  fetch(`${BASE_URL}/api/delivery/proof/${id}`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      alert("📸 Proof uploaded");
    });
}

// D7: Navigate via Google Maps
function navigateTo(lat, lng) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
}

// D8: Cash Collection
function collectCash(id, amount) {
  fetch(`${BASE_URL}/api/delivery/collect/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  })
    .then(res => res.json())
    .then(() => {
      alert("💰 Cash collection recorded");
    });
}

// D9: Chat with AI Assistant
function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input?.value.trim();
  if (!message) return;

  fetch(`${BASE_URL}/api/ai/delivery-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => {
      const responseBox = document.getElementById("chatResponse");
      if (responseBox) responseBox.innerText = "🤖 " + data.reply;
    });

  input.value = "";
}

// D10: Load Salary Info
function loadSalary() {
  fetch(`${BASE_URL}/api/delivery/salary`)
    .then(res => res.json())
    .then(data => {
      const salaryBox = document.getElementById("salary-box");
      if (salaryBox) salaryBox.innerText = `💼 Total Salary: ₹${data.total}`;
    });
}

// D11: Daily Shift Start
function startShift() {
  fetch(`${BASE_URL}/api/delivery/start-shift`, { method: "POST" })
    .then(res => res.json())
    .then(() => {
      alert("🚦 Shift started");
    });
}

// D12: Daily Shift End
function endShift() {
  fetch(`${BASE_URL}/api/delivery/end-shift`, { method: "POST" })
    .then(res => res.json())
    .then(() => {
      alert("🏁 Shift ended");
    });
}

// D13: Live Notification (every 10 sec)
setInterval(() => {
  fetch(`${BASE_URL}/api/delivery/notifications`)
    .then(res => res.json())
    .then(data => {
      if (data.newAssignment) {
        alert("🆕 New order assigned!");
        loadAssignedDeliveries();
      }
    });
}, 10000);

// D14: Referral Delivery Bonus
function checkReferralBonus() {
  fetch(`${BASE_URL}/api/delivery/referral-bonus`)
    .then(res => res.json())
    .then(data => {
      const bonusBox = document.getElementById("bonus-box");
      if (bonusBox) bonusBox.innerText = `🎁 Bonus: ₹${data.bonus}`;
    });
}
