// WKF Championship Hub - Interactive JavaScript

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Performance optimizations
    let ticking = false;
    let lastScrollY = 0;

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeNavigation();
        initializeScrollEffects();
        initializeAnimations();
        initializeStatCounters();
        initializeIntersectionObserver();
        initializePerformanceOptimizations();
    });

    // Navigation functionality
    function initializeNavigation() {
        // Mobile menu toggle
        navToggle.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking on links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Smooth scrolling for anchor links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = header.offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Scroll effects
    function initializeScrollEffects() {
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    function updateOnScroll() {
        const currentScrollY = window.scrollY;
        
        // Header background change on scroll
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax effect for hero section (subtle)
        const hero = document.querySelector('.hero');
        if (hero && currentScrollY < hero.offsetHeight) {
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${currentScrollY * parallaxSpeed}px)`;
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    // Animation initialization
    function initializeAnimations() {
        // Add staggered animation delays to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-in');
        });

        // Add entrance animations to news cards
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('animate-in');
        });
    }

    // Statistics counter animation
    function initializeStatCounters() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    // Counter animation function
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Intersection Observer for scroll animations
    function initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-card, .news-card, .section-header');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Performance optimizations
    function initializePerformanceOptimizations() {
        // Lazy load images when they exist
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        } else {
            // Fallback for browsers that don't support native lazy loading
            loadImagesLazily();
        }

        // Preload critical resources
        preloadCriticalResources();
        
        // Initialize service worker for caching (if available)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // Service worker registration failed - silent fail
            });
        }
    }

    // Lazy loading fallback
    function loadImagesLazily() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Error handling
    window.addEventListener('error', function(e) {
        console.warn('WKF Hub: Non-critical error caught:', e.error);
        // Could send to analytics service in production
    });

    // Newsletter signup functionality (if form exists)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }

    function handleNewsletterSignup(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (validateEmail(email)) {
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.textContent = 'Subscribed!';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    e.target.reset();
                }, 2000);
            }, 1000);
        }
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Tab navigation improvements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Smooth reveal animations for content
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid #ff6b6b !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);

    // Accessibility improvements
    function initializeAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Improve mobile menu accessibility
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
        
        navToggle.addEventListener('click', function() {
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Initialize accessibility features
    initializeAccessibility();

    // Export for external use if needed
    window.WKFHub = {
        toggleMobileMenu,
        closeMobileMenu,
        animateCounter
    };

})();