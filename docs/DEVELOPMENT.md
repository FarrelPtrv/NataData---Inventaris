# Panduan Pengembangan NataData

Untuk pengembang yang ingin menjalankan dan memodifikasi NataData.

> **Fakta kondisi aktual:** saat audit, repository `FarrelPtrv/NataData---Inventaris` **kosong** dan belum ada `package.json`. Karena itu belum ada versi Node.js/npm "resmi" proyek, dan belum ada perintah `npm run ...` yang bisa dikutip. Dokumen ini hanya memuat perintah yang berlaku untuk struktur yang ada (satu file HTML) dan untuk rencana Tauri. Perintah Tauri belum dijalankan terhadap proyek ini.

## 1. Perangkat lunak yang dibutuhkan

| Kebutuhan | Wajib untuk | Keterangan |
|---|---|---|
| Browser modern + DevTools | Semua | Chrome/Edge/Firefox |
| Git | Semua | Clone dan commit |
| Editor kode | Semua | Contoh: VS Code |
| Node.js (LTS) + npm | Server lokal, Tauri CLI | Versi belum dikunci proyek. Pakai LTS terbaru dari nodejs.org |
| Rust (via rustup) + build tools OS | Tauri saja | Lihat [TAURI_BUILD.md](TAURI_BUILD.md) |
| Koneksi internet | Semua | Tailwind, Lucide, Chart.js dimuat dari CDN |

Periksa instalasi:

```bash
git --version
node -v
npm -v
```

## 2. Clone repository

```bash
git clone https://github.com/FarrelPtrv/NataData---Inventaris.git
cd NataData---Inventaris
```

Jika repository masih kosong, salin `index.html`, `logo.jpeg`, dan folder `img/` ke dalamnya, lalu commit pertama (lihat [DEPLOYMENT.md](DEPLOYMENT.md)).

## 3. Memasang dependensi

Aplikasi web **tidak punya dependensi npm**; semua pustaka dimuat dari CDN. Tidak ada `npm install` yang diperlukan sampai Tauri ditambahkan.

## 4. Menjalankan aplikasi

Pilihan A, buka langsung `index.html` di browser (klik ganda).

Pilihan B, server lokal (disarankan):

```bash
npx serve .                   # unduh otomatis paket "serve" saat dijalankan
# atau, bila Python terpasang:
python -m http.server 8080
```

Penting: `localStorage` terikat pada **origin** (`file://`, `http://localhost:3000`, `http://localhost:8080` semuanya berbeda). Gunakan satu cara yang konsisten saat menguji.

Menjalankan sebagai aplikasi desktop: `npx tauri dev` (setelah mengikuti [TAURI_BUILD.md](TAURI_BUILD.md)).

## 5. Perintah build

Tidak ada langkah build untuk versi web (file statis). Untuk aplikasi desktop:

```bash
npx tauri build
```

Tidak ada skrip `npm run build` karena `package.json` belum ada. Jangan mengarang skrip tersebut sebelum benar-benar ditambahkan.

## 6. Cara memodifikasi

Seluruh kode ada di `index.html`:

| Ingin mengubah | Cari di |
|---|---|
| Tampilan layar | Bagian HTML (`<body>`), kelas Tailwind |
| Logika | Tag `<script>` pada bagian bawah |
| Nama toko bawaan, logo bawaan | Konstanta `DEFAULT_STORE_NAME`, `DEFAULT_LOGO` |
| Kategori produk | Dua `<select>` kategori (form Barang Masuk dan modal Edit), tombol filter, dan objek `catCounts` di `updateCharts` |
| Alasan pengurangan stok | `<select id="alasanKeluar">` |

Prinsip saat mengubah kode:
1. Setiap perubahan data harus memanggil `saveDataToStorage()`.
2. Setelah mengubah data, panggil fungsi render terkait (`updateDashboard`, `renderStokList`, `renderTransactionHistory`, `renderNotifications`, `updateCharts`).
3. Teks dari pengguna yang dimasukkan ke `innerHTML` harus lewat `escapeHTML()`.
4. Jika menambah kategori, ubah **semua** tempat yang disebut di tabel di atas, karena kategori ditulis berulang (hard-coded).

## 7. Menguji perubahan

Belum ada pengujian otomatis. Gunakan daftar uji manual berikut setelah setiap perubahan:

| # | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Pertama kali buka (data bersih) | Muncul "Buat Profil Toko" |
| 2 | PIN 5 angka / konfirmasi berbeda | Ditolak dengan pesan |
| 3 | Barang masuk produk baru | Muncul di Stok; riwayat bertambah; modal di Laporan naik |
| 4 | Barang masuk dengan nama sama | Stok bertambah, tidak ada duplikat produk |
| 5 | Penjualan melebihi stok | Ditolak |
| 6 | Penjualan sah | Stok turun, omset dan laba naik |
| 7 | Stok ≤ minimum | Muncul di Notifikasi dan banner dashboard |
| 8 | Pengurangan dengan alasan "Lainnya" | Alasan kustom tercatat |
| 9 | Muat ulang halaman | Data tetap ada |
| 10 | Keluar lalu masuk dengan PIN | Data tetap ada |
| 11 | Reset | Semua data dan PIN hilang |
| 12 | Nama produk berisi `<b>x</b>` | Tampil sebagai teks, bukan HTML |
| 13 | Lebar layar HP dan desktop | Navigasi bawah (HP) / sidebar (desktop) benar |

Untuk menyiapkan kondisi bersih: DevTools → Application → Local Storage → hapus kunci berawalan `natadata_`.

## 8. Memeriksa kesalahan JavaScript

1. Buka DevTools (F12) → tab **Console**. Galat merah menunjukkan baris dan fungsi.
2. Tab **Network**: pastikan `cdn.tailwindcss.com`, `unpkg.com/lucide`, dan `cdn.jsdelivr.net/npm/chart.js` berstatus 200.
3. Tab **Application → Local Storage**: lihat nilai kunci `natadata_*`.
4. Pemeriksaan sintaks tanpa browser, dari terminal (butuh Node.js). Salin isi tag `<script>` ke `app.js`, lalu jalankan:

```bash
node --check app.js
```

Pada audit ini, pemeriksaan sintaks terhadap skrip dilakukan dan **lolos** (hanya pemeriksaan sintaks, bukan pengujian fungsi).

Pada aplikasi Tauri, DevTools bisa dibuka dengan klik kanan → Inspect saat `npx tauri dev` (perilaku pada build rilis belum diverifikasi).

## 9. Masalah umum saat pengembangan

| Gejala | Kemungkinan penyebab | Tindakan |
|---|---|---|
| Layar tanpa gaya | Tailwind CDN gagal dimuat | Cek internet dan tab Network |
| Ikon kosong | Lucide gagal dimuat | Cek Network; `lucide.createIcons()` dipanggil bila `window.lucide` ada |
| Laporan error `Chart is not defined` | Chart.js gagal dimuat | Cek Network |
| Data "hilang" setelah ganti cara membuka | Origin berbeda | Gunakan satu alamat konsisten |
| Logo tidak tampil | Jalur `logo.jpeg` / `img/logo.jpeg` salah | Lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |

Masalah lain: [TROUBLESHOOTING.md](TROUBLESHOOTING.md).
