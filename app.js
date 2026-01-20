/**
 * app.js - DonorX Frontend Logic (Modern Edition)
 * 
 * Updates:
 * - Uses new CSS classes for cards (badge-soft-danger, etc.)
 * - Cleaner HTML structure in renderFeed()
 */

// ==========================================
// 1. DATA MANAGEMENT
// ==========================================

const dummyRequests = [
    {
        id: 1,
        bloodGroup: "O+",
        location: "City Hospital, Delhi",
        urgency: "High",
        timeRemaining: "2h",
        status: "Active",
        verified: true
    },
    {
        id: 2,
        bloodGroup: "A-",
        location: "Community Center, NFC",
        urgency: "Medium",
        timeRemaining: "5h",
        status: "Active",
        verified: true
    },
    {
        id: 3,
        bloodGroup: "AB+",
        location: "Red Cross Clinic",
        urgency: "Low",
        timeRemaining: "24h",
        status: "Active",
        verified: false
    }
];

function initData() {
    const existingData = localStorage.getItem('donorx_requests');
    if (!existingData) {
        localStorage.setItem('donorx_requests', JSON.stringify(dummyRequests));
    }
}

function getRequests() {
    const data = localStorage.getItem('donorx_requests');
    return data ? JSON.parse(data) : [];
}

// ==========================================
// 2. UI RENDERING
// ==========================================
function renderFeed() {
    const feedContainer = document.getElementById('request-feed');
    const requests = getRequests();

    feedContainer.innerHTML = '';

    requests.forEach(req => {
        // Updated Logic for "Soft" badges
        let badgeClass = 'badge-soft-success';

        if (req.urgency === 'High') {
            badgeClass = 'badge-soft-danger';
        } else if (req.urgency === 'Medium') {
            badgeClass = 'badge-soft-warning';
        }

        const verifiedIcon = req.verified ?
            '<i class="bi bi-patch-check-fill text-primary ms-1" data-bs-toggle="tooltip" title="Verified Request"></i>' : '';

        // New Card HTML Structure
        const cardHTML = `
            <div class="col-md-6 col-lg-4 fade-in">
                <div class="card h-100">
                    <div class="card-body">
                        
                        <!-- Header with Blood Group + Badge -->
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="blood-group-circle">
                                ${req.bloodGroup}
                            </div>
                            <span class="badge ${badgeClass} rounded-pill">
                                ${req.urgency} Priority
                            </span>
                        </div>
                        
                        <!-- Content -->
                        <h5 class="fw-bold mb-2 text-dark">
                            Blood Needed ${verifiedIcon}
                        </h5>
                        <p class="text-muted small mb-4">
                            <i class="bi bi-geo-alt-fill text-danger me-1"></i> ${req.location}
                        </p>
                        
                        <!-- Footer Info -->
                        <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-4">
                            <div class="small">
                                <div class="text-muted fw-bold" style="font-size: 0.75rem;">EXPIRES IN</div>
                                <div class="fw-bold text-dark"><i class="bi bi-clock"></i> ${req.timeRemaining}</div>
                            </div>
                            <div class="small text-end">
                                <div class="text-muted fw-bold" style="font-size: 0.75rem;">STATUS</div>
                                <div class="fw-bold text-success">${req.status}</div>
                            </div>
                        </div>

                        <!-- Action Button -->
                        <button class="btn btn-outline-danger w-100 rounded-pill fw-bold py-2 border-2" 
                                onclick="alert('Connecting you to donor...')">
                            <i class="bi bi-telephone-fill me-2"></i> Contact Now
                        </button>

                    </div>
                </div>
            </div>
        `;
        feedContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function handlePost(event) {
    event.preventDefault();

    // Get values from new form IDs if they changed, though they should be same
    const newRequest = {
        id: Date.now(),
        bloodGroup: document.getElementById('bloodGroup').value,
        location: document.getElementById('location').value,
        urgency: document.getElementById('urgency').value,
        timeRemaining: "48h",
        contact: document.getElementById('contact').value, // Saved for completeness
        status: "Active",
        verified: false
    };

    const currentRequests = getRequests();
    currentRequests.unshift(newRequest);
    localStorage.setItem('donorx_requests', JSON.stringify(currentRequests));

    alert("Request Posted Successfully!");

    document.getElementById('post-request-form').reset();
    showSection('feed-section'); // Go back to feed
    renderFeed();
}

// ==========================================
function showSection(sectionId) {
    // Hide all main sections
    document.querySelectorAll('main > section').forEach(sec => {
        sec.classList.add('d-none');
    });

    // Show target
    const target = document.getElementById(sectionId);
    if (target) target.classList.remove('d-none');

    // Update Nav Active State
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        // Simple string check to see if this link controls the current section
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });

    if (sectionId === 'feed-section') {
        renderFeed();
    }
}

// ==========================================
// 4. INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initData();
    renderFeed(); // Load data into the feed (hidden in background)

    // Default View: Landing Section is already visible via HTML classes
    // If you wanted to force it: showSection('landing-section');

    const postForm = document.getElementById('post-request-form');
    if (postForm) {
        postForm.addEventListener('submit', handlePost);
    }
});
