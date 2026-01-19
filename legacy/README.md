# 📅 Jadwal Stadion Pakansari

Aplikasi web untuk menampilkan jadwal kegiatan Stadion Pakansari yang dapat ditampilkan di TV melalui HDMI.

![Preview](https://via.placeholder.com/800x400?text=Jadwal+Stadion+Pakansari)

## ✨ Fitur Utama

### 🖥️ Display TV (index.html)

- **Tabel Jadwal** - Menampilkan jadwal dengan kolom: No, Hari/Tanggal, Uraian Kegiatan, Waktu, Keterangan
- **Jam Real-time** - Menampilkan waktu yang terus update
- **TV Mode** - Mode fullscreen untuk tampilan TV (tekan `F`)
- **Running Text** - Pengumuman berjalan (marquee) di bagian bawah
- **Auto-refresh** - Sinkronisasi otomatis dengan admin panel setiap 5 detik

### ⚙️ Admin Panel (admin.html)

- **CRUD Jadwal** - Create, Read, Update, Delete jadwal
- **Search/Filter** - Cari jadwal berdasarkan nama, hari, atau keterangan
- **Print/Cetak** - Cetak jadwal dalam format tabel
- **Pengumuman** - Kelola running text untuk display TV
- **Backup/Restore** - Export dan import data jadwal (JSON)

## 📁 Struktur File

```
upt_paspor_pakansari_schedule_presence/
├── index.html      # Halaman display untuk TV
├── styles.css      # Styling halaman display
├── app.js          # Logika halaman display
├── admin.html      # Halaman admin panel
├── admin.css       # Styling admin panel
├── admin.js        # Logika admin panel
└── README.md       # Dokumentasi (file ini)
```

## 🚀 Cara Menggunakan

### 1. Membuka Aplikasi

- Buka file `index.html` di browser untuk display TV
- Buka file `admin.html` di browser untuk panel admin

### 2. Mengelola Jadwal (Admin Panel)

1. Buka `admin.html`
2. Isi form "Tambah Jadwal Baru"
3. Klik "Simpan Jadwal"
4. Untuk edit, klik tombol ✏️ pada jadwal
5. Untuk hapus, klik tombol 🗑️ pada jadwal

### 3. Menampilkan di TV via HDMI

1. Hubungkan komputer/laptop ke TV dengan kabel HDMI
2. Buka `index.html` di browser (Chrome/Edge direkomendasikan)
3. Tekan tombol `F` atau klik tombol 📺 untuk mode fullscreen
4. Jadwal akan tampil penuh di layar TV

### 4. Menggunakan Pengumuman (Running Text)

1. Buka Admin Panel (`admin.html`)
2. Scroll ke bagian "Pengumuman (Running Text)"
3. Masukkan teks pengumuman
4. Centang "Aktifkan Pengumuman"
5. Klik "Simpan Pengumuman"
6. Pengumuman akan muncul di display TV secara otomatis

### 5. Backup & Restore Data

1. **Export**: Klik tombol 💾 di admin panel untuk download backup (JSON)
2. **Import**: Klik tombol 📂 untuk memuat data dari file backup

## ⌨️ Keyboard Shortcuts (Display)

| Tombol   | Fungsi                    |
| -------- | ------------------------- |
| `F`      | Toggle fullscreen/TV mode |
| `R`      | Refresh jadwal manual     |
| `Escape` | Keluar dari TV mode       |

## 🎨 Kustomisasi

### Mengubah Warna Tema

Edit file `styles.css` pada bagian `:root` untuk mengubah warna:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #1a5f7a 0%, #086375 100%);
  --accent-color: #00d4aa;
  --bg-dark: #0a1628;
  /* ... */
}
```

### Mengubah Kecepatan Marquee

Edit file `styles.css` pada bagian `.announcement-marquee span`:

```css
.announcement-marquee span {
  animation: marquee 20s linear infinite; /* Ubah 20s ke nilai lain */
}
```

## 💾 Penyimpanan Data

Data disimpan menggunakan **localStorage** browser, yang berarti:

- ✅ Data tersimpan secara lokal di komputer
- ✅ Data tetap ada meskipun browser ditutup
- ⚠️ Data hanya tersedia di browser yang sama
- ⚠️ Membersihkan data browser akan menghapus data jadwal

**Tips**: Gunakan fitur Backup untuk menyimpan data secara berkala.

## 🔧 Teknologi

- HTML5
- CSS3 (Vanilla CSS, tanpa framework)
- JavaScript (ES6+)
- localStorage untuk penyimpanan data
- Google Fonts (Inter)

## 📱 Responsif

Aplikasi ini responsif dan dapat digunakan di:

- 🖥️ Desktop/Laptop
- 📺 TV (via HDMI)
- 📱 Tablet
- 📱 Mobile (dengan tampilan yang disesuaikan)

## 📝 Lisensi

© 2024 UPT Paspor Pakansari - Kabupaten Bogor

---

Dibuat dengan ❤️ untuk Stadion Pakansari
