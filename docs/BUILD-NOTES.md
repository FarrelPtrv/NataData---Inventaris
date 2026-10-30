# Catatan build NataData

## Android

Workflow `.github/workflows/build-android.yml` memasang dependensi Node, Java 21, dan Android SDK, membuat proyek native menggunakan `npx cap add android`, menyinkronkan file `www/`, lalu menjalankan Gradle `assembleDebug`. Artefak yang diunggah adalah APK debug.

## Desktop

Workflow `.github/workflows/build-desktop.yml` menjalankan satu job per sistem operasi:

- Windows: NSIS installer dan portable executable.
- macOS: DMG dan ZIP.
- Linux: AppImage dan Debian package.

Electron memuat `www/index.html` secara lokal. Renderer tidak diberi akses Node.js (`nodeIntegration: false`) dan context isolation/sandbox diaktifkan.

## Catatan keamanan

Aplikasi web yang diberikan menyimpan PIN dalam localStorage. Ini hanya pengunci lokal sederhana, bukan sistem autentikasi yang aman untuk multi-pengguna. Tinjau dan perbaiki autentikasi sebelum memakai data bisnis nyata.


## Dependensi dan lockfile

Paket sumber tidak menyertakan `package-lock.json` karena registri npm tidak tersedia saat paket disusun. Jalankan `npm install` pada komputer yang memiliki koneksi internet untuk menghasilkan lockfile, lalu commit file `package-lock.json` ke repository. Workflow tetap menggunakan `npm install` agar dapat berjalan sebelum lockfile dibuat. Setelah lockfile masuk repository, workflow dapat diubah menjadi `npm ci` untuk instalasi yang lebih reproducible.
