// MediBook Surat - Application Logic

// 1. Dummy Data: 10 Doctors across Surat
const doctors = [
    { 
        id: 1, 
        name: "Dr. Vishal Vanani", 
        specialty: "Cardiology", 
        hospital: "Dr. Vishal Heart Care", 
        location: "G7, Infinity tower, Railway Station Cir, near Ayurvedic college, Suryapur Gate, Varachha, Surat, Gujarat 395003", 
        phone: "09979775172",
        timing: "Monday to Saturday (10:00 AM to 1:00 PM)",
        slots: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM"]
    }
];

// Specialty color mapping for AG Badges
const specialtyColors = {
    "Cardiology": { bg: "#fee2e2", text: "#991b1b" },
    "Neurology": { bg: "#e0e7ff", text: "#3730a3" },
    "Orthopedics": { bg: "#fef3c7", text: "#92400e" },
    "Dermatology": { bg: "#fae8ff", text: "#86198f" },
    "Pediatrics": { bg: "#dcfce7", text: "#166534" },
    "Gynecology": { bg: "#fce7f3", text: "#9d174d" },
    "General Medicine": { bg: "#f1f5f9", text: "#334155" },
    "ENT": { bg: "#ecfeff", text: "#155e75" },
    "Ophthalmology": { bg: "#f0fdf4", text: "#166534" },
    "Psychiatry": { bg: "#fff7ed", text: "#9a3412" }
};

// 2. State Management
let activeSpecialty = "All";
let searchQuery = "";

// 3. UI Elements
const doctorGrid = document.getElementById('doctorGrid');
const searchInput = document.getElementById('searchInput');
const specialtyChips = document.querySelectorAll('.ag-chip');
const bookingModalOverlay = document.getElementById('bookingModalOverlay');
const closeModalBtn = document.getElementById('closeModal');
const bookingForm = document.getElementById('bookingForm');
const notifContainer = document.getElementById('notifContainer');

// 4. Core Functions

// Render Doctor Cards
function renderDoctors() {
    const filtered = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = activeSpecialty === "All" || doc.specialty === activeSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    doctorGrid.innerHTML = filtered.map(doc => {
        const color = specialtyColors[doc.specialty] || { bg: "#f1f5f9", text: "#334155" };
        const initials = doc.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        
        return `
            <div class="ag-card">
                <div class="ag-card-header">
                    <span class="ag-hospital-name">${doc.hospital}</span>
                    <span class="ag-badge" style="background: ${color.bg}; color: ${color.text}">${doc.specialty}</span>
                </div>
                <div class="ag-doctor-info">
                    <div class="ag-avatar">${initials}</div>
                    <div class="ag-doctor-name">${doc.name}</div>
                </div>
                <div class="ag-info-row" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.location)}', '_blank')">
                    <i data-lucide="map-pin" style="width: 18px; height: 18px;"></i>
                    <span>${doc.location}</span>
                </div>
                <div class="ag-info-row">
                    <i data-lucide="phone" style="width: 18px; height: 18px;"></i>
                    <span>${doc.phone}</span>
                </div>
                <div class="ag-info-row">
                    <i data-lucide="clock" style="width: 18px; height: 18px;"></i>
                    <span>${doc.timing}</span>
                </div>
                <button class="ag-button ag-button-primary ag-button-full" onclick="openBookingModal(${doc.id})">
                    Book Appointment
                </button>
            </div>
        `;
    }).join('');

    // Re-initialize Lucide icons for new content
    lucide.createIcons();
}

// Modal Logic
function openBookingModal(doctorId) {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) return;

    document.getElementById('modalHospital').value = doc.hospital;
    document.getElementById('modalDoctor').value = doc.name;
    document.getElementById('modalLocation').value = doc.location;
    
    // Set min date for appointment to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').setAttribute('min', today);
    
    // Dynamically populate time slots based on doctor's timing
    const timeSlotSelect = bookingForm.querySelector('select[name="timeSlot"]');
    timeSlotSelect.innerHTML = '<option value="">Select Time</option>';
    if (doc.slots) {
        doc.slots.forEach(slot => {
            const option = document.createElement('option');
            option.textContent = slot;
            option.value = slot;
            timeSlotSelect.appendChild(option);
        });
    }

    bookingModalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeBookingModal() {
    bookingModalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    bookingForm.reset();
}

// Notification System
function showNotification(message, type = "success") {
    const notif = document.createElement('div');
    const isError = type === "error";
    notif.className = `ag-notification ${isError ? 'ag-notification-error' : 'ag-notification-success'}`;
    notif.innerHTML = `
        <i data-lucide="${isError ? 'x-circle' : 'check-circle'}" style="color: ${isError ? '#dc2626' : '#059669'};"></i>
        <div>${message}</div>
    `;
    notifContainer.appendChild(notif);
    lucide.createIcons();

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(100%)';
        setTimeout(() => notif.remove(), 300);
    }, 5000);
}

// 5. Event Listeners

// Search Input
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderDoctors();
});

// Specialty Filtering
specialtyChips.forEach(chip => {
    chip.addEventListener('click', () => {
        specialtyChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeSpecialty = chip.dataset.specialty;
        renderDoctors();
    });
});

// Modal Close
closeModalBtn.addEventListener('click', closeBookingModal);
bookingModalOverlay.addEventListener('click', (e) => {
    if (e.target === bookingModalOverlay) closeBookingModal();
});

// n8n Webhook URL
const N8N_WEBHOOK_URL = "https://bhavanaben.app.n8n.cloud/webhook/book-appointment";

// Form Submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);

    // Build the payload with all appointment details
    const payload = {
        hospital:       document.getElementById('modalHospital').value,
        doctor:         document.getElementById('modalDoctor').value,
        location:       document.getElementById('modalLocation').value,
        patientName:    data.fullName,
        dateOfBirth:    data.dob,
        mobile:         data.mobile,
        healthIssue:    data.issue || "Not specified",
        appointmentDate: data.appDate,
        timeSlot:       data.timeSlot,
        bookedAt:       new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // Show loading state on button
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Booking...";

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            closeBookingModal();
            showNotification(`✅ Appointment confirmed for ${payload.patientName} with ${payload.doctor} on ${payload.appointmentDate} at ${payload.timeSlot}.`);
        } else {
            throw new Error(`Server responded with status ${response.status}`);
        }
    } catch (error) {
        console.error("Booking failed:", error);
        showNotification("❌ Booking failed. Please try again or contact us directly.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// 6. Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderDoctors();
    lucide.createIcons();
});

// Expose functions to window for inline onclick handlers (needed for Vite module bundling)
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
