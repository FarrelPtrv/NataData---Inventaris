# Deployment Website NataData

NataData adalah situs statis (satu `index.html`), sehingga cocok dipublikasikan lewat **GitHub Pages**.

> **Status:** workflow `.github/workflows/pages.yml` adalah **usulan baru dan belum diuji**. Belum ada bukti bahwa website NataData sudah dipublikasikan, dan URL-nya belum dapat dipastikan. Repository ini tidak berisi konfigurasi hosting lain (Netlify, Vercel, dsb.).

## 1. Persiapan repository

1. Pastikan file berikut sudah di-push ke branch `main`: `index.html`, `logo.jpeg`, `.github/workflows/pages.yml`. Panduan push ada di [DEVELOPMENT.md](DEVELOPMENT.md#9-mengunggah-push-ke-github).
2. Pastikan `.github/workflows/` berada **di akar repository**, bukan di dalam folder lain.
3. Repository publik dapat memakai GitHub Pages di paket gratis. Untuk repository privat, ketersediaan bergantung pada paket akun Anda (periksa dokumentasi GitHub).

## 2. Mengaktifkan GitHub Pages

Langkah ini dilakukan **sekali** di antarmuka GitHub, karena workflow tidak dapat mengaktifkannya sendiri tanpa pengaturan tambahan:

1. Buka repository → **Settings → Pages**.
2. Pada **Build and deployment → Source**, pilih **GitHub Actions**.

Jika langkah ini dilewati, workflow biasanya gagal dengan pesan *Get Pages site failed* atau *Not Found* (lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md#2-error-get-pages-site-failed--not-found)).

## 3. Pengaturan izin GitHub Actions

Workflow sudah menyatakan izin sendiri:

```yaml
permissions:
  contents: read     # membaca kode
  pages: write       # menerbitkan ke Pages
  id-token: write    # verifikasi deployment (OIDC)
```

Jika organisasi atau repository Anda membatasi izin Actions, cek **Settings → Actions → General** dan pastikan Actions diizinkan berjalan.

## 4. Fungsi workflow `pages.yml`

| Bagian | Fungsi |
|---|---|
| `on: push: branches: [main]` | Berjalan otomatis setiap push ke `main` |
| `on: workflow_dispatch` | Bisa dijalankan manual dari tab Actions |
| `concurrency` | Mencegah dua deployment berjalan bersamaan |
| Langkah *Siapkan folder publikasi* | Menyalin **hanya** `index.html` (dan `logo.jpeg` jika ada) ke `_site/`, agar `README.md`, `docs/`, dan file lain tidak ikut diterbitkan |
| `configure-pages`, `upload-pages-artifact`, `deploy-pages` | Rangkaian resmi GitHub untuk menerbitkan situs |

Versi action yang dipakai: `checkout@v4`, `configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`. Periksa apakah masih versi yang dianjurkan GitHub.

## 5. Menjalankan deployment

- **Otomatis:** push ke `main`.
- **Manual:** tab **Actions** → *Deploy NataData ke GitHub Pages* → **Run workflow**.

## 6. Memeriksa status

1. Tab **Actions**: cari run terbaru. Centang hijau berarti berhasil, silang merah berarti gagal (klik untuk melihat log).
2. **Settings → Pages**: bagian atas menampilkan status dan URL situs setelah berhasil.

## 7. Mendapatkan URL website

Setelah run berhasil, URL tampil di:

- Ringkasan run di tab Actions (job `deploy`, bagian *github-pages*), dan
- **Settings → Pages**.

Untuk repository proyek, polanya biasanya `https://<nama-akun>.github.io/<nama-repository>/`. Nama repository ini mengandung tiga tanda hubung (`NataData---Inventaris`), jadi **salin URL persis dari GitHub**, jangan menebak. Pola ini belum diverifikasi untuk repository ini.

## 8. Catatan penting setelah publikasi

- **Data tidak ikut diterbitkan.** Data toko ada di browser masing-masing pengguna. Orang yang membuka URL tersebut mulai dari data kosong/contoh.
- **Situs publik.** Siapa pun yang punya URL dapat membuka aplikasi. Karena PIN belum berfungsi, jangan menyimpan data sensitif.
- **Origin berbeda = data berbeda.** `localStorage` terikat ke alamat situs. Data yang dibuat di `localhost` tidak muncul di alamat GitHub Pages.
- **HTTPS:** GitHub Pages memakai HTTPS, sehingga CDN yang dimuat lewat `https://` bekerja normal.

## 9. Memecahkan masalah

Lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md). Pemeriksaan cepat:

| Pemeriksaan | Pertanyaan |
|---|---|
| Workflow muncul di Actions? | Jika tidak: lokasi `.github/workflows/pages.yml` salah atau belum ter-push |
| Source Pages = GitHub Actions? | Jika tidak: *Get Pages site failed* |
| Run gagal di langkah mana? | Baca pesan error pada log langkah tersebut |
| Halaman terbuka tetapi tanpa gaya? | CDN diblokir atau offline |
