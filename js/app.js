/* ===============================================
   IERICORN CREATIVE - Main Application JavaScript
   Visual Storytelling, Powered by Motion Intelligence
   =============================================== */

// Global State
const AppState = {
    currentUser: null,
    isLoggedIn: false,
    portfolioPage: 1,
    graphicsData: [],
    clientsData: [],
    uploadedFiles: []
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Initialize Application
function initApp() {
    // Hide preloader after page loads
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 1500);
    
    // Initialize components
    initNavigation();
    initScrollEffects();
    initCounters();
    initProgressBars();
    initDashboardStats();
    initParticles();
    loadPortfolio();
    loadGraphics();
    loadClients();
    initUploadZone();
    checkAuthStatus();
    initFilterButtons();
    
    // Start realtime simulation
    startRealtimeSimulation();
}

// Navigation
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            scrollToSection(sectionId);
            closeMobileMenu();
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

// Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.getElementById('mainNav').offsetHeight;
        const sectionTop = section.offsetTop - navHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Scroll Effects
function initScrollEffects() {
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
    
    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-children').forEach(el => {
        observer.observe(el);
    });
}

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter-value[data-target]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = formatNumber(Math.floor(current));
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// Progress Bars
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill[data-progress]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Dashboard Stats
function initDashboardStats() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateDashboardStat(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statValues.forEach(stat => observer.observe(stat));
}

function animateDashboardStat(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Particles
function initParticles() {
    const particlesBg = document.getElementById('particles-bg');
    if (!particlesBg) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesBg);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    
    if (Math.random() > 0.5) {
        particle.style.background = 'var(--primary-blue)';
    } else {
        particle.style.background = 'var(--primary-red)';
    }
    
    container.appendChild(particle);
}

// Load Portfolio
async function loadPortfolio() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    
    // Default portfolio items
    const defaultPortfolio = [
        {
            id: 'p1',
            title: 'Professional Instagram Design',
            description: 'High-quality social media graphics',
            image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg',
            category: 'graphics',
            likes: 124,
            views: 1520,
            comments: 18
        },
        {
            id: 'p2',
            title: 'IYAN Creative Poster',
            description: 'Modern poster design with futuristic elements',
            image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770236645/IYAN_2_asu0kf.png',
            category: 'graphics',
            likes: 89,
            views: 980,
            comments: 12
        },
        {
            id: 'p3',
            title: 'IYAN Brand Identity',
            description: 'Complete brand identity design',
            image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770236739/IYAN_xo8rrs.png',
            category: 'graphics',
            likes: 156,
            views: 2100,
            comments: 24
        },
        {
            id: 'p4',
            title: 'Marketing Campaign',
            description: 'Engaging marketing visuals',
            image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770236837/WhatsApp_Image_2026-02-03_at_5.36.36_AM_2_wogrj5.jpg',
            category: 'motion',
            likes: 203,
            views: 2890,
            comments: 31
        }
    ];
    
    // Try to load from API
    try {
        const response = await fetch('tables/graphics_posts?limit=20');
        if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.length > 0) {
                renderPortfolio(grid, result.data);
                return;
            }
        }
    } catch (error) {
        console.log('Using default portfolio data');
    }
    
    renderPortfolio(grid, defaultPortfolio);
}

function renderPortfolio(grid, items) {
    grid.innerHTML = items.map(item => `
        <div class="portfolio-item" data-category="${item.category || 'graphics'}" onclick="openPortfolioItem('${item.id}')">
            <div class="portfolio-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="portfolio-overlay">
                    <div class="overlay-btn">
                        <i class="fas fa-expand"></i>
                    </div>
                </div>
            </div>
            <div class="portfolio-content">
                <h4>${item.title}</h4>
                <p>${item.description || ''}</p>
                <div class="portfolio-stats">
                    <span><i class="fas fa-heart"></i> ${item.likes || 0}</span>
                    <span><i class="fas fa-eye"></i> ${item.views || 0}</span>
                    <span><i class="fas fa-comment"></i> ${item.comments || 0}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Graphics
async function loadGraphics() {
    const grid = document.getElementById('graphicsGrid');
    if (!grid) return;
    
    try {
        const response = await fetch('tables/graphics_posts?limit=20');
        if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.length > 0) {
                AppState.graphicsData = result.data;
                renderGraphics(grid, result.data);
                return;
            }
        }
    } catch (error) {
        console.log('Using default graphics data');
    }
    
    // Default graphics data
    const defaultGraphics = [
        {
            id: 'gfx-001',
            title: 'Professional Instagram Design',
            description: 'High-quality social media graphics for brand presence',
            image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg',
            likes: 124,
            views: 1520,
            comments: 18
        },
        {
            id: 'gfx-002',
            title: 'IYAN Creative Poster',
            description: 'Modern poster design with futuristic elements',
            image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770236645/IYAN_2_asu0kf.png',
            likes: 89,
            views: 980,
            comments: 12
        },
        {
            id: 'gfx-003',
            title: 'IYAN Brand Identity',
            description: 'Complete brand identity design package',
            image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770236739/IYAN_xo8rrs.png',
            likes: 156,
            views: 2100,
            comments: 24
        },
        {
            id: 'gfx-004',
            title: 'WhatsApp Marketing Design',
            description: 'Engaging marketing visuals for WhatsApp campaigns',
            image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770236837/WhatsApp_Image_2026-02-03_at_5.36.36_AM_2_wogrj5.jpg',
            likes: 203,
            views: 2890,
            comments: 31
        }
    ];
    
    AppState.graphicsData = defaultGraphics;
    renderGraphics(grid, defaultGraphics);
}

function renderGraphics(grid, items) {
    grid.innerHTML = items.map(item => `
        <div class="graphics-item" onclick="openGraphicsModal('${item.id}')">
            <div class="graphics-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="graphics-content">
                <h4>${item.title}</h4>
                <p>${item.description || ''}</p>
                <div class="graphics-stats">
                    <span><i class="fas fa-heart"></i> ${item.likes || 0}</span>
                    <span><i class="fas fa-eye"></i> ${item.views || 0}</span>
                    <span><i class="fas fa-comment"></i> ${item.comments || 0}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Clients
async function loadClients() {
    const grid = document.getElementById('clientsGrid');
    if (!grid) return;
    
    try {
        const response = await fetch('tables/clients?limit=20');
        if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.length > 0) {
                AppState.clientsData = result.data;
                renderClients(grid, result.data);
                return;
            }
        }
    } catch (error) {
        console.log('Using default clients data');
    }
    
    // Default clients data
    const defaultClients = [
        {
            id: 'client-001',
            name: 'Lushoto Executive Lodge',
            logo: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770294853/LUSHOTO_LOGO_2_PURE_wzx2li.png',
            description: 'Premium lodge and hospitality services'
        }
    ];
    
    AppState.clientsData = defaultClients;
    renderClients(grid, defaultClients);
}

function renderClients(grid, clients) {
    grid.innerHTML = clients.map(client => `
        <div class="client-card">
            <div class="client-logo">
                <img src="${client.logo}" alt="${client.name}" loading="lazy">
            </div>
            <h4>${client.name}</h4>
            <p>${client.description || ''}</p>
        </div>
    `).join('');
}

// Filter Buttons
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter portfolio items
            const filter = btn.getAttribute('data-filter');
            filterPortfolio(filter);
        });
    });
}

function filterPortfolio(filter) {
    const items = document.querySelectorAll('.portfolio-item');
    
    items.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Upload Zone
function initUploadZone() {
    const uploadZone = document.getElementById('uploadZone');
    if (!uploadZone) return;
    
    // Drag and drop events
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
}

function handleFileSelect(event) {
    const files = event.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const filesList = document.getElementById('filesList');
    const noFiles = filesList.querySelector('.no-files');
    
    if (noFiles) {
        noFiles.remove();
    }
    
    Array.from(files).forEach(file => {
        // Validate file
        if (file.type.startsWith('video/') && file.size > 200 * 1024 * 1024) {
            showToast('Video file too large. Maximum size is 200MB.', 'error');
            return;
        }
        
        // Add to state
        AppState.uploadedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type
        });
        
        // Add to list
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-icon">
                <i class="fas fa-${file.type.startsWith('video/') ? 'video' : 'image'}"></i>
            </div>
            <div class="file-info">
                <h5>${file.name}</h5>
                <span>${formatFileSize(file.size)}</span>
            </div>
            <div class="file-actions">
                <button onclick="removeFile(this)"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        filesList.appendChild(fileItem);
        
        // Simulate upload progress
        simulateUpload();
    });
    
    showToast('Files uploaded successfully!', 'success');
}

function formatFileSize(bytes) {
    if (bytes >= 1073741824) {
        return (bytes / 1073741824).toFixed(2) + ' GB';
    }
    if (bytes >= 1048576) {
        return (bytes / 1048576).toFixed(2) + ' MB';
    }
    if (bytes >= 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    }
    return bytes + ' bytes';
}

function removeFile(button) {
    const fileItem = button.closest('.file-item');
    fileItem.remove();
    
    const filesList = document.getElementById('filesList');
    if (filesList.children.length === 0) {
        filesList.innerHTML = '<p class="no-files">No files uploaded yet</p>';
    }
}

function simulateUpload() {
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadContent = document.querySelector('.upload-content');
    
    // Show progress
    uploadContent.style.display = 'none';
    uploadProgress.style.display = 'block';
    
    let progress = 0;
    const progressPercent = uploadProgress.querySelector('.progress-percent');
    const progressFill = uploadProgress.querySelector('.progress-ring-fill');
    
    const interval = setInterval(() => {
        progress += 5;
        progressPercent.textContent = progress + '%';
        
        // Update SVG circle
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (progress / 100) * circumference;
        progressFill.style.strokeDashoffset = offset;
        
        if (progress >= 100) {
            clearInterval(interval);
            
            setTimeout(() => {
                uploadContent.style.display = 'block';
                uploadProgress.style.display = 'none';
                progressPercent.textContent = '0%';
                progressFill.style.strokeDashoffset = 283;
            }, 500);
        }
    }, 50);
}

function submitFeedback() {
    const feedbackBox = document.getElementById('feedbackBox');
    const feedback = feedbackBox.value.trim();
    
    if (!feedback) {
        showToast('Please enter your feedback', 'error');
        return;
    }
    
    // Simulate sending feedback
    showToast('Feedback submitted successfully!', 'success');
    feedbackBox.value = '';
}

// Realtime Simulation
function startRealtimeSimulation() {
    // Update progress bars periodically
    setInterval(() => {
        const progressBars = document.querySelectorAll('.progress-fill[data-progress]');
        progressBars.forEach(bar => {
            const currentProgress = parseInt(bar.getAttribute('data-progress'));
            const variation = Math.floor(Math.random() * 10) - 5;
            const newProgress = Math.min(100, Math.max(10, currentProgress + variation));
            bar.setAttribute('data-progress', newProgress);
            bar.style.width = newProgress + '%';
            
            // Update value display
            const valueDisplay = bar.closest('.progress-item').querySelector('.progress-value');
            if (valueDisplay) {
                valueDisplay.textContent = newProgress + '%';
            }
        });
    }, 5000);
    
    // Update dashboard stats
    setInterval(() => {
        const statValues = document.querySelectorAll('.dashboard-panel .stat-value[data-count]');
        statValues.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            const variation = Math.floor(Math.random() * 5) - 2;
            const newValue = Math.max(0, currentValue + variation);
            stat.textContent = newValue;
        });
    }, 3000);
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openLoginModal() {
    closeModal('signupModal');
    openModal('loginModal');
}

function openSignupModal() {
    closeModal('loginModal');
    openModal('signupModal');
}

function switchToSignup() {
    closeModal('loginModal');
    openModal('signupModal');
}

function switchToLogin() {
    closeModal('signupModal');
    openModal('loginModal');
}

function openProjectForm() {
    openModal('projectModal');
}

function openPaymentModal() {
    openModal('paymentModal');
}

// Service Details
function openServiceDetail(serviceType) {
    const modal = document.getElementById('serviceModal');
    const detailContainer = document.getElementById('serviceDetail');
    
    const services = {
        'video-editing': {
            icon: 'fa-film',
            title: 'Video Editing',
            description: 'Transform your raw footage into stunning 4K cinematic masterpieces. Our expert editors bring professional color grading, seamless transitions, and engaging storytelling to every project.',
            features: ['4K Resolution Support', 'Professional Color Grading', 'Sound Design & Mixing', 'Motion Graphics Integration', 'Multi-camera Editing', 'Export for All Platforms'],
            price: 'From $9.99'
        },
        'animation': {
            icon: 'fa-cube',
            title: '2D/3D Animation',
            description: 'Bring your ideas to life with stunning 2D and 3D animations. From character animation to product visualization, we create immersive visual experiences.',
            features: ['Character Animation', '3D Product Visualization', 'Explainer Videos', 'Logo Animation', 'Architectural Visualization', 'Game Assets'],
            price: 'From $19.99'
        },
        'social-media': {
            icon: 'fa-hashtag',
            title: 'Social Media Content',
            description: 'Create scroll-stopping content optimized for every social platform. Engage your audience with professional videos and graphics.',
            features: ['Instagram Reels', 'TikTok Videos', 'YouTube Shorts', 'Facebook Stories', 'LinkedIn Videos', 'Twitter Content'],
            price: 'From $4.99'
        },
        'motion-graphics': {
            icon: 'fa-magic',
            title: 'Motion Graphics',
            description: 'Dynamic visual effects and animated graphics that captivate your audience. Perfect for intros, outros, and promotional content.',
            features: ['Logo Animation', 'Kinetic Typography', 'Infographics', 'Title Sequences', 'Lower Thirds', 'Transition Effects'],
            price: 'From $14.99'
        }
    };
    
    const service = services[serviceType];
    if (!service) return;
    
    detailContainer.innerHTML = `
        <div class="service-detail-icon">
            <i class="fas ${service.icon}"></i>
        </div>
        <h2>${service.title}</h2>
        <p class="description">${service.description}</p>
        <div class="service-detail-features">
            ${service.features.map(f => `<span><i class="fas fa-check"></i> ${f}</span>`).join('')}
        </div>
        <div class="service-detail-pricing">
            <h4>Starting Price</h4>
            <div class="price">${service.price}</div>
        </div>
        <div class="service-detail-actions">
            <button class="btn btn-primary" onclick="closeModal('serviceModal'); openProjectForm();">
                <i class="fas fa-rocket"></i> Start Project
            </button>
            <button class="btn btn-secondary" onclick="openPaymentModal()">
                <i class="fas fa-credit-card"></i> View Pricing
            </button>
        </div>
    `;
    
    openModal('serviceModal');
}

// Studio Module
function openStudioModule(moduleType) {
    showToast(`Opening ${moduleType} module...`, 'info');
    // Could expand to show detailed module content
}

// Portfolio Item
function openPortfolioItem(itemId) {
    const modal = document.getElementById('portfolioModal');
    const detailContainer = document.getElementById('portfolioDetail');
    
    // Find item in state or use default
    const item = AppState.graphicsData.find(i => i.id === itemId) || {
        id: itemId,
        title: 'Portfolio Item',
        description: 'A creative project showcasing our capabilities.',
        image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg',
        likes: 100,
        views: 1000,
        comments: 20
    };
    
    detailContainer.innerHTML = `
        <div class="portfolio-detail-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <h2>${item.title}</h2>
        <p class="description">${item.description || ''}</p>
        <div class="portfolio-detail-stats">
            <div class="stat">
                <div class="stat-value">${item.likes || 0}</div>
                <div class="stat-label">Likes</div>
            </div>
            <div class="stat">
                <div class="stat-value">${item.views || 0}</div>
                <div class="stat-label">Views</div>
            </div>
            <div class="stat">
                <div class="stat-value">${item.comments || 0}</div>
                <div class="stat-label">Comments</div>
            </div>
        </div>
    `;
    
    openModal('portfolioModal');
}

// Graphics Modal
function openGraphicsModal(itemId) {
    openPortfolioItem(itemId);
}

// Graphics Upload
function openGraphicsUploadModal() {
    if (!AppState.isLoggedIn) {
        showToast('Please login to upload graphics', 'error');
        openLoginModal();
        return;
    }
    openModal('graphicsUploadModal');
}

function previewGraphicsImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('graphicsPreview');
    const placeholder = document.querySelector('#graphicsImageUpload .upload-placeholder');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

async function handleGraphicsUpload(event) {
    event.preventDefault();
    
    const title = document.getElementById('graphicsTitle').value;
    const description = document.getElementById('graphicsDescription').value;
    const imageInput = document.getElementById('graphicsImage');
    
    if (!imageInput.files[0]) {
        showToast('Please select an image', 'error');
        return;
    }
    
    // For demo, we'll simulate the upload
    const newGraphic = {
        id: 'gfx-' + Date.now(),
        title: title,
        description: description,
        image: URL.createObjectURL(imageInput.files[0]),
        likes: 0,
        views: 0,
        comments: 0,
        status: 'published',
        author_id: AppState.currentUser?.id || 'anonymous'
    };
    
    // Try to save to API
    try {
        const response = await fetch('tables/graphics_posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGraphic)
        });
        
        if (response.ok) {
            const savedGraphic = await response.json();
            AppState.graphicsData.unshift(savedGraphic);
        } else {
            AppState.graphicsData.unshift(newGraphic);
        }
    } catch (error) {
        AppState.graphicsData.unshift(newGraphic);
    }
    
    // Re-render graphics grid
    const grid = document.getElementById('graphicsGrid');
    renderGraphics(grid, AppState.graphicsData);
    
    // Close modal and reset form
    closeModal('graphicsUploadModal');
    document.getElementById('graphicsUploadForm').reset();
    document.getElementById('graphicsPreview').style.display = 'none';
    document.querySelector('#graphicsImageUpload .upload-placeholder').style.display = 'block';
    
    showToast('Graphics uploaded successfully!', 'success');
}

// Payment Functions
function payWithMpesa() {
    const phoneNumber = '+255740330004';
    showToast(`Send payment to M-Pesa: ${phoneNumber}`, 'info');
    
    // Copy phone number to clipboard
    navigator.clipboard.writeText(phoneNumber).then(() => {
        showToast('Phone number copied to clipboard!', 'success');
    });
}

function payWithWhatsApp() {
    window.open('https://wa.me/255740330004?text=Hello!%20I%20want%20to%20make%20a%20payment%20for%20my%20project.', '_blank');
}

// Pricing Selection
function selectPlan(plan) {
    if (plan === 'free') {
        openProjectForm();
    } else if (plan === 'enterprise') {
        openDirectChat();
    } else {
        openPaymentModal();
    }
}

// Direct Chat
function openDirectChat() {
    window.open('https://wa.me/255740330004?text=Hello!%20I%20would%20like%20to%20discuss%20a%20project.', '_blank');
}

// Project Form Handler
async function handleProjectSubmit(event) {
    event.preventDefault();
    
    const projectData = {
        id: 'proj-' + Date.now(),
        name: document.getElementById('projectName').value,
        client_name: document.getElementById('projectName').value,
        email: document.getElementById('projectEmail').value,
        phone: document.getElementById('projectPhone').value,
        service_type: document.getElementById('projectService').value,
        description: document.getElementById('projectDescription').value,
        budget: document.getElementById('projectBudget').value,
        status: 'pending'
    };
    
    try {
        const response = await fetch('tables/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        
        if (response.ok) {
            showToast('Project submitted successfully! We will contact you soon.', 'success');
        } else {
            showToast('Project submitted! We will contact you soon.', 'success');
        }
    } catch (error) {
        showToast('Project submitted! We will contact you soon.', 'success');
    }
    
    closeModal('projectModal');
    document.getElementById('projectForm').reset();
}

// User Menu
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

function openProfile() {
    showToast('Profile page coming soon!', 'info');
}

// Load More Portfolio
function loadMorePortfolio() {
    showToast('Loading more items...', 'info');
    // Could implement pagination here
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slide-in 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userDropdown = document.getElementById('userDropdown');
    const userAvatar = document.querySelector('.user-avatar');
    
    if (userDropdown && !userDropdown.contains(e.target) && !userAvatar?.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});
