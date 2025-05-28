// Contact Form Firebase Integration - Debug Version
console.log('Contact form script loading...');

// Firebase Configuration - REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB9VbCbqfKrfoCmX6kae_-N_UyHpBUjIjA",
  authDomain: "contact-egedal-devlopment.firebaseapp.com",
  projectId: "contact-egedal-devlopment",
  storageBucket: "contact-egedal-devlopment.firebasestorage.app",
  messagingSenderId: "1091720412185",
  appId: "1:1091720412185:web:aa2215a16a71d4e379be88",
  measurementId: "G-CFV31057M4"
};

let db;
let firebaseLoaded = false;

// Load Firebase scripts dynamically
function loadFirebaseScripts() {
    return new Promise((resolve, reject) => {
        console.log('Loading Firebase scripts...');
        
        // Check if Firebase is already loaded
        if (window.firebase) {
            console.log('Firebase already loaded');
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            firebaseLoaded = true;
            resolve();
            return;
        }

        // Load Firebase App
        const appScript = document.createElement('script');
        appScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
        appScript.onload = () => {
            console.log('Firebase App loaded');
            // Load Firestore
            const firestoreScript = document.createElement('script');
            firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js';
            firestoreScript.onload = () => {
                console.log('Firebase Firestore loaded');
                try {
                    firebase.initializeApp(firebaseConfig);
                    db = firebase.firestore();
                    firebaseLoaded = true;
                    console.log('Firebase initialized successfully');
                    resolve();
                } catch (error) {
                    console.error('Firebase initialization error:', error);
                    reject(error);
                }
            };
            firestoreScript.onerror = (error) => {
                console.error('Failed to load Firestore script:', error);
                reject(error);
            };
            document.head.appendChild(firestoreScript);
        };
        appScript.onerror = (error) => {
            console.error('Failed to load Firebase App script:', error);
            reject(error);
        };
        document.head.appendChild(appScript);
    });
}

// Contact Form Handler
class ContactFormHandler {
    constructor() {
        console.log('Initializing ContactFormHandler...');
        this.form = document.querySelector('.contact-form');
        
        if (!this.form) {
            console.error('Contact form not found!');
            return;
        }

        this.submitBtn = this.form.querySelector('button[type="submit"]');
        if (!this.submitBtn) {
            console.error('Submit button not found!');
            return;
        }

        this.originalBtnText = this.submitBtn.innerHTML;
        console.log('Form elements found, initializing...');
        this.init();
    }

    init() {
        // Remove any existing error messages from HTML
        this.forceRemoveAllErrors();
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        console.log('Form event listener added');
    }

    forceRemoveAllErrors() {
        // Remove any error messages that might be in the HTML
        const existingErrors = document.querySelectorAll('.error-message, .validation-error');
        existingErrors.forEach(error => error.remove());
        
        // Reset all field styles
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
            field.style.border = '';
            field.classList.remove('error', 'invalid');
        });
        
        console.log('Cleared all existing errors');
    }

    async handleSubmit(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        // Clear any existing errors first
        this.forceRemoveAllErrors();
        
        // Get form values
        const nameInput = this.form.querySelector('input[placeholder*="Name"], input[name="name"]');
        const emailInput = this.form.querySelector('input[placeholder*="Email"], input[name="email"]');
        const messageInput = this.form.querySelector('textarea[placeholder*="Message"], textarea[name="message"]');
        
        if (!nameInput || !emailInput || !messageInput) {
            console.error('Could not find form fields');
            this.showMessage('Form fields not found. Please refresh the page.', 'error');
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
        console.log('Form data:', { name, email, message: message.substring(0, 50) + '...' });

        // Basic validation
        if (!name || name.length < 2) {
            this.showMessage('Please enter a valid name (at least 2 characters)', 'error');
            nameInput.focus();
            return;
        }

        if (!email || !this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }

        if (!message || message.length < 10) {
            this.showMessage('Please enter a message (at least 10 characters)', 'error');
            messageInput.focus();
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            if (!firebaseLoaded || !db) {
                throw new Error('Firebase not initialized. Please check your configuration.');
            }

            console.log('Sending to Firestore...');
            
            // Create the document
            const docData = {
                name: name,
                email: email,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'unread',
                userAgent: navigator.userAgent,
                url: window.location.href,
                submitted: new Date().toISOString()
            };

            console.log('Document data:', docData);

            const docRef = await db.collection('contact-messages').add(docData);
            console.log('Document written with ID: ', docRef.id);
            
            this.showMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
            this.form.reset();

        } catch (error) {
            console.error('Error sending message:', error);
            this.showMessage(`Failed to send message: ${error.message}. Please try again or email me directly at egedal@workmail.com`, 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            console.log('Loading state: ON');
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = this.originalBtnText;
            console.log('Loading state: OFF');
        }
    }

    showMessage(text, type) {
        console.log(`Showing ${type} message:`, text);
        
        // Remove any existing messages
        const existingMessages = this.form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}-message`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${text}</span>
        `;
        
        const bgColor = type === 'success' ? '#2ecc71' : '#e74c3c';
        messageDiv.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;

        this.form.insertBefore(messageDiv, this.form.firstChild);

        // Auto-remove after delay
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, type === 'success' ? 6000 : 8000);
    }
}

// Add CSS animations
function addStyles() {
    const styles = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
        
        .form-message i {
            font-size: 1.2em;
            flex-shrink: 0;
        }
        
        /* Hide any hardcoded error messages */
        .contact-form .error-message,
        .contact-form .validation-error {
            display: none !important;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initialize everything
async function initContactForm() {
    console.log('Initializing contact form...');
    
    try {
        // Add styles
        addStyles();
        
        // Load Firebase
        await loadFirebaseScripts();
        console.log('Firebase loaded successfully');
        
        // Initialize form handler
        new ContactFormHandler();
        console.log('Contact form initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize contact form:', error);
        
        // Show fallback message
        const form = document.querySelector('.contact-form');
        if (form) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>Contact form temporarily unavailable. Please email me directly at <strong>egedal@workmail.com</strong></span>
            `;
            fallbackDiv.style.cssText = `
                background: #f39c12;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 500;
            `;
            form.insertBefore(fallbackDiv, form.firstChild);
        }
    }
}

// Wait for DOM and then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}

// Debug: Log when script finishes loading
console.log('Contact form script loaded');