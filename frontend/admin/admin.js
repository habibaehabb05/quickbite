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
  { user: "Salma", restaurant: "My Corner", amount: "35", time: "12:00 PM", status: "Pending" },
  { user: "Nimo", restaurant: "Gyro", amount: "150", time: "1:00 PM", status: "Completed" },
];

// Sample restaurant data for analytics chart markers
const restaurantMarkers = [
  { name: "My Corner", day: "Wed", orders: 5, revenue: 175 },
  { name: "R to go", day: "Fri", orders: 8, revenue: 240 },
  { name: "Gyro", day: "Sun", orders: 6, revenue: 210 }
];

// Global variables
let currentUserIndex = null;
let currentOrderIndex = null;
let analyticsChart = null;

// ========== ORDERS SECTION FUNCTIONALITY ========== //

function renderOrders(orderList = orders) {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";

  orderList.forEach((order, index) => {
    const row = document.createElement("tr");
    const statusClass = `status-tag status-${order.status.toLowerCase()}`;
    
    row.innerHTML = `
      <td>${order.user}</td>
      <td>${order.restaurant}</td>
      <td>$${order.amount}</td>
      <td>${order.time}</td>
      <td><span class="${statusClass}">${order.status}</span></td>
      <td>
        <div class="dropdown">
          <button class="dropdown-btn">Actions</button>
          <div class="dropdown-content">
            <a href="#" onclick="openStatusModal(${index})">Change Status</a>
            <a href="#" onclick="confirmDeleteOrder(${index})">Delete</a>
          </div>
        </div>
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

function openStatusModal(index) {
  currentOrderIndex = index;
  const modal = document.getElementById("changeStatusModal");
  const currentStatus = orders[index].status;
  
  // Set the current status in the radio buttons
  document.getElementById("statusPending").checked = currentStatus === "Pending";
  document.getElementById("statusCompleted").checked = currentStatus === "Completed";
  document.getElementById("statusCancelled").checked = currentStatus === "Cancelled";
  
  modal.style.display = "flex";
}

function saveOrderStatus() {
  const selectedStatus = document.querySelector('input[name="orderStatus"]:checked').value;
  orders[currentOrderIndex].status = selectedStatus;
  closeModal('changeStatusModal');
  renderOrders();
}

function confirmDeleteOrder(index) {
  currentOrderIndex = index;
  const modal = document.getElementById("deleteOrderModal");
  modal.style.display = "flex";
}

function deleteOrder() {
  orders.splice(currentOrderIndex, 1);
  closeModal('deleteOrderModal');
  renderOrders();
}

// ========== USERS SECTION FUNCTIONALITY ========== //

function renderUsers(userList = users) {
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  userList.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>
        <div class="dropdown">
          <button class="dropdown-btn">Actions</button>
          <div class="dropdown-content">
            <a href="#" onclick="openEditRoleModal(${index})">Edit Role</a>
            <a href="#" onclick="toggleUserStatus(${index})">${user.status === "Active" ? "Suspend" : "Activate"}</a>
            <a href="#" onclick="confirmDeleteUser(${index})">Delete</a>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function openEditRoleModal(index) {
  currentUserIndex = index;
  const modal = document.getElementById("editRoleModal");
  const currentRole = users[index].role;
  
  // Set the current role in the radio buttons
  document.getElementById("roleStaff").checked = currentRole === "Staff";
  document.getElementById("roleManager").checked = currentRole === "Manager";
  document.getElementById("roleAdmin").checked = currentRole === "Admin";
  document.getElementById("roleStudent").checked = currentRole === "Student";
  
  modal.style.display = "flex";
}

function saveRoleChange() {
  const selectedRole = document.querySelector('input[name="role"]:checked').value;
  users[currentUserIndex].role = selectedRole;
  closeModal('editRoleModal');
  renderUsers();
}

function searchUsers() {
  const input = document.getElementById("userSearchInput").value.toLowerCase();
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(input) ||
    u.email.toLowerCase().includes(input)
  );
  renderUsers(filtered);
}

function toggleUserStatus(index) {
  users[index].status = users[index].status === "Active" ? "Suspended" : "Active";
  renderUsers();
}

function confirmDeleteUser(index) {
  currentUserIndex = index;
  const modal = document.getElementById("deleteUserModal");
  modal.style.display = "flex";
}

function deleteUser() {
  users.splice(currentUserIndex, 1);
  closeModal('deleteUserModal');
  renderUsers();
}

function openAddUserModal() {
  document.getElementById("addUserModal").style.display = "flex";
}

function addUser() {
  const name = document.getElementById("newUserName").value;
  const email = document.getElementById("newUserEmail").value;
  const role = document.querySelector('input[name="newUserRole"]:checked').value;
  
  if (!name || !email) {
    // Show error message modal instead of alert
    showMessage("Name and email are required!");
    return;
  }

  users.push({ name, email, role, status: "Active", orders: [] });
  closeModal('addUserModal');
  renderUsers();
  showMessage("User added successfully!");
}

// ========== RESTAURANTS SECTION FUNCTIONALITY ========== //

function attachEditFunctionality(card) {
  const editBtn = card.querySelector(".edit-btn");
  const editOptions = card.querySelector(".edit-options");
  
  editBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    
    // Close all other edit options
    document.querySelectorAll(".edit-options").forEach(option => {
      if (option !== editOptions) {
        option.classList.remove("expanded");
      }
    });
    
    // Toggle this edit options
    editOptions.classList.toggle("expanded");
  });

  const renameBtn = card.querySelector(".rename-btn");
  const statusBtn = card.querySelector(".status-btn");
  const removeBtn = card.querySelector(".remove-btn");

  renameBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    const nameEl = card.querySelector("h2");
    const currentName = nameEl.textContent;
    
    // Open rename modal instead of using prompt
    openRenameRestaurantModal(currentName, nameEl);
    editOptions.classList.remove("expanded");
  });
  
  statusBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    const statusIndicator = card.querySelector(".status-indicator");
    const isActive = statusIndicator.classList.contains("status-active");
    
    if (isActive) {
      statusIndicator.classList.remove("status-active");
      statusIndicator.classList.add("status-inactive");
      statusIndicator.textContent = "Closed";
    } else {
      statusIndicator.classList.remove("status-inactive");
      statusIndicator.classList.add("status-active");
      statusIndicator.textContent = "Open";
    }
    
    editOptions.classList.remove("expanded");
  });
  
  removeBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    const restaurantName = card.querySelector("h2").textContent;
    openDeleteRestaurantModal(restaurantName, card);
  });
}

function openRenameRestaurantModal(currentName, nameElement) {
  const modal = document.getElementById("renameRestaurantModal");
  const inputField = document.getElementById("renameRestaurantInput");
  
  inputField.value = currentName;
  modal.dataset.nameElement = nameElement;
  
  modal.style.display = "flex";
}

function saveRestaurantRename() {
  const modal = document.getElementById("renameRestaurantModal");
  const newName = document.getElementById("renameRestaurantInput").value;
  
  if (!newName) {
    showMessage("Restaurant name cannot be empty!");
    return;
  }
  
  // Update restaurant name
  const nameElement = document.querySelector("h2");
  if (nameElement) {
    nameElement.textContent = newName;
  }
  
  closeModal('renameRestaurantModal');
  showMessage("Restaurant renamed successfully!");
}

function openDeleteRestaurantModal(restaurantName, card) {
  const modal = document.getElementById("deleteRestaurantModal");
  const messageElement = modal.querySelector("p");
  messageElement.textContent = `Are you sure you want to delete "${restaurantName}"?`;
  
  // Set a reference to the card element on the modal for later use
  modal.dataset.targetCard = card.dataset.index || "";
  
  modal.style.display = "flex";
}

function deleteRestaurant() {
  const modal = document.getElementById("deleteRestaurantModal");
  const cards = document.querySelectorAll(".restaurant-card");
  const targetIndex = modal.dataset.targetCard;
  
  if (targetIndex !== "") {
    cards[targetIndex].remove();
  } else {
    // Fallback to removing the last added restaurant if index not found
    document.querySelector(".restaurant-list .restaurant-card:last-child").remove();
  }
  
  closeModal('deleteRestaurantModal');
  updateDashboard();
  showMessage("Restaurant deleted successfully!");
}

function openAddRestaurantModal() {
  document.getElementById("addRestaurantModal").style.display = "flex";
}

function addRestaurant() {
  const name = document.getElementById("newRestaurantName").value;
  
  if (!name) {
    showMessage("Restaurant name is required!");
    return;
  }

  const restaurantList = document.querySelector(".restaurant-list");
  const existingCards = restaurantList.querySelectorAll(".restaurant-card");
  const newIndex = existingCards.length;

  const card = document.createElement("div");
  card.className = "restaurant-card";
  card.dataset.index = newIndex;
  card.innerHTML = `
    <h2>${name}</h2>
    <p><span class="status-indicator status-active">Open</span></p>
    <button class="edit-btn">Edit</button>
    <div class="edit-options">
      <button class="rename-btn">Rename</button>
      <button class="status-btn">Toggle Status</button>
      <button class="remove-btn">Remove</button>
    </div>`;
  
  restaurantList.appendChild(card);
  attachEditFunctionality(card);
  closeModal('addRestaurantModal');
  
  // Add a new restaurant thumbnail to the dashboard
  addRestaurantThumbnail(name);
  
  updateDashboard();
  showMessage("Restaurant added successfully!");
}

function addRestaurantThumbnail(name) {
  const thumbnailContainer = document.querySelector(".restaurant-grid");
  const addNewThumbnail = thumbnailContainer.lastElementChild;
  
  const newThumbnail = document.createElement("div");
  newThumbnail.className = "restaurant-thumbnail";
  newThumbnail.setAttribute("onclick", `goToRestaurantPanel('${name.toLowerCase().replace(/\s+/g, '-')}.html')`);
  newThumbnail.innerHTML = `
    <div class="restaurant-img">
      <i class="fas fa-store fa-3x"></i>
    </div>
    <div class="restaurant-name">${name}</div>
  `;
  
  // Insert before the "Add New" card
  thumbnailContainer.insertBefore(newThumbnail, addNewThumbnail);
}

// ========== DASHBOARD & CHART FUNCTIONALITY ========== //

function initializeChart() {
  const ctx = document.getElementById('analytics-chart').getContext('2d');
  
  // Sample data
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [15, 19, 13, 17, 23, 28, 22],
        backgroundColor: 'rgba(255, 75, 75, 0.2)',
        borderColor: 'rgba(255, 75, 75, 1)',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Revenue ($)',
        data: [300, 390, 250, 340, 460, 580, 450],
        backgroundColor: 'rgba(255, 177, 104, 0.2)',
        borderColor: 'rgba(255, 177, 104, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };
  
  // Add restaurant markers to the chart
  const annotations = {};
  restaurantMarkers.forEach((marker, index) => {
    const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(marker.day);
    
    if (dayIndex !== -1) {
      annotations[`restaurant${index}`] = {
        type: 'point',
        xValue: dayIndex,
        yValue: marker.orders,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 75, 75, 1)',
        borderWidth: 2,
        radius: 6,
        label: {
          enabled: true,
          content: marker.name,
          position: 'top'
        }
      };
    }
  });
  
  // Chart configuration
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#FFFFFF'
          }
        },
        annotation: {
          annotations: annotations
        },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const datasetIndex = context.datasetIndex;
              const dataIndex = context.dataIndex;
              const day = data.labels[dataIndex];
              
              // Check if there's a restaurant marker at this point
              const restaurantAtPoint = restaurantMarkers.find(m => m.day === day);
              if (restaurantAtPoint) {
                return `${restaurantAtPoint.name}: ${restaurantAtPoint.orders} orders, $${restaurantAtPoint.revenue} revenue`;
              }
              return '';
            }
          }
        }
      }
    }
  };
  
  analyticsChart = new Chart(ctx, config);
}

function updateDashboard() {
  document.getElementById("userCount").textContent = `Users: ${users.length}`;
  document.getElementById("restaurantCount").textContent = `Restaurants: ${document.querySelectorAll(".restaurant-card").length}`;
  document.getElementById("orderCount").textContent = `Orders: ${orders.length}`;
  document.getElementById("pendingOrders").textContent = `Pending Orders: ${orders.filter(o => o.status === "Pending").length}`;
}

function updateChartTimeframe() {
  const timeframe = document.querySelector(".time-filter").value;
  let labels, ordersData, revenueData;
  
  switch(timeframe) {
    case 'month':
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      ordersData = [65, 84, 78, 92];
      revenueData = [1250, 1680, 1560, 1840];
      break;
    case 'year':
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      ordersData = [180, 190, 220, 210, 280, 250, 300, 310, 290, 270, 320, 350];
      revenueData = [3600, 3800, 4400, 4200, 5600, 5000, 6000, 6200, 5800, 5400, 6400, 7000];
      break;
    default: // week
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      ordersData = [15, 19, 13, 17, 23, 28, 22];
      revenueData = [300, 390, 250, 340, 460, 580, 450];
  }
  
  if (analyticsChart) {
    analyticsChart.data.labels = labels;
    analyticsChart.data.datasets[0].data = ordersData;
    analyticsChart.data.datasets[1].data = revenueData;
    analyticsChart.update();
  }
}

// ========== MODAL FUNCTIONALITY ========== //

function openProfileModal() {
  document.getElementById("profileModal").style.display = "flex";
}

function saveProfileChanges() {
  const username = document.getElementById("profileUsername").value;
  const email = document.getElementById("profileEmail").value;
  const password = document.getElementById("profilePassword").value;
  
  if (!username || !email) {
    showMessage("Username and email are required!");
    return;
  }
  
  closeModal('profileModal');
  showMessage("Profile updated successfully!");
}

function confirmLogout() {
  document.getElementById("logoutModal").style.display = "flex";
}

function logout() {
  // Here you would typically handle logout logic
  window.location.href = "login.html"; // Redirect to login page
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function showMessage(message) {
  const messageModal = document.getElementById("messageModal");
  const messageElement = messageModal.querySelector("p");
  messageElement.textContent = message;
  messageModal.style.display = "flex";
}

function goToRestaurantPanel(url) {
  // This is a placeholder function that would navigate to a specific restaurant panel
  console.log(`Navigating to ${url}`);
  // window.location.href = url;
}

// Close dropdown when clicking outside
document.addEventListener("click", function(event) {
  const dropdowns = document.querySelectorAll(".dropdown-content");
  let clickedOnDropdown = false;
  
  dropdowns.forEach(dropdown => {
    if (dropdown.contains(event.target) || event.target.matches('.dropdown-btn')) {
      clickedOnDropdown = true;
    }
  });
  
  if (!clickedOnDropdown) {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove("show");
    });
  }
  
  // Close edit options when clicking outside
  const editOptions = document.querySelectorAll(".edit-options");
  let clickedOnEdit = false;
  
  editOptions.forEach(options => {
    if (options.contains(event.target) || event.target.matches('.edit-btn')) {
      clickedOnEdit = true;
    }
  });
  
  if (!clickedOnEdit) {
    editOptions.forEach(options => {
      options.classList.remove("expanded");
    });
  }
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Set up event listeners
  document.getElementById("orderSearchInput").addEventListener("input", searchOrders);
  document.getElementById("userSearchInput").addEventListener("input", searchUsers);
  document.getElementById("statusFilter").addEventListener("change", searchOrders);
  
  // Initialize restaurant edit buttons
  document.querySelectorAll(".restaurant-card").forEach((card, index) => {
    card.dataset.index = index;  // Set the index for reference
    attachEditFunctionality(card);
  });
  
  // Initialize chart
  initializeChart();
  
  // Set up time filter for chart
  document.querySelector(".time-filter").addEventListener("change", updateChartTimeframe);
  
  // Set up dropdown toggle for all dropdowns
  document.querySelectorAll(".dropdown-btn").forEach(btn => {
    btn.addEventListener("click", function(event) {
      event.stopPropagation();
      const content = this.nextElementSibling;
      
      // Close other dropdowns
      document.querySelectorAll(".dropdown-content").forEach(dropdown => {
        if (dropdown !== content) {
          dropdown.classList.remove("show");
        }
      });
      
      content.classList.toggle("show");
    });
  });
  
  // Add event listeners for "Add Restaurant" button
  document.querySelector(".add-restaurant-btn").addEventListener("click", openAddRestaurantModal);
  document.getElementById("confirmAddRestaurant").addEventListener("click", addRestaurant);
  
  // Add event listeners for "Add User" button
  document.getElementById("addUserBtn").addEventListener("click", openAddUserModal);
  document.getElementById("confirmAddUser").addEventListener("click", addUser);
  
  // Add event listeners for order status and delete modals
  document.getElementById("saveOrderStatus").addEventListener("click", saveOrderStatus);
  document.getElementById("confirmDeleteOrder").addEventListener("click", deleteOrder);
  
  // Add event listener for delete user modal
  document.getElementById("confirmDeleteUser").addEventListener("click", deleteUser);
  
  // Add event listener for delete restaurant modal
  document.getElementById("confirmDeleteRestaurant").addEventListener("click", deleteRestaurant);
  
  // Add event listeners for profile modal
  document.getElementById("saveProfileChanges").addEventListener("click", saveProfileChanges);
  
  // Add event listener for logout modal confirm button
  document.getElementById("confirmLogout").addEventListener("click", logout);
  
  // Add event listeners for message close button
  document.getElementById("closeMessage").addEventListener("click", () => closeModal('messageModal'));
  
  // Add event listeners for rename restaurant modal
  document.getElementById("confirmRenameRestaurant").addEventListener("click", saveRestaurantRename);
  
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
