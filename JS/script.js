// Mobile detection utility
const isMobile = () => window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Performance-optimized scroll handler with throttling
let ticking = false;
let lastScrollY = 0;

function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Loading Screen
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, isMobile() ? 1000 : 2000); // Faster on mobile
});

// Optimized Header Scroll Effect
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');

const handleScroll = throttle(function() {
    const scrollY = window.scrollY;
    const scrollThreshold = isMobile() ? 50 : 100; // Lower threshold on mobile
    
    if (scrollY > scrollThreshold) {
        header?.classList.add('scrolled');
        backToTop?.classList.add('visible');
    } else {
        header?.classList.remove('scrolled');
        backToTop?.classList.remove('visible');
    }
    
    lastScrollY = scrollY;
}, isMobile() ? 16 : 10); // Less frequent updates on mobile

window.addEventListener('scroll', handleScroll, { passive: true });

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - (isMobile() ? 60 : 80); // Smaller offset for mobile
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Optimized Scroll Animations with Intersection Observer
const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
const sectionTitles = document.querySelectorAll('.section-title');
const contactItems = document.querySelectorAll('.contact-item');

const observerOptions = {
    threshold: isMobile() ? 0.05 : 0.1, // Lower threshold for mobile
    rootMargin: isMobile() ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Special handling for GitHub section
            if (entry.target.closest('.github')) {
                entry.target.closest('.github').classList.add('revealed');
            }
        }
    });
}, observerOptions);

// Observe elements
[...scrollRevealElements, ...sectionTitles, ...contactItems].forEach(element => {
    observer.observe(element);
});

// Parallax Effect (disabled on mobile for performance)
if (!isMobile()) {
    const handleParallax = throttle(function() {
        const scrolled = window.pageYOffset;
        const parallaxBgs = document.querySelectorAll('.parallax-bg');
        
        parallaxBgs.forEach(bg => {
            const speed = 0.5;
            bg.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 16);
    
    window.addEventListener('scroll', handleParallax, { passive: true });
}

// Optimized Hero Particles Animation
let particleInterval;
const heroParticles = document.getElementById('heroParticles');

function createParticle() {
    if (!heroParticles) return;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * (isMobile() ? 3 : 4) + 2;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * (isMobile() ? 8 : 10) + (isMobile() ? 8 : 10);
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = startX + 'px';
    particle.style.animationDuration = duration + 's';
    
    heroParticles.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, duration * 1000);
}

// Reduce particle frequency on mobile
const particleFrequency = isMobile() ? 600 : 300;
particleInterval = setInterval(createParticle, particleFrequency);

// Pause particles when page is not visible (performance optimization)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(particleInterval);
    } else {
        particleInterval = setInterval(createParticle, particleFrequency);
    }
});

// Form Submission with better mobile UX
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const message = this.querySelector('textarea').value.trim();
        
        // Enhanced validation
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            alert('Please enter a valid email address.');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }
        
        // Simulate form submission
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1000);
    });
}

// Enhanced Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    // Handle both click and touch events
    ['click', 'touchstart'].forEach(eventType => {
        navToggle.addEventListener(eventType, function(e) {
            if (eventType === 'touchstart') {
                e.preventDefault(); // Prevent double-tap zoom
            }
            
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            
            // Add/remove body scroll lock on mobile
            if (isMobile()) {
                document.body.classList.toggle('menu-open');
            }
        }, { passive: false });
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Remove body scroll lock
            if (isMobile()) {
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMobile() && navLinks.classList.contains('active')) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                document.body.classList.remove('menu-open');
            }
        }
    });
}

// Enhanced scroll reveal with stagger effect
function handleStaggeredReveal(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const delay = isMobile() ? index * 50 : index * 100; // Faster on mobile
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, delay);
        }
    });
}

// Skills cards stagger animation
const skillCards = document.querySelectorAll('.skill-card');
const skillsObserver = new IntersectionObserver(handleStaggeredReveal, {
    threshold: isMobile() ? 0.05 : 0.1,
    rootMargin: isMobile() ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
});

skillCards.forEach(card => {
    skillsObserver.observe(card);
});

// Mouse/Touch parallax effect for skill cards (optimized for mobile)
function handleCardInteraction(e) {
    const cards = document.querySelectorAll('.skill-card');
    let clientX, clientY;
    
    // Handle both mouse and touch events
    if (e.type === 'touchmove') {
        if (e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    if (clientX === undefined || clientY === undefined) return;
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const maxDistance = isMobile() ? 15 : 30; // Reduced effect on mobile
        const distanceX = (clientX - cardCenterX) / maxDistance;
        const distanceY = (clientY - cardCenterY) / maxDistance;
        
        card.style.transform = `perspective(1000px) rotateX(${-distanceY}deg) rotateY(${distanceX}deg)`;
    });
}

// Add interaction handlers
if (!isMobile()) {
    // Desktop: mouse events
    document.addEventListener('mousemove', handleCardInteraction);
    document.addEventListener('mouseleave', function() {
        const cards = document.querySelectorAll('.skill-card');
        cards.forEach(card => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
} else {
    // Mobile: touch events with debouncing
    let touchTimeout;
    document.addEventListener('touchmove', function(e) {
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => handleCardInteraction(e), 16);
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        const cards = document.querySelectorAll('.skill-card');
        cards.forEach(card => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Optimized typing effect for hero text
function typeWriter(element, text, speed = 50) {
    if (!element) return;
    
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect after page load (faster on mobile)
setTimeout(() => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        const typingSpeed = isMobile() ? 80 : 100; // Faster on mobile
        typeWriter(heroTitle, originalText, typingSpeed);
    }
}, isMobile() ? 2000 : 3500); // Earlier start on mobile

// Orientation change handler for mobile
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        // Recalculate positions after orientation change
        window.scrollTo(0, window.scrollY + 1);
        window.scrollTo(0, window.scrollY - 1);
    }, 100);
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    clearInterval(particleInterval);
    observer.disconnect();
    skillsObserver.disconnect();
});