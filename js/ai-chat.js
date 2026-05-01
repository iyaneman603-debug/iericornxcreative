/* ===============================================
   IERICORN CREATIVE - AI Chat Assistant
   Interactive Chat Widget
   =============================================== */

// AI Chat State
const AIChat = {
    isOpen: false,
    messages: [],
    isTyping: false
};

// AI Knowledge Base
const AIKnowledge = {
    pricing: {
        free: {
            name: 'Free Plan',
            price: '$0',
            features: ['1 minute video', 'Watermark included', '1 revision', '720p quality']
        },
        pro: {
            name: 'Pro Plan',
            price: '$9.99/project',
            features: ['4K resolution', 'No watermark', 'Unlimited revisions', 'Priority support', 'Source files']
        },
        enterprise: {
            name: 'Enterprise Plan',
            price: 'Custom pricing',
            features: ['3D animation', '24/7 support', 'Dedicated manager', 'API access']
        }
    },
    services: {
        'video-editing': {
            name: 'Video Editing',
            description: '4K cinematic video editing with professional color grading',
            startingPrice: '$9.99'
        },
        'animation': {
            name: '2D/3D Animation',
            description: 'Character animation, product visualization, explainer videos',
            startingPrice: '$19.99'
        },
        'social-media': {
            name: 'Social Media Content',
            description: 'Instagram Reels, TikTok, YouTube Shorts',
            startingPrice: '$4.99'
        },
        'motion-graphics': {
            name: 'Motion Graphics',
            description: 'Logo animation, infographics, title sequences',
            startingPrice: '$14.99'
        }
    },
    payment: {
        mpesa: '+255740330004',
        whatsapp: 'https://wa.me/255740330004',
        instructions: [
            'Send payment to M-Pesa: +255740330004',
            'Include your project name in the reference',
            'Send screenshot via WhatsApp for confirmation'
        ]
    },
    contact: {
        email: 'iericorn.inc@gmail.com',
        phone: '+255740330004',
        location: 'Dar es Salaam, Tanzania',
        youtube: 'https://www.youtube.com/@x.mationmedia'
    }
};

// Toggle AI Chat
function toggleAIChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    AIChat.isOpen = !AIChat.isOpen;
    
    if (AIChat.isOpen) {
        chatWindow.classList.add('active');
    } else {
        chatWindow.classList.remove('active');
    }
}

// Send AI Message
function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Process and respond
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage(response, 'bot');
    }, 500 + Math.random() * 1000);
}

// Handle Enter Key
function handleAIInput(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

// Quick Action Buttons
function aiQuickAction(action) {
    let message = '';
    
    switch (action) {
        case 'pricing':
            message = 'What are your pricing plans?';
            break;
        case 'services':
            message = 'What services do you offer?';
            break;
        case 'payment':
            message = 'How can I make a payment?';
            break;
        default:
            message = action;
    }
    
    document.getElementById('aiInput').value = message;
    sendAIMessage();
}

// Add Chat Message to UI
function addChatMessage(message, type) {
    const messagesContainer = document.getElementById('aiMessages');
    
    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ${type}`;
    
    const avatar = type === 'bot' 
        ? 'https://res.cloudinary.com/dluecf4wg/image/upload/v1770228777/INSTAGRAM_PROFESSIONAL_2_qaa7pb.jpg'
        : 'https://ui-avatars.com/api/?name=User&background=0066ff&color=fff';
    
    messageEl.innerHTML = `
        <img src="${avatar}" alt="${type}">
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Generate AI Response
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Pricing related
    if (message.includes('price') || message.includes('pricing') || message.includes('cost') || message.includes('bei')) {
        return formatPricingResponse();
    }
    
    // Services related
    if (message.includes('service') || message.includes('huduma') || message.includes('what do you') || message.includes('offer')) {
        return formatServicesResponse();
    }
    
    // Payment related
    if (message.includes('payment') || message.includes('pay') || message.includes('mpesa') || message.includes('malipo') || message.includes('lipa')) {
        return formatPaymentResponse();
    }
    
    // Contact related
    if (message.includes('contact') || message.includes('reach') || message.includes('wasiliana')) {
        return formatContactResponse();
    }
    
    // Video editing
    if (message.includes('video') || message.includes('edit') || message.includes('hariri')) {
        return `🎬 <strong>Video Editing Service</strong><br><br>
        We offer professional 4K video editing with:<br>
        • Color grading<br>
        • Sound design<br>
        • Motion graphics<br>
        • Multi-camera editing<br><br>
        Starting from <strong>$9.99</strong>. Would you like to start a project?`;
    }
    
    // Animation
    if (message.includes('animation') || message.includes('animate') || message.includes('3d') || message.includes('2d')) {
        return `✨ <strong>Animation Services</strong><br><br>
        We create stunning 2D and 3D animations:<br>
        • Character animation<br>
        • Product visualization<br>
        • Explainer videos<br>
        • Logo animation<br><br>
        Starting from <strong>$19.99</strong>. Interested?`;
    }
    
    // Social media
    if (message.includes('social') || message.includes('instagram') || message.includes('tiktok') || message.includes('youtube')) {
        return `📱 <strong>Social Media Content</strong><br><br>
        We create engaging content for all platforms:<br>
        • Instagram Reels<br>
        • TikTok Videos<br>
        • YouTube Shorts<br>
        • Facebook Stories<br><br>
        Starting from just <strong>$4.99</strong>!`;
    }
    
    // Start project
    if (message.includes('start') || message.includes('project') || message.includes('mradi') || message.includes('begin')) {
        return `🚀 <strong>Ready to Start?</strong><br><br>
        I'd love to help you start your project! You can:<br>
        1. Click "Anza Mradi Wako" button on the homepage<br>
        2. Contact us via WhatsApp: +255740330004<br>
        3. Email: iericorn.inc@gmail.com<br><br>
        What type of project are you thinking about?`;
    }
    
    // Greeting
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('hujambo') || message.includes('habari')) {
        return `Hujambo! 👋 Karibu IERICORN CREATIVE!<br><br>
        I'm your creative assistant. I can help you with:<br>
        • 💰 Pricing information<br>
        • 🎬 Service details<br>
        • 💳 Payment guidance<br>
        • 📋 Starting a project<br><br>
        What would you like to know?`;
    }
    
    // Thank you
    if (message.includes('thank') || message.includes('asante')) {
        return `Karibu sana! 🙏<br><br>
        Is there anything else I can help you with today?`;
    }
    
    // Default response
    return `Thank you for your message! 💬<br><br>
    I can help you with:<br>
    • <strong>Pricing</strong> - Ask about our plans<br>
    • <strong>Services</strong> - Learn what we offer<br>
    • <strong>Payment</strong> - How to pay<br>
    • <strong>Projects</strong> - Start your project<br><br>
    Or contact us directly at +255740330004`;
}

// Format Pricing Response
function formatPricingResponse() {
    const pricing = AIKnowledge.pricing;
    
    return `💰 <strong>Our Pricing Plans:</strong><br><br>
    <strong>🆓 Free Plan</strong><br>
    ${pricing.free.price} - ${pricing.free.features.join(', ')}<br><br>
    <strong>⭐ Pro Plan</strong> (Most Popular)<br>
    ${pricing.pro.price} - ${pricing.pro.features.join(', ')}<br><br>
    <strong>🏢 Enterprise</strong><br>
    ${pricing.enterprise.price} - ${pricing.enterprise.features.join(', ')}<br><br>
    Would you like to start with any plan?`;
}

// Format Services Response
function formatServicesResponse() {
    const services = AIKnowledge.services;
    
    let response = `🎬 <strong>Our Services:</strong><br><br>`;
    
    for (const [key, service] of Object.entries(services)) {
        response += `<strong>• ${service.name}</strong><br>
        ${service.description}<br>
        Starting from ${service.startingPrice}<br><br>`;
    }
    
    response += `Which service interests you?`;
    
    return response;
}

// Format Payment Response
function formatPaymentResponse() {
    const payment = AIKnowledge.payment;
    
    return `💳 <strong>Payment Options:</strong><br><br>
    <strong>📱 M-Pesa:</strong><br>
    ${payment.mpesa}<br><br>
    <strong>💬 WhatsApp:</strong><br>
    Chat to pay - click <a href="${payment.whatsapp}" target="_blank" style="color: var(--primary-blue);">here</a><br><br>
    <strong>📝 Instructions:</strong><br>
    ${payment.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('<br>')}<br><br>
    Need help with payment?`;
}

// Format Contact Response
function formatContactResponse() {
    const contact = AIKnowledge.contact;
    
    return `📞 <strong>Contact Us:</strong><br><br>
    <strong>📧 Email:</strong> ${contact.email}<br>
    <strong>📱 Phone:</strong> ${contact.phone}<br>
    <strong>📍 Location:</strong> ${contact.location}<br>
    <strong>🎥 YouTube:</strong> <a href="${contact.youtube}" target="_blank" style="color: var(--primary-blue);">@x.mationmedia</a><br><br>
    We're here to help!`;
}

// Initialize AI Chat
document.addEventListener('DOMContentLoaded', function() {
    // Auto-greet after delay
    setTimeout(() => {
        const chatWindow = document.getElementById('aiChatWindow');
        const aiToggle = document.querySelector('.ai-toggle');
        
        // Add attention animation
        if (aiToggle) {
            aiToggle.classList.add('pulse-soft');
        }
    }, 5000);
});
