# NataData

<p align="center">
  <img src="www/logo.jpeg" alt="NataData Logo" width="120" style="border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</p>

<p align="center">
  <strong>Aplikasi Pencatat Stok Barang dan Penjualan Sederhana untuk Pelaku UMKM</strong><br>
  Ringan, cepat, mandiri (100% offline), dan mudah digunakan di perangkat desktop maupun browser.
</p>

<p align="center">
  <a href="https://github.com/FarrelPtrv/NataData---Inventaris/releases"><img src="https://img.shields.io/badge/Download-v1.0.0-2ea44f?style=flat-square&logo=github" alt="Unduh Versi 1.0.0"></a>
  <a href="#dukungan-platform"><img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Web-blue?style=flat-square&logo=windows" alt="Platform"></a>
  <a href="https://tauri.app/"><img src="https://img.shields.io/badge/Framework-Tauri%20v2-24c8db?style=flat-square&logo=tauri" alt="Tauri v2"></a>
  <a href="#fitur-baru--pembaruan-terkini"><img src="https://img.shields.io/badge/Mode-100%25%20Offline-success?style=flat-square" alt="Offline Ready"></a>
</p>

---

## Daftar Isi

1. [Tentang NataData](#tentang-natadata)
2. [Fitur Utama](#fitur-utama)
3. [Dukungan Platform](#dukungan-platform)
4. [Struktur Direktori](#struktur-direktori)
5. [Panduan Penggunaan Lokal](#panduan-penggunaan-lokal)
   - [A. Menjalankan di Browser](#a-menjalankan-langsung-di-browser-web)
   - [B. Menjalankan Mode Desktop (Tauri)](#b-menjalankan-sebagai-aplikasi-desktop-tauri)
   - [C. Membangun Installer Desktop](#c-membangun-installer-desktop-windows)
6. [Fitur Baru & Pembaruan Terkini](#fitur-baru--pembaruan-terkini)
7. [Hal yang Perlu Diketahui](#hal-yang-perlu-diketahui)
8. [Indeks Dokumentasi](#indeks-dokumentasi)
9. [Lisensi & Kontribusi](#lisensi--kontribusi)

---

## Tentang NataData

Banyak pelaku UMKM masih mencatat keluar-masuk barang di buku catatan fisik atau pesan obrolan, sehingga sering terjadi ketidaksesuaian stok, sulit mengetahui barang yang menipis, dan kesulitan menghitung estimasi keuntungan harian.

**NataData** hadir sebagai solusi sistem pencatatan digital yang:
* **Tidak Memerlukan Server Khusus:** Berjalan langsung di komputer pengguna dengan data tersimpan di penyimpanan lokal (*local storage*).
* **Bisa Berjalan 100% Offline:** Pustaka antarmuka, ikon, dan grafik telah dibundel secara lokal sehingga tidak membutuhkan koneksi internet saat dioperasikan.
* **Aman dengan Cadangan Data:** Dilengkapi fitur ekspor dan impor file cadangan JSON sekali klik untuk mencegah kehilangan data.

---

## Fitur Utama

- 📊 **Dashboard Interaktif:** Ringkasan jumlah produk, peringatan stok menipis, total penjualan hari ini, dan estimasi laba kotor.
- 📦 **Manajemen Stok Barang:** Pencarian cepat, filter kategori (*Makanan, Minuman, Sembako, Lainnya*), ubah data produk, dan hapus barang.
- 📥 **Pencatatan Barang Masuk:** Tambah barang baru (lengkap dengan SKU otomatis, satuan, harga beli, dan harga jual) atau restock produk yang sudah terdaftar.
- 🛒 **Pencatatan Penjualan:** Penjualan langsung dengan validasi stok otomatis (menolak transaksi jika stok tidak mencukupi) dan penghitungan laba otomatis.
- 📉 **Penyesuaian Stok Beralasan:** Pengurangan stok dengan kategori alasan jelas (*Rusak, Kadaluarsa, Pemakaian Sendiri, Hilang, atau Koreksi Lainnya*).
- ↩️ **Pembatalan Transaksi (*Void Transaction*):** Batalkan transaksi penjualan atau barang masuk yang keliru dengan **otomatisasi pengembalian stok barang** ke kondisi semula.
- 💾 **Cadangan & Pemulihan Data (Ekspor / Impor JSON):** Unduh seluruh data bisnis ke file JSON dan pulihkan kapan saja di perangkat lain.
- 📈 **Laporan & Analitik Keuangan:** Rekapitulasi omset, laba, modal masuk, arus kas sederhana, produk terlaris, bar chart penjualan 7 hari terakhir, dan diagram komposisi kategori stok.
- 🔔 **Peringatan Stok Menipis:** Notifikasi otomatis saat stok barang mencapai atau berada di bawah batas minimum alert.
- 🔒 **Kunci Tampilan PIN 6-Digit:** Kunci sesi cepat untuk melindungi privasi tampilan kasir, serta kemudahan kustomisasi nama dan logo toko.

---

## Dukungan Platform

| Platform | Status | Keterangan |
|---|---|---|
| **Windows Desktop (x64)** | ✅ Siap Pakai | Dibungkus menggunakan Tauri v2 (berkas `.exe` / installer MSI). Memerlukan WebView2. |
| **Web Browser (Chrome/Edge/Firefox)** | ✅ Siap Pakai | Berjalan murni langsung dari file `www/index.html` tanpa build step. |
| **Android (APK)** | 🟡 Workflow Tersedia | Konfigurasi Capacitor & GitHub Actions workflow (`.github/workflows/build-android.yml`) tersedia. |
| **macOS & Linux** | 🟡 Kompatibel | Dapat dikompilasi menggunakan Tauri CLI pada lingkungan OS masing-masing. |

---

## Struktur Direktori

```text
NataData---Inventaris/
├── .github/
│   └── workflows/              # Otomatisasi build CI/CD (Desktop & Android APK)
│       ├── build-desktop.yml
│       └── build-android.yml
├── docs/                       # Dokumentasi lengkap proyek
│   ├── ARCHITECTURE.md         # Desain arsitektur sistem & model data
│   ├── AUDIT_DAN_REKOMENDASI.md# Audit analisis kode & rekomendasi
│   ├── DEVELOPMENT.md          # Panduan pengembangan & daftar pengujian
│   ├── TAURI_BUILD.md          # Panduan kompilasi Tauri desktop
│   ├── USER_GUIDE.md           # Panduan pengguna langkah-demi-langkah
│   └── TROUBLESHOOTING.md      # Pemecahan masalah teknis
├── src-tauri/                  # Backend & konfigurasi Tauri Desktop (Rust)
│   ├── Cargo.toml
│   ├── tauri.conf.json         # Konfigurasi jendela & bundle Tauri v2
│   ├── icons/                  # Aset ikon desktop (.ico, .icns, .png)
│   └── src/                    # Entry point Rust (main.rs, lib.rs)
├── www/                        # Frontend Web (HTML, CSS, JS, Assets)
│   ├── index.html              # Aplikasi utama NataData
│   ├── logo.jpeg               # Aset logo bawaan aplikasi
│   ├── assets/                 # Aset grafis pendukung (SVG logo)
│   └── vendor/                 # Pustaka mandiri (100% offline)
│       ├── tailwind.js         # Tailwind CSS engine lokal
│       ├── lucide.min.js       # Pustaka ikon Lucide lokal
│       └── chart.umd.min.js    # Pustaka grafik Chart.js lokal
├── capacitor.config.ts         # Konfigurasi pembungkus Android Capacitor
├── package.json
└── README.md
```

---

## Panduan Penggunaan Lokal

### A. Menjalankan Langsung di Browser Web
Cara tercepat untuk mencoba atau memakai aplikasi tanpa instalasi alat pengembangan:
1. Masuk ke folder `www/`.
2. Klik dua kali pada file `index.html` (atau klik kanan $\rightarrow$ *Open with* Chrome / Microsoft Edge / Firefox).
3. Aplikasi langsung terbuka dan siap digunakan secara penuh.

Atau jalankan melalui local server jika diinginkan:
```bash
npx serve www
# atau dengan python
python -m http.server 8000 --directory www
```

### B. Menjalankan sebagai Aplikasi Desktop (Tauri)
**Prasyarat:**
- [Node.js](https://nodejs.org/) (versi LTS $\ge$ 20.x atau 22.x)
- [Rust & Cargo](https://rustup.rs/)
- Di Windows: C++ Build Tools (via Visual Studio Installer) dan Microsoft Edge WebView2.

**Langkah Menjalankan:**
```bash
# 1. Clone repository
git clone https://github.com/FarrelPtrv/NataData---Inventaris.git
cd NataData---Inventaris

# 2. Pasang dependensi
npm install

# 3. Jalankan aplikasi desktop dalam mode development
npm run tauri dev
```

### C. Membangun Installer Desktop Windows
Untuk membuat berkas installer `.exe` / `.msi`:
```bash
npm run tauri build
```
Hasil installer akan terbentuk di folder:
`src-tauri/target/release/bundle/nsis/` atau `src-tauri/target/release/bundle/msi/`.

---

## Fitur Baru & Pembaruan Terkini

Berdasarkan hasil audit sistem dan masukan pengguna, versi saat ini telah mengintegrasikan pembaruan penting:

1. **Perbaikan Path Logo & Auto-Healing Storage:**
   - Mengoreksi penautan file `DEFAULT_LOGO` ke `logo.jpeg` yang konsisten.
   - Menyertakan mekanisme migrasi otomatis pada `localStorage` sehingga logo toko langsung tampil normal tanpa perlu reset data.
2. **Cadangan Data Mandiri (Ekspor & Impor JSON):**
   - Mengatasi risiko kehilangan data akibat pembersihan cache browser.
   - Tombol ekspor dan impor tersedia di sidebar desktop dan modal pengaturan toko di tampilan layar HP.
3. **Pembatalan Transaksi (*Void Transaction*):**
   - Transaksi yang salah input dapat dibatalkan langsung dari daftar riwayat.
   - Stok produk otomatis disesuaikan kembali (penjualan batal $\rightarrow$ stok kembali bertambah; barang masuk batal $\rightarrow$ stok ditarik kembali).
   - Laba dan grafik laporan otomatis disinkronkan.
4. **Dukungan Mode Offline Penuh:**
   - Tailwind CSS, ikon Lucide, dan Chart.js telah dibundel secara lokal di `www/vendor/` dengan skrip fallback cerdas ke CDN.

---

## Hal yang Perlu Diketahui

| Aspek | Penjelasan Penting |
|---|---|
| **Penyimpanan Lokal** | Data disimpan di `localStorage` peramban / aplikasi desktop komputer Anda. Gunakan fitur **Ekspor Cadangan (JSON)** secara berkala untuk menjaga keamanan data usaha Anda. |
| **Satu Perangkat** | Versi ini belum menggunakan database cloud terpusat, sehingga data belum tersinkronisasi otomatis antar-perangkat. |
| **Keamanan PIN** | PIN 6-digit berfungsi sebagai pengunci kenyamanan antarmuka (*kiosk mode / lock screen*). Catat PIN Anda di tempat aman karena belum ada fitur pemulihan lupa PIN. |
| **Reset Data Toko** | Fitur reset akan mengosongkan seluruh data produk, transaksi, dan pengaturan toko. Pastikan telah mengekspor cadangan JSON sebelum melakukan reset. |

---

## Indeks Dokumentasi

Pelajari lebih lanjut mengenai arsitektur, panduan teknis, dan audit sistem melalui dokumen berikut:

* 📖 [**Panduan Pengguna (User Guide)**](docs/USER_GUIDE.md): Alur kerja harian pemilik toko dari input barang hingga membaca laporan.
* 🛠️ [**Panduan Pengembangan (Development)**](docs/DEVELOPMENT.md): Panduan setup kode sumber, daftar uji coba manual, dan arsitektur fungsi.
* 🖥️ [**Panduan Build Tauri Desktop**](docs/TAURI_BUILD.md): Rincian dependensi, konfigurasi, dan pemecahan kendala kompilasi desktop.
* 📱 [**Panduan Build Android (Capacitor/Tauri)**](docs/ANDROID_BUILD.md): Dokumentasi persiapan lingkungan mobile dan workflow APK.
* 🔍 [**Audit dan Rekomendasi Sistem**](docs/AUDIT_DAN_REKOMENDASI.md): Analisis statis mendalam, temuan teknis, dan roadmap jangka panjang.
* ❓ [**Pemecahan Masalah (Troubleshooting)**](docs/TROUBLESHOOTING.md): Solusi gejala error umum, penanganan cache, dan pemulihan tampilan.

---

## Lisensi & Kontribusi

Proyek ini dikembangkan untuk membantu operasional UMKM Indonesia.
Seluruh hak cipta dimiliki oleh pemilik proyek ([FarrelPtrv](https://github.com/FarrelPtrv)). Untuk pertanyaan kerja sama, kontribusi perbaikan, atau pelaporan kendala teknis, silakan buka menu [Issues](https://github.com/FarrelPtrv/NataData---Inventaris/issues) pada repositori ini.
