# NataData

**Aplikasi pencatat stok barang dan penjualan untuk UMKM.** Catat barang masuk, penjualan, dan pengurangan stok, lalu lihat ringkasan, laporan, dan peringatan stok menipis, semuanya dari satu aplikasi yang ringan.

![Versi](https://img.shields.io/badge/versi-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows%2064--bit-lightgrey)
![Status](https://img.shields.io/badge/status-prototipe-orange)

> **Status: prototipe.** NataData cocok untuk dicoba dan untuk pemakaian sederhana di satu perangkat. Data tersimpan **hanya di komputer Anda** dan belum ada fitur cadangan. Baca [Hal yang perlu diketahui](#hal-yang-perlu-diketahui) sebelum dipakai untuk data toko yang penting.

<!-- Tambahkan tangkapan layar di sini setelah berkas gambarnya ada di repository:
![Dashboard NataData](docs/images/dashboard.png)
-->

## Daftar isi

- [Unduh](#unduh)
- [Cara memasang](#cara-memasang)
- [Fitur](#fitur)
- [Mulai memakai](#mulai-memakai)
- [Hal yang perlu diketahui](#hal-yang-perlu-diketahui)
- [Dokumentasi](#dokumentasi)
- [Untuk pengembang](#untuk-pengembang)
- [Lisensi](#lisensi)

## Unduh

**[⬇ Unduh versi terbaru dari halaman Releases](https://github.com/FarrelPtrv/NataData---Inventaris/releases/latest)**

| | |
|---|---|
| Berkas | `natadata_1_0_0_x64-setup.exe` (pemasang Windows) |
| Versi | 1.0.0 |
| Platform | Windows 64-bit (x64) |
| Ukuran | sekitar 1,9 MB |
| SHA-256 | `a9b91409abc5bc3798ec871837cb963962e48e9781a9c9b9dd4b048defca8956` |

- Versi Windows minimum belum diuji. Aplikasi memerlukan **Microsoft Edge WebView2**, yang umumnya sudah ada di Windows 10 (pembaruan terbaru) dan Windows 11.
- Versi **Android (APK)**, **macOS**, dan **Linux** belum tersedia.
- Aplikasi **membutuhkan koneksi internet** agar tampilan, ikon, dan grafik termuat.

### Memeriksa keaslian berkas (opsional)

Pastikan berkas yang Anda unduh sama dengan yang diterbitkan. Di PowerShell:

```powershell
Get-FileHash .\natadata_1_0_0_x64-setup.exe -Algorithm SHA256
```

Hasilnya harus sama dengan nilai SHA-256 di atas. Jika berbeda, jangan dipasang.

## Cara memasang

1. Unduh `natadata_1_0_0_x64-setup.exe` dari halaman [Releases](https://github.com/FarrelPtrv/NataData---Inventaris/releases/latest).
2. Klik ganda berkas itu dan ikuti petunjuk pemasang.
3. Buka **NataData** dari Start Menu atau pintasan desktop.

**Jika Windows menampilkan peringatan "Windows protected your PC" (SmartScreen):** pemasang ini kemungkinan belum ditandatangani sertifikat penerbit, sehingga Windows memperingatkan. Jika Anda mengunduh langsung dari halaman Releases repository ini dan checksum-nya cocok, pilih **More info → Run anyway**. Jangan lanjutkan bila berkas berasal dari sumber lain. *(Perilaku persis belum diuji.)*

**Mencopot:** Settings → Apps → Installed apps → NataData → Uninstall. Apakah data toko ikut terhapus saat dicopot **belum diverifikasi**, jadi catat data penting lebih dulu.

## Fitur

- **Dashboard:** jumlah produk, stok menipis, penjualan hari ini, dan estimasi laba kotor.
- **Stok:** daftar barang dengan pencarian, filter kategori (Makanan, Minuman, Sembako, Lainnya), ubah, dan hapus.
- **Barang masuk:** tambah barang baru atau tambah stok barang lama, lengkap dengan harga modal dan harga jual.
- **Penjualan:** catat penjualan, stok berkurang otomatis, dan laba terhitung.
- **Penyesuaian stok:** kurangi stok karena rusak, kadaluarsa, pemakaian sendiri, hilang, atau koreksi.
- **Riwayat transaksi:** seluruh aktivitas tercatat berurutan.
- **Laporan:** omset, laba, modal, arus kas sederhana, produk terlaris, grafik penjualan 7 hari, dan komposisi stok.
- **Notifikasi:** peringatan saat stok mencapai batas minimum.
- **PIN 6 angka** untuk mengunci tampilan, serta pengaturan nama dan logo toko.

Penjelasan rinci tiap fitur: [Panduan Pengguna](docs/USER_GUIDE.md).

## Mulai memakai

1. Buka NataData, isi **Nama Toko**, lalu buat **PIN 6 angka** dan catat PIN-nya.
2. Buka **Transaksi → Barang Masuk** untuk menambahkan barang pertama.
3. Catat penjualan di **Transaksi → Penjualan Produk**.
4. Pantau **Dashboard**, **Laporan**, dan **Notifikasi**.

## Hal yang perlu diketahui

| Hal | Penjelasan |
|---|---|
| **Data hanya di komputer ini** | Data disimpan di dalam aplikasi pada komputer yang Anda pakai. Tidak tersinkron ke komputer atau HP lain |
| **Belum ada cadangan/ekspor** | Jika data aplikasi terhapus atau Reset dijalankan, data tidak dapat dipulihkan |
| **PIN bukan pengaman data** | PIN hanya mengunci tampilan dan tersimpan sebagai teks biasa di aplikasi. Jangan anggap data terlindungi dari orang yang memegang komputer Anda |
| **Lupa PIN tidak bisa dipulihkan** | Satu-satunya jalan menghapus seluruh data aplikasi. Catat PIN di tempat aman |
| **Tombol Reset menghapus semuanya** | Termasuk produk, transaksi, nama toko, dan PIN. Tidak bisa dibatalkan |
| **Perlu internet** | Pustaka tampilan dimuat dari internet saat aplikasi dibuka |
| **Satu toko, satu pengguna** | Belum ada akun, peran, atau banyak toko |

Daftar lengkap keterbatasan dan rekomendasi pengembangan: [Audit dan Rekomendasi](docs/AUDIT_DAN_REKOMENDASI.md).

## Dokumentasi

| Dokumen | Untuk siapa | Isi |
|---|---|---|
| [Panduan Pengguna](docs/USER_GUIDE.md) | Pemilik toko | Cara memakai setiap fitur, contoh alur harian |
| [Pemecahan Masalah](docs/TROUBLESHOOTING.md) | Semua | Gejala, penyebab, dan perbaikan |
| [Arsitektur](docs/ARCHITECTURE.md) | Pengembang | Struktur aplikasi, model data, alur transaksi |
| [Panduan Pengembangan](docs/DEVELOPMENT.md) | Pengembang | Menjalankan, memodifikasi, dan menguji |
| [Membangun Aplikasi Desktop (Tauri)](docs/TAURI_BUILD.md) | Pengembang | Lingkungan, konfigurasi, dan build installer |
| [Membangun APK Android (Tauri)](docs/ANDROID_BUILD.md) | Pengembang | Persiapan Android dan pembuatan APK (belum diuji) |
| [Deployment](docs/DEPLOYMENT.md) | Pengembang | Website GitHub Pages dan rilis lewat GitHub Actions |
| [Audit dan Rekomendasi](docs/AUDIT_DAN_REKOMENDASI.md) | Pengembang | Temuan teknis dan prioritas perbaikan |

## Untuk pengembang

NataData adalah satu halaman web (HTML + JavaScript, tanpa framework) yang menyimpan data di `localStorage`, dibungkus **Tauri v2** menjadi aplikasi desktop. Aset web ada di folder `www/`.

Persyaratan: Node.js 22.12.0 atau lebih baru, Rust, dan (di Windows) Microsoft C++ Build Tools serta WebView2.

```bash
git clone https://github.com/FarrelPtrv/NataData---Inventaris.git
cd NataData---Inventaris
npm install
npm run tauri dev      # jalankan sebagai aplikasi desktop
npm run tauri build    # buat installer
```

Installer hasil build umumnya berada di `src-tauri/target/release/bundle/`. Langkah lengkap, termasuk pemasangan lingkungan dan masalah umum, ada di [docs/TAURI_BUILD.md](docs/TAURI_BUILD.md).

## Lisensi

`package.json` menyatakan `"license": "UNLICENSED"`: semua hak dilindungi pemilik proyek, dan belum ada izin untuk memakai ulang, memodifikasi, atau mendistribusikan kode. Belum ada berkas `LICENSE`. Pemilik proyek dapat menambahkannya bila ingin membuka kode sebagai open source.
