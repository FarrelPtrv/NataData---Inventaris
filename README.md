# NataData

Aplikasi manajemen stok barang dan penjualan UMKM. Proyek ini memakai HTML, CSS, dan JavaScript sebagai antarmuka web, Capacitor untuk Android, serta Electron untuk desktop.

## Target build

- **Android:** APK debug melalui GitHub Actions (`Build Android APK - NataData`).
- **Windows:** installer `.exe` (NSIS) dan versi portable `.exe`.
- **macOS:** `.dmg` dan `.zip`.
- **Linux:** `.AppImage` dan `.deb`.

Hasil build tersedia pada bagian **Artifacts** dari workflow GitHub Actions terkait. Build yang disediakan workflow ini untuk pengujian dan distribusi awal; belum ditandatangani dengan sertifikat publisher/Apple Developer.

## Struktur proyek

```text
NataData/
├── .github/
│   └── workflows/
│       ├── build-android.yml
│       └── build-desktop.yml
├── electron/
│   └── main.cjs
├── www/
│   ├── index.html
│   └── assets/
│       └── natadata-logo.svg
├── .gitignore
├── capacitor.config.ts
└── package.json
```

## Prasyarat pengembangan lokal

- Node.js 24 LTS (Capacitor v8 mensyaratkan Node.js 22 atau lebih baru).
- npm yang disertakan bersama Node.js.
- Untuk menjalankan desktop: sistem operasi desktop yang didukung Electron.
- Untuk build Android lokal: Android Studio, Android SDK, dan JDK yang sesuai. Workflow GitHub Actions menyiapkan Java dan Android SDK sendiri.

## Menyiapkan proyek

```bash
git clone https://github.com/USERNAME/natadata.git
cd natadata
npm install
```

Ganti `USERNAME/natadata` sesuai alamat repository milikmu.

## Menjalankan aplikasi desktop untuk pengembangan

```bash
npm start
```

## Build desktop lokal

Build sebaiknya dilakukan pada sistem operasi target. Untuk contoh perintah:

```bash
# Windows
npm run dist:win

# macOS
npm run dist:mac

# Linux
npm run dist:linux
```

Hasil build berada di folder `release/`.

## Build APK Android lokal

Folder `android/` tidak disimpan di repository; folder tersebut dihasilkan dari konfigurasi Capacitor.

```bash
npm run android:add
npm run android:sync
```

Buka folder `android/` dengan Android Studio, atau build APK debug dari terminal:

```bash
cd android

# Windows PowerShell / Command Prompt
gradlew.bat assembleDebug

# macOS / Linux
./gradlew assembleDebug
```

APK debug akan berada di `android/app/build/outputs/apk/debug/app-debug.apk`.

## Build otomatis melalui GitHub Actions

1. Push seluruh isi proyek ke branch `main` repository.
2. Buka tab **Actions** di GitHub.
3. Pilih `Build Android APK - NataData` untuk APK Android.
4. Pilih `Build Desktop App - NataData` untuk Windows, macOS, dan Linux.
5. Klik **Run workflow** untuk menjalankan manual, atau workflow berjalan otomatis saat file proyek yang dipantau berubah pada branch `main`.
6. Setelah status **Success**, buka hasil run dan unduh file pada bagian **Artifacts**.

Folder `.github` diawali titik. Pastikan kedua file workflow berada di lokasi persis `.github/workflows/`. Tidak ada `package-lock.json` di paket awal; `npm install` akan membuatnya secara otomatis. Sebaiknya simpan `package-lock.json` hasil instalasi lokal ke GitHub agar versi dependensi lebih konsisten antar-build.

## Data dan keamanan — baca sebelum penggunaan nyata

- Kode aplikasi saat ini memakai `localStorage`. Data tersimpan secara lokal pada profil browser/WebView masing-masing perangkat. Data tidak otomatis tersinkron antara komputer dan HP.
- PIN aplikasi saat ini disimpan sebagai nilai lokal melalui `localStorage` (`natadata_password`). PIN tersebut bukan autentikasi server dan tidak boleh dianggap sebagai perlindungan kuat untuk data bisnis sensitif.
- APK debug bukan rilis Play Store. Untuk distribusi publik, siapkan proses signing/release dan pengujian yang lebih menyeluruh.
- Tailwind CSS, Lucide, Chart.js, dan Google Fonts dimuat dari CDN. Aplikasi membutuhkan koneksi internet agar dependensi tersebut dapat dimuat. Jika ingin benar-benar offline, pindahkan dependensi tersebut ke aset lokal.
- Desktop Electron dan Android memiliki penyimpanan lokal masing-masing; pemasangan aplikasi di beberapa perangkat tidak membuat datanya sama.

## Logo

`www/assets/natadata-logo.svg` adalah logo fallback sederhana agar referensi logo lokal di HTML tidak rusak. Ganti file itu dengan logo resmi dan sesuaikan format/path pada `www/index.html` bila diperlukan.

## Catatan

`android/`, `node_modules/`, dan `release/` sengaja diabaikan oleh Git. Workflow Android membuat proyek Android saat build. Workflow desktop menggunakan Electron Builder pada runner sistem operasi masing-masing.
