// Sample users data
let users = [
  {
    name: "Salma",
    email: "salma2300364@miuegypt.edu.eg",
    role: "Student",
    status: "Active",
    orders: [
      { restaurant: "My Corner", amount: "$35", time: "2024-05-01 14:30", status: "Completed" }
    ]
  },
  {
    name: "Nimo",
    email: "nimo2303638@miuegypt.edu.eg",
    role: "Staff",
    status: "Active",
    orders: [
      { restaurant: "R to go", amount: "$12", time: "2024-05-03 09:00", status: "Pending" }
    ]
  }
];

// Sample orders data
let orders = [
  { user: "salma", restaurant: "my corner", amount: "35", time: "12AM", status: "Pending" },
  { user: "nimo", restaurant: "gyro", amount: "150", time: "1AM", status: "Completed" },
];

// ========== ORDERS SECTION FUNCTIONALITY ========== //

function renderOrders(orderList = orders) {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";

  orderList.forEach((order, index) => {
    const row = document.createElement("tr");
    const statusClass = `status-${order.status.toLowerCase()}`;
    
    row.innerHTML = `
      <td>${order.user}</td>
      <td>${order.restaurant}</td>
      <td>$${order.amount}</td>
      <td>${order.time}</td>
      <td><span class="${statusClass}">${order.status}</span></td>
      <td>
        <button class="action-btn" onclick="changeOrderStatus(${index})">Change Status</button>
        <button class="action-btn delete" onclick="deleteOrder(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  updateDashboard();
}

function searchOrders() {
  const searchInput = document.getElementById("orderSearchInput").value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;
  
  let filteredOrders = orders;
  
  // Apply search filter
  if (searchInput) {
    filteredOrders = filteredOrders.filter(order => 
      order.user.toLowerCase().includes(searchInput) || 
      order.restaurant.toLowerCase().includes(searchInput)
    );
  }
  
  // Apply status filter
  if (statusFilter) {
    filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
  }
  
  renderOrders(filteredOrders);
}

function filterOrdersByStatus() {
  searchOrders(); // Reuse the search function which handles both filters
}

function changeOrderStatus(index) {
  const current = orders[index].status;
  const newStatus = prompt("Enter new status (Pending, Completed, Cancelled):", current);
  if (newStatus && ["Pending", "Completed", "Cancelled"].includes(newStatus)) {
    orders[index].status = newStatus;
    renderOrders();
  }
}

function deleteOrder(index) {
  if (confirm("Delete this order?")) {
    orders.splice(index, 1);
    renderOrders();
  }
}

// ========== USERS SECTION FUNCTIONALITY ========== //

function renderUsers(userList = users) {
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  userList.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>
        <button class="actions-btn" onclick="toggleUserActions('${user.name}')">Actions</button>
        <div class="action-options" id="actions-${user.name}" style="display: none;">
          <button onclick="viewOrderHistory('${user.name}')">View Orders</button>
          <button onclick="toggleUserStatus('${user.name}')">${user.status === "Active" ? "Suspend" : "Activate"}</button>
          <button onclick="promoteToAdmin('${user.name}')">Make Admin</button>
          <button onclick="deleteUser('${user.name}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function toggleUserActions(name) {
  document.querySelectorAll(".action-options").forEach(opt => opt.style.display = "none");
  const current = document.getElementById(`actions-${name}`);
  if (current) current.style.display = "block";
}

function addUser() {
  const name = prompt("Enter user name:");
  const email = prompt("Enter user email:");
  const role = prompt("Enter role (Student/Staff):", "Student");
  if (!name || !email || !role) return alert("All fields are required!");

  users.push({ name, email, role, status: "Active", orders: [] });
  renderUsers();
}

function searchUsers() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(input) ||
    u.email.toLowerCase().includes(input)
  );
  renderUsers(filtered);
}

function toggleUserStatus(name) {
  users = users.map(u =>
    u.name === name ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u
  );
  renderUsers();
}

function promoteToAdmin(name) {
  users = users.map(u =>
    u.name === name ? { ...u, role: "Admin" } : u
  );
  renderUsers();
}

function deleteUser(name) {
  if (confirm(`Delete user ${name}?`)) {
    users = users.filter(u => u.name !== name);
    renderUsers();
  }
}

function viewOrderHistory(name) {
  const user = users.find(u => u.name === name);
  if (!user || !user.orders.length) return alert(`${name} has no orders.`);
  const history = user.orders.map(o =>
    `• ${o.restaurant} — ${o.amount} — ${o.time} — ${o.status}`
  ).join("\n");
  alert(`Order History for ${name}:\n\n${history}`);
}

// ========== RESTAURANTS SECTION FUNCTIONALITY ========== //

function attachEditFunctionality(card) {
  const editBtn = card.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => toggleEditOptions(editBtn));

  const renameBtn = card.querySelector(".rename-btn");
  const statusBtn = card.querySelector(".status-btn");
  const removeBtn = card.querySelector(".remove-btn");

  renameBtn.addEventListener("click", () => renameRestaurant(renameBtn));
  statusBtn.addEventListener("click", () => changeStatus(statusBtn));
  removeBtn.addEventListener("click", () => removeRestaurantCard(removeBtn));
}

function toggleEditOptions(button) {
  const card = button.closest(".restaurant-card");
  const options = card.querySelector(".edit-options");

  document.querySelectorAll(".edit-options").forEach(opt => {
    if (opt !== options) opt.classList.add("hidden");
  });

  options.classList.toggle("hidden");
}

function renameRestaurant(innerButton) {
  const card = innerButton.closest(".restaurant-card");
  const nameEl = card.querySelector("h2");
  const newName = prompt("Edit restaurant name:", nameEl.textContent);
  if (newName) nameEl.textContent = newName;
}

function changeStatus(innerButton) {
  const card = innerButton.closest(".restaurant-card");
  const statusEl = card.querySelector("p");
  const currentStatus = statusEl.textContent.includes("Active") ? "Active" : "Inactive";
  const newStatus = prompt("Change status (Active/Inactive):", currentStatus);
  if (newStatus === "Active" || newStatus === "Inactive") {
    statusEl.textContent = `Status: ${newStatus}`;
  }
}

function removeRestaurantCard(innerButton) {
  const card = innerButton.closest(".restaurant-card");
  if (confirm("Remove this restaurant?")) card.remove();
}

// ========== DASHBOARD & INITIALIZATION ========== //

//function updateDashboard() {
  //document.getElementById("userCount").textContent = `Users: ${users.length}`;
  //document.getElementById("restaurantCount").textContent = `Restaurants: ${document.querySelectorAll(".restaurant-card").length}`;
  //document.getElementById("orderCount").textContent = `Orders: ${orders.length}`;
  //document.getElementById("pendingOrders").textContent = `Pending Orders: ${orders.filter(o => o.status === "Pending").length}`;
//}

function updateDashboard() {
  document.getElementById("userCount").textContent = `Users: ${users.length}`;
  document.getElementById("restaurantCount").textContent = `Restaurants: ${document.querySelectorAll(".restaurant-card").length}`;
  document.getElementById("orderCount").textContent = `Orders: ${orders.length}`;
  document.getElementById("pendingOrders").textContent = `Pending Orders: ${orders.filter(o => o.status === "Pending").length}`;

  // Orders Today (simulated: time includes "12AM")
  const todayOrders = orders.filter(o => o.time.includes("12AM")).length;
  document.getElementById("todayOrders").textContent = `Orders Today: ${todayOrders}`;

  // Total Revenue (Completed orders only)
  const revenue = orders
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + parseFloat(o.amount), 0);
  document.getElementById("totalRevenue").textContent = `Revenue: ${revenue} EGP`;

  // Most Popular Restaurant
  const restaurantCount = {};
  orders.forEach(o => {
    restaurantCount[o.restaurant] = (restaurantCount[o.restaurant] || 0) + 1;
  });
  const topRestaurant = Object.entries(restaurantCount).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("popularRestaurant").textContent = `Top Restaurant: ${topRestaurant ? topRestaurant[0] : '-'}`;

  // Most Active User
  const userCount = {};
  orders.forEach(o => {
    userCount[o.user] = (userCount[o.user] || 0) + 1;
  });
  const topUser = Object.entries(userCount).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("activeUser").textContent = `Top User: ${topUser ? topUser[0] : '-'}`;
}


function updateDashboard() {
  document.getElementById("userCount").textContent = `Users: ${users.length}`;
  document.getElementById("restaurantCount").textContent = `Restaurants: ${document.querySelectorAll(".restaurant-card").length}`;
  document.getElementById("orderCount").textContent = `Orders: ${orders.length}`;
  document.getElementById("pendingOrders").textContent = `Pending Orders: ${orders.filter(o => o.status === "Pending").length}`;

  // Orders Today (simulated: time includes "12AM")
  const todayOrders = orders.filter(o => o.time.includes("12AM")).length;
  document.getElementById("todayOrders").textContent = `Orders Today: ${todayOrders}`;

  // Total Revenue (Completed orders only)
  const revenue = orders
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + parseFloat(o.amount), 0);
  document.getElementById("totalRevenue").textContent = `Revenue: ${revenue} EGP`;

  // Most Popular Restaurant
  const restaurantCount = {};
  orders.forEach(o => {
    restaurantCount[o.restaurant] = (restaurantCount[o.restaurant] || 0) + 1;
  });
  const topRestaurant = Object.entries(restaurantCount).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("popularRestaurant").textContent = `Top Restaurant: ${topRestaurant ? topRestaurant[0] : '-'}`;

  // Most Active User
  const userCount = {};
  orders.forEach(o => {
    userCount[o.user] = (userCount[o.user] || 0) + 1;
  });
  const topUser = Object.entries(userCount).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("activeUser").textContent = `Top User: ${topUser ? topUser[0] : '-'}`;
}
function updateDashboard() {
  document.getElementById("userCount").textContent = `Users: ${users.length}`;
  document.getElementById("restaurantCount").textContent = `Restaurants: ${document.querySelectorAll(".restaurant-card").length}`;
  document.getElementById("orderCount").textContent = `Orders: ${orders.length}`;
  document.getElementById("pendingOrders").textContent = `Pending Orders: ${orders.filter(o => o.status === "Pending").length}`;

  // Orders Today (simulated: time includes "12AM")
  const todayOrders = orders.filter(o => o.time.includes("12AM")).length;
  document.getElementById("todayOrders").textContent = `Orders Today: ${todayOrders}`;

  // Total Revenue (Completed orders only)
  const revenue = orders
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + parseFloat(o.amount), 0);
  document.getElementById("totalRevenue").textContent = `Revenue: ${revenue} EGP`;

  // Most Popular Restaurant
  const restaurantCount = {};
  orders.forEach(o => {
    restaurantCount[o.restaurant] = (restaurantCount[o.restaurant] || 0) + 1;
  });
  const topRestaurant = Object.entries(restaurantCount).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("popularRestaurant").textContent = `Top Restaurant: ${topRestaurant ? topRestaurant[0] : '-'}`;

  // Most Active User
  const userCount = {};
  orders.forEach(o => {
    userCount[o.user] = (userCount[o.user] || 0) + 1;
  });
  const topUser = Object.entries(userCount).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("activeUser").textContent = `Top User: ${topUser ? topUser[0] : '-'}`;
}


// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Set up event listeners for orders section
  document.getElementById("orderSearchInput").addEventListener("input", searchOrders);
  document.getElementById("statusFilter").addEventListener("change", filterOrdersByStatus);
  
  // Initialize restaurant edit buttons
  document.querySelectorAll(".restaurant-card").forEach(attachEditFunctionality);
  
  // Add "Add Restaurant" button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Restaurant";
  addBtn.onclick = () => {
    const name = prompt("Enter restaurant name:");
    if (!name) return;

    const card = document.createElement("div");
    card.className = "restaurant-card";
    card.innerHTML = `
      <h2>${name}</h2>
      <p>Status: Active</p>
      <button class="edit-btn">Edit</button>
      <div class="edit-options hidden">
        <button class="rename-btn">Rename</button>
        <button class="status-btn">Change Status</button>
        <button class="remove-btn">Remove</button>
      </div>`;
    document.querySelector(".restaurant-list").appendChild(card);
    attachEditFunctionality(card);
  };
  document.querySelector("#restaurants").insertBefore(addBtn, document.querySelector(".restaurant-list"));

  // Initial renders
  renderUsers();
  renderOrders();
  updateDashboard();
});

// Section switching
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.classList.remove('active'));

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }
}