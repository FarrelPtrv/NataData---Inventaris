# Panduan Membuat Aplikasi Desktop NataData (Tauri 2)

Panduan ini membawa Anda dari **nol sampai punya file installer** (`...-setup.exe`) yang bisa dipasang di komputer Windows seperti aplikasi biasa. Ikuti urutan nomor. Jangan loncat.

**Yang Anda dapat di akhir:** aplikasi desktop NataData dengan ikon sendiri, jendela sendiri, dan **bisa dipakai tanpa internet**.

> ## Baca dulu
>
> - Panduan ini **ditulis untuk Windows 10/11 (64-bit)**. Catatan macOS/Linux ada di [bagian 14](#14-macos-dan-linux).
> - **Belum dijalankan end-to-end oleh penulis.** Saya tidak punya Windows dan internet di lingkungan kerja saya. Yang sudah saya uji: file `src/index.html` versi desktop (di Chromium, dengan stub pustaka, 12 dari 12 skenario lulus). Langkah Tauri mengikuti dokumentasi resmi (v2.tauri.app). Jika ada layar atau pesan yang berbeda dari yang saya tulis, kirim tangkapan layarnya.
> - Data aplikasi **masih memakai `localStorage`** (belum SQLite). Penjelasan di [bagian 12](#12-data-anda-di-mana-dan-bagaimana-mengamankannya).
> - Waktu yang dibutuhkan: sekitar **1–2 jam** untuk pertama kali (mayoritas menunggu unduhan dan kompilasi).

## Daftar Isi

1. [Gambaran: apa yang akan kita lakukan](#1-gambaran-apa-yang-akan-kita-lakukan)
2. [Pasang prasyarat](#2-pasang-prasyarat)
3. [Buat proyek Tauri](#3-buat-proyek-tauri)
4. [Coba proyek bawaan](#4-coba-proyek-bawaan)
5. [Masukkan kode NataData](#5-masukkan-kode-natadata)
6. [Unduh pustaka agar bisa offline](#6-unduh-pustaka-agar-bisa-offline)
7. [Atur nama dan ukuran jendela](#7-atur-nama-dan-ukuran-jendela)
8. [Buat ikon aplikasi](#8-buat-ikon-aplikasi)
9. [Jalankan dan uji (mode pengembangan)](#9-jalankan-dan-uji-mode-pengembangan)
10. [Bangun installer](#10-bangun-installer)
11. [Pasang dan uji hasilnya](#11-pasang-dan-uji-hasilnya)
12. [Data Anda: di mana dan bagaimana mengamankannya](#12-data-anda-di-mana-dan-bagaimana-mengamankannya)
13. [Membagikan dan memperbarui aplikasi](#13-membagikan-dan-memperbarui-aplikasi)
14. [macOS dan Linux](#14-macos-dan-linux)
15. [Menyimpan proyek ke GitHub](#15-menyimpan-proyek-ke-github)
16. [Jika ada masalah](#16-jika-ada-masalah)
17. [Daftar periksa akhir](#17-daftar-periksa-akhir)

---

## 1. Gambaran: apa yang akan kita lakukan

NataData adalah satu halaman web. **Tauri** membungkusnya menjadi aplikasi desktop: jendela asli Windows yang menampilkan halaman itu memakai komponen **WebView2** bawaan Windows. Bagian "Rust" dari Tauri sudah disediakan template, **Anda tidak perlu menulis Rust** untuk panduan ini.

```text
index.html (kode Anda)  ──►  Tauri (jendela + Rust)  ──►  NataData_x.x.x_x64-setup.exe
```

Ada tiga keputusan yang sudah saya buat agar Anda tidak perlu memikirkannya:

| Keputusan | Alasan |
|---|---|
| Frontend tetap `index.html` biasa | Tidak ada kode yang ditulis ulang |
| Pustaka (Tailwind, Lucide, Chart.js) **diunduh dan disimpan di dalam aplikasi** | Versi web memuatnya dari internet. Di aplikasi desktop, tanpa ini aplikasi tampil rusak saat offline |
| Fitur PWA (service worker, manifest) **dibuang** dari versi desktop | Tidak dibutuhkan di aplikasi desktop |

## 2. Pasang prasyarat

Lakukan **berurutan**. Setelah selesai tiap langkah, tutup lalu buka ulang jendela terminal yang baru sebelum memeriksa versi.

Halaman resmi: <https://v2.tauri.app/start/prerequisites/>

### 2.1 Microsoft C++ Build Tools

1. Buka <https://visualstudio.microsoft.com/visual-cpp-build-tools/> lalu unduh **Build Tools**.
2. Jalankan installer. Pada tab **Workloads**, centang **Desktop development with C++**.
3. Klik **Install**. Unduhannya besar (beberapa GB). Tunggu sampai selesai, lalu restart komputer bila diminta.

### 2.2 WebView2

Windows 11 dan Windows 10 yang diperbarui umumnya **sudah punya** WebView2. Jika Anda ragu, lewati dulu. Bila aplikasi nanti tidak mau terbuka, pasang *Evergreen Bootstrapper* dari halaman WebView2 Microsoft.

### 2.3 Rust

1. Buka <https://rustup.rs> dan unduh `rustup-init.exe` (64-bit).
2. Jalankan. Jika muncul menu, ketik **`1`** (instalasi standar) lalu Enter.
3. Tunggu selesai. **Tutup dan buka ulang** terminal.
4. Periksa:

```powershell
rustc --version
cargo --version
```

Keduanya harus menampilkan nomor versi. Jika muncul *"not recognized"*, terminal belum dibuka ulang, atau restart komputer.

### 2.4 Node.js

1. Buka <https://nodejs.org> dan unduh versi **LTS**.
2. Pasang dengan pilihan bawaan.
3. Buka terminal baru dan periksa:

```powershell
node --version
npm --version
```

### 2.5 Cara membuka terminal

Tekan tombol **Windows**, ketik **PowerShell**, tekan Enter. Semua perintah di panduan ini dijalankan di sana. Salin perintah (satu baris atau satu blok), tempel dengan klik kanan, tekan Enter.

## 3. Buat proyek Tauri

Pilih folder kerja, misalnya `Documents`:

```powershell
cd $HOME\Documents
npm create tauri-app@latest
```

Jika ditanya *"Ok to proceed?"* untuk memasang `create-tauri-app`, ketik `y`.

Jawab pertanyaan satu per satu. Nama pertanyaan bisa sedikit berbeda dari tabel ini:

| Pertanyaan | Jawaban |
|---|---|
| Project name | `natadata-desktop` |
| Identifier | `id.natadata.app` (atau milik Anda sendiri, lihat catatan) |
| Choose which language to use for your frontend | **TypeScript / JavaScript** |
| Choose your package manager | **npm** |
| Choose your UI template | **Vanilla** |
| Choose your UI flavor | **JavaScript** |

> **Catatan Identifier.** Ini nama unik aplikasi (seperti alamat). **Putuskan sekarang dan jangan diubah nanti.** Folder tempat data aplikasi disimpan bergantung pada identifier, jadi mengubahnya setelah ada pengguna membuat data lama "hilang". Pola umum: kebalikan nama domain, huruf kecil, tanpa spasi.

Lalu masuk ke folder dan pasang dependensi:

```powershell
cd natadata-desktop
npm install
```

Sekarang struktur folder Anda kira-kira:

```text
natadata-desktop/
├── package.json
├── src/                  ← halaman web (di sinilah kode NataData akan masuk)
│   ├── index.html
│   ├── main.js
│   ├── styles.css
│   └── assets/
└── src-tauri/            ← bagian Rust + konfigurasi
    ├── Cargo.toml
    ├── tauri.conf.json
    ├── icons/
    └── src/
```

## 4. Coba proyek bawaan

Sebelum mengubah apa pun, pastikan fondasinya berfungsi:

```powershell
npm run tauri dev
```

- **Kompilasi pertama lama (bisa 5–15 menit)** karena Rust mengunduh dan mengompilasi banyak pustaka. Ini normal. Jangan ditutup.
- Setelah selesai, sebuah **jendela aplikasi contoh** terbuka (biasanya berisi "Welcome to Tauri").
- Tutup jendela itu, atau tekan `Ctrl + C` di terminal untuk berhenti.

Jika bagian ini gagal, **berhenti dan lihat [bagian 16](#16-jika-ada-masalah)**. Jangan lanjut sebelum ini berhasil.

## 5. Masukkan kode NataData

Dari paket yang Anda unduh (`natadata-desktop-files`), ambil `src/index.html`. File ini adalah versi desktop dari kode Anda: sudah memuat pustaka dari folder lokal `vendor/`, tanpa tag PWA, dan sudah berisi perbaikan tombol *Ubah Nama Toko* dan *Reset*.

1. **Ekstrak** ZIP `natadata-desktop-files` ke suatu folder, misalnya `C:\Users\NAMA\Downloads\natadata-desktop-files`. (Ganti `NAMA` dengan nama pengguna Windows Anda.)
2. Dari folder proyek (`natadata-desktop`) jalankan:

```powershell
# hapus file contoh template
Remove-Item src\main.js, src\styles.css -ErrorAction SilentlyContinue
Remove-Item src\assets -Recurse -ErrorAction SilentlyContinue

# salin kode NataData (ganti NAMA)
Copy-Item "C:\Users\NAMA\Downloads\natadata-desktop-files\src\index.html" .\src\index.html -Force

# buat folder pustaka
New-Item -ItemType Directory -Force src\vendor | Out-Null
```

Periksa isi `src`:

```powershell
Get-ChildItem src
```

Harus ada `index.html` dan folder `vendor`.

## 6. Unduh pustaka agar bisa offline

`index.html` mencari tiga berkas di `src\vendor\`. Unduh dari alamat yang sama dengan yang dipakai versi web Anda. Gunakan `curl.exe` (pakai **`.exe`**, karena `curl` saja di PowerShell adalah perintah lain):

```powershell
curl.exe -L -o src\vendor\tailwind.js https://cdn.tailwindcss.com
curl.exe -L -o src\vendor\lucide.js   https://unpkg.com/lucide@latest
curl.exe -L -o src\vendor\chart.js    https://cdn.jsdelivr.net/npm/chart.js
```

**Periksa hasilnya.** Ketiganya harus berukuran **ratusan KB**, bukan beberapa KB:

```powershell
Get-ChildItem src\vendor | Select-Object Name, Length
```

Lalu buka tiap berkas dengan Notepad. Isinya harus berupa **kode JavaScript**. Jika isinya tulisan HTML ("<html>", "Access Denied", halaman login jaringan), unduhan gagal: periksa internet atau proxy kantor, lalu ulangi.

> **Kunci versi.** Karena alamat di atas mengambil versi terbaru *saat ini*, berkas yang Anda simpan menjadi **tetap** (tidak berubah lagi). Itu bagus: aplikasi Anda tidak rusak oleh rilis baru pustaka. Simpan salinan folder `vendor`.

> **Font.** Font Inter dari Google Fonts tidak dipakai di versi desktop. Aplikasi memakai font bawaan sistem. Tampilan sedikit berbeda, fungsinya sama.

**Logo.** `index.html` merujuk logo di dua lokasi: `logo.jpeg` dan `img/logo.jpeg`. Jika Anda punya file logo, salin ke **keduanya** agar tidak ada gambar rusak:

```powershell
New-Item -ItemType Directory -Force src\img | Out-Null
Copy-Item "C:\Users\NAMA\Pictures\logo.jpeg" .\src\logo.jpeg
Copy-Item "C:\Users\NAMA\Pictures\logo.jpeg" .\src\img\logo.jpeg
```

## 7. Atur nama dan ukuran jendela

Buka `src-tauri\tauri.conf.json` dengan editor teks (Notepad atau VS Code). Jangan hapus isinya. Cari dan **ubah** bagian berikut, sisanya biarkan. Susunan persisnya bisa sedikit berbeda antarversi template.

**a. Informasi dasar** (di tingkat paling atas):

```json
"productName": "NataData",
"version": "1.0.0",
"identifier": "id.natadata.app",
```

Pastikan `identifier` sama dengan yang Anda pilih di bagian 3.

**b. Lokasi halaman web** (di dalam `"build"`). Nilainya harus menunjuk ke folder `src`:

```json
"build": {
  "frontendDist": "../src"
}
```

Jika di `build` ada baris `beforeDevCommand` atau `beforeBuildCommand` yang berisi perintah (bukan kosong), hapus barisnya. Template Vanilla biasanya tidak punya.

**c. Jendela** (di dalam `"app"` → `"windows"`):

```json
"windows": [
  {
    "title": "NataData",
    "width": 1280,
    "height": 800,
    "minWidth": 900,
    "minHeight": 600
  }
]
```

**d. Pastikan paket dibuat** (di dalam `"bundle"`):

```json
"bundle": {
  "active": true,
  "targets": "all"
}
```

Pada Windows ini menghasilkan installer `.msi` dan `-setup.exe`. Biarkan bagian `"icon"` apa adanya (akan diisi di langkah berikut).

Simpan file. **Pastikan JSON valid:** tidak ada koma berlebih di akhir daftar, dan semua tanda kutip berpasangan. Cek cepat:

```powershell
node -e "JSON.parse(require('fs').readFileSync('src-tauri/tauri.conf.json','utf8')); console.log('JSON valid')"
```

> Ada pengaturan keamanan `"csp"`. **Biarkan** nilai bawaan template. Jangan diperketat sebelum Anda yakin aplikasi berjalan baik; Tailwind versi CDN menyusun gaya lewat JavaScript dan bisa terblokir oleh CSP yang terlalu ketat (dugaan, belum saya uji).

## 8. Buat ikon aplikasi

Di paket ada `assets\icon-1024.png` (**placeholder**: huruf N di kotak hijau). Ganti dengan logo Anda sendiri jika ada. Syaratnya: gambar **PNG persegi**, disarankan 1024×1024 piksel.

```powershell
npm run tauri icon "C:\Users\NAMA\Downloads\natadata-desktop-files\assets\icon-1024.png"
```

Perintah ini membuat semua ukuran ikon di `src-tauri\icons\`. Selesai jika tidak ada pesan error.

## 9. Jalankan dan uji (mode pengembangan)

```powershell
npm run tauri dev
```

Tunggu jendela **NataData** terbuka. Uji berurutan:

| # | Lakukan | Hasil yang benar |
|---|---|---|
| 1 | Lihat layar awal | Form **Buat Profil Toko** |
| 2 | Isi nama toko, PIN 6 angka (dua kali), klik **Simpan & Buka Toko** | Dashboard terbuka |
| 3 | **Transaksi & Stok → Barang Masuk**: isi nama, satuan, harga beli, harga jual, jumlah → **Simpan Stok** | Produk muncul di daftar stok |
| 4 | **Penjualan Produk**: pilih produk, jumlah → simpan | Stok berkurang, omset di dashboard naik |
| 5 | Klik ikon pensil di kartu toko | Jendela *Ubah Tampilan Toko* terbuka |
| 6 | Klik **Keluar Toko** → Ya | Layar PIN muncul |
| 7 | Masukkan PIN yang salah, lalu yang benar | Salah ditolak, benar masuk |
| 8 | **Uji offline:** matikan Wi-Fi/internet, tutup aplikasi, jalankan lagi | Tampilan tetap normal (warna, ikon, grafik) |

**Tampilan tanpa warna atau ikon hilang?** Artinya pustaka di `src\vendor` bermasalah. Klik kanan di jendela → **Inspect** (hanya ada di mode `dev`), buka tab **Console** dan **Network** untuk melihat berkas mana yang gagal. Ulangi [bagian 6](#6-unduh-pustaka-agar-bisa-offline).

> Jangan pakai tombol **Reset** pada data yang penting. Reset menghapus seluruh data aplikasi **dan PIN**.

Hentikan dengan menutup jendela atau `Ctrl + C`.

## 10. Bangun installer

```powershell
npm run tauri build
```

Menunggu lama (kompilasi versi rilis, beberapa menit hingga belasan menit). Setelah selesai, hasilnya ada di:

```text
src-tauri\target\release\bundle\
├── nsis\   →  NataData_1.0.0_x64-setup.exe   (installer .exe)
└── msi\    →  NataData_1.0.0_x64_en-US.msi   (installer .msi)
```

Nama persisnya bisa sedikit berbeda. Buka foldernya dari terminal:

```powershell
explorer src-tauri\target\release\bundle
```

Untuk dibagikan ke pengguna, **file `-setup.exe`** biasanya yang paling mudah dipakai.

## 11. Pasang dan uji hasilnya

Lakukan di komputer yang bersih bila bisa (atau setidaknya setelah menutup mode `dev`).

1. Klik dua kali `...-setup.exe`.
2. Windows mungkin menampilkan **"Windows protected your PC"** (SmartScreen). Ini terjadi karena aplikasi **belum ditandatangani** sertifikat kode. Klik **More info → Run anyway**. Ini wajar untuk aplikasi buatan sendiri; lihat bagian 13.
3. Ikuti installer sampai selesai, lalu buka NataData dari Start Menu.
4. Ulangi uji nomor 2–8 di bagian 9, kali ini pada aplikasi terpasang.
5. Cabut internet dan pastikan aplikasi tetap tampil normal.

Untuk mencopot: **Settings → Apps → Installed apps → NataData → Uninstall**.

## 12. Data Anda: di mana dan bagaimana mengamankannya

- Data (produk, transaksi, nama toko, **PIN**) disimpan di **penyimpanan lokal WebView** milik aplikasi (`localStorage`), di folder data aplikasi pada komputer itu. Lokasi persisnya berada di bawah folder pengguna Windows (sekitar `%LOCALAPPDATA%` dengan nama sesuai identifier). **Cek sendiri** lokasi tepatnya, saya tidak memverifikasinya.
- Data **terpisah** dari versi web/PWA. Isi di browser **tidak** muncul di aplikasi desktop, dan sebaliknya.
- Data **tidak sinkron** antarkomputer.
- **Tidak ada fitur ekspor/cadangan** di aplikasi ini. Risiko kehilangan data nyata (hapus data, rusaknya komputer, mencopot aplikasi dapat menghapus datanya, belum saya uji). Catat angka penting secara berkala, atau minta saya menambahkan ekspor/impor.
- **PIN tersimpan sebagai teks biasa** dan hanya penghalang tampilan, bukan keamanan sungguhan.
- **Reset menghapus semuanya**, termasuk PIN dan profil toko.

Jika Anda butuh database yang sebenarnya (SQLite) dengan Rust, lihat `TAURI_MIGRATION.md`. Itu pekerjaan lanjutan yang terpisah dari panduan ini.

## 13. Membagikan dan memperbarui aplikasi

**Membagikan:** kirim file `-setup.exe` (lewat flashdisk, Drive, dsb.). Pengguna harus menjalankan dan menerima peringatan SmartScreen.

**Menghilangkan peringatan SmartScreen** memerlukan **sertifikat penandatanganan kode** yang dibeli dari penerbit sertifikat. Itu berbayar dan di luar panduan ini. Aplikasi tanpa tanda tangan tetap berfungsi.

**Memperbarui versi:**

1. Ubah kode di `src\index.html`.
2. Naikkan `"version"` di `src-tauri\tauri.conf.json` (misalnya `1.0.1`). Periksa juga `src-tauri\Cargo.toml` dan `package.json` agar konsisten.
3. Jalankan `npm run tauri build` lagi.
4. Pasang installer baru **di atas** yang lama. Selama `identifier` tidak berubah, data seharusnya tetap ada (**belum saya uji; cadangkan dulu**).

Pembaruan otomatis (*updater*) tidak disiapkan di sini.

## 14. macOS dan Linux

Installer harus dibangun **di sistem operasi yang sama** dengan targetnya (Windows untuk `.msi`, macOS untuk `.dmg`/`.app`, Linux untuk `.deb`/`.AppImage`), kecuali memakai CI.

| OS | Prasyarat (ringkas) |
|---|---|
| macOS | Xcode Command Line Tools: `xcode-select --install`, lalu Rust dan Node.js |
| Linux | Paket pengembangan WebKitGTK dan pustaka pendukung sesuai distribusi (daftar lengkap di halaman prasyarat resmi), lalu Rust dan Node.js |

Langkah 3–10 sama, hanya perintah salin/hapus berkas memakai `cp`/`rm`, dan unduhan memakai `curl -L -o ...` tanpa `.exe`. Hasil build ada di `src-tauri/target/release/bundle/`.

## 15. Menyimpan proyek ke GitHub

Template biasanya sudah membuat `.gitignore` yang mengecualikan `node_modules` dan `src-tauri/target`. **Periksa** isinya sebelum commit; folder `target` berukuran sangat besar dan tidak boleh ikut.

```powershell
git init
git add .
git status          # pastikan tidak ada node_modules/ atau target/
git commit -m "NataData desktop (Tauri 2)"
git branch -M main
git remote add origin https://github.com/FarrelPtrv/NataData---Inventaris.git
git push -u origin main
```

Jika repo itu berisi versi web/PWA, **jangan menimpanya**. Gunakan repository atau branch lain (misalnya `git checkout -b desktop` sebelum push). Folder `src\vendor` ukurannya besar tetapi wajar untuk disimpan. File installer (`bundle\`) **jangan** di-commit.

## 16. Jika ada masalah

Tanda ❓ berarti dugaan umum yang belum saya uji pada komputer Anda.

| Gejala | Kemungkinan penyebab | Perbaikan |
|---|---|---|
| `rustc`/`cargo` *not recognized* | Terminal belum dibuka ulang ❓ | Tutup semua terminal lalu buka lagi, atau restart komputer |
| `error: linker 'link.exe' not found` atau error MSVC | C++ Build Tools belum terpasang atau workload salah ❓ | Ulangi 2.1 dan pastikan *Desktop development with C++* tercentang |
| `npm` *not recognized* | Node.js belum terpasang / terminal lama ❓ | Ulangi 2.4, buka terminal baru |
| `npm create tauri-app` gagal mengunduh | Internet / proxy ❓ | Periksa koneksi, coba lagi |
| Jendela putih kosong | `frontendDist` salah atau `index.html` tidak di `src` ❓ | Periksa bagian 7b dan `Get-ChildItem src` |
| Tampil tanpa warna / ikon hilang / grafik kosong | Berkas `vendor` rusak atau tidak ada ❓ | Ulangi bagian 6, periksa ukuran dan isi berkas |
| Gambar logo rusak | File logo tidak ada di `src\logo.jpeg` dan `src\img\logo.jpeg` | Lihat akhir bagian 6 |
| `npm run tauri icon` gagal | Gambar bukan PNG persegi ❓ | Pakai PNG persegi 1024×1024 |
| `JSON.parse` error pada tauri.conf.json | Koma/kurung salah ❓ | Jalankan perintah cek JSON di 7, perbaiki baris yang disebut |
| Build lama sekali | Kompilasi pertama | Normal. Tunggu |
| Antivirus menandai aplikasi ❓ | Aplikasi tanpa tanda tangan | Periksa sumbernya (buatan Anda sendiri), tambahkan pengecualian bila yakin |
| Aplikasi terpasang tidak mau terbuka ❓ | WebView2 tidak ada | Pasang *WebView2 Evergreen Runtime* dari Microsoft |
| Data hilang setelah update ❓ | `identifier` berubah | Kembalikan identifier lama |

**Jika tetap macet:** salin **pesan error lengkap** (dari terminal) dan kirim ke saya beserta nomor langkahnya.

## 17. Daftar periksa akhir

- [ ] `rustc`, `cargo`, `node`, `npm` semua menampilkan versi
- [ ] `npm run tauri dev` pada template bawaan berhasil (bagian 4)
- [ ] `src\index.html` adalah versi desktop dari paket
- [ ] Tiga berkas di `src\vendor` berisi JavaScript dan berukuran ratusan KB
- [ ] `tauri.conf.json`: nama, identifier, `frontendDist` = `../src`, jendela, JSON valid
- [ ] Ikon sudah dibuat
- [ ] Uji 1–8 lulus saat mode `dev`, **termasuk uji offline**
- [ ] `npm run tauri build` menghasilkan `-setup.exe`
- [ ] Installer dipasang di komputer lain dan diuji
- [ ] Anda sadar: data hanya di komputer itu, tidak ada cadangan otomatis, PIN bukan keamanan, installer belum bertanda tangan

Selamat, Anda punya aplikasi desktop NataData.
