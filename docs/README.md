# NataData

**NataData** adalah aplikasi web untuk mencatat stok barang dan penjualan UMKM. Seluruh aplikasi berupa **satu file HTML** (HTML + CSS + JavaScript) yang berjalan di browser, dan data disimpan di `localStorage` perangkat pengguna.

> **Status: prototipe / MVP.** NataData belum siap untuk penggunaan operasional skala nyata. Lihat [Status dan keterbatasan](#status-dan-keterbatasan) dan [docs/AUDIT_DAN_REKOMENDASI.md](docs/AUDIT_DAN_REKOMENDASI.md).

## Daftar isi

- [Tujuan aplikasi](#tujuan-aplikasi)
- [Fitur yang tersedia](#fitur-yang-tersedia)
- [Teknologi yang digunakan](#teknologi-yang-digunakan)
- [Struktur direktori](#struktur-direktori)
- [Persyaratan sistem](#persyaratan-sistem)
- [Menjalankan di browser](#menjalankan-di-browser)
- [Membuat aplikasi desktop dengan Tauri](#membuat-aplikasi-desktop-dengan-tauri)
- [Deployment website](#deployment-website)
- [Status dan keterbatasan](#status-dan-keterbatasan)
- [Dokumentasi lengkap](#dokumentasi-lengkap)
- [Kontribusi dan lisensi](#kontribusi-dan-lisensi)

## Tujuan aplikasi

UMKM kecil sering mencatat stok di buku atau chat sehingga sulit mengetahui sisa barang, barang yang hampir habis, dan laba. NataData menyediakan satu tempat untuk:

- mendaftarkan barang dan harga modal/jual,
- mencatat barang masuk, penjualan, dan pengurangan stok,
- melihat ringkasan dan laporan sederhana,
- diberi peringatan saat stok menyentuh batas minimum.

## Fitur yang tersedia

Status berdasarkan pembacaan kode (`index.html`). Tanda ✅ = ada implementasinya di kode. Tanda ⚠️ = ada, tetapi dengan batasan penting.

| Fitur | Status | Catatan |
|---|---|---|
| Pendaftaran toko + PIN 6 angka | ✅ ⚠️ | PIN hanya pengunci tampilan, tersimpan teks biasa di browser. Bukan keamanan sungguhan. |
| Login PIN dan keluar sesi | ✅ ⚠️ | Sama seperti di atas. |
| Dashboard (total produk, stok menipis, penjualan hari ini, estimasi profit) | ✅ | Estimasi profit = akumulasi laba **seluruh** penjualan, bukan hanya hari ini. |
| Daftar stok: cari, filter kategori, edit, hapus | ✅ | Kategori tetap: Makanan, Minuman, Sembako, Lainnya. |
| Barang masuk (produk baru atau tambah stok) | ✅ | Barang dianggap sama bila nama atau SKU sama. |
| Pencatatan penjualan | ✅ | Menolak penjualan melebihi stok. |
| Pengurangan/penyesuaian stok dengan alasan | ✅ | |
| Riwayat transaksi | ✅ | Tanpa filter tanggal dan tanpa halaman. |
| Laporan (omset, laba, modal, arus kas sederhana, produk terlaris, grafik 7 hari, komposisi stok) | ✅ ⚠️ | "Arus kas" hanya omset dikurangi total modal barang masuk. |
| Notifikasi stok menipis | ✅ | Muncul bila `stok <= minimum stok`. |
| Ubah nama toko dan logo (via URL) | ✅ | Tidak ada unggah file logo. |
| Reset data | ✅ ⚠️ | Menghapus **semua** data termasuk PIN. Tidak ada data demo. |
| Backend, database online, sinkronisasi antarperangkat | ❌ | Tidak ada. |
| Ekspor/impor atau cadangan data | ❌ | Tidak ada. |
| Multi-pengguna / multi-toko | ❌ | Satu toko per browser/aplikasi. |
| PWA / mode offline penuh | ❌ | Tidak ada `manifest` maupun service worker. Aplikasi memuat pustaka dari CDN (butuh internet). |

## Teknologi yang digunakan

| Komponen | Sumber | Catatan |
|---|---|---|
| HTML + JavaScript murni | satu file | Tanpa framework dan tanpa build step. |
| Tailwind CSS | `https://cdn.tailwindcss.com` | Versi CDN "play", tidak dianjurkan untuk produksi. |
| Lucide Icons | `https://unpkg.com/lucide@latest` | Versi tidak dikunci (`@latest`). |
| Chart.js | `https://cdn.jsdelivr.net/npm/chart.js` | Versi tidak dikunci. |
| Font Inter | Google Fonts | |
| Penyimpanan | `localStorage` | Per browser / per aplikasi. |
| Pembungkus desktop | Tauri v2 *(rencana, ikuti [docs/TAURI_BUILD.md](docs/TAURI_BUILD.md))* | Belum ada di kode saat ini. |

## Struktur direktori

**Kondisi saat ini** (berdasarkan file yang diberikan; folder `img/` dan `logo.jpeg` disiapkan pemilik proyek):

```text
.
├── index.html        # seluruh aplikasi (nama asli file unggahan: natadata_aplikasi_manajemen_stok_umkm__1_.html)
├── logo.jpeg         # dipakai oleh tag <img> awal (belum dapat dipastikan lokasinya di repo Anda)
└── img/
    └── logo.jpeg     # dipakai oleh konstanta DEFAULT_LOGO di JavaScript
```

> Kode memakai **dua** jalur logo (`logo.jpeg` dan `img/logo.jpeg`). Penjelasan di [AUDIT_DAN_REKOMENDASI.md](docs/AUDIT_DAN_REKOMENDASI.md#t-03).

**Struktur yang disarankan setelah Tauri ditambahkan** (usulan, belum ada):

```text
.
├── README.md
├── docs/
├── package.json
├── src/                  # aset web yang dibungkus Tauri
│   ├── index.html
│   └── img/logo.jpeg
└── src-tauri/            # dibuat otomatis oleh `npx tauri init`
    ├── tauri.conf.json
    ├── Cargo.toml
    └── src/
```

## Persyaratan sistem

| Kebutuhan | Untuk apa |
|---|---|
| Browser modern (Chrome, Edge, Firefox, Safari terbaru) | Menjalankan aplikasi web |
| Koneksi internet | Memuat Tailwind, Lucide, Chart.js, dan font dari CDN |
| Node.js LTS + npm | Hanya jika memakai Tauri / server lokal |
| Rust (rustup) + alat build sistem | Hanya untuk membangun aplikasi Tauri |

Versi persis belum dikunci di repository (belum ada `package.json`). Lihat [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Menjalankan di browser

Cara paling sederhana, tanpa instalasi:

1. Pastikan `index.html`, `logo.jpeg`, dan folder `img/` berada di folder yang sama.
2. Klik ganda `index.html` untuk membukanya di browser.
3. Pada pembukaan pertama, isi **Nama Toko** dan **PIN 6 angka**.

Alternatif dengan server lokal (disarankan agar perilaku `localStorage` konsisten):

```bash
# di folder yang berisi index.html
npx serve .
# atau
python -m http.server 8080
```

Lalu buka alamat yang ditampilkan (misalnya `http://localhost:8080`). Data tersimpan **per alamat/origin**: membuka lewat `file://`, `localhost:3000`, dan `localhost:8080` akan memberi data yang terpisah.

## Membuat aplikasi desktop dengan Tauri

Panduan langkah demi langkah ada di **[docs/TAURI_BUILD.md](docs/TAURI_BUILD.md)**. Ringkasnya:

```bash
npm init -y
npm install -D @tauri-apps/cli@latest
npx tauri init        # arahkan "web assets" ke ../src
npx tauri dev         # menjalankan jendela aplikasi
npx tauri build       # membuat installer
```

Perintah di atas mengikuti dokumentasi Tauri v2 dan **belum dijalankan terhadap proyek NataData Anda**.

## Deployment website

Belum ada workflow GitHub Actions maupun konfigurasi hosting di repository saat audit. Usulan GitHub Pages ada di [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Status dan keterbatasan

- Data hanya di perangkat/browser masing-masing dan **tidak tersinkron**. Menghapus data browser, ganti browser, atau ganti perangkat berarti data tidak terlihat atau hilang.
- Tidak ada cadangan/ekspor data.
- PIN bukan autentikasi sungguhan (lihat [audit](docs/AUDIT_DAN_REKOMENDASI.md)).
- Lupa PIN tidak punya jalur pemulihan.
- Membutuhkan internet untuk memuat pustaka CDN.
- Belum ada pengujian otomatis.

## Dokumentasi lengkap

| Dokumen | Isi |
|---|---|
| [docs/USER_GUIDE.md](docs/USER_GUIDE.md) | Panduan pemakaian untuk pemilik UMKM |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arsitektur, model data, alur transaksi |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Panduan pengembang |
| [docs/TAURI_BUILD.md](docs/TAURI_BUILD.md) | Membuat aplikasi desktop (dan Android) dengan Tauri |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment website dan rilis |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Pemecahan masalah |
| [docs/AUDIT_DAN_REKOMENDASI.md](docs/AUDIT_DAN_REKOMENDASI.md) | Temuan audit dan rekomendasi berprioritas |

## Kontribusi dan lisensi

- **Kontribusi:** belum ada `CONTRIBUTING.md` di repository. Usulan alur: fork, buat branch, ubah, buka Pull Request.
- **Lisensi:** belum ditemukan file `LICENSE`. Pemilik proyek perlu memilih lisensi sebelum dipublikasikan sebagai open source.
