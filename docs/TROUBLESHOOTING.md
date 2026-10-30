# Pemecahan Masalah NataData

Setiap masalah berisi **gejala, kemungkinan penyebab, cara memeriksa, dan perbaikan**.

Penanda status solusi:

- ✅ **Terverifikasi dari kode:** penyebab terlihat langsung di `index.html` atau konfigurasi.
- ❓ **Dugaan:** umum terjadi pada kasus serupa, tetapi **belum diuji** pada repository ini.

## Daftar Isi

1. [Workflow GitHub Actions gagal](#1-workflow-github-actions-gagal)
2. [Error Get Pages site failed / Not Found](#2-error-get-pages-site-failed--not-found)
3. [Workflow tidak muncul di tab Actions](#3-workflow-tidak-muncul-di-tab-actions)
4. [Folder .github/workflows tidak terunggah atau salah lokasi](#4-folder-githubworkflows-tidak-terunggah-atau-salah-lokasi)
5. [Instalasi dependensi gagal](#5-instalasi-dependensi-gagal)
6. [Build Capacitor atau Android gagal](#6-build-capacitor-atau-android-gagal)
7. [APK tidak bisa dipasang](#7-apk-tidak-bisa-dipasang)
8. [Tampilan, ikon, atau grafik tidak termuat](#8-tampilan-ikon-atau-grafik-tidak-termuat)
9. [Logo tidak muncul](#9-logo-tidak-muncul)
10. [Data tidak tersimpan atau hilang](#10-data-tidak-tersimpan-atau-hilang)
11. [Aplikasi macet di layar masuk atau layar kosong](#11-aplikasi-macet-di-layar-masuk-atau-layar-kosong)
12. [Grafik error setelah keluar lalu masuk lagi](#12-grafik-error-setelah-keluar-lalu-masuk-lagi)
13. [Nama produk menampilkan kode aneh](#13-nama-produk-menampilkan-kode-aneh)
14. [Push ke GitHub ditolak](#14-push-ke-github-ditolak)

---

## 1. Workflow GitHub Actions gagal

**Gejala:** run di tab Actions bertanda silang merah.

**Cara memeriksa:** klik run → klik job `deploy` → buka langkah yang bertanda merah dan baca pesan terakhirnya.

| Pesan / langkah gagal | Kemungkinan penyebab | Perbaikan |
|---|---|---|
| *Get Pages site failed* | Pages belum diaktifkan | Lihat masalah 2 |
| *Resource not accessible by integration* | Izin Actions dibatasi | ❓ Cek **Settings → Actions → General**, pastikan Actions diizinkan. Pastikan blok `permissions` di `pages.yml` utuh |
| Gagal di `Checkout` atau `Konfigurasi` | Gangguan sementara atau versi action | ❓ Jalankan ulang (**Re-run jobs**), cek versi action |
| `cp: cannot stat 'index.html'` | `index.html` tidak ada di akar repository | ✅ Letakkan `index.html` di akar, bukan di subfolder |
| Deploy lama tak selesai | Dua run saling menunggu | ❓ Batalkan run lama di tab Actions |

## 2. Error Get Pages site failed / Not Found

**Gejala:** langkah *Configure Pages* gagal dengan `Get Pages site failed` atau `Not Found`.

**Penyebab paling umum ❓:** GitHub Pages belum diaktifkan, atau Source belum diatur ke GitHub Actions. Ini dugaan umum, belum diuji pada repository ini.

**Perbaikan:**

1. **Settings → Pages**.
2. Pada **Source** pilih **GitHub Actions**.
3. Kembali ke tab Actions → **Re-run all jobs**.

Jika tidak ada menu Pages: repository privat pada paket yang tidak mendukung Pages ❓. Jadikan repository publik atau periksa paket akun.

## 3. Workflow tidak muncul di tab Actions

**Cara memeriksa:**

1. Buka repository di GitHub → telusuri ke `.github/workflows/`. Apakah `pages.yml` ada di sana?
2. Apakah file berada di **branch default**? Workflow dengan trigger `push` pada `main` perlu ada di `main`.
3. Apakah Actions dimatikan? Cek **Settings → Actions → General**.

**Perbaikan:** lihat masalah 4. Setelah benar, lakukan push baru atau jalankan manual lewat **Run workflow**.

## 4. Folder .github/workflows tidak terunggah atau salah lokasi

**Gejala:** folder `.github` tidak terlihat di GitHub.

| Penyebab | Cara memeriksa | Perbaikan |
|---|---|---|
| Diunggah lewat tombol *Upload files* di web (folder berawalan titik sering terlewat) ❓ | Telusuri repo di GitHub | Gunakan `git add .` dan `git push` dari terminal |
| Nama folder salah (`github`, `.workflow`, `.github/workflow`) ✅ | `git ls-files` | Nama harus tepat `.github/workflows` |
| Folder di dalam subfolder | `git ls-files \| grep workflows` | Pindahkan ke **akar** repository |
| Tidak ter-commit | `git status` | `git add .github` lalu commit dan push |
| Ekstensi salah | Lihat nama file | Harus `.yml` atau `.yaml` |

Perintah pemeriksaan:

```bash
git ls-files | grep -i workflows
```

Jika tidak ada keluaran, file belum ter-commit.

## 5. Instalasi dependensi gagal

**Catatan ✅:** repository ini **tidak memiliki `package.json`**, sehingga `npm install` pasti gagal dengan pesan seperti `ENOENT ... package.json`. Itu normal. Aplikasi tidak butuh instalasi.

Jika Anda sudah mengikuti [ANDROID_BUILD.md](ANDROID_BUILD.md) dan `npm install` gagal ❓: periksa versi Node (`node --version`) terhadap persyaratan Capacitor, koneksi internet, dan hapus `node_modules` lalu coba lagi.

## 6. Build Capacitor atau Android gagal

Belum ada konfigurasi Capacitor di repository ini, jadi tidak ada build yang bisa gagal. Setelah Anda menambahkannya, lihat tabel di [ANDROID_BUILD.md](ANDROID_BUILD.md#9-masalah-build-yang-umum-semuanya-dugaan-belum-diverifikasi). Semua isinya ❓ dugaan.

## 7. APK tidak bisa dipasang

Belum ada APK dari proyek ini. Jika kelak Anda punya ❓:

| Gejala | Kemungkinan penyebab | Perbaikan |
|---|---|---|
| "Aplikasi tidak terpasang" | Versi lama dengan tanda tangan berbeda sudah terpasang | Copot aplikasi lama (**data aplikasi ikut hilang**) |
| Pemasangan diblokir | Sumber tidak dikenal belum diizinkan | Izinkan untuk aplikasi pemasang (File Manager/browser) |
| "Paket rusak" | Unduhan tidak lengkap | Unduh ulang |
| Aplikasi dibuka tetapi putih | CDN tidak termuat | Lihat masalah 8 |

## 8. Tampilan, ikon, atau grafik tidak termuat

**Gejala:** halaman tanpa warna/tata letak, ikon hilang, atau grafik kosong.

**Penyebab ✅:** `index.html` memuat 4 sumber eksternal (Tailwind, Lucide, Chart.js, Google Fonts). Jika salah satu gagal dimuat, bagian itu rusak. Aplikasi **tidak punya cadangan lokal**.

| Yang rusak | Sumber penyebab |
|---|---|
| Tata letak dan warna | `cdn.tailwindcss.com` |
| Ikon | `unpkg.com/lucide@latest` |
| Grafik | `cdn.jsdelivr.net/npm/chart.js` |
| Font | `fonts.googleapis.com` (tampilan bergeser ke font bawaan) |

**Cara memeriksa:** F12 → tab **Network**, muat ulang, cari baris berwarna merah atau berstatus gagal. Tab **Console** biasanya menampilkan `ERR_BLOCKED_BY_CLIENT` atau `ERR_NAME_NOT_RESOLVED`.

**Perbaikan:**

1. Pastikan internet aktif.
2. Matikan sementara ekstensi pemblokir iklan, atau jaringan kantor/sekolah yang memblokir CDN ❓.
3. Jangka panjang: simpan pustaka secara lokal dan kunci versinya (lihat [AUDIT.md](AUDIT.md), T-01).

## 9. Logo tidak muncul

**Penyebab ✅:** `index.html` memanggil `logo.jpeg` (relatif, di folder yang sama) pada tiga tempat. File gambar tersebut tidak termasuk dalam kode yang diaudit.

**Perbaikan:** letakkan `logo.jpeg` di folder yang sama dengan `index.html` dan push. Nama file **peka huruf besar/kecil** di server GitHub Pages ❓ (`Logo.JPEG` tidak sama dengan `logo.jpeg`). Alternatif: ubah URL logo lewat menu ubah nama toko (tetapi itu tidak mengubah logo layar masuk).

## 10. Data tidak tersimpan atau hilang

**Penyebab yang terverifikasi dari kode ✅:**

- Data hanya ditulis ke `localStorage` perangkat itu.
- Data dipisah per **ID Toko**. ID yang berbeda (termasuk beda huruf besar/kecil sebelum dinormalkan, atau tanda baca yang dibuang) akan membuka toko lain yang kosong.
- Alamat berbeda berarti data berbeda: `localhost`, alamat `file://`, dan alamat GitHub Pages punya penyimpanan masing-masing.

**Penyebab umum lain ❓:** mode incognito, penghapusan data situs, pembersih otomatis browser, pembatasan penyimpanan di sebagian browser mobile, dan berganti browser/perangkat.

**Cara memeriksa:** F12 → **Application → Local Storage** → alamat situs → cari kunci `stokin_items_<idToko>`. Jika ada, datanya masih tersimpan.

**Perbaikan:** pastikan ID Toko sama persis, buka dari alamat yang sama, dan jangan memakai incognito. Data yang sudah terhapus **tidak bisa dipulihkan** karena tidak ada cadangan.

## 11. Aplikasi macet di layar masuk atau layar kosong

**Dugaan ❓ yang bersumber dari kode:** data tersimpan rusak dan gagal di-parse. `loadStoreData` memanggil `JSON.parse` tanpa penanganan error (baris 816–820), sehingga data yang korup dapat menghentikan proses masuk. Ini belum direproduksi.

**Cara memeriksa:** F12 → Console, cari `SyntaxError ... JSON`.

**Perbaikan sementara:** di Console jalankan `localStorage.clear()` lalu muat ulang. **Ini menghapus semua data situs.** Jika bisa, catat dulu nilai `stokin_items_<idToko>` dan `stokin_trx_<idToko>` dari tab Application.

## 12. Grafik error setelah keluar lalu masuk lagi

**Dugaan ❓ dari pembacaan kode:** `showMainApp()` memanggil `initCharts()` setiap kali, sedangkan grafik lama tidak pernah dihancurkan (`destroy()`). Chart.js versi baru biasanya menolak membuat grafik kedua di kanvas yang sama dengan pesan seperti *Canvas is already in use*. Belum diuji.

**Cara memeriksa:** masuk → keluar → masuk lagi tanpa memuat ulang halaman → lihat Console.

**Perbaikan sementara:** muat ulang halaman (F5) setelah keluar.

## 13. Nama produk menampilkan kode aneh

**Gejala ✅ (direproduksi dengan logika yang sama secara terpisah):** nama seperti `Ayam Bu Ani's & Kopi` menjadi `Ayam Bu Ani&#039;s &amp; Kopi` setelah produk **diedit dan disimpan**.

**Penyebab:** teks di-*escape* saat disimpan, lalu nilai yang sudah ter-escape dimasukkan kembali ke form edit dan di-*escape* lagi.

**Penghindaran:** hindari tanda `& < > " '` pada nama produk, SKU, dan satuan sampai bug diperbaiki.

## 14. Push ke GitHub ditolak

| Pesan | Perbaikan |
|---|---|
| `rejected ... fetch first` | `git pull --rebase origin main` lalu `git push` |
| `Authentication failed` / diminta kata sandi | Login ulang lewat GitHub Desktop atau `gh auth login`. Kata sandi akun tidak lagi dipakai untuk push lewat HTTPS ❓ |
| `remote origin already exists` | `git remote set-url origin <URL>` |
| `src refspec main does not match any` | Belum ada commit. Jalankan `git add .` dan `git commit` dulu |
