// Data
const restaurants = [
  {
    id: 1,
    name: "R2GO",
    image: "https://via.placeholder.com/320x160",
    status: "open",
    description: "Fast food and beverages for students on the go",
    rating: 4.5,
    reviews: 120,
    tags: ["Fast Food", "Beverages"],
    location: "Campus Center",
  },
  {
    id: 2,
    name: "MY Corner",
    image: "my corner.png",
    status: "open",
    description: "Specialty foods and drinks with a cozy atmosphere",
    rating: 4.7,
    reviews: 150,
    tags: ["Specialty", "Drinks"],
    location: "North Campus",
  },
  {
    id: 3,
    name: "Man'osha",  // Updated name
    image: "https://via.placeholder.com/320x160",
    status: "closed",
    description: "Arabic and international cuisine with authentic flavors",
    rating: 4.6,
    reviews: 200,
    tags: ["Arabic", "International"],
    location: "East Wing",
  },
  {
    id: 4,
    name: "Batates and Zalabya",
    image: "batates and zalabya.png", // Updated image path
    status: "open",
    description: "Fresh french fries and traditional Egyptian desserts",
    rating: 4.8,
    reviews: 180,
    tags: ["Snacks", "Desserts"],
    location: "South Campus",
  }
];

const orders = [
  {
    id: "ORD-2023-0567",
    restaurant: "R2GO",
    image: "https://via.placeholder.com/48",
    items: "Chicken Burger, Fries, Pepsi",
    total: 8.5,
    status: "preparing",
    time: "15 minutes ago",
  },
  {
    id: "ORD-2023-0566",
    restaurant: "MY Corner",
    image: "https://via.placeholder.com/48",
    items: "Alfredo Pasta, Garlic Bread, Orange Juice",
    total: 12.0,
    status: "ready",
    time: "3 hours ago",
  },
];

/*
// Remove or comment out this array
const recommendedItems = [
  // ...existing code...
];
*/

const searchData = [
  { name: "Chicken Burger", type: "meal", restaurant: "R2GO" },
  { name: "Alfredo Pasta", type: "meal", restaurant: "MY Corner" },
  { name: "R2GO", type: "restaurant" },
  { name: "MY Corner", type: "restaurant" },
  { name: "Man'osha", type: "restaurant" },  // Updated name
];

// DOM Elements - Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all DOM elements
  const loadingScreen = document.getElementById("loading-screen");
  const progressFill = document.getElementById("progress-fill");
  const progressPercent = document.getElementById("progress-percent");
  const tipText = document.getElementById("tip-text");
  const sidebar = document.getElementById("sidebar");
  const mobileSidebarToggle = document.getElementById("mobile-sidebar-toggle");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const themeToggle = document.getElementById("theme-toggle");
  const notificationsBtn = document.getElementById("notifications-btn");
  const notificationsPanel = document.getElementById("notifications-panel");
  const closeNotifications = document.getElementById("close-notifications");
  const trackingModal = document.getElementById("tracking-modal");
  const closeModal = document.getElementById("close-modal");
  const toast = document.getElementById("toast");
  const closeToast = document.getElementById("close-toast");
  const logoutBtn = document.getElementById("logout-btn");
  const restaurantsGrid = document.querySelector(".restaurants-grid");
  const ordersGrid = document.querySelector(".orders-grid");
  const termsModal = document.getElementById("terms-modal");
  const acceptTermsBtn = document.getElementById("accept-terms");
  const declineTermsBtn = document.getElementById("decline-terms");
  const viewTermsLink = document.getElementById("view-terms-link");

  // Check if user has accepted terms
  const hasAcceptedTerms = localStorage.getItem("acceptedTerms");

  // Start loading animation when page loads
  simulateLoading();

  // Main Functions
  function simulateLoading() {
    console.log("Starting loading simulation");
    
    if (!loadingScreen || !progressFill || !progressPercent || !tipText) {
      console.error("Loading screen elements not found!");
      return;
    }

    let progress = 0;
    const tips = [
      "Ordering your favorite campus food just got easier!",
      "Track your orders in real-time",
      "Find the best deals from campus restaurants",
      "Quick and easy pickup from multiple locations"
    ];

    const interval = setInterval(() => {
      progress += 2;
      progressFill.style.width = `${progress}%`;
      progressPercent.textContent = `${progress}%`;
      console.log(`Progress: ${progress}%`);

      if (progress % 25 === 0) {
        const tipIndex = Math.floor(progress / 25) - 1;
        if (tips[tipIndex]) {
          tipText.textContent = tips[tipIndex];
          tipText.style.opacity = "0";
          setTimeout(() => {
            tipText.style.opacity = "1";
          }, 150);
        }
      }

      if (progress >= 100) {
        console.log("Loading complete");
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.style.opacity = "0";
          setTimeout(() => {
            loadingScreen.style.display = "none";
            if (!hasAcceptedTerms) {
              showTermsModal();
            } else {
              showWelcomeToast();
            }
          }, 500);
        }, 500);
      }
    }, 50);
  }

  function showTermsModal() {
    termsModal.classList.remove("hidden");
  }

  function hideTermsModal() {
    termsModal.classList.add("hidden");
  }

  function showWelcomeToast() {
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 5000);
  }

  function toggleSidebar() {
    sidebar.classList.toggle("open");
  }

  function handleSearch() {
    const value = searchInput.value.toLowerCase();

    if (value.length > 0) {
      const filtered = searchData.filter((item) => 
        item.name.toLowerCase().includes(value)
      );
      renderSearchResults(filtered);
      searchResults.classList.remove("hidden");
    } else {
      searchResults.classList.add("hidden");
    }
  }

  function renderSearchResults(results) {
    searchResults.innerHTML = "";

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="p-3 text-center">No results found</div>';
      return;
    }

    results.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.className = "p-3 hover:bg-accent/10 cursor-pointer flex items-center gap-2";

      const icon = document.createElement("span");
      icon.innerHTML = item.type === "meal" ?
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path></svg>' :
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path><path d="M18 12V7"></path><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path><path d="M10 12V7"></path><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path><path d="M2 12V7"></path></svg>';

      const content = document.createElement("span");
      content.textContent = item.name;

      resultItem.appendChild(icon);
      resultItem.appendChild(content);

      if (item.restaurant) {
        const restaurantName = document.createElement("span");
        restaurantName.className = "text-xs text-muted-foreground ml-auto";
        restaurantName.textContent = item.restaurant;
        resultItem.appendChild(restaurantName);
      }

      resultItem.addEventListener("click", () => {
        searchInput.value = item.name;
        searchResults.classList.add("hidden");
      });

      searchResults.appendChild(resultItem);
    });
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
  }

  function toggleNotifications() {
    notificationsPanel.classList.toggle("hidden");
  }

  function openTrackingModal(orderId) {
    document.getElementById("tracking-order-id").textContent = orderId;
    trackingModal.classList.remove("hidden");
  }

  function closeTrackingModal() {
    trackingModal.classList.add("hidden");
  }

  function renderRestaurants() {
    restaurantsGrid.innerHTML = "";

    restaurants.forEach((restaurant) => {
      const restaurantCard = document.createElement("div");
      restaurantCard.className = "restaurant-card";

      const imageContainer = document.createElement("div");
      imageContainer.className = "restaurant-image";

      const image = document.createElement("img");
      image.src = restaurant.image;
      image.alt = restaurant.name;
      imageContainer.appendChild(image);

      const statusBadge = document.createElement("div");
      statusBadge.className = `status-badge ${restaurant.status === "open" ? "open-badge" : "closed-badge"}`;
      statusBadge.textContent = restaurant.status === "open" ? "Open" : "Closed";
      imageContainer.appendChild(statusBadge);

      restaurantCard.appendChild(imageContainer);

      const content = document.createElement("div");
      content.className = "restaurant-content";

      const header = document.createElement("div");
      header.className = "restaurant-header";

      const name = document.createElement("h3");
      name.className = "restaurant-name";
      name.textContent = restaurant.name;
      header.appendChild(name);

      const rating = document.createElement("div");
      rating.className = "restaurant-rating";
      rating.innerHTML = `<span class="restaurant-rating-value">${restaurant.rating.toFixed(1)}</span> <span class="restaurant-reviews">(${restaurant.reviews} reviews)</span>`;
      header.appendChild(rating);

      content.appendChild(header);

      const description = document.createElement("p");
      description.className = "restaurant-description";
      description.textContent = restaurant.description;
      content.appendChild(description);

      const tags = document.createElement("div");
      tags.className = "restaurant-tags";
      restaurant.tags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.className = "restaurant-tag";
        tagElement.textContent = tag;
        tags.appendChild(tagElement);
      });
      content.appendChild(tags);

      const info = document.createElement("div");
      info.className = "restaurant-info";

      const location = document.createElement("div");
      location.className = "restaurant-location";
      location.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${restaurant.location}`;
      info.appendChild(location);

      content.appendChild(info);

      const viewButton = document.createElement("button");
      viewButton.className = "view-menu-button";
      viewButton.textContent = "View Menu";
      content.appendChild(viewButton);

      restaurantCard.appendChild(content);
      restaurantsGrid.appendChild(restaurantCard);
    });
  }

  function renderOrders() {
    ordersGrid.innerHTML = "";

    orders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.className = "order-card";

      const header = document.createElement("div");
      header.className = "order-header";

      const headerContent = document.createElement("div");
      headerContent.className = "order-header-content";

      const orderId = document.createElement("span");
      orderId.className = "order-id";
      orderId.textContent = order.id;
      headerContent.appendChild(orderId);

      const orderStatus = document.createElement("span");
      orderStatus.className = `order-status ${order.status === "ready" ? "delivered-status" : "preparing-status"}`;
      orderStatus.textContent = order.status === "ready" ? "Ready" : "Preparing";
      headerContent.appendChild(orderStatus);

      header.appendChild(headerContent);

      const orderTime = document.createElement("div");
      orderTime.className = "order-time";
      orderTime.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${order.time}`;
      header.appendChild(orderTime);

      orderCard.appendChild(header);

      const content = document.createElement("div");
      content.className = "order-content";

      const restaurant = document.createElement("div");
      restaurant.className = "order-restaurant";

      const restaurantImg = document.createElement("img");
      restaurantImg.className = "restaurant-img";
      restaurantImg.src = order.image;
      restaurantImg.alt = order.restaurant;
      restaurant.appendChild(restaurantImg);

      const details = document.createElement("div");
      details.className = "order-details";

      const restaurantName = document.createElement("h4");
      restaurantName.className = "restaurant-name";
      restaurantName.textContent = order.restaurant;
      details.appendChild(restaurantName);

      const orderItems = document.createElement("p");
      orderItems.className = "order-items";
      orderItems.textContent = order.items;
      details.appendChild(orderItems);

      restaurant.appendChild(details);
      content.appendChild(restaurant);

      const price = document.createElement("div");
      price.className = "order-price";
      price.textContent = `E£ ${order.total.toFixed(2)}`;
      content.appendChild(price);

      orderCard.appendChild(content);

      const footer = document.createElement("div");
      footer.className = "order-footer";

      const trackButton = document.createElement("button");
      trackButton.className = "track-button";
      trackButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> Track`;
      trackButton.addEventListener("click", () => openTrackingModal(order.id));
      footer.appendChild(trackButton);

      const detailsButton = document.createElement("button");
      detailsButton.className = "details-button";
      detailsButton.textContent = "Details";
      footer.appendChild(detailsButton);

      orderCard.appendChild(footer);
      ordersGrid.appendChild(orderCard);
    });
  }

  // Event Listeners
  mobileSidebarToggle.addEventListener("click", toggleSidebar);
  searchInput.addEventListener("input", handleSearch);
  themeToggle.addEventListener("click", toggleTheme);
  notificationsBtn.addEventListener("click", toggleNotifications);
  closeNotifications.addEventListener("click", toggleNotifications);
  closeModal.addEventListener("click", closeTrackingModal);
  closeToast.addEventListener("click", () => toast.classList.add("hidden"));
  logoutBtn.addEventListener("click", () => alert("Logout clicked"));

  // Terms and Conditions
  if (!hasAcceptedTerms) {
    setTimeout(() => {
      showTermsModal();
    }, 1000);
  }

  acceptTermsBtn.addEventListener("click", () => {
    localStorage.setItem("acceptedTerms", "true");
    hideTermsModal();
    showWelcomeToast();
  });

  declineTermsBtn.addEventListener("click", () => {
    alert("You must accept the terms and conditions to use QuickBite.");
    window.location.href = "https://miu.edu";
  });

  viewTermsLink.addEventListener("click", (e) => {
    e.preventDefault();
    showTermsModal();
  });

  // Initial Render
  renderRestaurants();
  renderOrders();
});