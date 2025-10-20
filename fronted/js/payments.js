// Enhanced payment handling with success redirects
document.addEventListener('DOMContentLoaded', function() {
    // Mentorship Form
    const mentorshipForm = document.getElementById('mentorshipForm');
    if (mentorshipForm) {
        mentorshipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment(2500, 'mentorship');
        });
    }

    // Referral Form
    const referralForm = document.getElementById('referralForm');
    if (referralForm) {
        referralForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment(400, 'referral');
        });
    }
});

function processPayment(amount, programType) {
    const phoneInput = document.getElementById('phone') || document.getElementById('refPhone');
    const phoneNumber = phoneInput.value;
    
    // Validate phone number
    if (!phoneNumber.startsWith('254') || phoneNumber.length !== 12) {
        alert('Please enter a valid Kenyan phone number (e.g., 254712345678)');
        return;
    }

    // Validate other required fields
    if (!validateForm(programType)) {
        return;
    }

    // Show payment processing
    showPaymentProcessing(amount, phoneNumber);

    // Simulate M-Pesa STK Push (in real implementation, this would call your backend)
    simulateMpesaPayment(amount, phoneNumber, programType);
}

function validateForm(programType) {
    const form = programType === 'mentorship' ? 
        document.getElementById('mentorshipForm') : 
        document.getElementById('referralForm');
    
    const requiredFields = form.querySelectorAll('[required]');
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            alert(`Please fill in all required fields: ${field.labels[0].textContent}`);
            field.focus();
            return false;
        }
    }
    return true;
}

function showPaymentProcessing(amount, phoneNumber) {
    const processingHTML = `
        <div class="payment-processing">
            <div class="processing-spinner">⏳</div>
            <h3>Processing M-Pesa Payment</h3>
            <p>Amount: <strong>KSH ${amount}</strong></p>
            <p>Phone: <strong>${phoneNumber}</strong></p>
            <p>Check your phone for STK Push confirmation...</p>
        </div>
    `;
    
    document.querySelector('.payment-section').innerHTML = processingHTML;
}

function simulateMpesaPayment(amount, phoneNumber, programType) {
    // Simulate API call delay
    setTimeout(() => {
        // Simulate successful payment
        const success = Math.random() > 0.1; // 90% success rate for demo
        
        if (success) {
            // Save user data to localStorage (in real app, send to backend)
            saveUserData(programType);
            
            // Redirect to success page
            if (programType === 'mentorship') {
                window.location.href = 'success-mentorship.html';
            } else {
                window.location.href = 'success-referral.html';
            }
        } else {
            // Simulate payment failure
            alert('Payment failed. Please check your M-Pesa balance and try again.');
            location.reload();
        }
    }, 5000); // 5 second delay to simulate real payment processing
}

function saveUserData(programType) {
    // In a real application, this would send data to your backend
    // For demo purposes, we'll save to localStorage
    const form = programType === 'mentorship' ? 
        document.getElementById('mentorshipForm') : 
        document.getElementById('referralForm');
    
    const formData = new FormData(form);
    const userData = {
        program: programType,
        timestamp: new Date().toISOString(),
        // Add more fields as needed
    };
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        userData[key] = value;
    }
    
    // Save to localStorage (temporary)
    const users = JSON.parse(localStorage.getItem('crowntrade_users') || '[]');
    users.push(userData);
    localStorage.setItem('crowntrade_users', JSON.stringify(users));
    
    console.log('User data saved:', userData);
}