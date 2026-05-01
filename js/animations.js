/* ===============================================
   IERICORN CREATIVE - Animations JavaScript
   Motion Effects and Interactions
   =============================================== */

// Initialize Animations on DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initParallaxEffects();
    initHoverEffects();
    initTypingEffect();
    initMagneticButtons();
});

// Scroll Reveal Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'active');
                
                // Add stagger delay to children if needed
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('visible');
                });
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.fade-in, .fade-in-left, .fade-in-right, .scale-in, .reveal, .stagger-children'
    );
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Service cards animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Studio cards animation
    const studioCards = document.querySelectorAll('.studio-card');
    studioCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });
    
    // Portfolio items animation
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.transitionDelay = `${(index % 4) * 0.1}s`;
        observer.observe(item);
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(el => {
            let speed = 0.1;
            
            if (el.classList.contains('parallax-medium')) speed = 0.2;
            if (el.classList.contains('parallax-fast')) speed = 0.3;
            
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Hero floating shapes parallax
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        shapes.forEach((shape, index) => {
            const speed = 0.05 + (index * 0.02);
            const yPos = scrollY * speed;
            const xPos = Math.sin(scrollY * 0.01 + index) * 10;
            shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    });
}

// Hover Effects
function initHoverEffects() {
    // Card tilt effect
    const tiltCards = document.querySelectorAll('.service-card, .studio-card, .portfolio-item, .pricing-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Icon hover bounce
    const iconContainers = document.querySelectorAll('.service-icon, .studio-icon, .stat-icon');
    
    iconContainers.forEach(container => {
        const icon = container.querySelector('i');
        if (!icon) return;
        
        container.parentElement.addEventListener('mouseenter', () => {
            icon.style.animation = 'icon-bounce 0.5s ease';
        });
        
        container.parentElement.addEventListener('mouseleave', () => {
            icon.style.animation = '';
        });
    });
}

// Typing Effect
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                el.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50);
            }
        };
        
        // Start typing when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(el);
    });
}

// Magnetic Buttons
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.glow-btn, .btn-primary');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// Counter Animation with Easing
function animateCounterWithEasing(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(start + (target - start) * easedProgress);
        
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target);
        }
    }
    
    requestAnimationFrame(update);
}

// Progress Bar Animation
function animateProgressBar(element, targetPercent, duration = 1500) {
    const startWidth = 0;
    const startTime = performance.now();
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentWidth = startWidth + (targetPercent - startWidth) * easedProgress;
        
        element.style.width = `${currentWidth}%`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Ripple Effect
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth Number Update
function smoothNumberUpdate(element, newValue, duration = 500) {
    const currentValue = parseInt(element.textContent) || 0;
    const difference = newValue - currentValue;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(currentValue + difference * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = newValue;
        }
    }
    
    requestAnimationFrame(update);
}

// Shake Animation
function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

// Success Animation
function successAnimation(element) {
    element.classList.add('success-bounce');
    setTimeout(() => element.classList.remove('success-bounce'), 600);
}

// Fade Toggle
function fadeToggle(element, show) {
    if (show) {
        element.style.display = 'block';
        element.style.opacity = '0';
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '1';
        });
    } else {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    }
}

// Slide Toggle
function slideToggle(element, show) {
    if (show) {
        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.transition = 'height 0.3s ease';
        
        requestAnimationFrame(() => {
            element.style.height = height + 'px';
        });
        
        setTimeout(() => {
            element.style.height = '';
            element.style.overflow = '';
        }, 300);
    } else {
        const height = element.scrollHeight;
        element.style.height = height + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = 'height 0.3s ease';
        
        requestAnimationFrame(() => {
            element.style.height = '0';
        });
        
        setTimeout(() => {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
        }, 300);
    }
}

// Cursor Trail Effect (optional, can be resource intensive)
function initCursorTrail() {
    let lastX = 0;
    let lastY = 0;
    let isMoving = false;
    
    document.addEventListener('mousemove', (e) => {
        const distance = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
        
        if (distance > 20) {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
            document.body.appendChild(dot);
            
            setTimeout(() => dot.remove(), 500);
            
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });
}

// Export animations for use in other files
window.animateCounterWithEasing = animateCounterWithEasing;
window.animateProgressBar = animateProgressBar;
window.createRipple = createRipple;
window.smoothNumberUpdate = smoothNumberUpdate;
window.shakeElement = shakeElement;
window.successAnimation = successAnimation;
window.fadeToggle = fadeToggle;
window.slideToggle = slideToggle;
