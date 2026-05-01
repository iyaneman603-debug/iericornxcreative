/* ===============================================
   IERICORN CREATIVE - API Utilities
   RESTful API Integration
   =============================================== */

// API Base Configuration
const API_CONFIG = {
    baseUrl: 'tables',
    timeout: 10000
};

// API Client
const API = {
    // Generic request handler
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseUrl}/${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, mergedOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url);
    },
    
    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // PATCH request
    async patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
};

// Users API
const UsersAPI = {
    async getAll(params = {}) {
        return API.get('users', params);
    },
    
    async getById(id) {
        return API.get(`users/${id}`);
    },
    
    async create(userData) {
        return API.post('users', userData);
    },
    
    async update(id, userData) {
        return API.put(`users/${id}`, userData);
    },
    
    async patch(id, data) {
        return API.patch(`users/${id}`, data);
    },
    
    async delete(id) {
        return API.delete(`users/${id}`);
    },
    
    async search(query) {
        return API.get('users', { search: query });
    }
};

// Graphics Posts API
const GraphicsAPI = {
    async getAll(params = {}) {
        return API.get('graphics_posts', params);
    },
    
    async getById(id) {
        return API.get(`graphics_posts/${id}`);
    },
    
    async create(postData) {
        return API.post('graphics_posts', postData);
    },
    
    async update(id, postData) {
        return API.put(`graphics_posts/${id}`, postData);
    },
    
    async patch(id, data) {
        return API.patch(`graphics_posts/${id}`, data);
    },
    
    async delete(id) {
        return API.delete(`graphics_posts/${id}`);
    },
    
    async incrementLikes(id, currentLikes) {
        return this.patch(id, { likes: currentLikes + 1 });
    },
    
    async incrementViews(id, currentViews) {
        return this.patch(id, { views: currentViews + 1 });
    }
};

// Clients API
const ClientsAPI = {
    async getAll(params = {}) {
        return API.get('clients', params);
    },
    
    async getById(id) {
        return API.get(`clients/${id}`);
    },
    
    async create(clientData) {
        return API.post('clients', clientData);
    },
    
    async update(id, clientData) {
        return API.put(`clients/${id}`, clientData);
    },
    
    async patch(id, data) {
        return API.patch(`clients/${id}`, data);
    },
    
    async delete(id) {
        return API.delete(`clients/${id}`);
    }
};

// Projects API
const ProjectsAPI = {
    async getAll(params = {}) {
        return API.get('projects', params);
    },
    
    async getById(id) {
        return API.get(`projects/${id}`);
    },
    
    async create(projectData) {
        return API.post('projects', projectData);
    },
    
    async update(id, projectData) {
        return API.put(`projects/${id}`, projectData);
    },
    
    async patch(id, data) {
        return API.patch(`projects/${id}`, data);
    },
    
    async delete(id) {
        return API.delete(`projects/${id}`);
    },
    
    async updateStatus(id, status) {
        return this.patch(id, { status });
    }
};

// Activity Logs API
const ActivityAPI = {
    async getAll(params = {}) {
        return API.get('activity_logs', params);
    },
    
    async create(logData) {
        return API.post('activity_logs', logData);
    },
    
    async log(actorId, actorName, action, targetType, targetId, details = '') {
        return this.create({
            id: 'log-' + Date.now(),
            actor_id: actorId,
            actor_name: actorName,
            action: action,
            target_type: targetType,
            target_id: targetId,
            details: details
        });
    }
};

// Realtime Subscription Simulation
class RealtimeSubscription {
    constructor(table, callback, interval = 5000) {
        this.table = table;
        this.callback = callback;
        this.interval = interval;
        this.lastData = null;
        this.timer = null;
    }
    
    async checkForUpdates() {
        try {
            const response = await API.get(this.table, { limit: 100 });
            const currentData = JSON.stringify(response.data);
            
            if (this.lastData !== currentData) {
                this.lastData = currentData;
                this.callback(response.data);
            }
        } catch (error) {
            console.error('Realtime check error:', error);
        }
    }
    
    start() {
        // Initial check
        this.checkForUpdates();
        
        // Set up polling
        this.timer = setInterval(() => {
            this.checkForUpdates();
        }, this.interval);
    }
    
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// Create realtime subscriptions
function subscribeToTable(table, callback, interval = 5000) {
    const subscription = new RealtimeSubscription(table, callback, interval);
    subscription.start();
    return subscription;
}

// Export for use in other files
window.API = API;
window.UsersAPI = UsersAPI;
window.GraphicsAPI = GraphicsAPI;
window.ClientsAPI = ClientsAPI;
window.ProjectsAPI = ProjectsAPI;
window.ActivityAPI = ActivityAPI;
window.subscribeToTable = subscribeToTable;
