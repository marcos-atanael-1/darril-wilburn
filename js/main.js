/**
 * DARRIL WILBURN WEBSITE
 * Interactive JavaScript
 * Modern Leadership Development
 */

// Respect reduced motion preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    // initializeTestimonialsSlider(); // Disabled - using CSS scroll now
    initializeLogosCarousel();
    initializeIntersectionObserver();
    initializeSmoothScrolling();
    initializeFormHandling();
    
    if (!prefersReducedMotion) {
        initializeMicroInteractions();
        initializeParallaxEffects();
    }
});

/**
 * NAVIGATION
 */
function initializeNavigation() {
    const nav = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // Navigation scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Hide/show nav on scroll direction (optional)
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

/**
 * TESTIMONIALS SLIDER
 */
function initializeTestimonialsSlider() {
    const slider = document.getElementById('testimonials-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.testimonials-prev');
    const nextBtn = slider.querySelector('.testimonials-next');
    
    let currentSlide = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide and activate dot
        if (slides[index] && dots[index]) {
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    function startAutoPlay() {
        if (!prefersReducedMotion && isAutoPlaying) {
            autoPlayInterval = setInterval(nextSlide, 12000); // Slower: 12 seconds
        }
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000); // Resume after 10s
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000); // Resume after 10s
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000); // Resume after 10s
        });
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        startX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });
    
    slider.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].screenX;
        handleSwipe();
        setTimeout(startAutoPlay, 10000);
    });
    
    function handleSwipe() {
        const threshold = 50; // minimum distance for swipe
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
    }
    
    // Initialize
    showSlide(0);
    startAutoPlay();
}

/**
 * LOGOS CAROUSEL
 */
function initializeLogosCarousel() {
    const carousel = document.getElementById('logos-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.logo-slide');
    const dots = carousel.querySelectorAll('.logo-dot');
    
    let currentSlide = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide and activate dot
        if (slides[index] && dots[index]) {
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function startAutoPlay() {
        if (!prefersReducedMotion && isAutoPlaying) {
            autoPlayInterval = setInterval(nextSlide, 7000); // Slower: 7 seconds
        }
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000); // Resume after 10s
        });
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Initialize
    showSlide(0);
    startAutoPlay();
}

/**
 * INTERSECTION OBSERVER FOR ANIMATIONS
 */
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate counters if they exist
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('impact-item') || 
                    entry.target.classList.contains('offering-card') ||
                    entry.target.classList.contains('partner-card')) {
                    
                    const siblings = entry.target.parentElement.children;
                    const index = Array.from(siblings).indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 80); // 80ms stagger
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .impact-item,
        .offering-card,
        .partner-card,
        .fade-in,
        .stat-number
    `);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * FORM HANDLING
 */
function initializeFormHandling() {
    // Lead magnet form
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLeadFormSubmission(this);
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmission(this);
        });
    }
    
    // Book Darril form
    const bookDarrilForm = document.getElementById('book-darril-form');
    if (bookDarrilForm) {
        bookDarrilForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookDarrilSubmission(this);
        });
    }
}

function handleLeadFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Success state
        submitButton.innerHTML = '<i class="fas fa-check"></i> Download Ready!';
        submitButton.classList.add('success');
        
        // Show success message
        showNotification('Success! Check your email for the Leadership Insights Pack.', 'success');
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('success');
        }, 3000);
        
        // Track conversion (if analytics is setup)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
            });
        }
        
    }, 1500);
}

function handleNewsletterSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        submitButton.classList.add('success');
        
        showNotification('Welcome! You\'re now subscribed to Leadership Insights.', 'success');
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('success');
        }, 3000);
        
    }, 1000);
}

function handleBookDarrilSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
    submitButton.disabled = true;
    
    // Create email body from form data
    const emailBody = `
New booking inquiry from ${formData.get('firstName')} ${formData.get('lastName')}

Contact Information:
- Name: ${formData.get('firstName')} ${formData.get('lastName')}
- Email: ${formData.get('email')}
- Phone: ${formData.get('phone') || 'Not provided'}
- Company: ${formData.get('company') || 'Not provided'}

Inquiry Details:
- Interest: ${formData.get('interest')}
- Timeline: ${formData.get('timeline') || 'Not specified'}

Message:
${formData.get('message')}

Sent from Darril Wilburn Leadership Development website.
    `.trim();
    
    // Create mailto link with pre-filled data
    const emailSubject = `Booking Inquiry from ${formData.get('firstName')} ${formData.get('lastName')} - ${formData.get('interest')}`;
    const mailtoLink = `mailto:d.wilburn@honsha.org?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Simulate form processing time
    setTimeout(() => {
        // Open email client
        window.location.href = mailtoLink;
        
        // Success state
        submitButton.innerHTML = '<i class="fas fa-check"></i> Message Prepared!';
        submitButton.classList.add('success');
        
        // Show success message
        showNotification('Your message has been prepared in your email client. Please send when ready!', 'success');
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('success');
        }, 4000);
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submit', {
                'event_category': 'engagement',
                'event_label': formData.get('interest')
            });
        }
        
    }, 1500);
}

/**
 * SMOOTH SCROLLING
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * MICRO-INTERACTIONS
 */
function initializeMicroInteractions() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(1.02)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Logo hover effects
    const logoItems = document.querySelectorAll('.logo-item');
    logoItems.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.opacity = '1';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.opacity = '0.7';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.impact-item, .offering-card, .partner-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * PARALLAX EFFECTS
 */
function initializeParallaxEffects() {
    // Subtle parallax for hero video background
    const videoBackground = document.querySelector('.hero-video-bg');
    
    if (videoBackground) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5; // Slow parallax
            
            videoBackground.style.transform = `translateY(${rate}px)`;
        }, 16)); // 60fps throttle
    }
}

/**
 * COUNTER ANIMATION
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || element.textContent);
    const duration = 2000; // 2 seconds
    const start = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * NOTIFICATION SYSTEM
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: var(--font-primary);
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-close
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * ACCESSIBILITY ENHANCEMENTS
 */
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
    
    // Space/Enter key for custom buttons
    if (e.key === ' ' || e.key === 'Enter') {
        const focusedElement = document.activeElement;
        
        if (focusedElement.classList.contains('dot')) {
            e.preventDefault();
            focusedElement.click();
        }
    }
});

/**
 * PERFORMANCE OPTIMIZATIONS
 */

// Lazy load images when they come into view
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Throttle scroll events
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
    };
}

// Debounce resize events
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

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Recalculate any size-dependent elements
    // This is where you'd update slider dimensions, etc.
}, 250));

/**
 * ANALYTICS INTEGRATION
 */
function trackEvent(eventName, eventCategory, eventLabel) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': eventCategory,
            'event_label': eventLabel
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName);
    }
}

// Track form submissions
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.id === 'lead-form') {
        trackEvent('lead_form_submit', 'engagement', 'leadership_insights_pack');
    } else if (form.id === 'newsletter-form') {
        trackEvent('newsletter_subscribe', 'engagement', 'newsletter');
    }
});

// Track CTA clicks
document.addEventListener('click', function(e) {
    const target = e.target.closest('a');
    if (target && target.classList.contains('btn-primary')) {
        const text = target.textContent.trim();
        trackEvent('cta_click', 'engagement', text);
    }
});

console.log('✅ Darril Wilburn website initialized successfully');