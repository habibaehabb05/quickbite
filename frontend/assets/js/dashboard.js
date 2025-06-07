document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images with data-src
    const images = document.querySelectorAll('img[data-src]');
    if (images.length) {
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
    }

    // Location selector click
    const locationSelector = document.querySelector('.location-selector');
    if (locationSelector) {
        locationSelector.addEventListener('click', function() {
            // Placeholder for location modal
            showFeedback('Location selector clicked');
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const restaurantCards = document.querySelectorAll('.restaurant-card');
            let found = false;
            restaurantCards.forEach(card => {
                const name = card.querySelector('h2').textContent.toLowerCase();
                const desc = card.querySelector('.description').textContent.toLowerCase();
                const matches = name.includes(searchTerm) || desc.includes(searchTerm);
                if (matches) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    found = true;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        if (!matches) card.style.display = 'none';
                    }, 300);
                }
            });
            // Show/hide "no results"
            const noResultsMsg = document.getElementById('no-results') || createNoResultsMessage();
            noResultsMsg.style.display = found ? 'none' : 'block';
        });

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
        window.location.href = 'http://127.0.0.1:5500/frontend/Pages/Login.html';
        showFeedback('Redirecting to login page...');
    });
    document.querySelector('.signup-btn')?.addEventListener('click', function() {
        window.location.href = 'http://127.0.0.1:5500/frontend/Pages/Login.html';
        showFeedback('Redirecting to signup page...');
    });

    // Navigation tabs
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            // Placeholder for tab switching
            showFeedback('Switched to: ' + this.textContent.trim());
        });
    });

    // Menu buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            let menuPath;
            switch(this.id) {
                case 'gyros-menu':
                    menuPath = 'http://127.0.0.1:5500/frontend/Pages/Gyros.html';
                    break;
                case 'my-corner-menu':
                    menuPath = 'http://127.0.0.1:5500/frontend/Pages/MyCorner.html';
                    break;
                case 'cinnabon-menu':
                    menuPath = 'http://127.0.0.1:5500/frontend/Pages/Cinnabon.html';
                    break;
                default:
                    showFeedback('Menu not found');
                    return;
            }
            window.location.href = menuPath;
        });
    });

    // Update restaurant statuses (placeholder)
    updateRestaurantStatuses();
    setInterval(updateRestaurantStatuses, 60000);

    // Footer links and language selector
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
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showFeedback('Navigating to: ' + this.getAttribute('href'));
            // In a real app, you would do:
            // window.location.href = this.getAttribute('href');
        });
    });

    // Add feedback animations if not present
    if (!document.getElementById('feedback-animations')) {
        const style = document.createElement('style');
        style.id = 'feedback-animations';
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
    }
});

// Helper: Show feedback message (only one at a time)
function showFeedback(message) {
    let feedback = document.getElementById('feedback-message');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'feedback-message';
        feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--card-bg, #222);
            color: var(--text-color, #fff);
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.style.display = 'block';
    feedback.style.animation = 'slideIn 0.3s ease';

    clearTimeout(feedback._timeout);
    feedback._timeout = setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => feedback.style.display = 'none', 300);
    }, 2000);
}

// Helper: Create "no results" message
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

// Placeholder: Update restaurant statuses
function updateRestaurantStatuses() {
    // This would fetch real-time status from your API in a real app
    // For now, just log
    console.log('Updating restaurant statuses...');
}

function showNotification(message, iconClass = 'fa-info-circle') {
    const notification = document.getElementById('notification');
    const messageSpan = document.getElementById('notification-message');
    const icon = notification.querySelector('i');

    messageSpan.textContent = message;
    icon.className = `fas ${iconClass}`;

    notification.classList.add('show');
    clearTimeout(notification._timeout);
    notification._timeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}