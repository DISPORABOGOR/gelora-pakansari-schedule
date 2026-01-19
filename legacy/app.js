/**
 * Stadion Pakansari Schedule Display
 * JavaScript Application for TV Display
 * Synced with Admin Panel via LocalStorage
 */

// ============================================
// STORAGE KEY (same as admin panel)
// ============================================
const STORAGE_KEY = 'pakansari_schedule_data';

// ============================================
// DEFAULT SCHEDULE DATA
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

/**
 * Get schedules from localStorage
 */
function getSchedulesFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultScheduleData));
        return defaultScheduleData;
    }
    return JSON.parse(data);
}

/**
 * Format date from YYYY-MM-DD to Indonesian format
 */
function formatDateIndonesian(dateString) {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Transform storage data to display format
 */
function transformScheduleData(data) {
    // Sort by date and time
    const sorted = [...data].sort((a, b) => {
        const dateCompare = new Date(a.tanggal) - new Date(b.tanggal);
        if (dateCompare !== 0) return dateCompare;
        return a.waktuMulai.localeCompare(b.waktuMulai);
    });
    
    return sorted.map((item, index) => ({
        no: index + 1,
        hari: item.hari,
        tanggal: formatDateIndonesian(item.tanggal),
        kegiatan: item.kegiatan,
        waktu: `${item.waktuMulai} - ${item.waktuSelesai}`,
        keterangan: item.keterangan || '-'
    }));
}

// Get schedule data (transformed for display)
let scheduleData = transformScheduleData(getSchedulesFromStorage());

// ============================================
// DOM ELEMENTS
// ============================================
const scheduleBody = document.getElementById('scheduleBody');
const emptyState = document.getElementById('emptyState');
const currentDateEl = document.getElementById('currentDate');
const currentTimeEl = document.getElementById('currentTime');
const tvModeBtn = document.getElementById('tvModeBtn');

// ============================================
// DATE & TIME FUNCTIONS
// ============================================
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Format date to Indonesian format
 */
function formatDate(date) {
    const day = dayNames[date.getDay()];
    const dateNum = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}, ${dateNum} ${month} ${year}`;
}

/**
 * Format time to HH:MM:SS
 */
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Update date and time display
 */
function updateDateTime() {
    const now = new Date();
    currentDateEl.textContent = formatDate(now);
    currentTimeEl.textContent = formatTime(now);
}

// ============================================
// TABLE RENDERING
// ============================================

/**
 * Create a table row from schedule item
 */
function createTableRow(item) {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td class="cell-no">${item.no}</td>
        <td class="cell-date">
            <strong>${item.hari}</strong><br>
            <span style="opacity: 0.8;">${item.tanggal}</span>
        </td>
        <td class="cell-activity">
            <span class="activity-highlight">${item.kegiatan}</span>
        </td>
        <td class="cell-time">${item.waktu}</td>
        <td class="cell-notes">${item.keterangan}</td>
    `;
    
    return tr;
}

/**
 * Render the schedule table
 */
function renderSchedule(data) {
    scheduleBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    data.forEach((item, index) => {
        const row = createTableRow({ ...item, no: index + 1 });
        scheduleBody.appendChild(row);
    });
}

// ============================================
// TV MODE
// ============================================

/**
 * Toggle TV mode for full screen display
 */
function toggleTvMode() {
    document.body.classList.toggle('tv-mode');
    
    if (document.body.classList.contains('tv-mode')) {
        // Request fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// ============================================
// AUTO REFRESH (for live data updates from admin panel)
// ============================================
let autoRefreshInterval = null;

/**
 * Refresh schedule data from localStorage
 */
function refreshScheduleData() {
    scheduleData = transformScheduleData(getSchedulesFromStorage());
    renderSchedule(scheduleData);
}

/**
 * Start auto refresh for schedule data (syncs with admin panel)
 * @param {number} intervalMs - Refresh interval in milliseconds (default 5 seconds)
 */
function startAutoRefresh(intervalMs = 5000) {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        refreshScheduleData();
    }, intervalMs);
}

/**
 * Stop auto refresh
 */
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// ============================================
// API INTEGRATION (Template for future use)
// ============================================

/**
 * Fetch schedule from API
 * Uncomment and modify this function when integrating with a backend
 */
async function fetchScheduleFromAPI() {
    try {
        // const response = await fetch('/api/schedule');
        // const data = await response.json();
        // return data;
        
        // For now, return sample data
        return scheduleData;
    } catch (error) {
        console.error('Error fetching schedule:', error);
        return [];
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'f':
        case 'F':
            // Toggle fullscreen with 'F' key
            toggleTvMode();
            break;
        case 'Escape':
            // Exit TV mode with Escape
            if (document.body.classList.contains('tv-mode')) {
                document.body.classList.remove('tv-mode');
            }
            break;
        case 'r':
        case 'R':
            // Refresh schedule with 'R' key
            renderSchedule(scheduleData);
            break;
    }
});

// ============================================
// EVENT LISTENERS
// ============================================
tvModeBtn.addEventListener('click', toggleTvMode);

// Handle fullscreen change
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove('tv-mode');
    }
});

// ============================================
// ANNOUNCEMENT FUNCTIONALITY
// ============================================
const ANNOUNCEMENT_KEY = 'pakansari_announcement';
const announcementBar = document.getElementById('announcementBar');
const announcementTextEl = document.getElementById('announcementText');

/**
 * Load and display announcement from localStorage
 */
function loadAnnouncement() {
    const data = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (data) {
        const announcement = JSON.parse(data);
        if (announcement.enabled && announcement.text) {
            announcementBar.style.display = 'flex';
            announcementTextEl.textContent = announcement.text;
        } else {
            announcementBar.style.display = 'none';
        }
    } else {
        announcementBar.style.display = 'none';
    }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    // Update date and time immediately
    updateDateTime();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
    
    // Render initial schedule
    renderSchedule(scheduleData);
    
    // Load announcement
    loadAnnouncement();
    
    // Start auto refresh every 5 seconds to sync with admin panel
    startAutoRefresh(5000);
    
    // Refresh announcement every 5 seconds
    setInterval(loadAnnouncement, 5000);
    
    console.log('📺 Stadion Pakansari Schedule Display initialized');
    console.log('💡 Press "F" for fullscreen TV mode');
    console.log('💡 Press "R" to refresh schedule');
    console.log('🔄 Auto-refresh enabled (syncs with admin panel every 5 seconds)');
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// ============================================
// EXPORT FOR EXTERNAL USE
// ============================================
window.PakansariSchedule = {
    renderSchedule,
    toggleTvMode,
    startAutoRefresh,
    stopAutoRefresh,
    fetchScheduleFromAPI,
    loadAnnouncement
};
