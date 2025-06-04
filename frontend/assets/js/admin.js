// Data Models
class User {
  constructor(id, name, email, role, status, lastActive, orders = []) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.status = status;
    this.lastActive = lastActive;
    this.orders = orders;
  }
}

class Restaurant {
  constructor(id, name, category, status, image, description) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.status = status;
    this.image = image;
    this.description = description;
  }
}

class Order {
  constructor(id, userId, restaurantId, amount, time, status, items = []) {
    this.id = id;
    this.userId = userId;
    this.restaurantId = restaurantId;
    this.amount = amount;
    this.time = time;
    this.status = status;
    this.items = items;
  }
}

// Data Store
class DataStore {
  constructor() {
    this.users = [];
    this.restaurants = [];
    this.orders = [];
    this.currentUserPage = 1;
    this.currentOrderPage = 1;
    this.itemsPerPage = 10;
  }

  // Initialize with sample data
  initialize() {
    this.users = [
      new User(1, "Salma", "salma2300364@miuegypt.edu.eg", "Student", "Active", "2024-05-15 14:30", [
        { id: 101, restaurant: "My Corner", amount: "35", time: "2024-05-01 14:30", status: "Completed" }
      ]),
      new User(2, "Nimo", "nimo2303638@miuegypt.edu.eg", "Staff", "Active", "2024-05-16 09:15", [
        { id: 102, restaurant: "R to go", amount: "12", time: "2024-05-03 09:00", status: "Pending" }
      ]),
      new User(3, "Admin", "admin@miuegypt.edu.eg", "Admin", "Active", "2024-05-16 10:45", [])
    ];

    this.restaurants = [
      new Restaurant(1, "My Corner", "Fast Food", "Active", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", "Popular spot for quick meals"),
      new Restaurant(2, "R to go", "Casual Dining", "Active", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", "Great place for group dining"),
      new Restaurant(3, "Gyro", "Fast Food", "Inactive", "https://images.unsplash.com/photo-1559847844-5315695dadae", "Mediterranean cuisine")
    ];

    this.orders = [
      new Order(1001, 1, 1, "35", "2024-05-16 12:30", "Completed", [
        { name: "Burger", quantity: 1, price: "20" },
        { name: "Fries", quantity: 1, price: "10" },
        { name: "Soda", quantity: 1, price: "5" }
      ]),
      new Order(1002, 2, 3, "150", "2024-05-16 13:45", "Pending", [
        { name: "Chicken Shawarma", quantity: 2, price: "60" },
        { name: "Falafel Plate", quantity: 1, price: "30" }
      ]),
      new Order(1003, 1, 2, "75", "2024-05-15 19:30", "Completed", [
        { name: "Pasta", quantity: 1, price: "45" },
        { name: "Salad", quantity: 1, price: "30" }
      ])
    ];
  }

  // User methods
  addUser(user) {
    this.users.push(user);
  }

  updateUser(id, updatedUser) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }

  deleteUser(id) {
    this.users = this.users.filter(u => u.id !== id);
  }

  // Restaurant methods
  addRestaurant(restaurant) {
    this.restaurants.push(restaurant);
  }

  updateRestaurant(id, updatedRestaurant) {
    const index = this.restaurants.findIndex(r => r.id === id);
    if (index !== -1) {
      this.restaurants[index] = updatedRestaurant;
    }
  }

  deleteRestaurant(id) {
    this.restaurants = this.restaurants.filter(r => r.id !== id);
  }

  // Order methods
  addOrder(order) {
    this.orders.push(order);
  }

  updateOrder(id, updatedOrder) {
    const index = this.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    }
  }

  deleteOrder(id) {
    this.orders = this.orders.filter(o => o.id !== id);
  }

  // Pagination methods
  getPaginatedUsers(page = 1) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return {
      data: this.users.slice(startIndex, endIndex),
      totalPages: Math.ceil(this.users.length / this.itemsPerPage),
      currentPage: page
    };
  }

  getPaginatedOrders(page = 1) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return {
      data: this.orders.slice(startIndex, endIndex),
      totalPages: Math.ceil(this.orders.length / this.itemsPerPage),
      currentPage: page
    };
  }
}

// UI Controller
class UIController {
  constructor() {
    this.dataStore = new DataStore();
    this.dataStore.initialize();
    this.charts = {};
    this.initEventListeners();
    this.showSection('dashboard');
    this.updateDashboard();
    this.renderUsers();
    this.renderRestaurants();
    this.renderOrders();
  }

  initEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar li').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.getAttribute('data-section');
        this.showSection(section);
      });
    });

    // Restaurant section
    document.getElementById('addRestaurantBtn').addEventListener('click', () => this.showAddRestaurantModal());
    document.getElementById('restaurantSearch').addEventListener('input', () => this.filterRestaurants());
    document.getElementById('restaurantStatusFilter').addEventListener('change', () => this.filterRestaurants());
    document.getElementById('saveRestaurantBtn').addEventListener('click', () => this.saveRestaurant());
    document.getElementById('cancelRestaurantBtn').addEventListener('click', () => this.closeModal('addRestaurantModal'));

    // User section
    document.getElementById('addUserBtn').addEventListener('click', () => this.showAddUserModal());
    document.getElementById('userSearchInput').addEventListener('input', () => this.filterUsers());
    document.getElementById('userRoleFilter').addEventListener('change', () => this.filterUsers());
    document.getElementById('userStatusFilter').addEventListener('change', () => this.filterUsers());
    document.getElementById('saveUserBtn').addEventListener('click', () => this.saveUser());
    document.getElementById('cancelUserBtn').addEventListener('click', () => this.closeModal('addUserModal'));

    // Order section
    document.getElementById('orderSearchInput').addEventListener('input', () => this.filterOrders());
    document.getElementById('statusFilter').addEventListener('change', () => this.filterOrders());
    document.getElementById('orderDateFilter').addEventListener('change', () => this.filterOrders());
    document.getElementById('exportOrdersBtn').addEventListener('click', () => this.exportOrders());
    document.getElementById('closeOrderDetailsBtn').addEventListener('click', () => this.closeModal('orderDetailsModal'));

    // Pagination
    document.getElementById('prevPageBtn').addEventListener('click', () => this.prevOrderPage());
    document.getElementById('nextPageBtn').addEventListener('click', () => this.nextOrderPage());
    document.getElementById('prevUserPageBtn').addEventListener('click', () => this.prevUserPage());
    document.getElementById('nextUserPageBtn').addEventListener('click', () => this.nextUserPage());

    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
      }
    });
  }

  // Section Navigation
  showSection(sectionId) {
    // Update active state in sidebar
    document.querySelectorAll('.sidebar li').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === sectionId) {
        item.classList.add('active');
      }
    });

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add('active');
      document.getElementById('page-title').textContent = section.querySelector('h2').textContent;

      // Initialize section-specific content
      switch(sectionId) {
        case 'dashboard':
          this.updateDashboard();
          break;
        case 'analytics':
          this.renderAnalytics();
          break;
      }
    }
  }

  // Modal Handling
  showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
  }

  closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }

  showAddRestaurantModal() {
    document.getElementById('addRestaurantForm').reset();
    this.showModal('addRestaurantModal');
  }

  showAddUserModal() {
    document.getElementById('addUserForm').reset();
    this.showModal('addUserModal');
  }

  showOrderDetailsModal(orderId) {
    const order = this.dataStore.orders.find(o => o.id === orderId);
    if (!order) return;

    const user = this.dataStore.users.find(u => u.id === order.userId);
    const restaurant = this.dataStore.restaurants.find(r => r.id === order.restaurantId);

    let content = `
      <div class="order-details-header">
        <h4>Order #${order.id}</h4>
        <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
      </div>
      <div class="order-info-grid">
        <div class="order-info-item">
          <span class="info-label">Customer:</span>
          <span class="info-value">${user ? user.name : 'Unknown'}</span>
        </div>
        <div class="order-info-item">
          <span class="info-label">Restaurant:</span>
          <span class="info-value">${restaurant ? restaurant.name : 'Unknown'}</span>
        </div>
        <div class="order-info-item">
          <span class="info-label">Order Date:</span>
          <span class="info-value">${order.time}</span>
        </div>
        <div class="order-info-item">
          <span class="info-label">Total Amount:</span>
          <span class="info-value">${order.amount} EGP</span>
        </div>
      </div>
      <div class="order-items">
        <h5>Order Items</h5>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>`;

    order.items.forEach(item => {
      const total = parseInt(item.price) * item.quantity;
      content += `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price} EGP</td>
              <td>${total} EGP</td>
            </tr>`;
    });

    content += `
          </tbody>
        </table>
      </div>`;

    document.getElementById('orderDetailsContent').innerHTML = content;
    this.showModal('orderDetailsModal');
  }

  // Dashboard Functions
  updateDashboard() {
    // Update stats
    document.getElementById('userCount').textContent = this.dataStore.users.length;
    document.getElementById('restaurantCount').textContent = this.dataStore.restaurants.length;
    document.getElementById('orderCount').textContent = this.dataStore.orders.length;
    
    const pendingOrders = this.dataStore.orders.filter(o => o.status === 'Pending').length;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = this.dataStore.orders.filter(o => o.time.includes(today)).length;
    document.getElementById('todayOrders').textContent = todayOrders;
    
    const revenue = this.dataStore.orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + parseFloat(o.amount), 0);
    document.getElementById('totalRevenue').textContent = `${revenue} EGP`;
    
    // Find top restaurant
    const restaurantCount = {};
    this.dataStore.orders.forEach(o => {
      const restaurant = this.dataStore.restaurants.find(r => r.id === o.restaurantId);
      if (restaurant) {
        restaurantCount[restaurant.name] = (restaurantCount[restaurant.name] || 0) + 1;
      }
    });
    const topRestaurant = Object.entries(restaurantCount).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('popularRestaurant').textContent = topRestaurant ? topRestaurant[0] : '-';
    
    // Find top user
    const userCount = {};
    this.dataStore.orders.forEach(o => {
      const user = this.dataStore.users.find(u => u.id === o.userId);
      if (user) {
        userCount[user.name] = (userCount[user.name] || 0) + 1;
      }
    });
    const topUser = Object.entries(userCount).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('activeUser').textContent = topUser ? topUser[0] : '-';
    
    // Render recent orders
    this.renderRecentOrders();
    
    // Render charts if on dashboard
    if (document.getElementById('dashboard').classList.contains('active')) {
      this.renderCharts();
    }
  }

  renderRecentOrders() {
    const container = document.getElementById('recentOrdersList');
    container.innerHTML = '';
    
    // Get 5 most recent orders
    const recentOrders = [...this.dataStore.orders]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
    
    recentOrders.forEach(order => {
      const user = this.dataStore.users.find(u => u.id === order.userId);
      const restaurant = this.dataStore.restaurants.find(r => r.id === order.restaurantId);
      
      const orderEl = document.createElement('div');
      orderEl.className = 'order-item';
      orderEl.innerHTML = `
        <div class="order-info">
          <span class="order-name">Order #${order.id}</span>
          <span class="order-restaurant">${restaurant ? restaurant.name : 'Unknown'} • ${user ? user.name : 'Unknown'}</span>
        </div>
        <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
      `;
      orderEl.addEventListener('click', () => this.showOrderDetailsModal(order.id));
      container.appendChild(orderEl);
    });
  }

  renderCharts() {
    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    const ordersData = this.getOrdersChartData();
    
    if (this.charts.ordersChart) {
      this.charts.ordersChart.destroy();
    }
    
    this.charts.ordersChart = new Chart(ordersCtx, {
      type: 'line',
      data: {
        labels: ordersData.labels,
        datasets: [{
          label: 'Orders',
          data: ordersData.values,
          borderColor: '#FF4B4B',
          backgroundColor: 'rgba(255, 75, 75, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueData = this.getRevenueChartData();
    
    if (this.charts.revenueChart) {
      this.charts.revenueChart.destroy();
    }
    
    this.charts.revenueChart = new Chart(revenueCtx, {
      type: 'bar',
      data: {
        labels: revenueData.labels,
        datasets: [{
          label: 'Revenue (EGP)',
          data: revenueData.values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getOrdersChartData() {
    // Sample data - in a real app, you would group orders by date
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [12, 19, 15, 22, 18, 25]
    };
  }

  getRevenueChartData() {
    // Sample data - in a real app, you would calculate revenue by period
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [1200, 1900, 1500, 2200, 1800, 2500]
    };
  }

  // User Management
  renderUsers() {
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';
    
    const { data: users, totalPages, currentPage } = this.dataStore.getPaginatedUsers(this.dataStore.currentUserPage);
    
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><span class="status-${user.status.toLowerCase()}">${user.status}</span></td>
        <td>${user.lastActive}</td>
        <td>
          <div class="dropdown">
            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
              Actions
            </button>
            <div class="dropdown-menu">
              <button class="dropdown-item" onclick="uiController.viewUserOrders(${user.id})">View Orders</button>
              <button class="dropdown-item" onclick="uiController.toggleUserStatus(${user.id})">${user.status === 'Active' ? 'Suspend' : 'Activate'}</button>
              <button class="dropdown-item" onclick="uiController.promoteUser(${user.id})">Make ${user.role === 'Admin' ? 'Regular User' : 'Admin'}</button>
              <button class="dropdown-item text-danger" onclick="uiController.deleteUser(${user.id})">Delete</button>
            </div>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
    
    // Update pagination info
    document.getElementById('userPageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevUserPageBtn').disabled = currentPage === 1;
    document.getElementById('nextUserPageBtn').disabled = currentPage === totalPages;
  }

  filterUsers() {
    const searchTerm = document.getElementById('userSearchInput').value.toLowerCase();
    const roleFilter = document.getElementById('userRoleFilter').value;
    const statusFilter = document.getElementById('userStatusFilter').value;
    
    let filteredUsers = this.dataStore.users;
    
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    if (roleFilter) {
      filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter) {
      filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
    }
    
    // Update data store with filtered users temporarily
    const originalUsers = this.dataStore.users;
    this.dataStore.users = filteredUsers;
    this.renderUsers();
    // Restore original users
    this.dataStore.users = originalUsers;
  }

  saveUser() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const status = document.querySelector('input[name="userStatus"]:checked').value;
    
    if (!name || !email) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newUser = new User(
      this.dataStore.users.length + 1,
      name,
      email,
      role,
      status,
      new Date().toISOString()
    );
    
    this.dataStore.addUser(newUser);
    this.closeModal('addUserModal');
    this.renderUsers();
    this.updateDashboard();
  }

  viewUserOrders(userId) {
    const user = this.dataStore.users.find(u => u.id === userId);
    if (!user || user.orders.length === 0) {
      alert(`${user.name} has no orders.`);
      return;
    }
    
    let ordersList = user.orders.map(order => {
      return `• Order #${order.id} at ${order.restaurant} - ${order.amount} EGP - ${order.time} - ${order.status}`;
    }).join('\n');
    
    alert(`Order history for ${user.name}:\n\n${ordersList}`);
  }

  toggleUserStatus(userId) {
    const user = this.dataStore.users.find(u => u.id === userId);
    if (!user) return;
    
    user.status = user.status === 'Active' ? 'Suspended' : 'Active';
    this.renderUsers();
  }

  promoteUser(userId) {
    const user = this.dataStore.users.find(u => u.id === userId);
    if (!user) return;
    
    user.role = user.role === 'Admin' ? 'Student' : 'Admin';
    this.renderUsers();
  }

  deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.dataStore.deleteUser(userId);
      this.renderUsers();
      this.updateDashboard();
    }
  }

  // Restaurant Management
  renderRestaurants() {
    const container = document.getElementById('restaurantListContainer');
    container.innerHTML = '';
    
    this.dataStore.restaurants.forEach(restaurant => {
      const card = document.createElement('div');
      card.className = 'restaurant-card';
      card.innerHTML = `
        <div class="restaurant-image" style="background-image: url('${restaurant.image}')"></div>
        <div class="restaurant-content">
          <h3 class="restaurant-name">${restaurant.name}</h3>
          <span class="restaurant-category">${restaurant.category}</span>
          <span class="restaurant-status ${restaurant.status.toLowerCase()}">${restaurant.status}</span>
          <p class="restaurant-description">${restaurant.description}</p>
          <div class="restaurant-actions">
            <button class="btn btn-sm btn-primary" onclick="uiController.editRestaurant(${restaurant.id})">Edit</button>
            <button class="btn btn-sm ${restaurant.status === 'Active' ? 'btn-warning' : 'btn-success'}" 
              onclick="uiController.toggleRestaurantStatus(${restaurant.id})">
              ${restaurant.status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>
            <button class="btn btn-sm btn-danger" onclick="uiController.deleteRestaurant(${restaurant.id})">Delete</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  filterRestaurants() {
    const searchTerm = document.getElementById('restaurantSearch').value.toLowerCase();
    const statusFilter = document.getElementById('restaurantStatusFilter').value;
    
    let filteredRestaurants = this.dataStore.restaurants;
    
    if (searchTerm) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm) || 
        restaurant.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (statusFilter) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.status === statusFilter);
    }
    
    // Update UI with filtered restaurants
    const container = document.getElementById('restaurantListContainer');
    container.innerHTML = '';
    
    filteredRestaurants.forEach(restaurant => {
      const card = document.createElement('div');
      card.className = 'restaurant-card';
      card.innerHTML = `
        <div class="restaurant-image" style="background-image: url('${restaurant.image}')"></div>
        <div class="restaurant-content">
          <h3 class="restaurant-name">${restaurant.name}</h3>
          <span class="restaurant-category">${restaurant.category}</span>
          <span class="restaurant-status ${restaurant.status.toLowerCase()}">${restaurant.status}</span>
          <p class="restaurant-description">${restaurant.description}</p>
          <div class="restaurant-actions">
            <button class="btn btn-sm btn-primary" onclick="uiController.editRestaurant(${restaurant.id})">Edit</button>
            <button class="btn btn-sm ${restaurant.status === 'Active' ? 'btn-warning' : 'btn-success'}" 
              onclick="uiController.toggleRestaurantStatus(${restaurant.id})">
              ${restaurant.status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>
            <button class="btn btn-sm btn-danger" onclick="uiController.deleteRestaurant(${restaurant.id})">Delete</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  saveRestaurant() {
    const name = document.getElementById('restaurantName').value;
    const description = document.getElementById('restaurantDescription').value;
    const category = document.getElementById('restaurantCategory').value;
    const status = document.querySelector('input[name="restaurantStatus"]:checked').value;
    const imageFile = document.getElementById('restaurantImage').files[0];
    
    if (!name) {
      alert('Please enter a restaurant name');
      return;
    }
    
    // In a real app, you would upload the image and get a URL
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4';
    
    const newRestaurant = new Restaurant(
      this.dataStore.restaurants.length + 1,
      name,
      category,
      status,
      imageUrl,
      description
    );
    
    this.dataStore.addRestaurant(newRestaurant);
    this.closeModal('addRestaurantModal');
    this.renderRestaurants();
    this.updateDashboard();
  }

  editRestaurant(restaurantId) {
    const restaurant = this.dataStore.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    document.getElementById('restaurantName').value = restaurant.name;
    document.getElementById('restaurantDescription').value = restaurant.description;
    document.getElementById('restaurantCategory').value = restaurant.category;
    document.querySelector(`input[name="restaurantStatus"][value="${restaurant.status}"]`).checked = true;
    
    // Store the restaurant ID in a data attribute for the save function
    document.getElementById('saveRestaurantBtn').setAttribute('data-restaurant-id', restaurantId);
    
    this.showModal('addRestaurantModal');
  }

  toggleRestaurantStatus(restaurantId) {
    const restaurant = this.dataStore.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    restaurant.status = restaurant.status === 'Active' ? 'Inactive' : 'Active';
    this.renderRestaurants();
  }

  deleteRestaurant(restaurantId) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.dataStore.deleteRestaurant(restaurantId);
      this.renderRestaurants();
      this.updateDashboard();
    }
  }

  // Order Management
  renderOrders() {
    const tbody = document.querySelector('#orderTable tbody');
    tbody.innerHTML = '';
    
    const { data: orders, totalPages, currentPage } = this.dataStore.getPaginatedOrders(this.dataStore.currentOrderPage);
    
    orders.forEach(order => {
      const user = this.dataStore.users.find(u => u.id === order.userId);
      const restaurant = this.dataStore.restaurants.find(r => r.id === order.restaurantId);
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${user ? user.name : 'Unknown'}</td>
        <td>${restaurant ? restaurant.name : 'Unknown'}</td>
        <td>${order.amount} EGP</td>
        <td>${order.time}</td>
        <td><span class="status-${order.status.toLowerCase()}">${order.status}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="uiController.showOrderDetailsModal(${order.id})">Details</button>
          <button class="btn btn-sm btn-secondary" onclick="uiController.changeOrderStatus(${order.id})">Change Status</button>
        </td>
      `;
      tbody.appendChild(row);
    });
    
    // Update pagination info
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
  }

  filterOrders() {
    const searchTerm = document.getElementById('orderSearchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('orderDateFilter').value;
    
    let filteredOrders = this.dataStore.orders;
    
    if (searchTerm) {
      filteredOrders = filteredOrders.filter(order => {
        const user = this.dataStore.users.find(u => u.id === order.userId);
        const restaurant = this.dataStore.restaurants.find(r => r.id === order.restaurantId);
        return (
          (user && user.name.toLowerCase().includes(searchTerm)) ||
          (restaurant && restaurant.name.toLowerCase().includes(searchTerm)) ||
          order.id.toString().includes(searchTerm)
        );
      });
    }
    
    if (statusFilter) {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    if (dateFilter) {
      filteredOrders = filteredOrders.filter(order => order.time.includes(dateFilter));
    }
    
    // Update data store with filtered orders temporarily
    const originalOrders = this.dataStore.orders;
    this.dataStore.orders = filteredOrders;
    this.renderOrders();
    // Restore original orders
    this.dataStore.orders = originalOrders;
  }

  changeOrderStatus(orderId) {
    const order = this.dataStore.orders.find(o => o.id === orderId);
    if (!order) return;
    
    const newStatus = prompt('Enter new status (Pending, Completed, Cancelled):', order.status);
    if (newStatus && ['Pending', 'Completed', 'Cancelled'].includes(newStatus)) {
      order.status = newStatus;
      this.renderOrders();
      this.updateDashboard();
    }
  }

  exportOrders() {
    // In a real app, this would generate a CSV or Excel file
    alert('Export functionality would generate a file with all order data');
  }

  prevOrderPage() {
    if (this.dataStore.currentOrderPage > 1) {
      this.dataStore.currentOrderPage--;
      this.renderOrders();
    }
  }

  nextOrderPage() {
    const { totalPages } = this.dataStore.getPaginatedOrders();
    if (this.dataStore.currentOrderPage < totalPages) {
      this.dataStore.currentOrderPage++;
      this.renderOrders();
    }
  }

  prevUserPage() {
    if (this.dataStore.currentUserPage > 1) {
      this.dataStore.currentUserPage--;
      this.renderUsers();
    }
  }

  nextUserPage() {
    const { totalPages } = this.dataStore.getPaginatedUsers();
    if (this.dataStore.currentUserPage < totalPages) {
      this.dataStore.currentUserPage++;
      this.renderUsers();
    }
  }

  // Analytics
  renderAnalytics() {
    this.renderCharts();
    this.renderAdditionalAnalytics();
  }

  renderAdditionalAnalytics() {
    // Users Chart
    const usersCtx = document.getElementById('usersChart').getContext('2d');
    const usersData = this.getUsersChartData();
    
    if (this.charts.usersChart) {
      this.charts.usersChart.destroy();
    }
    
    this.charts.usersChart = new Chart(usersCtx, {
      type: 'line',
      data: {
        labels: usersData.labels,
        datasets: [{
          label: 'Users',
          data: usersData.values,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // Restaurants Chart
    const restaurantsCtx = document.getElementById('restaurantsChart').getContext('2d');
    const restaurantsData = this.getRestaurantsChartData();
    
    if (this.charts.restaurantsChart) {
      this.charts.restaurantsChart.destroy();
    }
    
    this.charts.restaurantsChart = new Chart(restaurantsCtx, {
      type: 'bar',
      data: {
        labels: restaurantsData.labels,
        datasets: [{
          label: 'Orders',
          data: restaurantsData.values,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // Order Status Chart
    const orderStatusCtx = document.getElementById('orderStatusChart').getContext('2d');
    const orderStatusData = this.getOrderStatusData();
    
    if (this.charts.orderStatusChart) {
      this.charts.orderStatusChart.destroy();
    }
    
    this.charts.orderStatusChart = new Chart(orderStatusCtx, {
      type: 'doughnut',
      data: {
        labels: orderStatusData.labels,
        datasets: [{
          data: orderStatusData.values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  getUsersChartData() {
    // Sample data
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [50, 75, 90, 110, 130, 150]
    };
  }

  getRestaurantsChartData() {
    // Count orders per restaurant
    const restaurantOrders = {};
    this.dataStore.orders.forEach(order => {
      const restaurant = this.dataStore.restaurants.find(r => r.id === order.restaurantId);
      if (restaurant) {
        restaurantOrders[restaurant.name] = (restaurantOrders[restaurant.name] || 0) + 1;
      }
    });
    
    const labels = Object.keys(restaurantOrders);
    const values = Object.values(restaurantOrders);
    
    return { labels, values };
  }

  getOrderStatusData() {
    const statusCount = {
      'Pending': 0,
      'Completed': 0,
      'Cancelled': 0
    };
    
    this.dataStore.orders.forEach(order => {
      statusCount[order.status]++;
    });
    
    return {
      labels: Object.keys(statusCount),
      values: Object.values(statusCount)
    };
  }
}

// Initialize the application
const uiController = new UIController();