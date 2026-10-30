# Audit dan Rekomendasi NataData

## 1. Ruang lingkup dan metode

| Item | Keterangan |
|---|---|
| Yang diaudit | **Satu file**: `index.html` (1.718 baris, 102.140 byte) yang diunggah pemilik proyek |
| Yang **tidak** ada / tidak diaudit | `package.json`, `capacitor.config.*`, folder `android/` dan `www/`, workflow GitHub Actions, `logo.jpeg`, serta pengaturan repository. Pada saat dicek, halaman repository GitHub menampilkan "This repository is empty" |
| Metode | Membaca seluruh kode (HTML dan JavaScript), pemeriksaan sintaks `node --check` pada skrip inline (**hasil: valid**), dan simulasi terpisah untuk satu bug (T-05) |
| **Tidak dilakukan** | Aplikasi **tidak dijalankan di browser**, tidak ada pengujian fungsional, tidak ada build APK, tidak ada deployment |

Penanda keyakinan: **[Kode]** terlihat langsung di kode. **[Simulasi]** direproduksi dengan logika yang sama secara terpisah. **[Dugaan]** disimpulkan dari kode tetapi belum dijalankan.

## 2. Status fitur

| Fitur | Status | Bukti |
|---|---|---|
| Masuk per toko (ID, nama, PIN) | ⚠️ Sebagian: **PIN tidak berfungsi** | `handleLogin`, baris 790 |
| Dashboard | ✅ Tersedia | `updateDashboard`, 973 |
| Daftar, cari, filter, edit, hapus produk | ✅ Tersedia | 1040–1242 |
| Barang masuk (produk baru/restock) | ✅ Tersedia | `handleBarangMasuk`, 1300 |
| Penjualan | ✅ Tersedia | `handlePenjualan`, 1377 |
| Penyesuaian stok (hanya pengurangan) | ✅ Tersedia | `handleBarangKeluar`, 1436 |
| Riwayat transaksi | ⚠️ Tersedia, tanpa filter/pencarian/tanggal asli | 1487 |
| Laporan dan grafik | ✅ Tersedia (definisi angka perlu dijelaskan) | 1636 |
| Notifikasi stok menipis | ✅ Tersedia (tidak ada notifikasi di luar aplikasi) | 1535 |
| Ubah nama toko dan logo | ✅ Tersedia | 902–925 |
| Reset data demo | ⚠️ Tersedia hanya di layar lebar; stok mungkin tidak kembali penuh (T-07) | 854, 1207 |
| **Data contoh** | Ada: 4 produk, 3 transaksi, nama *Toko Berkah Utama* | 752–763 |
| Backend, database online, sinkronisasi | ❌ Tidak ada | tidak ada `fetch`/API |
| Verifikasi login / akun | ❌ Tidak ada | PIN tidak disimpan |
| Ekspor/impor/cadangan | ❌ Tidak ada | — |
| Batalkan/hapus transaksi | ❌ Tidak ada | — |
| Mode offline penuh | ❌ Tidak ada (bergantung CDN) | baris 8–14 |
| Pengujian otomatis | ❌ Tidak ada | — |
| APK Android, workflow APK | ❌ Tidak ada | — |

## 3. Temuan

### Prioritas KRITIS

**K-01 — PIN tidak diverifikasi dan tidak disimpan** [Kode]
`handleLogin` (790–807) hanya memastikan kolom terisi dan `pin.length >= 4`. Nilai PIN tidak ditulis ke mana pun dan tidak dibandingkan. Siapa pun di browser yang sama dapat membuka toko mana pun dengan menebak ID Toko. Lencana dashboard bertuliskan "Sesi Terisolasi" dapat menimbulkan rasa aman yang keliru.
*Dampak:* akses tidak sah ke data toko.
*Rekomendasi:* jangan dipromosikan sebagai keamanan. Solusi nyata memerlukan autentikasi di server (lihat bagian 4). Bila tetap lokal: simpan *hash* PIN (misalnya dengan Web Crypto) agar setidaknya ada penghalang, dengan catatan itu **tetap bukan keamanan sungguhan** karena data `localStorage` terbuka bagi siapa pun yang memegang perangkat.

**K-02 — Data hanya di `localStorage`, tanpa cadangan** [Kode]
Seluruh data ditulis lewat `saveDataToStorage` (825). Tidak ada ekspor, impor, atau sinkronisasi.
*Dampak:* menghapus data situs, mode incognito, rusaknya perangkat, atau berganti HP menghilangkan seluruh catatan usaha secara permanen.
*Rekomendasi:* tambahkan ekspor/impor JSON dan ekspor CSV riwayat sebagai langkah tercepat. Jangka menengah: database online (bagian 4).

### Prioritas TINGGI

**T-01 — Ketergantungan CDN tanpa versi tetap dan wajib online** [Kode]
Baris 8–14: Tailwind (`cdn.tailwindcss.com`), `lucide@latest`, `chart.js` tanpa versi. Tailwind versi CDN ditujukan untuk pengembangan, bukan produksi (periksa dokumentasi Tailwind). Pembaruan pustaka di CDN dapat merusak aplikasi tanpa perubahan apa pun pada kode Anda, dan tanpa internet tampilan gagal.
*Rekomendasi:* kunci versi atau simpan salinan lokal; untuk produksi, build CSS Tailwind sekali dan sertakan hasilnya.

**T-02 — `JSON.parse` tanpa penanganan error** [Kode]
Baris 816–820 dan 770–775 (dipanggil dari `window.onload`). Data tersimpan yang rusak dapat menghentikan proses masuk.
*Rekomendasi:* bungkus dengan `try/catch`, tampilkan pesan, dan tawarkan memulihkan atau mengekspor data mentah.

**T-03 — Grafik dibuat ulang tanpa menghancurkan yang lama** [Dugaan]
`showMainApp` (833) memanggil `initCharts` (1576) setiap kali masuk; `salesChartInstance`/`categoryChartInstance` tidak di-`destroy()`. Pada keluar lalu masuk lagi tanpa memuat ulang halaman, Chart.js versi baru umumnya melempar error "Canvas is already in use". Belum diuji.
*Rekomendasi:* panggil `destroy()` bila instance sudah ada, atau buat grafik sekali saja.

**T-04 — Transaksi tidak dapat dibatalkan atau dikoreksi** [Kode]
Tidak ada fungsi hapus/ubah transaksi. Salah mencatat penjualan hanya bisa dikoreksi dengan mengubah stok manual, dan perubahan itu pun tidak tercatat (M-05). Laporan akan tetap memuat transaksi yang salah.
*Dampak:* menghambat pemakaian nyata, laporan tidak bisa dipercaya setelah salah ketik.
*Rekomendasi:* fitur batalkan transaksi yang mengembalikan stok dan menandai transaksi sebagai dibatalkan.

**T-05 — Teks ter-*escape* dua kali saat edit produk** [Simulasi]
`sanitizeInput` dipakai saat menyimpan (1146–1148, 1303–1311). Saat modal edit dibuka, nilai yang sudah ter-escape dimasukkan ke kolom (`openModalEditBarang`, 1116), lalu di-escape lagi saat disimpan. Hasil simulasi: `Ayam Bu Ani's & Kopi` → `Ayam Bu Ani&amp;#039;s &amp;amp; Kopi` setelah satu kali edit.
*Rekomendasi:* simpan teks **mentah**, dan escape hanya saat menampilkan (atau pakai `textContent`).

**T-06 — `logo.jpeg` dirujuk tetapi tidak ada** [Kode]
Baris 32, 86, 152, dan konstanta `DEFAULT_LOGO` (727). File tidak termasuk dalam kode yang diaudit; hasilnya gambar rusak.
*Rekomendasi:* tambahkan file ke repository atau gunakan SVG inline.

**T-07 — Reset Data Demo mungkin tidak mengembalikan stok** [Kode, belum dijalankan]
`items = [...DEFAULT_ITEMS]` (817, 1209) menyalin *daftar*, bukan objeknya, sehingga `items` dan `DEFAULT_ITEMS` berbagi objek yang sama. Penjualan, barang masuk pada produk lama, dan penyesuaian mengubah `stok` langsung pada objek itu (1324, 1393, 1459). Akibatnya, selama halaman belum dimuat ulang, reset mengembalikan nilai stok yang **sudah berubah**, dan toko baru yang dibuat dalam sesi yang sama bisa mendapat stok contoh yang sudah berubah.
*Rekomendasi:* salin dalam (`structuredClone` atau `JSON.parse(JSON.stringify(...))`).

### Prioritas MENENGAH

| ID | Temuan | Bukti | Rekomendasi |
|---|---|---|---|
| M-01 | ID transaksi acak 3 digit (`TRX-100`…`TRX-999`) dapat kembar | 1348, 1401, 1464 | Pakai penghitung berurutan atau `crypto.randomUUID()` |
| M-02 | Waktu transaksi disimpan sebagai teks `"Hari Ini, 09:10"`, jadi transaksi lama tetap berlabel "Hari Ini". Tanggal asli hanya ada di `dateIso` | 1354, 1407, 1470 | Simpan stempel waktu lengkap dan format saat ditampilkan |
| M-03 | Transaksi menyimpan **nama** produk, bukan id. Produk dengan nama sama bergabung di "Produk Terlaris", dan mengganti nama memutus keterkaitan | 1350, 1664 | Simpan `itemId` (dan nama sebagai salinan) |
| M-04 | Dua arti "laba": Dashboard (margin per penjualan) vs Laporan ("Saldo Kas Bersih" = omset − modal restock) | 980, 1643 | Beri penjelasan di UI atau tampilkan laba kotor sebenarnya di laporan |
| M-05 | Mengubah stok lewat modal edit tidak tercatat di riwayat | 1152 | Catat selisih sebagai transaksi penyesuaian |
| M-06 | Riwayat selalu menulis "Pcs", bukan satuan produk | 1526 | Simpan `satuan` pada transaksi |
| M-07 | Tombol Reset hanya ada di sidebar layar lebar. Reset juga tidak mengembalikan logo | 134, 1207 | Tambahkan akses di tampilan HP dan samakan perilaku |
| M-08 | 17 pemakaian `innerHTML` dengan data produk. Aman hanya bila semua jalur sudah di-escape. Nama toko dari login ditampilkan lewat `innerText`, jadi aman | grep `innerHTML` | Gunakan `textContent` / pembuatan elemen |
| M-09 | Kata kunci pencarian di-escape sebelum dibandingkan dengan nama mentah, sehingga mencari `&` atau `'` tidak cocok | 1042 | Hapus escape pada pencarian |
| M-10 | Aksesibilitas: 29 `<label>` tanpa atribut `for`, 0 atribut `aria-*`, tombol ikon hanya ber-`title`, 31 pemakaian ukuran font 9–10 px, kolom PIN menerima huruf dan tanpa `inputmode="numeric"` | grep | Hubungkan label ke input, tambahkan `aria-label`, naikkan ukuran font, atur `inputmode` |
| M-11 | Penyesuaian stok tidak memperbarui grafik (`updateCharts` tidak dipanggil) | 1478–1484 | Panggil `updateCharts()` |
| M-12 | Tidak ada validasi bahwa harga jual ≥ harga beli, dan tidak ada tanda saat laba negatif | 1307–1308 | Beri peringatan |

### Prioritas RENDAH

- Belum ada file `LICENSE` (pemilik perlu memilih lisensi).
- Satu file besar berisi HTML, CSS, dan JS. Pisahkan menjadi berkas terpisah agar mudah dipelihara.
- Awalan kunci penyimpanan `stokin_` adalah nama lama. Ganti **hanya** dengan migrasi data.
- Belum ada favicon, manifest PWA, atau *service worker* (tidak ada mode offline).
- Belum ada pengujian otomatis dan CI.
- Komentar kode di baris 31 dan 85 menyebut "logo yang diunggah", yang tidak sesuai kondisi repository.

## 4. Autentikasi dan database untuk banyak UMKM

Kondisi sekarang cocok sebagai **demo satu perangkat**. Bila NataData akan dipakai banyak UMKM atau lebih dari satu perangkat, dibutuhkan:

| Kebutuhan | Alasan teknis (berdasarkan kode saat ini) |
|---|---|
| Akun dan autentikasi di server | PIN lokal tidak melindungi apa pun (K-01) |
| Database online per toko (dengan aturan akses per akun) | `localStorage` terikat satu browser (K-02) |
| API / sinkronisasi | Dua perangkat sekarang memiliki data berbeda |
| Cadangan dan pemulihan | Tidak ada jalur pemulihan data |
| Transaksi atomik | Stok dan transaksi ditulis terpisah di memori, tanpa jaminan konsistensi antarperangkat |
| Log audit | Transaksi tidak bisa dibatalkan, dan perubahan stok manual tidak tercatat |

Pilihan teknologi (layanan *backend-as-a-service* atau server sendiri) adalah keputusan pemilik proyek dan di luar cakupan audit ini.

## 5. Kompatibilitas dan aksesibilitas

- **Tata letak:** responsif (sidebar di layar `md` ke atas, bottom nav di HP) menurut kelas Tailwind. Belum diuji di perangkat nyata.
- **Browser:** memakai fitur JavaScript modern (template literal, `padStart`, `toLocaleString('id-ID')`). Browser lama tidak diuji.
- **Aksesibilitas:** lihat M-10.
- **Android:** belum ada pembungkus. Lihat [ANDROID_BUILD.md](ANDROID_BUILD.md).

## 6. Pengujian yang diperlukan sebelum penggunaan operasional

1. Jalankan daftar periksa manual di [DEVELOPMENT.md](DEVELOPMENT.md#6-menguji-perubahan), terutama skenario 8 (T-03) dan reset (T-07).
2. Uji data tidak biasa: nama dengan `& ' " < >`, nilai desimal, jumlah sangat besar.
3. Uji di browser dan perangkat yang dipakai pengguna sebenarnya (Chrome Android, Safari iOS).
4. Uji kapasitas `localStorage` dengan ribuan transaksi.
5. Uji tanpa internet.
6. Tambahkan pengujian otomatis untuk logika inti (stok, laba, laporan) setelah logika dipisah dari tampilan.

## 7. Kesimpulan

NataData adalah **prototipe yang fungsional untuk demo satu perangkat**. Dengan kondisi sekarang, **jangan dinyatakan siap produksi**: tidak ada pengamanan akses yang berfungsi, tidak ada cadangan data, ada bug yang dapat merusak data tampilan (T-05) atau pemulihan (T-07), dan belum ada pengujian.

**Urutan perbaikan yang disarankan:** K-02 (ekspor/impor) → T-05, T-07, T-03, T-02 (bug kecil dan murah diperbaiki) → T-04 (batalkan transaksi) → T-01 (kunci/lokalkan CDN) → K-01 (autentikasi sungguhan bersama database) → sisanya.
