// Add lazy loading for images
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
});


// Add button event listeners
document.addEventListener('DOMContentLoaded', function() {
    const restaurantCards = document.querySelectorAll('.restaurant-card');


    // Menu buttons with specific paths
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Get restaurant specific paths based on button ID
            let menuPath;
            switch(this.id) {
                case 'gyros-menu':
                    menuPath ="file:///C:/Users/MOHANAD/OneDrive/Desktop/Web/Mohanad/Gyros.html";
                    break;
                case 'my-corner-menu':

                
                    menuPath = '/menus/my-corner.html';
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
});