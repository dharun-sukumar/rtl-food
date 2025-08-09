// RTL/LTR Toggle Functionality

class RTLToggle {
    constructor() {
        this.isRTL = localStorage.getItem('isRTL') === 'true';
        this.init();
    }

    init() {
        this.createToggleButton();
        this.setDirection();
        this.setupEventListeners();
    }

    createToggleButton() {
        // If button already exists, don't create another
        if (document.querySelector('.rtl-toggle')) return;

        const button = document.createElement('button');
        button.className = 'rtl-toggle';
        button.textContent = this.isRTL ? 'LTR' : 'RTL';
        button.title = `Switch to ${this.isRTL ? 'Left-to-Right' : 'Right-to-Left'} layout`;
        
        // Add to navigation
        const navbar = document.querySelector('.nav-links');
        if (navbar) {
            const li = document.createElement('li');
            li.appendChild(button);
            navbar.appendChild(li);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('rtl-toggle')) {
                this.toggleDirection();
            }
        });

        // Keyboard shortcut (Alt + R)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                this.toggleDirection();
            }
        });
    }

    toggleDirection() {
        this.isRTL = !this.isRTL;
        this.setDirection();
        this.updateToggleButton();
        this.savePreference();
        this.showDirectionChange();
        this.closeNavbarMenu(); // Close the menu after toggling
    }
    // Close the menu in navbar if open
    closeNavbarMenu() {
        // Common patterns: nav-links or navbar with 'open' or 'active' class
        const navMenus = document.querySelectorAll('.nav-links.open, .nav-links.active, .navbar.open, .navbar.active');
        navMenus.forEach(menu => {
            menu.classList.remove('open', 'active');
        });

        // If you use a hamburger menu or similar, close it as well
        const hamburger = document.querySelector('.hamburger.active');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
    }

    setDirection() {
        const html = document.documentElement;
        const body = document.body;
        
        if (this.isRTL) {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar'); // Arabic as default RTL language
            body.style.fontFamily = '"Segoe UI", "Arabic UI Text", "Geeza Pro", sans-serif';
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            body.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        }

        // Update text alignment for main content areas
        this.updateTextAlignment();
        
        // Update navigation alignment
        this.updateNavigationAlignment();
        
        // Update form alignment
        this.updateFormAlignment();
    }

    updateTextAlignment() {
        const contentElements = document.querySelectorAll('.hero-content, .section-content, .card-content');
        contentElements.forEach(element => {
            if (this.isRTL) {
                element.style.textAlign = 'right';
            } else {
                element.style.textAlign = element.classList.contains('hero-content') ? 'center' : 'left';
            }
        });
    }

    updateNavigationAlignment() {
        const navElements = document.querySelectorAll('.navbar, .nav-links, .dropdown-content');
        navElements.forEach(element => {
            if (this.isRTL) {
                element.style.direction = 'rtl';
            } else {
                element.style.direction = 'ltr';
            }
        });

        // Update dropdown positions
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            if (this.isRTL) {
                dropdown.style.right = '0';
                dropdown.style.left = 'auto';
            } else {
                dropdown.style.left = '0';
                dropdown.style.right = 'auto';
            }
        });
    }

    updateFormAlignment() {
        const formElements = document.querySelectorAll('form, .form-container');
        formElements.forEach(element => {
            if (this.isRTL) {
                element.style.direction = 'rtl';
            } else {
                element.style.direction = 'ltr';
            }
        });

        // Update input text alignment
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (this.isRTL) {
                input.style.textAlign = 'right';
            } else {
                input.style.textAlign = 'left';
            }
        });
    }

    updateToggleButton() {
        const button = document.querySelector('.rtl-toggle');
        if (button) {
            button.textContent = this.isRTL ? 'LTR' : 'RTL';
            button.title = `Switch to ${this.isRTL ? 'Left-to-Right' : 'Right-to-Left'} layout`;
            
            // Add visual feedback
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        }
    }

    savePreference() {
        localStorage.setItem('isRTL', this.isRTL.toString());
    }

    showDirectionChange() {
        const notification = document.createElement('div');
        notification.className = 'direction-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 107, 53, 0.95);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: bold;
            z-index: 10001;
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            animation: fadeInScale 0.3s ease;
        `;

        notification.textContent = `Layout switched to ${this.isRTL ? 'RTL (Right-to-Left)' : 'LTR (Left-to-Right)'}`;
        
        // Add animation keyframes
        if (!document.querySelector('#direction-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'direction-animation-styles';
            style.textContent = `
                @keyframes fadeInScale {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes fadeOutScale {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after animation
        setTimeout(() => {
            notification.style.animation = 'fadeOutScale 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // Method to get current direction
    getCurrentDirection() {
        return this.isRTL ? 'rtl' : 'ltr';
    }

    // Method to set specific direction
    setSpecificDirection(direction) {
        if (direction === 'rtl' && !this.isRTL) {
            this.toggleDirection();
        } else if (direction === 'ltr' && this.isRTL) {
            this.toggleDirection();
        }
    }

    // Update content for RTL languages
    updateContentForLanguage() {
        if (this.isRTL) {
            // You can add specific content changes for RTL here
            // For example, changing placeholder text to Arabic
            const inputs = document.querySelectorAll('input[placeholder]');
            inputs.forEach(input => {
                const placeholder = input.getAttribute('placeholder');
                input.setAttribute('data-original-placeholder', placeholder);
                // Add Arabic translations here if needed
            });
        } else {
            // Restore original placeholders
            const inputs = document.querySelectorAll('input[data-original-placeholder]');
            inputs.forEach(input => {
                const originalPlaceholder = input.getAttribute('data-original-placeholder');
                input.setAttribute('placeholder', originalPlaceholder);
                input.removeAttribute('data-original-placeholder');
            });
        }
    }
}

// Initialize RTL toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rtlToggle = new RTLToggle();
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RTLToggle;
}