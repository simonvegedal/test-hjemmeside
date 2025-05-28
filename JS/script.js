// Loading Screen
        window.addEventListener('load', function() {
            setTimeout(() => {
                document.getElementById('loadingScreen').classList.add('hidden');
            }, 2000);
        });

        // Header Scroll Effect
        const header = document.getElementById('header');
        const backToTop = document.getElementById('backToTop');

        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                backToTop.classList.add('visible');
            } else {
                header.classList.remove('scrolled');
                backToTop.classList.remove('visible');
            }
        });

        // Smooth Scrolling for Navigation Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll Animations
        const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
        const sectionTitles = document.querySelectorAll('.section-title');
        const contactItems = document.querySelectorAll('.contact-item');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
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

        // Observe all scroll reveal elements
        scrollRevealElements.forEach(element => {
            observer.observe(element);
        });

        // Observe section titles
        sectionTitles.forEach(title => {
            observer.observe(title);
        });

        // Observe contact items
        contactItems.forEach(item => {
            observer.observe(item);
        });

        // Parallax Effect for Background Elements
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxBgs = document.querySelectorAll('.parallax-bg');
            
            parallaxBgs.forEach(bg => {
                const speed = 0.5;
                bg.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Hero Particles Animation
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const startX = Math.random() * window.innerWidth;
            const duration = Math.random() * 10 + 10;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = startX + 'px';
            particle.style.animationDuration = duration + 's';
            
            document.getElementById('heroParticles').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        }

        // Create particles periodically
        setInterval(createParticle, 300);

        // Form Submission
        document.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (name && email && message) {
                // Here you would typically send the data to your server
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });

        // Mobile Navigation Toggle
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.querySelector('.nav-links');

        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Enhanced scroll reveal with stagger effect
        function handleStaggeredReveal(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100); // 100ms delay between each element
                }
            });
        }

        // Skills cards stagger animation
        const skillCards = document.querySelectorAll('.skill-card');
        const skillsObserver = new IntersectionObserver(handleStaggeredReveal, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        skillCards.forEach(card => {
            skillsObserver.observe(card);
        });

        // Function to check if device is mobile/touch device
        function isMobileDevice() {
            return (
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0 ||
                window.innerWidth <= 768
            );
        }

        // Add mouse move parallax effect for skill cards (desktop only)
        if (!isMobileDevice()) {
            // Add CSS transition for smooth animation
            const skillCards = document.querySelectorAll('.skill-card');
            skillCards.forEach(card => {
                card.style.transition = 'transform 0.1s ease-out';
            });

            let animationFrame;
            
            document.addEventListener('mousemove', function(e) {
                // Cancel previous animation frame for better performance
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
                
                animationFrame = requestAnimationFrame(() => {
                    const cards = document.querySelectorAll('.skill-card');
                    
                    cards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const cardCenterX = rect.left + rect.width / 2;
                        const cardCenterY = rect.top + rect.height / 2;
                        
                        // Increased sensitivity (reduced divisor from 30 to 15)
                        const distanceX = (e.clientX - cardCenterX) / 15;
                        const distanceY = (e.clientY - cardCenterY) / 15;
                        
                        // Limit maximum rotation for better UX
                        const maxRotation = 15;
                        const rotateX = Math.max(-maxRotation, Math.min(maxRotation, -distanceY));
                        const rotateY = Math.max(-maxRotation, Math.min(maxRotation, distanceX));
                        
                        // Add slight scale effect for more dynamic feel
                        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                        const scale = 1 + (distance / 1000);
                        
                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${Math.min(scale, 1.05)})`;
                    });
                });
            });

            // Reset card transforms when mouse leaves (desktop only)
            document.addEventListener('mouseleave', function() {
                const cards = document.querySelectorAll('.skill-card');
                cards.forEach(card => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                });
            });

            // Also reset when mouse enters the page
            document.addEventListener('mouseenter', function() {
                const cards = document.querySelectorAll('.skill-card');
                cards.forEach(card => {
                    card.style.transition = 'transform 0.1s ease-out';
                });
            });
        }

        // Typing effect for hero text (optional enhancement)
        function typeWriter(element, text, speed = 50) {
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

        // Initialize typing effect after page load
        setTimeout(() => {
            const heroTitle = document.querySelector('.hero h1');
            if (heroTitle) {
                const originalText = heroTitle.textContent;
                typeWriter(heroTitle, originalText, 100);
            }
        }, 3500);
