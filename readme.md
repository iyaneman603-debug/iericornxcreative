# IERICORN CREATIVE

## Visual Storytelling, Powered by Motion Intelligence

A comprehensive creative agency website featuring cinematic design, motion UI, and full content management capabilities.

![Brand Colors: Blue + Red + White](https://img.shields.io/badge/Theme-Blue%20%7C%20Red%20%7C%20White-0066ff)
![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-00ff88)

---

## 🎬 Project Overview

IERICORN CREATIVE is a professional creative agency platform offering:
- Video Editing (4K cinematic)
- 2D/3D Animation
- Social Media Content
- Motion Graphics

The website features a futuristic, cinematic design with smooth animations and a comprehensive admin dashboard.

---

## ✅ Completed Features

### Main Website (`index.html`)

1. **Navigation System**
   - Responsive sticky navigation
   - Smooth scroll to sections
   - Mobile hamburger menu
   - User authentication buttons
   - User dropdown menu when logged in

2. **Hero Section**
   - Animated title with gradient text
   - Cinematic background with floating shapes
   - Call-to-action buttons
   - Live animated counters (Projects Delivered, Satisfaction %, Frames Rendered)
   - Scroll indicator

3. **Core Services Section**
   - 4 service cards (Video Editing, Animation, Social Media, Motion Graphics)
   - Hover effects with glow
   - Click to open detailed modal with pricing

4. **Creative Studio Section**
   - Video Production, VFX, Color Grading modules
   - Interactive cards with sample visuals

5. **Motion Intelligence Dashboard**
   - Real-time render progress bars
   - Timeline steps visualization
   - Animated stats (Active Projects, Frames Today, Avg. Turnaround)
   - Simulated live updates

6. **Portfolio Gallery**
   - Filter buttons (All, Video, Animation, Graphics, Motion)
   - Image cards with likes, views, comments
   - Click to view detail modal

7. **Graphics Section**
   - Graphics gallery with default posts
   - Upload system (visible when logged in)
   - Like/view/comment counters

8. **Collaboration Hub**
   - Drag & drop file upload zone
   - Video max 200MB, Images: JPG, PNG, WEBP
   - Progress indicator
   - Uploaded files list
   - Feedback text area

9. **Pricing Section**
   - 3 plans: Free, Pro ($9.99), Enterprise (Custom)
   - Feature comparison
   - Click to select plan

10. **Payment System**
    - M-Pesa: +255740330004
    - WhatsApp: https://wa.me/255740330004
    - Payment instructions modal

11. **Clients Section**
    - Client logo showcase
    - Default: Lushoto Executive Lodge

12. **AI Assistant (Floating)**
    - Avatar image with pulse indicator
    - Chat window with messages
    - Quick action buttons (Pricing, Services, Payment)
    - Knowledge base for automated responses
    - Supports Swahili and English

13. **Footer**
    - Brand information
    - Quick links
    - Services links
    - Contact information
    - Social media icons

14. **Authentication System**
    - Login modal
    - Signup modal
    - Session persistence (localStorage)
    - Role-based access (admin/user)

### Admin Dashboard (`admin.html`)

1. **Overview**
   - Stats cards (Graphics, Clients, Users, Projects)
   - Recent activity feed
   - Quick stats (Views, Likes, Pending Projects)

2. **Graphics Manager**
   - Table view with all graphics
   - Add/Edit/Delete functionality
   - Status management (Published/Draft)

3. **Clients Manager**
   - Table view with all clients
   - Add/Edit/Delete functionality
   - Status management (Active/Inactive)

4. **Users Manager**
   - Table view with all users
   - Add/Edit/Delete functionality
   - Role management (Admin/User)
   - Status management (Active/Disabled)

5. **Projects Section**
   - View all submitted projects
   - Status tracking

6. **Settings**
   - Site settings form
   - Theme options (Dark/Light)
   - Notification toggles

---

## 📂 File Structure

```
/
├── index.html              # Main website
├── admin.html              # Admin dashboard
├── README.md               # Documentation
│
├── css/
│   ├── style.css           # Main styles
│   ├── animations.css      # Animation effects
│   ├── responsive.css      # Mobile/tablet styles
│   └── admin.css           # Admin dashboard styles
│
├── js/
│   ├── app.js              # Main application logic
│   ├── auth.js             # Authentication system
│   ├── api.js              # RESTful API utilities
│   ├── animations.js       # Animation effects
│   ├── ai-chat.js          # AI assistant logic
│   └── admin.js            # Admin dashboard logic
```

---

## 🔗 Entry Points (URIs)

| Page | Path | Description |
|------|------|-------------|
| Home | `/` or `/index.html` | Main website |
| Admin | `/admin.html` | Admin dashboard (requires login) |

### URL Hash Navigation

- `#home` - Hero section
- `#services` - Services section
- `#creative-studio` - Studio section
- `#motion-library` - Dashboard UI
- `#portfolio` - Portfolio gallery
- `#graphics` - Graphics section
- `#collaboration` - File upload hub
- `#pricing` - Pricing plans
- `#clients` - Clients section

---

## 💾 Database Schema

### Tables

**users**
| Field | Type | Description |
|-------|------|-------------|
| id | text | Unique identifier |
| email | text | User email |
| password | text | Hashed password |
| name | text | Full name |
| role | text | admin/user |
| status | text | active/disabled |
| avatar | text | Avatar URL |

**graphics_posts**
| Field | Type | Description |
|-------|------|-------------|
| id | text | Unique identifier |
| title | text | Post title |
| description | text | Description |
| image | text | Image URL |
| category | text | Category |
| likes | number | Like count |
| views | number | View count |
| comments | number | Comment count |
| status | text | published/draft |
| author_id | text | Author ID |

**clients**
| Field | Type | Description |
|-------|------|-------------|
| id | text | Unique identifier |
| name | text | Client name |
| logo | text | Logo URL |
| description | text | Description |
| website | text | Website URL |
| status | text | active/inactive |

**projects**
| Field | Type | Description |
|-------|------|-------------|
| id | text | Unique identifier |
| name | text | Project name |
| client_name | text | Client name |
| email | text | Contact email |
| phone | text | Phone number |
| service_type | text | Service type |
| description | text | Description |
| budget | text | Budget range |
| status | text | pending/in_progress/completed |
| files | array | Uploaded files |

**activity_logs**
| Field | Type | Description |
|-------|------|-------------|
| id | text | Unique identifier |
| actor_id | text | User ID |
| actor_name | text | User name |
| action | text | Action type |
| target_type | text | Target type |
| target_id | text | Target ID |
| details | text | Additional details |

---

## 🌐 API Endpoints

All endpoints use the `tables/` prefix:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `tables/{table}` | List records |
| GET | `tables/{table}/{id}` | Get single record |
| POST | `tables/{table}` | Create record |
| PUT | `tables/{table}/{id}` | Update record |
| PATCH | `tables/{table}/{id}` | Partial update |
| DELETE | `tables/{table}/{id}` | Delete record |

Query parameters:
- `page` - Page number
- `limit` - Records per page
- `search` - Search query
- `sort` - Sort field

---

## 💰 Payment Information

**M-Pesa Number:** +255740330004

**WhatsApp:** [wa.me/255740330004](https://wa.me/255740330004)

**Pricing Plans:**
- **Free:** $0 - 1min video, watermark, 1 revision
- **Pro:** $9.99 - 4K, no watermark, unlimited revisions
- **Enterprise:** Custom - 3D, 24/7 support

---

## 📱 Contact Information

- **Email:** iericorn.inc@gmail.com
- **Phone:** +255740330004
- **Location:** Dar es Salaam, Tanzania
- **YouTube:** [@x.mationmedia](https://www.youtube.com/@x.mationmedia)

---

## 🎨 Design System

### Colors
- **Primary Blue:** #0066ff
- **Primary Red:** #ff3366
- **White:** #ffffff
- **Dark Background:** #0a0a0f
- **Dark Surface:** #12121a
- **Dark Card:** #1a1a25

### Fonts
- **Primary:** Poppins (300-900)
- **Secondary:** Montserrat (400-800)

### Icons
- Font Awesome 6.4.0

---

## 📋 Default Content

### Portfolio Images (Cloudinary)
1. INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg
2. IYAN_2_asu0kf.png
3. IYAN_xo8rrs.png
4. WhatsApp_Image_2026-02-03_at_5.36.36_AM_2_wogrj5.jpg

### Client Logo
- Lushoto Executive Lodge: LUSHOTO_LOGO_2_PURE_wzx2li.png

### AI Assistant Avatar
- INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg

---

## 🚀 Deployment

The website is ready for deployment. To publish:

1. Go to the **Publish tab** in the interface
2. Click **Publish** to deploy
3. The live URL will be provided

---

## 📝 Future Enhancements

- [ ] Video player integration for portfolio
- [ ] Real-time notifications system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Email notification system
- [ ] Invoice generation
- [ ] Client portal with project tracking

---

## ⚠️ Important Notes

- **XMATION branding has been completely removed**
- **Logo area displays IERICORN CREATIVE branding**
- All images use provided Cloudinary URLs
- Session data stored in localStorage
- Admin access: Use email containing "admin" or login as admin@iericorn.com

---

## 👤 Admin Access

**Default Admin Credentials:**
- Email: admin@iericorn.com
- Password: admin123

Or any email containing "admin" will grant admin role.

---

© 2026 IERICORN CREATIVE. All rights reserved.
