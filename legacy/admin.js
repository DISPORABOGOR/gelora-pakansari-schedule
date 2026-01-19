/**
 * Admin Panel - Jadwal Stadion Pakansari
 * CRUD Operations with LocalStorage
 */

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'pakansari_schedule_data';

// ============================================
// DEFAULT DATA (for initial setup)
// ============================================
const defaultScheduleData = [
    {
        id: 1,
        hari: "Senin",
        tanggal: "2025-01-20",
        kegiatan: "Latihan Rutin PERSIKABO 1973",
        waktuMulai: "08:00",
        waktuSelesai: "12:00",
        keterangan: "Lapangan Utama"
    },
    {
        id: 2,
        hari: "Senin",
        tanggal: "2025-01-20",
        kegiatan: "Pertandingan Liga 2 Indonesia",
        waktuMulai: "15:00",
        waktuSelesai: "18:00",
        keterangan: "Lapangan Utama - Tiket Berbayar"
    },
    {
        id: 3,
        hari: "Selasa",
        tanggal: "2025-01-21",
        kegiatan: "Maintenance Rumput Lapangan",
        waktuMulai: "06:00",
        waktuSelesai: "10:00",
        keterangan: "Area Tertutup"
    },
    {
        id: 4,
        hari: "Rabu",
        tanggal: "2025-01-22",
        kegiatan: "Event Komunitas Sepak Bola Kab. Bogor",
        waktuMulai: "09:00",
        waktuSelesai: "15:00",
        keterangan: "Pendaftaran Online"
    },
    {
        id: 5,
        hari: "Kamis",
        tanggal: "2025-01-23",
        kegiatan: "Latihan Tim Nasional U-20",
        waktuMulai: "14:00",
        waktuSelesai: "17:00",
        keterangan: "Tertutup untuk Umum"
    }
];

// ============================================
// DOM ELEMENTS
// ============================================
const scheduleForm = document.getElementById('scheduleForm');
const scheduleList = document.getElementById('scheduleList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const formTitle = document.getElementById('formTitle');
const submitBtnText = document.getElementById('submitBtnText');
const cancelBtn = document.getElementById('cancelBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const editIdInput = document.getElementById('editId');

// Form inputs
const hariInput = document.getElementById('hari');
const tanggalInput = document.getElementById('tanggal');
const kegiatanInput = document.getElementById('kegiatan');
const waktuMulaiInput = document.getElementById('waktuMulai');
const waktuSelesaiInput = document.getElementById('waktuSelesai');
const keteranganInput = document.getElementById('keterangan');

// Toast elements
const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');

// Modal elements
const confirmModal = document.getElementById('confirmModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date to Indonesian format
 */
function formatDateToIndonesian(dateString) {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

/**
 * Format time range
 */
function formatTimeRange(start, end) {
    return `${start} - ${end}`;
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    toast.className = `toast ${type}`;
    toastIcon.textContent = type === 'success' ? '✓' : '✕';
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Show confirmation modal
 */
function showConfirmModal(title, message) {
    return new Promise((resolve) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        confirmModal.classList.add('show');
        
        const handleConfirm = () => {
            confirmModal.classList.remove('show');
            cleanup();
            resolve(true);
        };
        
        const handleCancel = () => {
            confirmModal.classList.remove('show');
            cleanup();
            resolve(false);
        };
        
        const cleanup = () => {
            modalConfirm.removeEventListener('click', handleConfirm);
            modalCancel.removeEventListener('click', handleCancel);
        };
        
        modalConfirm.addEventListener('click', handleConfirm);
        modalCancel.addEventListener('click', handleCancel);
    });
}

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Get all schedules from localStorage
 */
function getSchedules() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        // Initialize with default data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultScheduleData));
        return defaultScheduleData;
    }
    return JSON.parse(data);
}

/**
 * Save schedules to localStorage
 */
function saveSchedules(schedules) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}

/**
 * Create new schedule
 */
function createSchedule(scheduleData) {
    const schedules = getSchedules();
    const newSchedule = {
        id: generateId(),
        ...scheduleData
    };
    schedules.push(newSchedule);
    saveSchedules(schedules);
    return newSchedule;
}

/**
 * Read schedule by ID
 */
function readSchedule(id) {
    const schedules = getSchedules();
    return schedules.find(s => s.id == id);
}

/**
 * Update schedule
 */
function updateSchedule(id, scheduleData) {
    const schedules = getSchedules();
    const index = schedules.findIndex(s => s.id == id);
    if (index !== -1) {
        schedules[index] = { ...schedules[index], ...scheduleData };
        saveSchedules(schedules);
        return schedules[index];
    }
    return null;
}

/**
 * Delete schedule
 */
function deleteSchedule(id) {
    const schedules = getSchedules();
    const filtered = schedules.filter(s => s.id != id);
    saveSchedules(filtered);
}

/**
 * Delete all schedules
 */
function deleteAllSchedules() {
    saveSchedules([]);
}

// ============================================
// UI RENDERING
// ============================================

/**
 * Render schedule list
 */
function renderScheduleList() {
    const schedules = getSchedules();
    
    // Update count
    totalCount.textContent = `${schedules.length} jadwal`;
    
    // Check empty state
    if (schedules.length === 0) {
        scheduleList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    scheduleList.style.display = 'flex';
    emptyState.style.display = 'none';
    
    // Sort by date and time
    schedules.sort((a, b) => {
        const dateCompare = new Date(a.tanggal) - new Date(b.tanggal);
        if (dateCompare !== 0) return dateCompare;
        return a.waktuMulai.localeCompare(b.waktuMulai);
    });
    
    // Render items
    scheduleList.innerHTML = schedules.map((schedule, index) => `
        <div class="schedule-item" data-id="${schedule.id}">
            <div class="schedule-number">${index + 1}</div>
            <div class="schedule-content">
                <div class="schedule-header">
                    <h3 class="schedule-title">${schedule.kegiatan}</h3>
                </div>
                <div class="schedule-meta">
                    <span class="schedule-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${schedule.hari}, ${formatDateToIndonesian(schedule.tanggal)}
                    </span>
                    <span class="schedule-meta-item time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        ${formatTimeRange(schedule.waktuMulai, schedule.waktuSelesai)}
                    </span>
                </div>
                ${schedule.keterangan ? `<p class="schedule-notes">${schedule.keterangan}</p>` : ''}
            </div>
            <div class="schedule-actions">
                <button class="btn btn-icon edit" onclick="editSchedule('${schedule.id}')" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="btn btn-icon delete" onclick="confirmDelete('${schedule.id}')" title="Hapus">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Reset form to add mode
 */
function resetForm() {
    scheduleForm.reset();
    editIdInput.value = '';
    formTitle.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah Jadwal Baru
    `;
    submitBtnText.textContent = 'Simpan Jadwal';
    cancelBtn.style.display = 'none';
}

/**
 * Set form to edit mode
 */
function setEditMode(schedule) {
    editIdInput.value = schedule.id;
    hariInput.value = schedule.hari;
    tanggalInput.value = schedule.tanggal;
    kegiatanInput.value = schedule.kegiatan;
    waktuMulaiInput.value = schedule.waktuMulai;
    waktuSelesaiInput.value = schedule.waktuSelesai;
    keteranganInput.value = schedule.keterangan || '';
    
    formTitle.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Edit Jadwal
    `;
    submitBtnText.textContent = 'Update Jadwal';
    cancelBtn.style.display = 'flex';
    
    // Scroll to form
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle form submission
 */
scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const scheduleData = {
        hari: hariInput.value,
        tanggal: tanggalInput.value,
        kegiatan: kegiatanInput.value,
        waktuMulai: waktuMulaiInput.value,
        waktuSelesai: waktuSelesaiInput.value,
        keterangan: keteranganInput.value
    };
    
    const editId = editIdInput.value;
    
    if (editId) {
        // Update existing
        updateSchedule(editId, scheduleData);
        showToast('Jadwal berhasil diperbarui!', 'success');
    } else {
        // Create new
        createSchedule(scheduleData);
        showToast('Jadwal baru berhasil ditambahkan!', 'success');
    }
    
    resetForm();
    renderScheduleList();
});

/**
 * Handle cancel button
 */
cancelBtn.addEventListener('click', () => {
    resetForm();
});

/**
 * Edit schedule
 */
function editSchedule(id) {
    const schedule = readSchedule(id);
    if (schedule) {
        setEditMode(schedule);
    }
}

/**
 * Confirm delete schedule
 */
async function confirmDelete(id) {
    const schedule = readSchedule(id);
    if (!schedule) return;
    
    const confirmed = await showConfirmModal(
        'Hapus Jadwal',
        `Apakah Anda yakin ingin menghapus jadwal "${schedule.kegiatan}"?`
    );
    
    if (confirmed) {
        deleteSchedule(id);
        showToast('Jadwal berhasil dihapus!', 'success');
        renderScheduleList();
        
        // Reset form if editing the deleted item
        if (editIdInput.value == id) {
            resetForm();
        }
    }
}

/**
 * Clear all schedules
 */
clearAllBtn.addEventListener('click', async () => {
    const schedules = getSchedules();
    if (schedules.length === 0) {
        showToast('Tidak ada jadwal untuk dihapus', 'error');
        return;
    }
    
    const confirmed = await showConfirmModal(
        'Hapus Semua Jadwal',
        `Apakah Anda yakin ingin menghapus semua ${schedules.length} jadwal? Tindakan ini tidak dapat dibatalkan.`
    );
    
    if (confirmed) {
        deleteAllSchedules();
        showToast('Semua jadwal berhasil dihapus!', 'success');
        resetForm();
        renderScheduleList();
    }
});

/**
 * Close modal on overlay click
 */
confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        confirmModal.classList.remove('show');
    }
});

/**
 * Auto-fill day based on date selection
 */
tanggalInput.addEventListener('change', () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const date = new Date(tanggalInput.value);
    if (!isNaN(date)) {
        hariInput.value = days[date.getDay()];
    }
});

// ============================================
// INITIALIZATION
// ============================================
function init() {
    renderScheduleList();
    loadAnnouncement();
    setupSearch();
    setupPrint();
    setupAnnouncement();
    setupResetSample();
    console.log('🔧 Admin Panel initialized');
}

// Start
document.addEventListener('DOMContentLoaded', init);

// Make functions globally available
window.editSchedule = editSchedule;
window.confirmDelete = confirmDelete;

// ============================================
// RESET SAMPLE DATA
// ============================================
const resetSampleBtn = document.getElementById('resetSampleBtn');

function setupResetSample() {
    if (!resetSampleBtn) return;
    
    resetSampleBtn.addEventListener('click', async () => {
        const confirmed = await showConfirmModal(
            'Reset Data Contoh',
            'Apakah Anda yakin ingin mengembalikan data ke contoh awal? Semua jadwal saat ini akan dihapus dan diganti dengan data contoh.'
        );
        
        if (confirmed) {
            // Reset to default data
            saveSchedules(defaultScheduleData);
            resetForm();
            renderScheduleList();
            showToast('Data berhasil direset ke contoh awal!', 'success');
        }
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
const searchInput = document.getElementById('searchInput');
let currentSearchTerm = '';

function setupSearch() {
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        renderFilteredScheduleList();
    });
}

function renderFilteredScheduleList() {
    const schedules = getSchedules();
    
    // Filter schedules based on search term
    const filtered = currentSearchTerm 
        ? schedules.filter(s => 
            s.kegiatan.toLowerCase().includes(currentSearchTerm) ||
            s.hari.toLowerCase().includes(currentSearchTerm) ||
            s.keterangan?.toLowerCase().includes(currentSearchTerm) ||
            formatDateToIndonesian(s.tanggal).toLowerCase().includes(currentSearchTerm)
        )
        : schedules;
    
    // Update count
    totalCount.textContent = `${filtered.length} jadwal`;
    
    // Check empty state
    if (filtered.length === 0) {
        scheduleList.style.display = 'none';
        emptyState.style.display = 'block';
        if (currentSearchTerm) {
            emptyState.querySelector('p').textContent = `Tidak ditemukan jadwal untuk "${currentSearchTerm}"`;
        } else {
            emptyState.querySelector('p').textContent = 'Belum ada jadwal';
        }
        return;
    }
    
    scheduleList.style.display = 'flex';
    emptyState.style.display = 'none';
    
    // Sort by date and time
    filtered.sort((a, b) => {
        const dateCompare = new Date(a.tanggal) - new Date(b.tanggal);
        if (dateCompare !== 0) return dateCompare;
        return a.waktuMulai.localeCompare(b.waktuMulai);
    });
    
    // Render items
    scheduleList.innerHTML = filtered.map((schedule, index) => `
        <div class="schedule-item" data-id="${schedule.id}">
            <div class="schedule-number">${index + 1}</div>
            <div class="schedule-content">
                <div class="schedule-header">
                    <h3 class="schedule-title">${highlightSearchTerm(schedule.kegiatan)}</h3>
                </div>
                <div class="schedule-meta">
                    <span class="schedule-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${schedule.hari}, ${formatDateToIndonesian(schedule.tanggal)}
                    </span>
                    <span class="schedule-meta-item time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        ${formatTimeRange(schedule.waktuMulai, schedule.waktuSelesai)}
                    </span>
                </div>
                ${schedule.keterangan ? `<p class="schedule-notes">${highlightSearchTerm(schedule.keterangan)}</p>` : ''}
            </div>
            <div class="schedule-actions">
                <button class="btn btn-icon edit" onclick="editSchedule('${schedule.id}')" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="btn btn-icon delete" onclick="confirmDelete('${schedule.id}')" title="Hapus">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function highlightSearchTerm(text) {
    if (!currentSearchTerm || !text) return text;
    const regex = new RegExp(`(${currentSearchTerm})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(0, 212, 170, 0.3); color: inherit; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

// Override original renderScheduleList to use filtered version
const originalRenderScheduleList = renderScheduleList;
renderScheduleList = function() {
    if (currentSearchTerm) {
        renderFilteredScheduleList();
    } else {
        originalRenderScheduleList();
    }
};

// ============================================
// PRINT FUNCTIONALITY
// ============================================
const printBtn = document.getElementById('printBtn');

function setupPrint() {
    if (!printBtn) return;
    
    printBtn.addEventListener('click', () => {
        printSchedule();
    });
}

function printSchedule() {
    const schedules = getSchedules();
    
    if (schedules.length === 0) {
        showToast('Tidak ada jadwal untuk dicetak', 'error');
        return;
    }
    
    // Sort schedules
    schedules.sort((a, b) => {
        const dateCompare = new Date(a.tanggal) - new Date(b.tanggal);
        if (dateCompare !== 0) return dateCompare;
        return a.waktuMulai.localeCompare(b.waktuMulai);
    });
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Jadwal Stadion Pakansari</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; margin-bottom: 5px; color: #1a5f7a; }
                h2 { text-align: center; font-weight: normal; color: #666; margin-bottom: 20px; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #1a5f7a; color: white; font-weight: bold; }
                tr:nth-child(even) { background: #f9f9f9; }
                .no { text-align: center; width: 5%; }
                .date { width: 18%; }
                .activity { width: 35%; }
                .time { text-align: center; width: 15%; }
                .notes { width: 27%; font-style: italic; color: #666; }
                .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>JADWAL STADION PAKANSARI</h1>
            <h2>Unit Pelaksana Teknis Paspor Pakansari - Kabupaten Bogor</h2>
            <table>
                <thead>
                    <tr>
                        <th class="no">NO</th>
                        <th class="date">HARI / TANGGAL</th>
                        <th class="activity">URAIAN KEGIATAN</th>
                        <th class="time">WAKTU</th>
                        <th class="notes">KETERANGAN</th>
                    </tr>
                </thead>
                <tbody>
                    ${schedules.map((s, i) => `
                        <tr>
                            <td class="no">${i + 1}</td>
                            <td class="date">${s.hari}, ${formatDateToIndonesian(s.tanggal)}</td>
                            <td class="activity">${s.kegiatan}</td>
                            <td class="time">${s.waktuMulai} - ${s.waktuSelesai}</td>
                            <td class="notes">${s.keterangan || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p class="footer">Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ============================================
// ANNOUNCEMENT FUNCTIONALITY
// ============================================
const ANNOUNCEMENT_KEY = 'pakansari_announcement';
const announcementText = document.getElementById('announcementText');
const announcementEnabled = document.getElementById('announcementEnabled');
const saveAnnouncementBtn = document.getElementById('saveAnnouncementBtn');

function setupAnnouncement() {
    if (!saveAnnouncementBtn) return;
    
    saveAnnouncementBtn.addEventListener('click', () => {
        saveAnnouncement();
    });
}

function loadAnnouncement() {
    const data = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (data) {
        const announcement = JSON.parse(data);
        if (announcementText) announcementText.value = announcement.text || '';
        if (announcementEnabled) announcementEnabled.checked = announcement.enabled || false;
    }
}

function saveAnnouncement() {
    const announcement = {
        text: announcementText?.value || '',
        enabled: announcementEnabled?.checked || false
    };
    
    localStorage.setItem(ANNOUNCEMENT_KEY, JSON.stringify(announcement));
    showToast('Pengumuman berhasil disimpan!', 'success');
}

function getAnnouncement() {
    const data = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return { text: '', enabled: false };
}

// ============================================
// EXPORT/IMPORT FUNCTIONALITY
// ============================================
const exportBtn = document.getElementById('exportBtn');
const importInput = document.getElementById('importInput');

/**
 * Export all data to JSON file
 */
function exportData() {
    const schedules = getSchedules();
    const announcement = getAnnouncement();
    
    const data = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        schedules: schedules,
        announcement: announcement
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `jadwal_pakansari_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast(`Berhasil export ${schedules.length} jadwal!`, 'success');
}

/**
 * Import data from JSON file
 */
function importData(file) {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.schedules || !Array.isArray(data.schedules)) {
                throw new Error('Format file tidak valid');
            }
            
            const existingSchedules = getSchedules();
            const action = existingSchedules.length > 0 
                ? await showConfirmModal(
                    'Import Data',
                    `Anda memiliki ${existingSchedules.length} jadwal. Pilih "Hapus" untuk mengganti semua data, atau tutup modal untuk membatalkan.`
                )
                : true;
            
            if (action) {
                // Save imported schedules
                saveSchedules(data.schedules);
                
                // Save imported announcement if exists
                if (data.announcement) {
                    localStorage.setItem(ANNOUNCEMENT_KEY, JSON.stringify(data.announcement));
                    loadAnnouncement();
                }
                
                renderScheduleList();
                showToast(`Berhasil import ${data.schedules.length} jadwal!`, 'success');
            }
        } catch (error) {
            console.error('Import error:', error);
            showToast('Gagal import: ' + error.message, 'error');
        }
    };
    
    reader.onerror = () => {
        showToast('Gagal membaca file', 'error');
    };
    
    reader.readAsText(file);
}

// Setup export/import event listeners
if (exportBtn) {
    exportBtn.addEventListener('click', exportData);
}

if (importInput) {
    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            importData(file);
            e.target.value = ''; // Reset input
        }
    });
}
