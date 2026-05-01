/* ===============================================
   IERICORN CREATIVE - Admin Dashboard JavaScript
   =============================================== */

// Admin State
const AdminState = {
    graphics: [],
    clients: [],
    users: [],
    projects: [],
    activities: [],
    currentSection: 'overview',
    editingItem: null
};

// Initialize Admin
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    initAdmin();
});

// Check Admin Authentication
function checkAdminAuth() {
    const authData = localStorage.getItem('iericorn_auth');
    
    if (!authData) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const user = JSON.parse(authData);
        
        // For demo, allow any logged-in user or check for admin role
        if (user) {
            AppState.currentUser = user;
            AppState.isLoggedIn = true;
            
            // Update admin header
            const adminAvatar = document.getElementById('adminAvatar');
            const adminName = document.getElementById('adminName');
            
            if (adminAvatar) adminAvatar.src = user.avatar || 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg';
            if (adminName) adminName.textContent = user.name || user.email;
        } else {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Auth error:', error);
        window.location.href = 'index.html';
    }
}

// Initialize Admin Dashboard
function initAdmin() {
    loadDashboardData();
    initEventListeners();
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load all data in parallel
        const [graphicsRes, clientsRes, usersRes, projectsRes, activityRes] = await Promise.all([
            fetch('tables/graphics_posts?limit=100'),
            fetch('tables/clients?limit=100'),
            fetch('tables/users?limit=100'),
            fetch('tables/projects?limit=100'),
            fetch('tables/activity_logs?limit=50')
        ]);
        
        if (graphicsRes.ok) {
            const data = await graphicsRes.json();
            AdminState.graphics = data.data || [];
        }
        
        if (clientsRes.ok) {
            const data = await clientsRes.json();
            AdminState.clients = data.data || [];
        }
        
        if (usersRes.ok) {
            const data = await usersRes.json();
            AdminState.users = data.data || [];
        }
        
        if (projectsRes.ok) {
            const data = await projectsRes.json();
            AdminState.projects = data.data || [];
        }
        
        if (activityRes.ok) {
            const data = await activityRes.json();
            AdminState.activities = data.data || [];
        }
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
    
    // Use default data if empty
    if (AdminState.graphics.length === 0) {
        AdminState.graphics = [
            { id: 'gfx-001', title: 'Professional Instagram Design', image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg', status: 'published', views: 1520, likes: 124 },
            { id: 'gfx-002', title: 'IYAN Creative Poster', image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770236645/IYAN_2_asu0kf.png', status: 'published', views: 980, likes: 89 },
            { id: 'gfx-003', title: 'IYAN Brand Identity', image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770236739/IYAN_xo8rrs.png', status: 'published', views: 2100, likes: 156 },
            { id: 'gfx-004', title: 'WhatsApp Marketing', image: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770236837/WhatsApp_Image_2026-02-03_at_5.36.36_AM_2_wogrj5.jpg', status: 'published', views: 2890, likes: 203 }
        ];
    }
    
    if (AdminState.clients.length === 0) {
        AdminState.clients = [
            { id: 'client-001', name: 'Lushoto Executive Lodge', logo: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770294853/LUSHOTO_LOGO_2_PURE_wzx2li.png', status: 'active' }
        ];
    }
    
    if (AdminState.users.length === 0) {
        AdminState.users = [
            { id: 'admin-001', name: 'Admin User', email: 'admin@iericorn.com', role: 'admin', status: 'active', avatar: 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg' }
        ];
    }
    
    // Update dashboard
    updateDashboard();
    renderAllTables();
}

// Update Dashboard Stats
function updateDashboard() {
    // Update stat cards
    document.getElementById('totalGraphics').textContent = AdminState.graphics.length;
    document.getElementById('totalClients').textContent = AdminState.clients.filter(c => c.status === 'active').length;
    document.getElementById('totalUsers').textContent = AdminState.users.length;
    document.getElementById('totalProjects').textContent = AdminState.projects.length;
    
    // Calculate totals
    const totalViews = AdminState.graphics.reduce((sum, g) => sum + (g.views || 0), 0);
    const totalLikes = AdminState.graphics.reduce((sum, g) => sum + (g.likes || 0), 0);
    const pendingProjects = AdminState.projects.filter(p => p.status === 'pending').length;
    
    document.getElementById('totalViews').textContent = formatNumber(totalViews);
    document.getElementById('totalLikes').textContent = formatNumber(totalLikes);
    document.getElementById('pendingProjects').textContent = pendingProjects;
    
    // Render activity list
    renderActivityList();
}

// Format Number
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
}

// Render Activity List
function renderActivityList() {
    const container = document.getElementById('activityList');
    
    if (AdminState.activities.length === 0) {
        container.innerHTML = '<p class="empty-state">No recent activity</p>';
        return;
    }
    
    container.innerHTML = AdminState.activities.slice(0, 10).map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${getActivityIcon(activity.action)}"></i>
            </div>
            <div class="activity-content">
                <p><strong>${activity.actor_name || 'User'}</strong> ${activity.action} ${activity.target_type}</p>
                <span>${formatDate(activity.created_at)}</span>
            </div>
        </div>
    `).join('');
}

// Get Activity Icon
function getActivityIcon(action) {
    const icons = {
        'login': 'sign-in-alt',
        'signup': 'user-plus',
        'create': 'plus',
        'update': 'edit',
        'delete': 'trash'
    };
    return icons[action] || 'circle';
}

// Format Date
function formatDate(timestamp) {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' minutes ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
    return date.toLocaleDateString();
}

// Render All Tables
function renderAllTables() {
    renderGraphicsTable();
    renderClientsTable();
    renderUsersTable();
    renderProjectsTable();
}

// Render Graphics Table
function renderGraphicsTable() {
    const tbody = document.getElementById('graphicsTableBody');
    
    if (AdminState.graphics.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No graphics found</td></tr>';
        return;
    }
    
    tbody.innerHTML = AdminState.graphics.map(item => `
        <tr>
            <td><img src="${item.image}" alt="${item.title}" class="table-image"></td>
            <td>${item.title}</td>
            <td><span class="status-badge ${item.status || 'published'}">${item.status || 'Published'}</span></td>
            <td>${item.views || 0}</td>
            <td>${item.likes || 0}</td>
            <td>
                <div class="table-actions">
                    <button class="edit" onclick="editGraphics('${item.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete" onclick="confirmDelete('graphics', '${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render Clients Table
function renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    
    if (AdminState.clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No clients found</td></tr>';
        return;
    }
    
    tbody.innerHTML = AdminState.clients.map(item => `
        <tr>
            <td><img src="${item.logo}" alt="${item.name}" class="table-image"></td>
            <td>${item.name}</td>
            <td><span class="status-badge ${item.status || 'active'}">${item.status || 'Active'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="edit" onclick="editClient('${item.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete" onclick="confirmDelete('clients', '${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render Users Table
function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    
    if (AdminState.users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = AdminState.users.map(item => `
        <tr>
            <td><img src="${item.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name || item.email)}" alt="${item.name}" class="table-avatar"></td>
            <td>${item.name || 'N/A'}</td>
            <td>${item.email}</td>
            <td><span class="role-badge ${item.role || 'user'}">${item.role || 'User'}</span></td>
            <td><span class="status-badge ${item.status || 'active'}">${item.status || 'Active'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="edit" onclick="editUser('${item.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete" onclick="confirmDelete('users', '${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render Projects Table
function renderProjectsTable() {
    const tbody = document.getElementById('projectsTableBody');
    
    if (AdminState.projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No projects found</td></tr>';
        return;
    }
    
    tbody.innerHTML = AdminState.projects.map(item => `
        <tr>
            <td>${item.client_name || item.name}</td>
            <td>${item.service_type || 'N/A'}</td>
            <td><span class="status-badge ${item.status || 'pending'}">${item.status || 'Pending'}</span></td>
            <td>${formatDate(item.created_at)}</td>
            <td>
                <div class="table-actions">
                    <button class="edit" onclick="viewProject('${item.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="delete" onclick="confirmDelete('projects', '${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Section Navigation
function showSection(sectionName) {
    AdminState.currentSection = sectionName;
    
    // Update nav items
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName + 'Section').classList.add('active');
    
    // Update page title
    const titles = {
        'overview': 'Overview',
        'graphics': 'Graphics Manager',
        'clients': 'Clients Manager',
        'users': 'Users Manager',
        'projects': 'Projects',
        'settings': 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('active');
}

// Modal Functions
function openAdminModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeAdminModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    AdminState.editingItem = null;
}

// Graphics CRUD
function openAddGraphicsModal() {
    AdminState.editingItem = null;
    document.getElementById('graphicsModalTitle').textContent = 'Add Graphics';
    document.getElementById('graphicsForm').reset();
    document.getElementById('graphicsId').value = '';
    openAdminModal('graphicsModal');
}

function editGraphics(id) {
    const item = AdminState.graphics.find(g => g.id === id);
    if (!item) return;
    
    AdminState.editingItem = item;
    document.getElementById('graphicsModalTitle').textContent = 'Edit Graphics';
    document.getElementById('graphicsId').value = item.id;
    document.getElementById('gfxTitle').value = item.title || '';
    document.getElementById('gfxDescription').value = item.description || '';
    document.getElementById('gfxImage').value = item.image || '';
    document.getElementById('gfxStatus').value = item.status || 'published';
    
    openAdminModal('graphicsModal');
}

async function saveGraphics(event) {
    event.preventDefault();
    
    const id = document.getElementById('graphicsId').value;
    const data = {
        title: document.getElementById('gfxTitle').value,
        description: document.getElementById('gfxDescription').value,
        image: document.getElementById('gfxImage').value,
        status: document.getElementById('gfxStatus').value,
        category: 'Graphics'
    };
    
    try {
        if (id) {
            // Update
            await fetch(`tables/graphics_posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, id })
            });
            
            const index = AdminState.graphics.findIndex(g => g.id === id);
            if (index !== -1) {
                AdminState.graphics[index] = { ...AdminState.graphics[index], ...data };
            }
            
            showToast('Graphics updated successfully', 'success');
        } else {
            // Create
            const newItem = {
                id: 'gfx-' + Date.now(),
                ...data,
                views: 0,
                likes: 0,
                comments: 0
            };
            
            await fetch('tables/graphics_posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            
            AdminState.graphics.unshift(newItem);
            showToast('Graphics added successfully', 'success');
        }
        
        closeAdminModal('graphicsModal');
        renderGraphicsTable();
        updateDashboard();
        
    } catch (error) {
        console.error('Error saving graphics:', error);
        showToast('Error saving graphics', 'error');
    }
}

// Clients CRUD
function openAddClientModal() {
    AdminState.editingItem = null;
    document.getElementById('clientModalTitle').textContent = 'Add Client';
    document.getElementById('clientForm').reset();
    document.getElementById('clientId').value = '';
    openAdminModal('clientModal');
}

function editClient(id) {
    const item = AdminState.clients.find(c => c.id === id);
    if (!item) return;
    
    AdminState.editingItem = item;
    document.getElementById('clientModalTitle').textContent = 'Edit Client';
    document.getElementById('clientId').value = item.id;
    document.getElementById('clientName').value = item.name || '';
    document.getElementById('clientLogo').value = item.logo || '';
    document.getElementById('clientDescription').value = item.description || '';
    document.getElementById('clientStatus').value = item.status || 'active';
    
    openAdminModal('clientModal');
}

async function saveClient(event) {
    event.preventDefault();
    
    const id = document.getElementById('clientId').value;
    const data = {
        name: document.getElementById('clientName').value,
        logo: document.getElementById('clientLogo').value,
        description: document.getElementById('clientDescription').value,
        status: document.getElementById('clientStatus').value
    };
    
    try {
        if (id) {
            await fetch(`tables/clients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, id })
            });
            
            const index = AdminState.clients.findIndex(c => c.id === id);
            if (index !== -1) {
                AdminState.clients[index] = { ...AdminState.clients[index], ...data };
            }
            
            showToast('Client updated successfully', 'success');
        } else {
            const newItem = {
                id: 'client-' + Date.now(),
                ...data
            };
            
            await fetch('tables/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            
            AdminState.clients.unshift(newItem);
            showToast('Client added successfully', 'success');
        }
        
        closeAdminModal('clientModal');
        renderClientsTable();
        updateDashboard();
        
    } catch (error) {
        console.error('Error saving client:', error);
        showToast('Error saving client', 'error');
    }
}

// Users CRUD
function openAddUserModal() {
    AdminState.editingItem = null;
    document.getElementById('userModalTitle').textContent = 'Add User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    openAdminModal('userModal');
}

function editUser(id) {
    const item = AdminState.users.find(u => u.id === id);
    if (!item) return;
    
    AdminState.editingItem = item;
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userId').value = item.id;
    document.getElementById('userName').value = item.name || '';
    document.getElementById('userEmail').value = item.email || '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = item.role || 'user';
    document.getElementById('userStatus').value = item.status || 'active';
    
    openAdminModal('userModal');
}

async function saveUser(event) {
    event.preventDefault();
    
    const id = document.getElementById('userId').value;
    const password = document.getElementById('userPassword').value;
    
    const data = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value
    };
    
    if (password) {
        data.password = password;
    }
    
    try {
        if (id) {
            await fetch(`tables/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, id })
            });
            
            const index = AdminState.users.findIndex(u => u.id === id);
            if (index !== -1) {
                AdminState.users[index] = { ...AdminState.users[index], ...data };
            }
            
            showToast('User updated successfully', 'success');
        } else {
            if (!password) {
                showToast('Password is required for new users', 'error');
                return;
            }
            
            const newItem = {
                id: 'user-' + Date.now(),
                ...data,
                avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.name)
            };
            
            await fetch('tables/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            
            AdminState.users.unshift(newItem);
            showToast('User added successfully', 'success');
        }
        
        closeAdminModal('userModal');
        renderUsersTable();
        updateDashboard();
        
    } catch (error) {
        console.error('Error saving user:', error);
        showToast('Error saving user', 'error');
    }
}

// View Project
function viewProject(id) {
    const project = AdminState.projects.find(p => p.id === id);
    if (!project) return;
    
    alert(`Project Details:\n\nClient: ${project.client_name || project.name}\nService: ${project.service_type}\nStatus: ${project.status}\nDescription: ${project.description || 'N/A'}`);
}

// Confirm Delete
let deleteTarget = { type: '', id: '' };

function confirmDelete(type, id) {
    deleteTarget = { type, id };
    document.getElementById('confirmMessage').textContent = `Are you sure you want to delete this ${type.slice(0, -1)}?`;
    document.getElementById('confirmDeleteBtn').onclick = executeDelete;
    openAdminModal('confirmModal');
}

async function executeDelete() {
    const { type, id } = deleteTarget;
    
    try {
        await fetch(`tables/${type === 'graphics' ? 'graphics_posts' : type}/${id}`, {
            method: 'DELETE'
        });
        
        // Remove from local state
        switch (type) {
            case 'graphics':
                AdminState.graphics = AdminState.graphics.filter(g => g.id !== id);
                renderGraphicsTable();
                break;
            case 'clients':
                AdminState.clients = AdminState.clients.filter(c => c.id !== id);
                renderClientsTable();
                break;
            case 'users':
                AdminState.users = AdminState.users.filter(u => u.id !== id);
                renderUsersTable();
                break;
            case 'projects':
                AdminState.projects = AdminState.projects.filter(p => p.id !== id);
                renderProjectsTable();
                break;
        }
        
        closeAdminModal('confirmModal');
        updateDashboard();
        showToast('Item deleted successfully', 'success');
        
    } catch (error) {
        console.error('Error deleting:', error);
        showToast('Error deleting item', 'error');
    }
}

// Event Listeners
function initEventListeners() {
    // Global search
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            // Implement search filtering based on current section
            console.log('Search:', query);
        });
    }
    
    // Settings form
    const settingsForm = document.getElementById('siteSettingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Settings saved successfully', 'success');
        });
    }
    
    // Theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            showToast('Theme updated', 'success');
        });
    });
}

// Toast Notification
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
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Logout
function logout() {
    localStorage.removeItem('iericorn_auth');
    window.location.href = 'index.html';
}
