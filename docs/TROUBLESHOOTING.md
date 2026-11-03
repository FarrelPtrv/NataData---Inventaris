# Pemecahan Masalah NataData

Keterangan label pada setiap solusi:
- **[Terverifikasi dari kode]**: penyebab terlihat langsung pada `index.html`.
- **[Dugaan]**: berdasarkan pengetahuan umum/dokumentasi; belum diuji pada proyek ini.

Format tiap masalah: gejala → kemungkinan penyebab → cara memeriksa → perbaikan.

## Daftar isi

1. [Workflow GitHub Actions gagal](#1-workflow-github-actions-gagal)
2. [Error "Get Pages site failed" / "Not Found"](#2-error-get-pages-site-failed--not-found)
3. [Workflow tidak muncul di tab Actions](#3-workflow-tidak-muncul-di-tab-actions)
4. [Folder `.github/workflows` tidak terunggah atau salah lokasi](#4-folder-githubworkflows-tidak-terunggah-atau-salah-lokasi)
5. [Instalasi dependensi gagal](#5-instalasi-dependensi-gagal)
6. [Build Tauri / Android gagal](#6-build-tauri--android-gagal)
7. [APK tidak bisa dipasang](#7-apk-tidak-bisa-dipasang)
8. [Tampilan, ikon, atau grafik tidak termuat (CDN)](#8-tampilan-ikon-atau-grafik-tidak-termuat-cdn)
9. [Logo tidak tampil](#9-logo-tidak-tampil)
10. [Data tidak tersimpan / hilang](#10-data-tidak-tersimpan--hilang)
11. [Lupa PIN](#11-lupa-pin)
12. [Situs Pages menampilkan 404](#12-situs-pages-menampilkan-404)

---

## 1. Workflow GitHub Actions gagal

> Saat audit tidak ada workflow di repository; bagian ini berlaku bila Anda menambahkan usulan di [DEPLOYMENT.md](DEPLOYMENT.md) atau [TAURI_BUILD.md](TAURI_BUILD.md).

| | |
|---|---|
| **Gejala** | Run bertanda merah (✗) di tab Actions |
| **Penyebab mungkin** | Galat sintaks YAML; izin kurang; langkah build gagal; versi *action* tidak ada **[Dugaan]** |
| **Cara memeriksa** | Tab Actions → klik run → klik langkah yang merah → baca baris galat pertama |
| **Perbaikan** | Perbaiki sesuai pesan. YAML sangat sensitif spasi (gunakan spasi, bukan tab). Untuk izin, lihat bagian 2 |

## 2. Error "Get Pages site failed" / "Not Found"

| | |
|---|---|
| **Gejala** | Langkah `configure-pages` gagal dengan pesan *Get Pages site failed* atau *Not Found* |
| **Penyebab paling mungkin** | GitHub Pages belum diaktifkan, atau **Source** belum diset ke *GitHub Actions* **[Dugaan; pola yang umum]** |
| **Penyebab lain** | Izin `pages: write` / `id-token: write` tidak ada; kebijakan Actions pada akun/organisasi membatasi; repository privat pada paket tanpa Pages **[Dugaan]** |
| **Cara memeriksa** | Settings → Pages: apakah Source terisi? Settings → Actions → General: izin workflow. Buka file workflow: cek blok `permissions` |
| **Perbaikan** | Settings → Pages → Source = **GitHub Actions**, lalu jalankan ulang run (*Re-run all jobs*). Pastikan `permissions` berisi `pages: write` dan `id-token: write` |

## 3. Workflow tidak muncul di tab Actions

| | |
|---|---|
| **Gejala** | Tab Actions kosong atau workflow tidak ada di daftar kiri |
| **Penyebab mungkin** | File tidak berada di `.github/workflows/` pada akar; ekstensi bukan `.yml`/`.yaml`; belum di-push ke branch default; YAML tidak valid; Actions dinonaktifkan **[Dugaan]** |
| **Cara memeriksa** | Di GitHub, buka Code → pastikan jalur persis `.github/workflows/namafile.yml`. Settings → Actions → General |
| **Perbaikan** | Pindahkan ke jalur yang benar, push ke `main`, aktifkan Actions. Workflow yang hanya memakai `workflow_dispatch` baru muncul bila file ada di branch default |

## 4. Folder `.github/workflows` tidak terunggah atau salah lokasi

| | |
|---|---|
| **Gejala** | Folder tidak ada di repository setelah unggah |
| **Penyebab mungkin** | Folder berawalan titik disembunyikan/dilewati saat seret-lepas lewat web atau saat mengompres ZIP; folder terunggah di dalam subfolder (misal `NataData/.github/...`) **[Dugaan]** |
| **Cara memeriksa** | `git ls-files .github` di terminal; atau lihat tampilan Code di GitHub |
| **Perbaikan** | Gunakan Git: `git add .github && git commit -m "workflow" && git push`. Atau di GitHub: Add file → Create new file → ketik `.github/workflows/pages.yml` sebagai nama |

## 5. Instalasi dependensi gagal

Aplikasi web tidak punya dependensi npm. Masalah ini hanya muncul bila Tauri CLI dipasang.

| | |
|---|---|
| **Gejala** | `npm install` gagal, `npx tauri` tidak dikenal |
| **Penyebab mungkin** | Tidak ada internet/proxy; Node.js belum terpasang; izin folder; berada di folder yang salah (bukan yang berisi `package.json`) **[Dugaan]** |
| **Cara memeriksa** | `node -v`, `npm -v`; `dir package.json` (Windows) / `ls package.json` |
| **Perbaikan** | Pasang Node.js LTS; jalankan di folder proyek; ulangi `npm install -D @tauri-apps/cli@latest`. Jika cache rusak: `npm cache verify` |

## 6. Build Tauri / Android gagal

| Gejala | Penyebab mungkin **[Dugaan]** | Perbaikan |
|---|---|---|
| `rustc`/`cargo` tidak dikenal | Rust belum terpasang, atau terminal belum dibuka ulang | Pasang rustup; buka ulang terminal |
| `linker link.exe not found` (Windows) | Build Tools C++ belum ada | Pasang "Desktop development with C++" |
| Jendela aplikasi putih/kosong | `frontendDist` salah | Pastikan `"frontendDist": "../src"` dan `src/index.html` ada |
| Galat konfigurasi `tauri.conf.json` | Memakai format Tauri v1 pada CLI v2 | Gunakan kunci v2 (`productName`, `identifier`, `build.frontendDist`, `app.windows`) |
| Gagal mengunduh alat installer | Tidak ada internet saat build pertama | Sambungkan internet dan ulangi |
| Android: SDK/NDK/JAVA_HOME tidak ditemukan | Variabel lingkungan belum diatur | Atur `JAVA_HOME`, `ANDROID_HOME`, `NDK_HOME`; buka ulang terminal |
| Android: target Rust tidak ada | `rustup target add ...` belum dijalankan | Jalankan perintah di [TAURI_BUILD.md, bagian 12](TAURI_BUILD.md#12-android-opsional) |

Cara umum memeriksa: baca **galat pertama** (bukan yang terakhir) pada keluaran terminal, lalu cari pesan itu di dokumentasi/isu Tauri. Perintah `npx tauri info` menampilkan ringkasan lingkungan Anda **[Dugaan; tersedia pada CLI v2]**.

## 7. APK tidak bisa dipasang

| | |
|---|---|
| **Gejala** | "App not installed", "Parse error", atau dilarang memasang |
| **Penyebab mungkin** | APK rilis belum ditandatangani; sumber tidak dikenal belum diizinkan; versi kunci tanda tangan berbeda dari aplikasi yang sudah terpasang; arsitektur CPU tidak cocok **[Dugaan]** |
| **Perbaikan** | Gunakan APK debug untuk uji, atau tandatangani APK rilis dengan keystore; aktifkan pemasangan dari sumber tidak dikenal; copot versi lama yang kunci tanda tangannya berbeda |

Belum ada bukti APK NataData pernah dibuat atau diuji.

## 8. Tampilan, ikon, atau grafik tidak termuat (CDN)

| | |
|---|---|
| **Gejala** | Halaman tanpa warna/tata letak (Tailwind), ikon kosong (Lucide), laporan kosong atau error `Chart is not defined` (Chart.js) |
| **Penyebab** | **[Terverifikasi dari kode]** Aplikasi memuat ketiga pustaka dari CDN pada baris 8, 10, dan 12 `index.html`. Tanpa internet, diblokir jaringan/iklan-pemblokir, atau CDN sedang gangguan, pustaka tidak termuat |
| **Cara memeriksa** | F12 → Network: lihat permintaan `cdn.tailwindcss.com`, `unpkg.com`, `cdn.jsdelivr.net` yang merah |
| **Perbaikan** | Pastikan internet. Nonaktifkan pemblokir untuk situs. Perbaikan jangka panjang: bundel pustaka secara lokal (perlu persetujuan pemilik proyek) |
| **Catatan** | Lucide dimuat `@latest` dan Chart.js tanpa versi, sehingga pembaruan di CDN bisa memengaruhi aplikasi sewaktu-waktu |

## 9. Logo tidak tampil

| | |
|---|---|
| **Penyebab** | **[Terverifikasi dari kode]** Tag `<img>` awal memakai `logo.jpeg` (baris 31, 103, 167), sedangkan `DEFAULT_LOGO` bernilai `img/logo.jpeg` (baris 745). Setelah aplikasi dimuat, JavaScript menimpa `src` logo sidebar/header dengan `img/logo.jpeg` |
| **Cara memeriksa** | F12 → Network → filter Img → lihat jalur yang 404 |
| **Perbaikan** | Pastikan berkas ada pada **kedua** jalur relatif terhadap `index.html`, atau (dengan persetujuan pemilik) seragamkan menjadi satu jalur. Jika logo sudah tampil di lingkungan Anda, struktur folder Anda sudah memenuhi kedua jalur. Pada Tauri/Pages, salin kedua berkas ke folder yang dipublikasikan |

Logo kustom via **Link URL Logo** membutuhkan alamat gambar yang bisa diakses publik.

## 10. Data tidak tersimpan / hilang

| Gejala | Penyebab | Keterangan |
|---|---|---|
| Data kosong saat dibuka dengan cara lain | `localStorage` per origin: `file://`, `localhost:PORT`, URL Pages, dan aplikasi Tauri masing-masing terpisah **[Terverifikasi dari desain]** | Gunakan satu cara dan satu perangkat |
| Data hilang setelah bersihkan browser | "Hapus data situs/cookie" menghapus `localStorage` | Belum ada ekspor/cadangan |
| Tidak tersimpan di mode penyamaran | Penyimpanan dibuang saat jendela ditutup **[Dugaan]** | Jangan pakai mode private |
| Data hilang setelah Reset | **[Terverifikasi dari kode]** `localStorage.clear()` pada reset | Tidak bisa dipulihkan |
| Aplikasi aneh/kosong setelah data rusak | `JSON.parse` pada `loadStoreData` tidak dibungkus penanganan galat **[Terverifikasi dari kode]** | Hapus kunci `natadata_items` / `natadata_trx` lewat DevTools (data produk/transaksi ikut hilang) |
| Gagal menyimpan | Kuota `localStorage` penuh (batas umum beberapa MB per origin) **[Dugaan]** | Tidak ada penanganan galat di kode |
| Tidak muncul di HP/komputer lain | Tidak ada sinkronisasi | Memerlukan backend (lihat audit) |

## 11. Lupa PIN

**[Terverifikasi dari kode]** Tidak ada fitur pemulihan. Tombol Reset hanya ada di sidebar setelah login, sehingga tidak bisa dicapai tanpa PIN. PIN tersimpan teks biasa di kunci `natadata_password`: orang dengan akses ke DevTools perangkat dapat membacanya, yang menunjukkan PIN bukan pengaman data. Memulihkan akses berarti menghapus data situs/aplikasi, dan **itu menghapus seluruh data toko**.

## 12. Situs Pages menampilkan 404

| | |
|---|---|
| **Penyebab mungkin** | Deployment belum selesai; `index.html` tidak ada di folder yang dipublikasikan; URL salah; Source Pages tidak sesuai **[Dugaan]** |
| **Cara memeriksa** | Settings → Pages (URL dan status); tab Actions (run sukses?); cek `index.html` di akar |
| **Perbaikan** | Tunggu beberapa menit; pastikan nama file persis `index.html` (huruf kecil); salin URL dari Settings → Pages |
