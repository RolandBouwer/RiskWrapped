// Risk Insights HTMX Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states to buttons
    document.addEventListener('htmx:beforeRequest', function(evt) {
        const button = evt.detail.elt;
        if (button.tagName === 'BUTTON') {
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.disabled = true;
        }
    });

    document.addEventListener('htmx:afterRequest', function(evt) {
        const button = evt.detail.elt;
        if (button.tagName === 'BUTTON') {
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            button.disabled = false;
        }
    });

    // Add success/error handling
    document.addEventListener('htmx:responseError', function(evt) {
        console.error('HTMX Error:', evt.detail);
        showNotification('An error occurred while loading data.', 'error');
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
        notification.classList.add(bgColor, 'text-white');
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Slide out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add hover effects to cards
    document.querySelectorAll('.card, .metric-card, .risk-card, .incident-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Auto-refresh dashboard metrics every 5 minutes
    if (window.location.pathname === '/dashboard') {
        setInterval(() => {
            // Refresh the page to get updated metrics
            window.location.reload();
        }, 5 * 60 * 1000); // 5 minutes
    }
});

// Global utility functions
window.RiskInsights = {
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },
    
    formatDate: function(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        });
    }
};