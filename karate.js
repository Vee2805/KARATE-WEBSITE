// Hero Slider Class
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.prevBtn = document.querySelector('.hero-nav.prev');
        this.nextBtn = document.querySelector('.hero-nav.next');
        this.hero = document.querySelector('.hero');
        this.progressBar = document.querySelector('.hero-progress-fill');
        
        this.currentSlide = 0;
        this.isAutoPlay = true;
        this.autoPlayInterval = null;
        this.imageTimer = null;
        
        this.init();
    }

    init() {
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Pause/resume auto-play on hover
        this.hero.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.hero.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Handle video slides
        this.handleVideoSlides();
        
        // Start the slideshow
        this.showSlide(0);
        this.startSlideTimer();
    }

    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Show current slide
        this.slides[index].classList.add('active');
        
        // Handle video/image playback
        this.handleSlideMedia(index);
        
        this.currentSlide = index;
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
        this.resetSlideTimer();
    }

    previousSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
        this.resetSlideTimer();
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetSlideTimer();
    }

    handleVideoSlides() {
        this.slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (video) {
                // Ensure video properties
                video.muted = true;
                video.loop = false;
                video.preload = 'metadata';
                
                // Handle video end event
                video.addEventListener('ended', () => {
                    if (slide.classList.contains('active')) {
                        this.nextSlide();
                    }
                });
                
                // Handle video load
                video.addEventListener('loadeddata', () => {
                    if (slide.classList.contains('active')) {
                        video.currentTime = 0;
                        video.play().catch(e => console.log('Video autoplay failed:', e));
                    }
                });
            }
        });
    }

    handleSlideMedia(index) {
        const currentSlide = this.slides[index];
        const video = currentSlide.querySelector('video');
        const image = currentSlide.querySelector('img');
        
        // Stop all videos first
        this.slides.forEach((slide, i) => {
            const slideVideo = slide.querySelector('video');
            if (slideVideo && i !== index) {
                slideVideo.pause();
                slideVideo.currentTime = 0;
            }
        });
        
        if (video) {
            // It's a video slide
            video.currentTime = 0;
            video.play().catch(e => console.log('Video play failed:', e));
            // Progress bar will be handled by video duration or ended event
            this.startVideoProgress();
        } else if (image) {
            // It's an image slide - show for 10 seconds
            this.startImageProgress(2000);
        }
    }

    startImageProgress(duration = 2000) {
        if (this.progressBar) {
            this.progressBar.style.transition = 'none';
            this.progressBar.style.width = '0%';
            
            // Small delay for smooth animation
            setTimeout(() => {
                this.progressBar.style.transition = `width ${duration}ms linear`;
                this.progressBar.style.width = '100%';
            }, 50);
        }
        
        // Clear any existing timer
        if (this.imageTimer) {
            clearTimeout(this.imageTimer);
        }
        
        // Set timer to move to next slide
        this.imageTimer = setTimeout(() => {
            if (this.isAutoPlay) {
                this.nextSlide();
            }
        }, duration);
    }

    startVideoProgress() {
        const currentSlide = this.slides[this.currentSlide];
        const video = currentSlide.querySelector('video');
        
        if (video && this.progressBar) {
            const updateProgress = () => {
                if (video.duration && video.currentTime !== undefined) {
                    const progress = (video.currentTime / video.duration) * 100;
                    this.progressBar.style.transition = 'none';
                    this.progressBar.style.width = progress + '%';
                }
                
                if (!video.ended && currentSlide.classList.contains('active')) {
                    requestAnimationFrame(updateProgress);
                }
            };
            
            this.progressBar.style.transition = 'none';
            this.progressBar.style.width = '0%';
            updateProgress();
        }
    }

    startSlideTimer() {
        const currentSlide = this.slides[this.currentSlide];
        const video = currentSlide.querySelector('video');
        
        if (video) {
            // Video slide - will advance when video ends
            this.startVideoProgress();
        } else {
            // Image slide - advance after 10 seconds
            this.startImageProgress(2000);
        }
    }

    resetSlideTimer() {
        // Clear existing timers
        if (this.imageTimer) {
            clearTimeout(this.imageTimer);
            this.imageTimer = null;
        }
        
        // Start new timer for current slide
        this.startSlideTimer();
    }

    pauseAutoPlay() {
        this.isAutoPlay = false;
        
        if (this.imageTimer) {
            clearTimeout(this.imageTimer);
        }
        
        // Pause video if current slide has one
        const currentSlide = this.slides[this.currentSlide];
        const video = currentSlide.querySelector('video');
        if (video && !video.paused) {
            video.pause();
        }
        
        // Stop progress bar
        if (this.progressBar) {
            this.progressBar.style.transition = 'none';
        }
    }

    resumeAutoPlay() {
        this.isAutoPlay = true;
        
        // Resume video if current slide has one
        const currentSlide = this.slides[this.currentSlide];
        const video = currentSlide.querySelector('video');
        if (video && video.paused) {
            video.play().catch(e => console.log('Video resume failed:', e));
        }
        
        this.resetSlideTimer();
    }
}

// Countdown Timer Function
function startCountdown() {
    // Set target date (16 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 16);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM elements
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // Stop countdown when target is reached
        if (distance < 0) {
            clearInterval(countdownInterval);
            const countdown = document.querySelector('.countdown');
            if (countdown) {
                countdown.innerHTML = '<span style="color: #dc143c; font-weight: bold;">Championship Started!</span>';
            }
        }
    }
    
    // Update immediately and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Mobile Navigation Toggle
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const mainMenu = document.getElementById('main-menu');
    
    if (navToggle && mainMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Toggle active classes
            mainMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = 'hidden';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
                
                // Restore body scroll
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on menu items
        const menuLinks = mainMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Reset hamburger animation
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
                
                // Restore body scroll
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !mainMenu.contains(e.target)) {
                mainMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Reset hamburger animation
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
                
                // Restore body scroll
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainMenu.classList.contains('active')) {
                mainMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Reset hamburger animation
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
                
                // Restore body scroll
                document.body.style.overflow = '';
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 150; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Keyboard Navigation for Hero Slider
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (window.heroSlider) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    window.heroSlider.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    window.heroSlider.nextSlide();
                    break;
                case ' ': // Spacebar to pause/resume
                    e.preventDefault();
                    if (window.heroSlider.isAutoPlay) {
                        window.heroSlider.pauseAutoPlay();
                    } else {
                        window.heroSlider.resumeAutoPlay();
                    }
                    break;
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero slider
    window.heroSlider = new HeroSlider();
    
    // Initialize other functions
    startCountdown();
    initMobileNavigation();
    initSmoothScrolling();
    initKeyboardNavigation();
    
    // Add loading animation fade out
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const mainMenu = document.getElementById('main-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (mainMenu && navToggle) {
                mainMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Reset hamburger animation
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
                
                // Restore body scroll
                document.body.style.overflow = '';
            }
        }
    });
});

// Handle page visibility change (pause video/animations when tab is not active)
document.addEventListener('visibilitychange', () => {
    if (window.heroSlider) {
        if (document.hidden) {
            window.heroSlider.pauseAutoPlay();
        } else {
            window.heroSlider.resumeAutoPlay();
        }
    }
});