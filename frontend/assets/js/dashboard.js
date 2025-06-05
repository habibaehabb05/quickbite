document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Header functionality
    // Location selector dropdown
    const locationSelector = document.querySelector('.location-selector');
    if (locationSelector) {
        locationSelector.addEventListener('click', function() {
            // Implement location selection functionality
            console.log('Location selector clicked');
            // In a real app, this would open a location selection modal
        });
    }

    // Enhanced search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const restaurantCards = document.querySelectorAll('.restaurant-card');
            
            restaurantCards.forEach(card => {
                const restaurantName = card.querySelector('h2').textContent.toLowerCase();
                const restaurantDescription = card.querySelector('.description').textContent.toLowerCase();
                
                const matchesSearch = restaurantName.includes(searchTerm) || 
                                    restaurantDescription.includes(searchTerm);
                
                // Smooth transition for showing/hiding cards
                if (matchesSearch) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        if (!matchesSearch) { // Check again in case of rapid typing
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });

            // Show "no results" message if no restaurants match
            const noResultsMsg = document.getElementById('no-results') || createNoResultsMessage();
            const hasResults = Array.from(restaurantCards).some(card => card.style.display !== 'none');
            noResultsMsg.style.display = hasResults ? 'none' : 'block';
        });

        // Clear search when user presses Escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.dispatchEvent(new Event('input'));
                this.blur();
            }
        });
    }

    // Auth buttons
    document.querySelector('.login-btn')?.addEventListener('click', function() {
        // Navigate to login page
        window.location.href = 'http://127.0.0.1:5500/frontend/Pages/Login.html';
        
        // Show feedback to user
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-color);
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        feedback.textContent = 'Redirecting to login page...';
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    });

    document.querySelector('.signup-btn')?.addEventListener('click', function() {
        // Navigate to signup page
        window.location.href = 'http://127.0.0.1:5500/frontend/Pages/Login.html';
        
        // Show feedback to user
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-color);
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        feedback.textContent = 'Redirecting to signup page...';
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    });

    // Navigation tabs
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            // Implement tab switching
            console.log('Switched to:', this.textContent.trim());
            // In a real app, this would load different content sections
        });
    });

    // Menu buttons with specific paths
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Get restaurant specific paths based on button ID
            let menuPath;
            switch(this.id) {
                case 'gyros-menu':
                    menuPath = 'http://127.0.0.1:5500/frontend/Pages/Gyros.html';
                    break;
                case 'my-corner-menu':
                    menuPath = 'http://127.0.0.1:5500/frontend/Pages/MyCorner.html';
                    break;
                case 'batates-zalabia-menu':
                    menuPath = '/menus/batates-zalabia.html';
                    break;
                default:
                    console.error('Menu not found');
                    return;
            }
            
            window.location.href = menuPath;    
        });
    });

    // Initialize and set up auto-update
    updateRestaurantStatuses();
    setInterval(updateRestaurantStatuses, 60000);

    // Handle footer links
    document.querySelectorAll('.footer-links a, .legal-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const path = this.getAttribute('href').replace('#', '');
            console.log(`Navigating to: ${path}`);
            
            // Show feedback to user
            const feedback = document.createElement('div');
            feedback.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--card-bg);
                color: var(--text-color);
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            feedback.textContent = `Navigating to: ${path}`;
            document.body.appendChild(feedback);

            // Remove feedback after 2 seconds
            setTimeout(() => {
                feedback.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => feedback.remove(), 300);
            }, 2000);
        });
    });

    // Add these animations to your CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

function updateRestaurantStatuses() {
    // This would fetch real-time status from your API in a real app
    console.log('Updating restaurant statuses...');
}

// Helper function to create "no results" message
function createNoResultsMessage() {
    const message = document.createElement('div');
    message.id = 'no-results';
    message.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--gray-text);">
            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <p>No restaurants found matching your search.</p>
        </div>
    `;
    document.querySelector('.restaurants-grid').appendChild(message);
    return message;
}

// Footer functionality
document.addEventListener('DOMContentLoaded', function() {
    // Language selector
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'quickbit/language-selector';
        });
    }

    // Intercept all footer links to ensure they use the quickbit path
    document.querySelectorAll('.bolt-footer a').forEach(link => {
        if (!link.getAttribute('href').startsWith('quickbit/')) {
            const currentHref = link.getAttribute('href');
            if (currentHref && currentHref !== '#') {
                link.setAttribute('href', 'quickbit/' + currentHref);
            }
        }
    });

    // Log navigation for demonstration
    document.querySelectorAll('.bolt-footer a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.href.includes('quickbit/')) {
                e.preventDefault();
                console.log('Navigating to: quickbit/' + this.getAttribute('href'));
                // In a real app, you would do:
                // window.location.href = 'quickbit/' + this.getAttribute('href');
            }
        });
    });
});