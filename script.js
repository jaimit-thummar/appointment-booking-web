// MediBook Surat - Application Logic

// 1. Dummy Data: 10 Doctors across Surat
const doctors = [
    { id: 1, name: "Dr. Vishal Vanani", specialty: "Cardiology", hospital: "Surat Heart Clinic", location: "Adajan", phone: "+91 98251 11001" },
    { id: 2, name: "Dr. Priya Mehta", specialty: "Neurology", hospital: "NeuroLife Hospital", location: "Vesu", phone: "+91 98252 22002" },
    { id: 3, name: "Dr. Rakesh Shah", specialty: "Orthopedics", hospital: "BoneCare Clinic", location: "Athwa", phone: "+91 98253 33003" },
    { id: 4, name: "Dr. Sneha Patel", specialty: "Dermatology", hospital: "SkinGlow Center", location: "Citylight", phone: "+91 98254 44004" },
    { id: 5, name: "Dr. Amit Desai", specialty: "Pediatrics", hospital: "KidsCare Clinic", location: "Katargam", phone: "+91 98255 55005" },
    { id: 6, name: "Dr. Kavita Joshi", specialty: "Gynecology", hospital: "MothersFirst Hospital", location: "Varachha", phone: "+91 98256 66006" },
    { id: 7, name: "Dr. Nitin Trivedi", specialty: "General Medicine", hospital: "MediPlus Clinic", location: "Udhna", phone: "+91 98257 77007" },
    { id: 8, name: "Dr. Harsha Kapoor", specialty: "ENT", hospital: "ClearSound Clinic", location: "Piplod", phone: "+91 98258 88008" },
    { id: 9, name: "Dr. Rajan Nair", specialty: "Ophthalmology", hospital: "VisionPlus Eye Clinic", location: "Althan", phone: "+91 98259 99009" },
    { id: 10, name: "Dr. Meena Kulkarni", specialty: "Psychiatry", hospital: "MindWell Center", location: "Bhatar", phone: "+91 98250 10010" }
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
                <div class="ag-info-row" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.location + ', Surat')}', '_blank')">
                    <i data-lucide="map-pin" style="width: 18px; height: 18px;"></i>
                    <span>${doc.location}, Surat</span>
                </div>
                <div class="ag-info-row">
                    <i data-lucide="phone" style="width: 18px; height: 18px;"></i>
                    <span>${doc.phone}</span>
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
    document.getElementById('modalLocation').value = doc.location + ", Surat";
    
    // Set min date for appointment to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').setAttribute('min', today);

    bookingModalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeBookingModal() {
    bookingModalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    bookingForm.reset();
}

// Notification System
function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'ag-notification ag-notification-success';
    notif.innerHTML = `
        <i data-lucide="check-circle" style="color: #059669;"></i>
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

// Form Submission
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple verification
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);
    
    console.log("Appointment Booked:", data);
    
    closeBookingModal();
    showNotification("Your appointment has been booked successfully! A confirmation call will reach you within 2 hours.");
});

// 6. Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderDoctors();
    lucide.createIcons();
});
