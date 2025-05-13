// Auth state management
let currentUser = null;

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token and get user data
        fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                currentUser = data.user;
                updateUI(true);
            } else {
                updateUI(false);
            }
        })
        .catch(() => {
            updateUI(false);
        });
    } else {
        updateUI(false);
    }
}

// Update UI based on auth state
function updateUI(isLoggedIn) {
    const authLinks = document.getElementById('auth-links');
    const userLinks = document.getElementById('user-links');
    
    if (isLoggedIn) {
        authLinks.classList.add('d-none');
        userLinks.classList.remove('d-none');
        loadDashboard();
    } else {
        authLinks.classList.remove('d-none');
        userLinks.classList.add('d-none');
        document.getElementById('main-content').innerHTML = `
            <div class="text-center mt-5">
                <h1>Welcome to SecureDoc</h1>
                <p class="lead">Securely store and share your government documents with family members</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                    Get Started
                </button>
            </div>
        `;
    }
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUI(true);
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            showAlert('success', 'Login successful!');
        } else {
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'An error occurred. Please try again.');
    }
});

// Handle register form submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password')
            })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUI(true);
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            showAlert('success', 'Registration successful!');
        } else {
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'An error occurred. Please try again.');
    }
});

// Handle logout
document.getElementById('logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    currentUser = null;
    updateUI(false);
    showAlert('success', 'Logged out successfully!');
});

// Show alert message
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.container').insertBefore(alertDiv, document.getElementById('main-content'));
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Check auth state on page load
document.addEventListener('DOMContentLoaded', checkAuth); 