document.addEventListener("DOMContentLoaded", () => {
  // Sample order data
  const sampleOrders = [
    {
      id: "ORD-2024-001",
      restaurant: "Gyros",
      status: "pending",
      items: "1x Chicken Gyro, 1x Greek Salad, 1x Soda",
      date: "2024-06-13 18:30",
      total: "$18.95",
    },
    {
      id: "ORD-2024-002",
      restaurant: "MY Corner",
      status: "in-progress",
      items: "2x Falafel Wrap, 1x Hummus Plate, 2x Mint Tea",
      date: "2024-06-13 17:15",
      total: "$24.50",
    },
    {
      id: "ORD-2024-003",
      restaurant: "Cinnabon",
      status: "completed",
      items: "1x Classic Roll Pack (6), 2x Coffee",
      date: "2024-06-12 14:20",
      total: "$16.75",
    },
    {
      id: "ORD-2024-004",
      restaurant: "Gyros",
      status: "cancelled",
      items: "1x Lamb Gyro Plate, 1x Baklava",
      date: "2024-06-11 19:45",
      total: "$15.25",
    },
    {
      id: "ORD-2024-005",
      restaurant: "MY Corner",
      status: "completed",
      items: "1x Foul Plate, 2x Falafel Sandwich, 1x Ayran",
      date: "2024-06-10 12:30",
      total: "$22.80",
    },
    {
      id: "ORD-2024-006",
      restaurant: "Cinnabon",
      status: "completed",
      items: "2x Caramel Pecanbon, 1x Cold Brew",
      date: "2024-06-09 16:15",
      total: "$14.95",
    },
  ]

  // Lazy load images with data-src
  const images = document.querySelectorAll("img[data-src]")
  if (images.length) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.add("fade-in")
          img.removeAttribute("data-src")
          observer.unobserve(img)
        }
      })
    })
    images.forEach((img) => imageObserver.observe(img))
  }

  // Search functionality
  const searchInput = document.querySelector(".search-bar input")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim()
      const restaurantCards = document.querySelectorAll(".restaurant-card")
      let found = false
      restaurantCards.forEach((card) => {
        const name = card.querySelector("h2").textContent.toLowerCase()
        const desc = card.querySelector(".description").textContent.toLowerCase()
        const matches = name.includes(searchTerm) || desc.includes(searchTerm)
        if (matches) {
          card.style.display = "block"
          card.style.opacity = "1"
          card.style.transform = "scale(1)"
          found = true
        } else {
          card.style.opacity = "0"
          card.style.transform = "scale(0.8)"
          setTimeout(() => {
            if (!matches) card.style.display = "none"
          }, 300)
        }
      })
      // Show/hide "no results"
      const noResultsMsg = document.getElementById("no-results") || createNoResultsMessage()
      noResultsMsg.style.display = found ? "none" : "block"
    })

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        this.value = ""
        this.dispatchEvent(new Event("input"))
        this.blur()
      }
    })
  }

  // Auth buttons
  document.querySelector(".login-btn")?.addEventListener("click", () => {
    showNotification("Redirecting to login page...", "fa-sign-in-alt")
  })
  document.querySelector(".signup-btn")?.addEventListener("click", () => {
    showNotification("Redirecting to signup page...", "fa-user-plus")
  })

  // Navigation tabs
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()

      // Handle Order History navigation
      if (this.id === "order-history-nav") {
        toggleOrderHistory()
      } else {
        // This is the Restaurants tab
        document.getElementById("order-history-section").style.display = "none"
        document.getElementById("restaurants-grid").style.display = "grid"
      }

      navItems.forEach((i) => i.classList.remove("active"))
      this.classList.add("active")

      showNotification("Switched to: " + this.textContent.trim(), "fa-check-circle")
    })
  })

  // Set Restaurants tab as active by default
  const restaurantsTab = document.querySelector(".nav-item:first-child")
  if (restaurantsTab) {
    restaurantsTab.classList.add("active")
  }

  // Menu buttons
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      showNotification(
        "Viewing menu for " + this.closest(".restaurant-card").querySelector("h2").textContent,
        "fa-utensils",
      )
    })
  })

  // Update restaurant statuses (placeholder)
  updateRestaurantStatuses()
  setInterval(updateRestaurantStatuses, 60000)

  // Intercept all footer links
  document.querySelectorAll(".bolt-footer a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      showNotification("Navigating to: " + this.getAttribute("href"), "fa-link")
    })
  })

  // Initialize order history functionality
  initOrderHistory()

  // Welcome section buttons
  document.querySelector(".primary-btn")?.addEventListener("click", () => {
    // Show restaurants section
    document.getElementById("order-history-section").style.display = "none"
    document.getElementById("restaurants-grid").style.display = "grid"

    // Update active nav
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"))
    document.querySelector(".nav-item:first-child").classList.add("active")

    showNotification("Browsing restaurants", "fa-utensils")

    // Scroll to restaurants section
    document.querySelector(".dashboard-section-title").scrollIntoView({ behavior: "smooth" })
  })

  document.querySelector(".secondary-btn")?.addEventListener("click", () => {
    toggleOrderHistory()
  })
})

// Helper: Show feedback message
function showNotification(message, iconClass = "fa-info-circle") {
  const notification = document.getElementById("notification")
  const messageSpan = document.getElementById("notification-message")
  const icon = notification.querySelector("i")

  messageSpan.textContent = message
  icon.className = `fas ${iconClass}`

  notification.classList.add("show")
  clearTimeout(notification._timeout)
  notification._timeout = setTimeout(() => {
    notification.classList.remove("show")
  }, 2500)
}

// Helper: Create "no results" message
function createNoResultsMessage() {
  const message = document.createElement("div")
  message.id = "no-results"
  message.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--gray-text);">
            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <p>No restaurants found matching your search.</p>
        </div>
    `
  document.querySelector(".restaurants-grid").appendChild(message)
  return message
}

// Placeholder: Update restaurant statuses
function updateRestaurantStatuses() {
  console.log("Updating restaurant statuses...")
}

// Toggle Order History Section
function toggleOrderHistory() {
  const orderHistorySection = document.getElementById("order-history-section")
  const restaurantsGrid = document.getElementById("restaurants-grid")
  const orderHistoryNav = document.getElementById("order-history-nav")

  if (orderHistorySection.style.display === "none") {
    orderHistorySection.style.display = "block"
    restaurantsGrid.style.display = "none"

    // Make sure the nav item is active
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"))
    orderHistoryNav.classList.add("active")

    showNotification("Viewing order history", "fa-history")
  } else {
    orderHistorySection.style.display = "none"
    restaurantsGrid.style.display = "grid"
  }
}

// Initialize Order History
function initOrderHistory() {
  // Sample order data is defined at the top of the file

  // Populate orders
  populateOrders(
    window.sampleOrders || [
      {
        id: "ORD-2024-001",
        restaurant: "Gyros",
        status: "pending",
        items: "1x Chicken Gyro, 1x Greek Salad, 1x Soda",
        date: "2024-06-13 18:30",
        total: "$18.95",
      },
      {
        id: "ORD-2024-002",
        restaurant: "MY Corner",
        status: "in-progress",
        items: "2x Falafel Wrap, 1x Hummus Plate, 2x Mint Tea",
        date: "2024-06-13 17:15",
        total: "$24.50",
      },
      {
        id: "ORD-2024-003",
        restaurant: "Cinnabon",
        status: "completed",
        items: "1x Classic Roll Pack (6), 2x Coffee",
        date: "2024-06-12 14:20",
        total: "$16.75",
      },
      {
        id: "ORD-2024-004",
        restaurant: "Gyros",
        status: "cancelled",
        items: "1x Lamb Gyro Plate, 1x Baklava",
        date: "2024-06-11 19:45",
        total: "$15.25",
      },
      {
        id: "ORD-2024-005",
        restaurant: "MY Corner",
        status: "completed",
        items: "1x Foul Plate, 2x Falafel Sandwich, 1x Ayran",
        date: "2024-06-10 12:30",
        total: "$22.80",
      },
      {
        id: "ORD-2024-006",
        restaurant: "Cinnabon",
        status: "completed",
        items: "2x Caramel Pecanbon, 1x Cold Brew",
        date: "2024-06-09 16:15",
        total: "$14.95",
      },
    ],
  )

  // Set up filter event listeners
  document.getElementById("status-filter").addEventListener("change", filterOrders)
  document.getElementById("date-filter").addEventListener("change", filterOrders)
}

// Populate Orders
function populateOrders(orders) {
  const container = document.getElementById("orders-container")
  const template = document.getElementById("order-template")

  // Clear container
  container.innerHTML = ""

  if (orders.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
                <i class="fas fa-receipt" style="font-size: 2rem; margin-bottom: 1rem; color: var(--gray-500);"></i>
                <p style="color: var(--gray-300);">No orders found.</p>
            </div>
        `
    return
  }

  // Add each order
  orders.forEach((order) => {
    const orderCard = document.createElement("div")
    orderCard.className = "order-card"
    orderCard.dataset.status = order.status
    orderCard.dataset.date = order.date

    orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-id">${order.id}</div>
                <div class="order-status" data-status="${order.status}">
                    ${getStatusText(order.status)}
                </div>
            </div>
            <div class="order-restaurant">${order.restaurant}</div>
            <div class="order-items">${order.items}</div>
            <div class="order-footer">
                <div class="order-date">${formatDate(order.date)}</div>
                <div class="order-total">${order.total}</div>
            </div>
        `

    container.appendChild(orderCard)
  })
}

// Filter Orders
function filterOrders() {
  const statusFilter = document.getElementById("status-filter").value
  const dateFilter = document.getElementById("date-filter").value

  const orderCards = document.querySelectorAll(".order-card")

  orderCards.forEach((card) => {
    const status = card.dataset.status
    const date = new Date(card.dataset.date)
    const today = new Date()

    const showByStatus = statusFilter === "all" || status === statusFilter
    let showByDate = true

    // Apply date filter
    if (dateFilter === "today") {
      showByDate = isSameDay(date, today)
    } else if (dateFilter === "week") {
      showByDate = isThisWeek(date, today)
    } else if (dateFilter === "month") {
      showByDate = isSameMonth(date, today)
    }

    if (showByStatus && showByDate) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// Helper: Get status text with proper capitalization
function getStatusText(status) {
  switch (status) {
    case "pending":
      return "Pending"
    case "in-progress":
      return "In Progress"
    case "completed":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

// Helper: Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Helper: Check if two dates are the same day
function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

// Helper: Check if date is in the current week
function isThisWeek(date, today) {
  const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
  const lastDay = new Date(firstDay)
  lastDay.setDate(lastDay.getDate() + 6)

  return date >= firstDay && date <= lastDay
}

// Helper: Check if two dates are in the same month
function isSameMonth(date1, date2) {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}
