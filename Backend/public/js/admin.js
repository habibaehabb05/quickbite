// Sample users data
let users = [
  { id: 1, name: "Salma", email: "salma231@miuegypt.edu.eg", role: "Student", status: "Active" },
  { id: 2, name: "Nimo", email: "nimo232@miuegypt.edu.eg", role: "Staff", status: "Active" },
  { id: 3, name: "Bob", email: "bob233@miuegypt.edu.eg", role: "Student", status: "Active" },
  { id: 4, name: "Honda", email: "honda234@miuegypt.edu.eg", role: "Staff", status: "Active" },
  { id: 5, name: "Joe", email: "youssef235@miuegypt.edu.eg", role: "Student", status: "Suspended" }
];

// Sample restaurants data - UPDATED with username, email, and password
let restaurants = [
    { id: 1, name: "Gyro", status: "Open", username: "gyro_manager", email: "gyro@miuegypt.edu.eg", password: "11223344"},
    { id: 2, name: "R to go", status: "Open", username: "rtogo_manager", email: "rtogo@miuegypt.edu.eg", password: "55667788"},
    { id: 3, name: "Cinnabon", status: "Open", username: "cinnabon_manager", email: "cinnabon@miuegypt.edu.eg", password: "99887766"},
    { id: 4, name: "My Corner", status: "Open", username: "mycorner_manager", email: "mycorner@miuegypt.edu.eg", password: "55443322"},
    { id: 5, name: "farghali", status: "Closed", username: "farghali_manager", email: "farghali@miuegypt.edu.eg", password: "12345678"}
];

// Sample meals data
let meals = [
    { id: 1, name: "Gyro Platter", price: 85, restaurantId: 1, status: "Unavailable" },
    { id: 2, name: "Beef Burger", price: 70, restaurantId: 2, status: "Available" },
    { id: 3, name: "Classic Roll", price: 60, restaurantId: 3, status: "Available" },
    { id: 4, name: "Chicken Wrap", price: 55, restaurantId: 4, status: "Available" },
    { id: 5, name: "Mango Juice", price: 25, restaurantId: 5, status: "Available" }
];

// Sample orders data
let orders = [
  { id: 1, user: "Salma", userId: 1, restaurant: "My Corner", restaurantId: 4, amount: "35", time: "12:00 PM", status: "Pending" },
  { id: 2, user: "Nimo", userId: 2, restaurant: "Gyro", restaurantId: 1, amount: "150", time: "1:00 PM", status: "Completed" },
  { id: 3, user: "Bob", userId: 3, restaurant: "R to go", restaurantId: 2, amount: "70", time: "1:15 PM", status: "Completed" },
  { id: 4, user: "Honda", userId: 4, restaurant: "My Corner", restaurantId: 4, amount: "55", time: "2:30 PM", status: "Pending" },
  { id: 5, user: "Joe", userId: 5, restaurant: "Gyro", restaurantId: 1, amount: "85", time: "3:00 PM", status: "Cancelled" }
];

// Global variables
let currentUserId = null;
let currentOrderId = null;
let currentMealId = null; 
let currentRestaurantId = null;
let analyticsChart = null;

// ========== DATA PERSISTENCE (LOCAL STORAGE) ========== //
function saveDataToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
    localStorage.setItem('meals', JSON.stringify(meals));
    localStorage.setItem('orders', JSON.stringify(orders));
}

function loadDataFromLocalStorage() {
    const storedUsers = localStorage.getItem('users');
    const storedRestaurants = localStorage.getItem('restaurants');
    const storedMeals = localStorage.getItem('meals');
    const storedOrders = localStorage.getItem('orders');

    if (storedUsers) users = JSON.parse(storedUsers);
    if (storedRestaurants) restaurants = JSON.parse(storedRestaurants);
    if (storedMeals) meals = JSON.parse(storedMeals);
    if (storedOrders) orders = JSON.parse(storedOrders);
}

// ========== GENERAL MODAL & UI FUNCTIONALITY ========== //
function showMessage(message, title = "Notification") {
  document.getElementById("messageText").textContent = message;
  document.getElementById("messageModal").querySelector(".modal-title").textContent = title;
  document.getElementById("messageModal").style.display = "flex";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId)?.classList.add('active');
}

// ========== DASHBOARD & CHART FUNCTIONALITY ========== //
function updateDashboard() {
  document.getElementById("userCount").textContent = `Users: ${users.length}`;
  document.getElementById("restaurantCount").textContent = `Restaurants: ${restaurants.length}`;
  document.getElementById("mealCount").textContent = `Meals: ${meals.length}`;
  document.getElementById("orderCount").textContent = `Orders: ${orders.length}`;
}

function renderDashboardThumbnails() {
    const grid = document.querySelector("#dashboard .restaurant-grid");
    grid.innerHTML = ""; 

    restaurants.forEach(r => {
        const thumb = document.createElement('div');
        thumb.className = 'restaurant-thumbnail';
        thumb.onclick = () => goToRestaurantPanel(r.id);
        thumb.innerHTML = `
            <div class="restaurant-img"><i class="fas fa-store fa-3x"></i></div>
            <div class="restaurant-name">${r.name}</div>
        `;
        grid.appendChild(thumb);
    });

    const addNewThumb = document.createElement('div');
    addNewThumb.className = 'restaurant-thumbnail';
    addNewThumb.onclick = navigateToRestaurantsAndSuggestAdd;
    addNewThumb.innerHTML = `
        <div class="restaurant-img"><i class="fas fa-plus fa-3x"></i></div>
        <div class="restaurant-name">Add New</div>
    `;
    grid.appendChild(addNewThumb);
}

function goToRestaurantPanel(restaurantId) {
    showSection('restaurants');
    setTimeout(() => {
        const card = document.querySelector(`.restaurant-card[data-restaurant-id='${restaurantId}']`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.outline = '3px solid var(--brand-secondary)';
            setTimeout(() => { card.style.outline = 'none'; }, 3000);
        }
    }, 100);
}

function navigateToRestaurantsAndSuggestAdd() {
    showSection('restaurants');
    setTimeout(() => {
        const addBtn = document.querySelector('.add-restaurant-btn');
        if(addBtn) {
            addBtn.style.transform = 'scale(1.05)';
            addBtn.style.boxShadow = '0 0 15px var(--brand-secondary)';
            setTimeout(() => {
                addBtn.style.transform = 'scale(1)';
                addBtn.style.boxShadow = 'none';
            }, 2500);
        }
    }, 100);
}

function initializeChart() {
    const ctx = document.getElementById('analytics-chart')?.getContext('2d');
    if (!ctx) return;

    const config = {
        type: 'line', data: { labels: [], datasets: [{ label: 'Orders', data: [], backgroundColor: 'rgba(255, 75, 75, 0.2)', borderColor: 'rgba(255, 75, 75, 1)', borderWidth: 2, tension: 0.4 }, { label: 'Revenue ($)', data: [], backgroundColor: 'rgba(255, 177, 104, 0.2)', borderColor: 'rgba(255, 177, 104, 1)', borderWidth: 2, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { color: '#FFFFFF' } }, x: { ticks: { color: '#FFFFFF' } } }, plugins: { legend: { labels: { color: '#FFFFFF' } } } }
    };

    if (analyticsChart) analyticsChart.destroy();
    analyticsChart = new Chart(ctx, config);
    updateChartData('week');
}

function updateChartData(timeframe) {
    if (!analyticsChart) return;
    let labels, ordersData, revenueData;

    switch (timeframe) {
        case 'month':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            ordersData = [120, 150, 130, 180];
            revenueData = [2400, 3000, 2600, 3600];
            break;
        case 'year':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            ordersData = [500, 450, 600, 550, 700, 650];
            revenueData = [10000, 9000, 12000, 11000, 14000, 13000];
            break;
        case 'week':
        default:
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            ordersData = [15, 19, 13, 17, 23, 28, 22];
            revenueData = [300, 390, 250, 340, 460, 580, 450];
            break;
    }

    analyticsChart.data.labels = labels;
    analyticsChart.data.datasets[0].data = ordersData;
    analyticsChart.data.datasets[1].data = revenueData;
    analyticsChart.update();
}

// ========== PROFILE MODAL FUNCTIONALITY ========== //
function openProfileModal() {
    document.getElementById("profileUsername").value = "AdminUser";
    document.getElementById("profileEmail").value = "admin@example.com";
    document.getElementById("profilePassword").value = "";
    document.getElementById("profileModal").style.display = "flex";
}

function saveProfileChanges() {
    const username = document.getElementById("profileUsername").value.trim();
    const email = document.getElementById("profileEmail").value.trim();

    if (!username || !email) {
        showMessage("Username and email cannot be empty.", "Validation Error");
        return;
    }
    console.log("Profile Saved:", { username, email });
    closeModal('profileModal');
    showMessage("Profile updated successfully!");
}

// ========== ORDERS SECTION FUNCTIONALITY ========== //
function searchAndFilterOrders() {
    const searchInput = document.getElementById("orderSearchInput").value.toLowerCase();
    const statusFilter = document.getElementById("statusFilter").value;
    const filtered = orders.filter(order => {
        const matchesSearch = order.user.toLowerCase().includes(searchInput) || order.restaurant.toLowerCase().includes(searchInput);
        const matchesStatus = statusFilter ? order.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });
    renderOrders(filtered);
}

function renderOrders(orderList = orders) {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";
  orderList.forEach(order => {
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
            <a href="#" onclick="openStatusModal(${order.id})">Change Status</a>
            <a href="#" onclick="openConfirmDeleteOrderModal(${order.id})">Delete</a>
          </div>
        </div>
      </td>`;
    tbody.appendChild(row);
  });
}

function openStatusModal(orderId) {
    currentOrderId = orderId;
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    document.querySelectorAll('input[name="orderStatus"]').forEach(radio => {
        radio.checked = radio.value === order.status;
    });
    document.getElementById("changeStatusModal").style.display = "flex";
}

function saveOrderStatus() {
    const newStatus = document.querySelector('input[name="orderStatus"]:checked').value;
    const orderIndex = orders.findIndex(o => o.id === currentOrderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveDataToLocalStorage();
        searchAndFilterOrders();
        closeModal('changeStatusModal');
        showMessage("Order status updated.");
    }
}

function openConfirmDeleteOrderModal(orderId) {
    currentOrderId = orderId;
    document.getElementById("deleteOrderModal").style.display = "flex";
}

function deleteOrder() {
    orders = orders.filter(o => o.id !== currentOrderId);
    saveDataToLocalStorage();
    searchAndFilterOrders();
    updateDashboard();
    closeModal('deleteOrderModal');
    showMessage("Order deleted successfully.");
}

// ========== USERS SECTION FUNCTIONALITY ========== //
function searchUsers() {
    const input = document.getElementById("userSearchInput").value.toLowerCase();
    const filtered = users.filter(u => u.name.toLowerCase().includes(input) || u.email.toLowerCase().includes(input));
    renderUsers(filtered);
}

function renderUsers(userList = users) {
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";
  userList.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td><span class="status-tag ${user.status === 'Active' ? 'status-active' : 'status-inactive'}">${user.status}</span></td>
      <td>
        <div class="dropdown">
          <button class="dropdown-btn">Actions</button>
          <div class="dropdown-content">
            <a href="#" onclick="openEditRoleModal(${user.id})">Edit Role</a>
            <a href="#" onclick="toggleUserStatus(${user.id})">${user.status === 'Active' ? 'Suspend' : 'Activate'}</a>
            <a href="#" onclick="openConfirmDeleteUserModal(${user.id})">Delete</a>
          </div>
        </div>
      </td>`;
    tbody.appendChild(row);
  });
}

function openAddUserModal() {
  document.getElementById("newUserName").value = '';
  document.getElementById("newUserEmail").value = '';
  document.getElementById("addUserModal").style.display = "flex";
}

function addUser() {
  const name = document.getElementById("newUserName").value.trim();
  const email = document.getElementById("newUserEmail").value.trim();
  const role = "Student"; // Assign "Student" as the default role

  if (!name || !email) { 
    showMessage("Name and email are required.", "Validation Error"); 
    return; 
  }

  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  users.push({ id: newId, name, email, role, status: "Active" });
  
  saveDataToLocalStorage();
  renderUsers();
  updateDashboard();
  closeModal('addUserModal');
  showMessage("User added successfully.");
}

function openEditRoleModal(userId) {
    currentUserId = userId;
    const user = users.find(u => u.id === userId);
    if (!user) return;
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.checked = radio.value === user.role;
    });
    document.getElementById("editRoleModal").style.display = "flex";
}

function saveRoleChange() {
    const newRole = document.querySelector('input[name="role"]:checked').value;
    const userIndex = users.findIndex(u => u.id === currentUserId);
    if (userIndex !== -1) {
        users[userIndex].role = newRole;
        saveDataToLocalStorage();
        renderUsers();
        closeModal('editRoleModal');
        showMessage("User role updated.");
    }
}

function toggleUserStatus(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].status = users[userIndex].status === "Active" ? "Suspended" : "Active";
        saveDataToLocalStorage();
        renderUsers();
        showMessage("User status updated.");
    }
}

function openConfirmDeleteUserModal(userId) {
    currentUserId = userId;
    const user = users.find(u => u.id === userId);
    document.getElementById("deleteUserMessage").textContent = `Are you sure you want to delete user "${user.name}"?`;
    document.getElementById("deleteUserModal").style.display = "flex";
}

function deleteUser() {
    users = users.filter(u => u.id !== currentUserId);
    saveDataToLocalStorage();
    renderUsers();
    updateDashboard();
    closeModal('deleteUserModal');
    showMessage("User deleted successfully.");
}

// ========== MEALS SECTION FUNCTIONALITY ========== //
function filterAndRenderMeals() {
    const searchTerm = document.getElementById('mealSearchInput').value.toLowerCase();
    const restaurantFilterId = document.getElementById('mealRestaurantFilter').value;
    let filtered = meals.filter(meal => {
        const matchesSearch = meal.name.toLowerCase().includes(searchTerm);
        const matchesRestaurant = restaurantFilterId ? meal.restaurantId == restaurantFilterId : true;
        return matchesSearch && matchesRestaurant;
    });
    renderMeals(filtered);
}

function renderMeals(mealList = meals) {
    const container = document.querySelector(".meal-list");
    container.innerHTML = "";
    if (mealList.length === 0) {
        container.innerHTML = "<p>No meals found. Try adding a new meal.</p>";
        return;
    }
    mealList.forEach(meal => {
        const restaurant = restaurants.find(r => r.id === meal.restaurantId);
        const card = document.createElement("div");
        card.className = "meal-card";
        card.innerHTML = `
            <div>
                <h3>${meal.name}</h3>
                <p class="price">$${meal.price}</p>
                <p class="restaurant-name">${restaurant ? restaurant.name : 'N/A'}</p>
                <p><span class="status-tag ${meal.status === 'Available' ? 'status-available' : 'status-unavailable'}">${meal.status}</span></p>
            </div>
            <div class="meal-actions">
                <button onclick="toggleMealStatus(${meal.id})">${meal.status === 'Available' ? 'Set Unavailable' : 'Set Available'}</button>
                <button class="remove-btn" onclick="openDeleteMealModal(${meal.id})">Remove</button>
            </div>`;
        container.appendChild(card);
    });
}

function populateRestaurantFilter() {
    const filterSelect = document.getElementById('mealRestaurantFilter');
    const modalSelect = document.getElementById('newMealRestaurant');
    [filterSelect, modalSelect].forEach(select => {
        if (select) {
            const currentValue = select.value;
            select.innerHTML = select === filterSelect ? '<option value="">All Restaurants</option>' : '';
            restaurants.forEach(r => {
                select.innerHTML += `<option value="${r.id}">${r.name}</option>`;
            });
            select.value = currentValue;
        }
    });
}

function openAddMealModal() {
    document.getElementById('newMealName').value = '';
    document.getElementById('newMealPrice').value = '';
    document.getElementById('addMealModal').style.display = 'flex';
}

function addMeal() {
    const name = document.getElementById('newMealName').value.trim();
    const price = parseFloat(document.getElementById('newMealPrice').value);
    const restaurantId = parseInt(document.getElementById('newMealRestaurant').value);
    if (!name || isNaN(price) || !restaurantId) {
        showMessage("Please fill all fields correctly.", "Validation Error");
        return;
    }
    const newId = meals.length > 0 ? Math.max(...meals.map(m => m.id)) + 1 : 1;
    meals.push({ id: newId, name, price, restaurantId, status: "Available" });
    saveDataToLocalStorage();
    filterAndRenderMeals();
    updateDashboard();
    closeModal('addMealModal');
    showMessage("Meal added successfully.");
}

function toggleMealStatus(mealId) {
    const mealIndex = meals.findIndex(m => m.id === mealId);
    if (mealIndex !== -1) {
        meals[mealIndex].status = meals[mealIndex].status === "Available" ? "Unavailable" : "Available";
        saveDataToLocalStorage();
        filterAndRenderMeals();
    }
}

function openDeleteMealModal(mealId) {
    currentMealId = mealId;
    const meal = meals.find(m => m.id === mealId);
    document.getElementById('deleteMealMessage').textContent = `Are you sure you want to delete "${meal.name}"?`;
    document.getElementById('deleteMealModal').style.display = 'flex';
}

function deleteMeal() {
    meals = meals.filter(m => m.id !== currentMealId);
    saveDataToLocalStorage();
    filterAndRenderMeals();
    updateDashboard();
    closeModal('deleteMealModal');
    showMessage("Meal deleted.");
}


// ========== RESTAURANTS SECTION FUNCTIONALITY ========== //

// Helper function to toggle password visibility on cards
function toggleCardPassword(eyeIcon) {
    const passSpan = eyeIcon.previousElementSibling.querySelector('.password-text');
    const password = passSpan.dataset.password;
    if (passSpan.textContent === '********') {
        passSpan.textContent = password;
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passSpan.textContent = '********';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}


function searchRestaurants() {
    const input = document.getElementById("restaurantSearchInput").value.toLowerCase();
    const filtered = restaurants.filter(r => r.name.toLowerCase().includes(input));
    renderRestaurants(filtered);
}

function renderRestaurants(restaurantList = restaurants) {
    const list = document.querySelector(".restaurant-list");
    list.innerHTML = "";
    restaurantList.forEach(r => {
        const card = document.createElement("div");
        card.className = "restaurant-card";
        card.dataset.restaurantId = r.id;
        card.innerHTML = `
            <div>
                <h2>${r.name}</h2>
                <p style="margin: 5px 0; color: #ccc; font-size: 0.9em;">Username: ${r.username}</p>
                <p style="margin: 5px 0; color: #ccc; font-size: 0.9em;">Email: ${r.email}</p>
                <div class="password-view">
                  <p>Password: <span class="password-text" data-password="${r.password}">********</span></p>
                  <i class="fas fa-eye" onclick="toggleCardPassword(this)"></i>
                </div>
                <p><span class="status-indicator ${r.status === 'Open' ? 'status-active' : 'status-inactive'}">${r.status}</span></p>
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary btn-sm" onclick="viewRestaurantMeals(${r.id})">View Meals</button>
                <button class="btn btn-secondary btn-sm" onclick="toggleRestaurantStatus(${r.id})">Toggle Status</button>
                <button class="btn btn-secondary btn-sm" onclick="openDeleteRestaurantModal(${r.id})">Remove</button>
            </div>`;
        list.appendChild(card);
    });
}

function openAddRestaurantModal() {
  document.getElementById("newRestaurantName").value = '';
  document.getElementById("newRestaurantUsername").value = '';
  document.getElementById("newRestaurantEmail").value = '';
  document.getElementById("newRestaurantPassword").value = '';

  const nameInput = document.getElementById("newRestaurantName");
  const usernameInput = document.getElementById("newRestaurantUsername");
  const emailInput = document.getElementById("newRestaurantEmail");
  
  // Define the handler function for auto-generation
  const handleNameInput = () => {
    // Sanitize the name by removing spaces and converting to lowercase
    const sanitizedName = nameInput.value.trim().replace(/\s+/g, '').toLowerCase();
    // Generate and set username
    usernameInput.value = sanitizedName ? `${sanitizedName}_manager` : '';
    // Generate and set email
    emailInput.value = sanitizedName ? `${sanitizedName}@miuegypt.edu.eg` : '';
  };

  // Attach the event listener
  nameInput.addEventListener('input', handleNameInput);

  // Display the modal
  document.getElementById("addRestaurantModal").style.display = "flex";
}

function addRestaurant() {
  const name = document.getElementById("newRestaurantName").value.trim();
  const username = document.getElementById("newRestaurantUsername").value.trim();
  const email = document.getElementById("newRestaurantEmail").value.trim();
  const password = document.getElementById("newRestaurantPassword").value.trim();
  
  // Correct Regex for password validation: must be exactly 8 digits.
  const passwordRegex = /^\d{8}$/;

  if (!name) {
      showMessage("Restaurant name is required to generate credentials.", "Validation Error");
      return;
  }
  
  // Validate password format
  if (!passwordRegex.test(password)) {
      showMessage("Password must be exactly 8 numbers.", "Validation Error");
      return;
  }

  const newId = restaurants.length > 0 ? Math.max(...restaurants.map(r => r.id)) + 1 : 1;
  
  restaurants.push({ 
      id: newId, 
      name, 
      username, 
      email, 
      password, 
      status: "Open" 
  });
  
  saveDataToLocalStorage();
  renderRestaurants();
  renderDashboardThumbnails();
  populateRestaurantFilter();
  updateDashboard();
  closeModal('addRestaurantModal');
  showMessage("Restaurant added successfully.");
}

function viewRestaurantMeals(restaurantId) {
    showSection('meals');
    document.getElementById('mealRestaurantFilter').value = restaurantId;
    filterAndRenderMeals();
}

function toggleRestaurantStatus(restaurantId) {
    const restaurantIndex = restaurants.findIndex(r => r.id === restaurantId);
    if (restaurantIndex !== -1) {
        restaurants[restaurantIndex].status = restaurants[restaurantIndex].status === "Open" ? "Closed" : "Open";
        saveDataToLocalStorage();
        renderRestaurants();
        showMessage("Restaurant status updated.");
    }
}

function openDeleteRestaurantModal(restaurantId) {
    currentRestaurantId = restaurantId;
    const restaurant = restaurants.find(r => r.id === restaurantId);
    document.getElementById("deleteRestaurantMessage").textContent = `Delete "${restaurant.name}"? This will also delete all its meals.`;
    document.getElementById("deleteRestaurantModal").style.display = "flex";
}

function deleteRestaurant() {
    restaurants = restaurants.filter(r => r.id !== currentRestaurantId);
    meals = meals.filter(m => m.restaurantId !== currentRestaurantId);
    saveDataToLocalStorage();
    renderRestaurants();
    renderDashboardThumbnails();
    filterAndRenderMeals();
    populateRestaurantFilter();
    updateDashboard();
    closeModal('deleteRestaurantModal');
    showMessage("Restaurant deleted.");
}

// ========== LOGOUT FUNCTIONALITY ========== //
function confirmLogout() {
  document.getElementById("logoutModal").style.display = "flex";
}

function logout() {
  closeModal('logoutModal');
  showMessage("Logging out...");
}


// ========== INITIALIZATION & EVENT LISTENERS ========== //
document.addEventListener("DOMContentLoaded", () => {
    loadDataFromLocalStorage();
    
    updateDashboard();
    renderDashboardThumbnails();
    renderUsers();
    renderOrders();
    renderRestaurants();
    renderMeals();
    populateRestaurantFilter();
    initializeChart();

    // Event Listeners
    document.getElementById("restaurantSearchInput").addEventListener("input", searchRestaurants);
    document.querySelector(".time-filter").addEventListener("change", (e) => updateChartData(e.target.value));
    document.getElementById("orderSearchInput").addEventListener("input", searchAndFilterOrders);
    document.getElementById("statusFilter").addEventListener("change", searchAndFilterOrders);
    document.getElementById("userSearchInput").addEventListener("input", searchUsers);
    document.getElementById('mealSearchInput').addEventListener('input', filterAndRenderMeals);
    document.getElementById('mealRestaurantFilter').addEventListener('change', filterAndRenderMeals);
    
    // Modal Button Listeners
    document.getElementById("confirmAddUserBtn").addEventListener("click", addUser);
    document.getElementById("saveRoleChangeBtn").addEventListener("click", saveRoleChange);
    document.getElementById("confirmDeleteUserFinalBtn").addEventListener("click", deleteUser);
    document.getElementById("saveOrderStatusBtn").addEventListener("click", saveOrderStatus);
    document.getElementById("confirmDeleteOrderBtn").addEventListener("click", deleteOrder);
    document.getElementById("confirmAddRestaurantBtn").addEventListener("click", addRestaurant);
    document.getElementById("confirmDeleteRestaurantFinalBtn").addEventListener("click", deleteRestaurant);
    document.getElementById('confirmAddMealBtn').addEventListener('click', addMeal);
    document.getElementById('confirmDeleteMealBtn').addEventListener('click', deleteMeal);
    
    document.getElementById("addUserBtn").addEventListener("click", openAddUserModal);
    document.getElementById("confirmLogoutBtn").addEventListener("click", logout);
    document.getElementById("closeMessageBtn").addEventListener("click", () => closeModal('messageModal'));

    // Event listener for password toggle icon in the add restaurant modal
    const togglePasswordIcon = document.getElementById('togglePasswordIcon');
    const passwordInput = document.getElementById('newRestaurantPassword');
    togglePasswordIcon.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll(".dropdown-content.show").forEach(d => d.classList.remove("show"));
        }
        const dropdownBtn = event.target.closest('.dropdown-btn');
        if (dropdownBtn) {
            const content = dropdownBtn.nextElementSibling;
            const isShown = content.classList.contains('show');
            document.querySelectorAll(".dropdown-content.show").forEach(d => d.classList.remove("show"));
            if (!isShown) content.classList.toggle('show');
        }
    });
});