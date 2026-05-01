/* ===============================================
   IERICORN CREATIVE - Authentication System
   Login, Signup, Session Management
   =============================================== */

// Session Storage Keys
const AUTH_KEY = 'iericorn_auth';
const USER_KEY = 'iericorn_user';

// Check Authentication Status
function checkAuthStatus() {
    const authData = localStorage.getItem(AUTH_KEY);
    
    if (authData) {
        try {
            const user = JSON.parse(authData);
            setLoggedInState(user);
        } catch (error) {
            console.error('Error parsing auth data:', error);
            logout();
        }
    }
}

// Set Logged In State
function setLoggedInState(user) {
    AppState.isLoggedIn = true;
    AppState.currentUser = user;
    
    // Update UI
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const adminLink = document.getElementById('adminLink');
    const graphicsUploadArea = document.getElementById('graphicsUploadArea');
    
    if (navAuth) navAuth.style.display = 'none';
    if (navUser) navUser.style.display = 'flex';
    
    if (userAvatar) {
        userAvatar.src = user.avatar || 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg';
    }
    
    if (userName) {
        userName.textContent = user.name || user.email;
    }
    
    // Show admin link if user is admin
    if (adminLink && user.role === 'admin') {
        adminLink.style.display = 'flex';
    }
    
    // Show graphics upload area for logged in users
    if (graphicsUploadArea) {
        graphicsUploadArea.style.display = 'block';
    }
}

// Set Logged Out State
function setLoggedOutState() {
    AppState.isLoggedIn = false;
    AppState.currentUser = null;
    
    // Update UI
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const graphicsUploadArea = document.getElementById('graphicsUploadArea');
    
    if (navAuth) navAuth.style.display = 'flex';
    if (navUser) navUser.style.display = 'none';
    
    // Hide graphics upload area
    if (graphicsUploadArea) {
        graphicsUploadArea.style.display = 'none';
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Show loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    try {
        // Try to find user in database
        const response = await fetch(`tables/users?search=${encodeURIComponent(email)}`);
        
        if (response.ok) {
            const result = await response.json();
            const users = result.data || [];
            
            const user = users.find(u => u.email === email);
            
            if (user) {
                // For demo purposes, accept any password or check if matches
                if (user.password === password || password === 'admin123' || password === 'user123') {
                    // Successful login
                    const userData = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role || 'user',
                        avatar: user.avatar,
                        status: user.status
                    };
                    
                    // Store auth data
                    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
                    
                    // Update state
                    setLoggedInState(userData);
                    
                    // Close modal
                    closeModal('loginModal');
                    
                    // Show success message
                    showToast(`Welcome back, ${userData.name || userData.email}!`, 'success');
                    
                    // Log activity
                    logActivity(userData.id, userData.name, 'login', 'user', userData.id);
                    
                    // Redirect admin to admin page if needed
                    if (userData.role === 'admin') {
                        showToast('You have admin access. Visit Admin Dashboard from menu.', 'info');
                    }
                    
                    return;
                }
            }
        }
        
        // If we get here, login failed - but for demo, create a user session anyway
        const demoUser = {
            id: 'user-' + Date.now(),
            email: email,
            name: email.split('@')[0],
            role: email.includes('admin') ? 'admin' : 'user',
            avatar: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg'
        };
        
        localStorage.setItem(AUTH_KEY, JSON.stringify(demoUser));
        setLoggedInState(demoUser);
        closeModal('loginModal');
        showToast(`Welcome, ${demoUser.name}!`, 'success');
        
    } catch (error) {
        console.error('Login error:', error);
        
        // For demo, still log in
        const demoUser = {
            id: 'user-' + Date.now(),
            email: email,
            name: email.split('@')[0],
            role: email.includes('admin') ? 'admin' : 'user',
            avatar: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg'
        };
        
        localStorage.setItem(AUTH_KEY, JSON.stringify(demoUser));
        setLoggedInState(demoUser);
        closeModal('loginModal');
        showToast(`Welcome, ${demoUser.name}!`, 'success');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Validate password length
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;
    
    try {
        // Check if user already exists
        const checkResponse = await fetch(`tables/users?search=${encodeURIComponent(email)}`);
        
        if (checkResponse.ok) {
            const result = await checkResponse.json();
            const existingUser = (result.data || []).find(u => u.email === email);
            
            if (existingUser) {
                showToast('An account with this email already exists', 'error');
                return;
            }
        }
        
        // Create new user
        const newUser = {
            id: 'user-' + Date.now(),
            email: email,
            password: password,
            name: name,
            role: 'user',
            status: 'active',
            avatar: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg'
        };
        
        // Save to database
        const response = await fetch('tables/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        
        let userData;
        
        if (response.ok) {
            userData = await response.json();
        } else {
            userData = newUser;
        }
        
        // Create session data (without password)
        const sessionData = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            avatar: userData.avatar
        };
        
        // Store auth data
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
        
        // Update state
        setLoggedInState(sessionData);
        
        // Close modal
        closeModal('signupModal');
        
        // Show success message
        showToast(`Welcome to IERICORN CREATIVE, ${name}!`, 'success');
        
        // Log activity
        logActivity(sessionData.id, sessionData.name, 'signup', 'user', sessionData.id);
        
    } catch (error) {
        console.error('Signup error:', error);
        
        // For demo, create user anyway
        const demoUser = {
            id: 'user-' + Date.now(),
            email: email,
            name: name,
            role: 'user',
            avatar: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg'
        };
        
        localStorage.setItem(AUTH_KEY, JSON.stringify(demoUser));
        setLoggedInState(demoUser);
        closeModal('signupModal');
        showToast(`Welcome to IERICORN CREATIVE, ${name}!`, 'success');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Logout
function logout() {
    // Clear local storage
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Update state
    setLoggedOutState();
    
    // Show message
    showToast('You have been logged out', 'info');
    
    // Redirect if on admin page
    if (window.location.pathname.includes('admin')) {
        window.location.href = 'index.html';
    }
}

// Log Activity
async function logActivity(actorId, actorName, action, targetType, targetId, details = '') {
    try {
        const log = {
            id: 'log-' + Date.now(),
            actor_id: actorId,
            actor_name: actorName,
            action: action,
            target_type: targetType,
            target_id: targetId,
            details: details
        };
        
        await fetch('tables/activity_logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log)
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

// Check if user is admin
function isAdmin() {
    return AppState.currentUser?.role === 'admin';
}

// Require Auth
function requireAuth(callback) {
    if (!AppState.isLoggedIn) {
        showToast('Please login to continue', 'error');
        openLoginModal();
        return false;
    }
    if (callback) callback();
    return true;
}

// Require Admin
function requireAdmin(callback) {
    if (!AppState.isLoggedIn) {
        showToast('Please login to continue', 'error');
        openLoginModal();
        return false;
    }
    if (!isAdmin()) {
        showToast('Admin access required', 'error');
        return false;
    }
    if (callback) callback();
    return true;
}
