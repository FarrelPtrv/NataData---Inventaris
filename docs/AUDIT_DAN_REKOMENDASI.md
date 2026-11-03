# Audit dan Rekomendasi NataData

## 1. Ruang lingkup dan bukti

| Aspek | Fakta |
|---|---|
| Sumber audit | Satu file HTML yang diunggah (1.815 baris, ±106 KB): `natadata_aplikasi_manajemen_stok_umkm__1_.html`. Nomor baris di bawah merujuk ke file itu |
| Repository GitHub | `FarrelPtrv/NataData---Inventaris` **kosong** saat diperiksa; tidak ada `package.json`, `www`, konfigurasi Capacitor/Tauri, maupun `.github/workflows` |
| Referensi gaya dokumen (Avenqor) | **Tidak dapat diakses** (GitHub menolak akses otomatis). Struktur dokumen mengikuti spesifikasi tugas, bukan meniru Avenqor |
| Dijalankan | Pemeriksaan sintaks JavaScript dengan `node --check` (**lolos**); pengecekan ID HTML ganda (**tidak ada**) |
| **Tidak** dijalankan | Aplikasi di browser, uji fungsi, build Tauri, build APK, GitHub Pages, GitHub Actions |

Semua temuan di bawah adalah hasil **pembacaan kode (analisis statis)**.

## 2. Ringkasan kondisi aktual

NataData adalah aplikasi satu file yang berfungsi lengkap untuk alur dasar (daftar, login PIN, stok, barang masuk, penjualan, penyesuaian, riwayat, laporan, notifikasi). Tidak ada backend, database online, sinkronisasi, ekspor, PWA, maupun data demo. Penyimpanan hanya `localStorage`.

**Kesimpulan:** layak sebagai prototipe/demo atau pemakaian pribadi satu perangkat dengan risiko yang dipahami. **Belum layak** dinyatakan siap produksi: keamanan, penyimpanan data, dan pengujian belum memadai.

## 3. Status fitur

| Kategori | Item |
|---|---|
| **Sudah tersedia** | Pendaftaran toko + PIN; login/keluar; dashboard; CRUD stok (tambah via Barang Masuk, edit, hapus); penjualan; pengurangan stok beralasan; riwayat; laporan + 2 grafik; notifikasi stok menipis; ubah nama/logo toko; reset |
| **Tersedia dengan batasan** | PIN (bukan keamanan nyata); arus kas (hanya omset − modal barang masuk); riwayat (tanpa filter); logo (hanya URL) |
| **Memakai data contoh** | **Tidak ada.** Aplikasi mulai kosong. Teks "Toko Berkah" di HTML (baris 112) hanyalah placeholder yang ditimpa saat dimuat. Konfirmasi "reset data demo" pada brief **tidak berlaku**: reset menghapus semua |
| **Belum ada** | Backend/DB, login nyata, sinkronisasi, multi-pengguna/toko, ekspor/impor, cadangan, nota/struk, multi-item per transaksi, batal/koreksi transaksi, filter tanggal, PWA/offline, pengujian otomatis |

## 4. Temuan teknis dan rekomendasi berprioritas

### Prioritas kritis (kehilangan data, akses tidak sah, kegagalan fungsi utama)

| ID | Temuan | Bukti | Alasan teknis | Rekomendasi |
|---|---|---|---|---|
| K-01 | Satu-satunya salinan data ada di `localStorage`; tanpa ekspor/cadangan | `saveDataToStorage` (kunci `natadata_*`); tidak ada fungsi ekspor | Hapus data browser, ganti perangkat, atau reset = data hilang permanen | Tambah ekspor/impor JSON minimal; jangka panjang: database online |
| K-02 | PIN disimpan **teks biasa** dan hanya dicek di sisi klien | `localStorage.setItem('natadata_password', pin)` (baris 849); pembandingan di `handleLoginAuth` | Siapa pun dengan akses DevTools/berkas profil dapat membaca PIN dan seluruh data; bukan autentikasi | Jangan menjual PIN sebagai keamanan. Untuk data bisnis nyata: autentikasi sisi server. Setidaknya simpan hash + salt (tetap hanya pengunci kenyamanan) |
| K-03 | Lupa PIN tak punya pemulihan; reset hanya dari dalam aplikasi; teks konfirmasi reset menyesatkan | Reset di sidebar (baris 149) yang hanya tampil di `md+` dan setelah login; `localStorage.clear()` (baris 1279); teks hanya menyebut "produk dan transaksi" | Pengguna terkunci atau menghapus PIN, profil, dan logo tanpa sadar | Perjelas teks konfirmasi (sebut PIN & profil ikut terhapus); sediakan alur "lupa PIN" yang menjelaskan konsekuensinya; paksa ekspor sebelum reset |
| K-04 | Tidak ada penanganan galat penyimpanan | `JSON.parse(storedItems)` (di `loadStoreData`) tanpa `try/catch`; `setItem` tanpa penanganan kuota | Data rusak/kuota penuh dapat membuat aplikasi gagal total atau gagal menyimpan tanpa pemberitahuan | Bungkus dengan `try/catch`, tampilkan pesan, sediakan jalur pemulihan |

### Prioritas tinggi (menghambat pemakaian nyata)

| ID | Temuan | Bukti | Rekomendasi |
|---|---|---|---|
| T-01 | Ketergantungan CDN tak terkunci; Tailwind CDN bukan untuk produksi; skrip pihak ketiga berjalan di origin yang sama dengan data (termasuk PIN) | Baris 8, 10 (`lucide@latest`), 12 | Bundel lokal dengan versi tetap; kunci CSP; ini juga syarat agar versi Tauri/Android berjalan offline |
| T-02 | Tidak ada sinkronisasi, multi-perangkat, atau multi-pengguna | Hanya `localStorage` | Backend + database + autentikasi bila lebih dari satu perangkat/karyawan (lihat bagian 5) |
| <a id="t-03"></a>T-03 | **Dua jalur logo**: HTML memakai `logo.jpeg` (baris 31, 103, 167), JS memakai `img/logo.jpeg` (baris 745) | Perbandingan baris-baris tersebut | Seragamkan menjadi satu jalur (perubahan kode, perlu persetujuan). Sementara: sediakan kedua berkas (Anda menyatakan logo sudah tampil) |
| T-04 | Edit produk dapat mengubah stok tanpa jejak | `handleSaveEditBarang` tidak membuat transaksi | Stok dan riwayat bisa tidak cocok; arahkan koreksi stok lewat Penyesuaian atau catat transaksi koreksi otomatis |
| T-05 | Tidak ada batal/koreksi/edit transaksi | Tidak ada fungsi terkait | Salah input penjualan tidak dapat dibetulkan kecuali lewat Barang Masuk; tambah pembatalan (void) |
| T-06 | Transaksi menyimpan **nama**, bukan `id` produk; barang masuk dengan nama sama **menimpa** harga beli dan jual | `itemNama`; `handleBarangMasuk` | Riwayat tidak terhubung ke produk; perubahan harga memengaruhi hitungan selanjutnya. Simpan `itemId`; pertimbangkan harga rata-rata/lot |
| T-07 | Reset dan fitur penting tersembunyi pada layar sempit | `aside` memakai `hidden md:flex` (baris 99) | Pengguna HP tidak punya akses Reset; sesuaikan UI |
| T-08 | Belum ada pengujian otomatis, CI, lisensi, `package.json`, repository kosong | Hasil audit repository | Commit awal, tambah uji (lihat bagian 6), lisensi |

### Prioritas menengah (fungsionalitas dan pengalaman pengguna)

| ID | Temuan | Rekomendasi |
|---|---|---|
| M-01 | Label "Estimasi Laba Kotor" di dashboard = akumulasi seluruh waktu; "Arus Kas Bersih" disederhanakan (modal restock dianggap kas keluar) | Beri keterangan periode; tambah filter rentang tanggal |
| M-02 | Riwayat tanpa filter/pencarian/halaman; seluruh daftar dibangun ulang dengan `innerHTML` pada tiap perubahan | Tambah filter dan paginasi; optimasi bila data ribuan |
| M-03 | Satu produk per transaksi penjualan; tidak ada diskon, nota/struk, atau pelanggan | Tambah keranjang multi-item dan cetak/bagikan nota |
| M-04 | Kategori ditulis berulang (hard-coded) di empat tempat | Jadikan satu daftar yang dapat dikelola |
| M-05 | Tidak ada ekspor laporan (CSV/PDF) | Tambah ekspor |
| M-06 | Aksesibilitas belum diuji: banyak teks 10–11 px (`text-[10px]`), tombol ikon yang hanya mengandalkan ikon | Uji kontras/pembaca layar; perbesar teks; tambah label |
| M-07 | Tidak ada PWA/offline | Manifest + service worker (atau andalkan Tauri) |

### Prioritas rendah (kualitas kode dan dokumentasi)

| ID | Temuan | Rekomendasi |
|---|---|---|
| R-01 | `sanitizeInput` terdefinisi tetapi tidak dipakai (baris 822); komentar menyebut "PWA" padahal bukan | Hapus/gunakan; perbaiki komentar |
| R-02 | Indentasi tidak konsisten di bagian skrip; satu file 1.800 baris dengan `onclick` inline | Pisah menjadi `index.html`, `style.css`, `app.js` |
| R-03 | Nama file unggahan panjang (`natadata_..._1_.html`) | Ganti `index.html` (diperlukan GitHub Pages) |
| R-04 | Dokumentasi belum ada tangkapan layar | Tambahkan screenshot pada README |

## 5. Kebutuhan autentikasi dan database untuk banyak UMKM

Bukti saat ini: tidak ada kode jaringan (tidak ada `fetch`), sehingga seluruh skenario berikut **belum didukung**.

| Kebutuhan | Alasan |
|---|---|
| Akun pengguna dengan autentikasi sisi server (mis. email + sandi ter-hash, atau penyedia identitas) | PIN lokal tidak melindungi data dan tidak membedakan pengguna |
| Database terpusat per toko (data produk, transaksi) dengan pemisahan data antar toko | Sinkronisasi antar HP/PC, cadangan otomatis, banyak UMKM |
| Peran (pemilik, kasir) | Kasir tidak seharusnya bisa menghapus produk/reset |
| Log audit transaksi dan pembatalan | Jejak pertanggungjawaban stok dan uang |
| Cadangan dan pemulihan terjadwal | Mengurangi risiko K-01 |

Pilihan arsitektur bergantung keputusan pemilik proyek (layanan terkelola vs server sendiri); rekomendasi ini belum dievaluasi biaya dan kompleksitasnya.

## 6. Pengujian sebelum penggunaan operasional

1. Jalankan daftar uji manual di [DEVELOPMENT.md](DEVELOPMENT.md#7-menguji-perubahan).
2. Uji data realistis: ≥1.000 produk dan ≥10.000 transaksi (kinerja render dan kuota `localStorage`).
3. Uji lintas peramban (Chrome, Edge, Firefox, Safari) dan lintas ukuran layar; uji aplikasi Tauri dan WebView Android bila dirilis.
4. Uji skenario kegagalan: `localStorage` rusak/penuh, tanpa internet, mode penyamaran.
5. Uji aksesibilitas (kontras, keyboard, pembaca layar).
6. Uji keamanan dasar: percobaan XSS pada semua isian teks (render sudah memakai `escapeHTML`, tetapi belum diuji); tinjau risiko skrip CDN.
7. Uji penghitungan: laba, modal, arus kas, dan pembulatan terhadap contoh hitungan tangan.

## 7. Catatan keamanan ringkas

- **Positif (terbaca di kode):** teks pengguna pada render daftar melewati `escapeHTML`, membuat injeksi HTML lewat nama produk kecil kemungkinannya.
- **Risiko:** PIN teks biasa; skrip CDN berjalan di origin yang sama dengan data; CSP belum diatur; URL logo eksternal membuat peramban meminta gambar dari server pihak lain; tidak ada pembatasan percobaan PIN (di sisi klien semua bisa dilewati).
- **Tidak ditemukan:** token akses, kata sandi, atau kunci API di dalam kode.
