// Restaurant Website Main JavaScript

class RestaurantApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupFormValidation();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupOrderForm();
        this.setupHoverEffects();
    }

    // Mobile Menu Toggle
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                
                // // Animate hamburger menu
                // const icon = mobileToggle.querySelector('i') || mobileToggle;
                // icon.style.transform = navLinks.classList.contains('active') 
                //     ? 'rotate(90deg)' : 'rotate(0deg)';
            });

            // Close menu when clicking on links
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    const icon = mobileToggle.querySelector('i') || mobileToggle;
                    icon.style.transform = 'rotate(0deg)';
                });
            });
        }
    }

    // Form Validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearError(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Clear previous errors
        this.clearError(field);
        
        if (required && !value) {
            this.showError(field, 'This field is required');
            return false;
        }
        
        if (type === 'email' && value && !this.isValidEmail(value)) {
            this.showError(field, 'Please enter a valid email address');
            return false;
        }
        
        if (type === 'tel' && value && !this.isValidPhone(value)) {
            this.showError(field, 'Please enter a valid phone number');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    showError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#FF4444';
        
        let errorDiv = field.parentNode.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#FF4444';
            errorDiv.style.fontSize = '0.9rem';
            errorDiv.style.marginTop = '0.5rem';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    clearError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
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
    }

    // Animation on Scroll
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe cards and sections
        document.querySelectorAll('.card, .dashboard-card, .section').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Order Form Functionality
    setupOrderForm() {
        const orderForm = document.getElementById('orderForm');
        const orderSummary = document.getElementById('orderSummary');
        
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder(orderForm);
            });
        }

        // Menu item selection
        document.querySelectorAll('.menu-item').forEach(item => {
            const button = item.querySelector('.btn');
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.addToOrder(item);
                });
            }
        });
    }

    addToOrder(menuItem) {
        const name = menuItem.querySelector('h4').textContent;
        const price = menuItem.querySelector('.menu-item-price').textContent;
        
        // Visual feedback
        menuItem.style.background = '#E8F5E8';
        setTimeout(() => {
            menuItem.style.background = '';
        }, 1000);

        // Show success message
        this.showNotification(`${name} added to your order!`, 'success');
    }

    processOrder(form) {
        const formData = new FormData(form);
        const orderData = Object.fromEntries(formData.entries());
        
        // Simulate order processing
        this.showNotification('Processing your order...', 'info');
        
        setTimeout(() => {
            this.showNotification('Order placed successfully! You will receive a confirmation shortly.', 'success');
            form.reset();
        }, 2000);
    }

    // Hover Effects for Navigation
    setupHoverEffects() {
        // Home page switcher
        const homeDropdown = document.querySelector('.dropdown[data-page="home"]');
        if (homeDropdown) {
            const homeLinks = homeDropdown.querySelectorAll('.dropdown-content a');
            homeLinks.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const targetPage = link.getAttribute('href');
                    if (targetPage && !targetPage.startsWith('#')) {
                        // Preload page for faster switching
                        this.preloadPage(targetPage);
                    }
                });
            });
        }

        // Dashboard switcher
        const dashboardDropdown = document.querySelector('.dropdown[data-page="dashboard"]');
        if (dashboardDropdown) {
            const dashboardLinks = dashboardDropdown.querySelectorAll('.dropdown-content a');
            dashboardLinks.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const targetPage = link.getAttribute('href');
                    if (targetPage && !targetPage.startsWith('#')) {
                        this.preloadPage(targetPage);
                    }
                });
            });
        }
    }

    preloadPage(url) {
        // Create invisible link to preload page
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // RTL support
        if (document.documentElement.dir === 'rtl') {
            notification.style.left = '20px';
            notification.style.right = 'auto';
            notification.style.transform = 'translateX(-100%)';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Hide notification
        setTimeout(() => {
            notification.style.transform = document.documentElement.dir === 'rtl' 
                ? 'translateX(-100%)' : 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchMenu(e.target.value);
            });
        }
    }

    searchMenu(query) {
        const menuItems = document.querySelectorAll('.menu-item');
        const lowerQuery = query.toLowerCase();

        menuItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RestaurantApp();
});

// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getCurrentDateTime() {
    return new Date().toLocaleString();
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RestaurantApp;
}