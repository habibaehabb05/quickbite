/* Base styles */
:root {
  --background: #1A1A1A;
  --card-bg: #2A2A2A;
  --white: #FFFFFF;
  --brand-color: #FF4B4B;
  --brand-secondary: #FFB168;
  --completed-color: #4CAF50; /* Green for Completed */
  --pending-color: #FF9800; /* Orange for Pending */
  --cancelled-color: #F44336; /* Red for Cancelled */
  --input-bg: #333333;
  --hover-bg: rgba(255, 255, 255, 0.1);
  --border-radius: 8px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  height: 100vh;
  background: var(--background);
  color: var(--white);
  overflow-x: hidden;
}

/* Sidebar styles */
.sidebar {
  width: 200px;
  background-color: var(--card-bg);
  color: var(--white);
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px);
  position: sticky;
  top: 0;
}

.sidebar h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: var(--brand-color);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  flex-grow: 1;
}

.sidebar ul li {
  padding: 12px 15px;
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: background 0.3s ease;
  margin-bottom: 5px;
  font-weight: 500;
}

.sidebar ul li:hover {
  background-color: var(--hover-bg);
}

.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
}

.profile-btn {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: var(--white);
  padding: 10px;
  cursor: pointer;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.profile-btn i {
  margin-right: 10px;
  font-size: 20px;
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--brand-color);
  color: var(--brand-color);
  padding: 10px;
  border-radius: var(--border-radius);
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: var(--brand-color);
  color: var(--white);
}

/* Main content area */
.main {
  flex: 1;
  padding: 20px;
  background-color: var(--background);
  overflow-y: auto;
  height: 100vh;
}

/* Section headers */
.section h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: var(--white);
  border-bottom: 2px solid var(--brand-color);
  padding-bottom: 10px;
  display: inline-block;
}

/* Sections visibility */
.section {
  display: none;
}

.section.active {
  display: block;
}

/* Dashboard Cards Styling */
.dashboard-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.dashboard-card {
  flex: 1 1 calc(25% - 20px);
  min-width: 200px;
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  font-size: 1.2em;
  text-align: center;
  transition: transform 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
}

/* Analytics Section */
.analytics-container {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: var(--border-radius);
  margin-bottom: 30px;
  box-shadow: var(--box-shadow);
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.analytics-header h2 {
  margin: 0;
}

.time-filter {
  background: var(--input-bg);
  border: none;
  color: var(--white);
  padding: 8px 12px;
  border-radius: var(--border-radius);
}

/* Popular restaurants section */
.popular-restaurants {
  margin-top: 30px;
}

.popular-restaurants h2 {
  margin-bottom: 20px;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.restaurant-thumbnail {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: var(--box-shadow);
}

.restaurant-thumbnail:hover {
  transform: translateY(-5px);
}

.restaurant-img {
  width: 100%;
  height: 120px;
  background-color: #3A3A3A;
  display: flex;
  align-items: center;
  justify-content: center;
}

.restaurant-name {
  padding: 10px;
  text-align: center;
  font-weight: 500;
}

/* Restaurant cards styling */
.restaurant-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.restaurant-card {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  transition: transform 0.3s ease;
  position: relative;
  min-height: 180px;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.restaurant-card h2 {
  margin-top: 0;
  color: var(--white);
  font-size: 18px;
}

.restaurant-card .status-indicator {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  margin-top: 10px;
}

.status-active {
  background-color: var(--completed-color);
  color: white;
}

.status-inactive {
  background-color: #777;
  color: white;
}

.add-restaurant-btn {
  padding: 12px 20px;
  background-color: var(--brand-color);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.add-restaurant-btn i {
  margin-right: 8px;
}

.add-restaurant-btn:hover {
  background-color: var(--brand-secondary);
}

/* Buttons */
.btn {
  padding: 8px 15px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: 500;
}

.btn-primary {
  background-color: var(--brand-color);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--brand-secondary);
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--brand-color);
  color: var(--brand-color);
}

.btn-secondary:hover {
  background-color: rgba(255, 75, 75, 0.1);
}

.btn-sm {
  padding: 5px 10px;
  font-size: 0.9em;
}

/* Edit & Action buttons */
.edit-btn {
  width: auto;
  margin: 0;
  padding: 8px 15px;
  background-color: var(--brand-color);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute;
  top: 20px;
  right: 20px;
}

.edit-btn:hover {
  background-color: var(--brand-secondary);
}

.edit-options {
  margin-top: 15px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.edit-options.expanded {
  max-height: 200px;
}

.edit-options button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--white);
  padding: 8px 10px;
  margin-bottom: 8px;
  width: 100%;
  text-align: left;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background 0.3s ease;
}

.edit-options button:hover {
  background: var(--hover-bg);
}

/* Search and Filters */
.filters-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 0 1 300px;
}

.search-box input {
  width: 100%;
  padding: 10px 15px;
  padding-left: 35px;
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--input-bg);
  color: var(--white);
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.filter-select {
  padding: 10px 15px;
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--input-bg);
  color: var(--white);
  cursor: pointer;
  flex: 0 1 200px;
}

/* Tables styling */
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
}

.data-table th, .data-table td {
  padding: 15px;
  text-align: left;
}

.data-table th {
  background-color: var(--card-bg);
  color: var(--white);
  font-weight: 500;
}

.data-table th:first-child {
  border-top-left-radius: var(--border-radius);
}

.data-table th:last-child {
  border-top-right-radius: var(--border-radius);
}

.data-table tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.03);
}

.data-table tr {
  transition: background-color 0.3s ease;
}

.data-table tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Status colors and styles */
.status-tag {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.status-completed {
  background-color: var(--completed-color);
  color: white;
}

.status-pending {
  background-color: var(--pending-color);
  color: white;
}

.status-cancelled {
  background-color: var(--cancelled-color);
  color: white;
}

/* Action dropdowns */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-btn {
  background-color: var(--brand-color);
  color: var(--white);
  padding: 8px 15px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-btn:hover {
  background-color: var(--brand-secondary);
}

.dropdown-content {
  display: none;
  position: absolute;
  min-width: 160px;
  background-color: #333;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  z-index: 1000;
  right: 0;
}

.dropdown-content.show {
  display: block;
}

.dropdown-content a {
  color: var(--white);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease;
}

.dropdown-content a:hover {
  background-color: var(--brand-color);
}

/* Modal Styles */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: var(--card-bg);
  padding: 25px;
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 100%;
}

.modal-title {
  margin-top: 0;
  color: var(--white);
  margin-bottom: 20px;
  font-size: 20px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

.modal input[type="text"],
.modal input[type="email"],
.modal input[type="password"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  background-color: var(--input-bg);
  border: none;
  border-radius: var(--border-radius);
  color: var(--white);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: var(--white);
  font-size: 24px;
  cursor: pointer;
}

/* Radio buttons */
.radio-group {
  margin-bottom: 20px;
}

.radio-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.radio-option input[type="radio"] {
  margin-right: 10px;
}

/* Loading spinner for graph */
.spinner {
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 5px solid var(--brand-color);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Font Awesome Icons */
.fas, .far, .fa, .fab {
  margin-right: 5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  body {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    padding: 10px;
  }
  
  .sidebar ul {
    display: flex;
    overflow-x: auto;
  }
  
  .sidebar ul li {
    white-space: nowrap;
  }
  
  .sidebar-footer {
    display: none;
  }
  
  .dashboard-cards, .restaurant-list, .filters-container {
    flex-direction: column;
  }
  
  .search-box, .filter-select {
    flex: 1 1 100%;
  }
}