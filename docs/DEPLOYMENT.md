# Deployment NataData

> **Kondisi aktual saat audit:** repository `FarrelPtrv/NataData---Inventaris` kosong. **Tidak ditemukan** folder `.github/workflows`, konfigurasi GitHub Pages, maupun hosting lain. Jadi tidak ada workflow yang bisa dijelaskan sebagai "sudah ada". Dokumen ini memberi **prosedur dan usulan** yang ditandai jelas. Status deployment (aktif/tidak) **tidak dapat dipastikan** dari bukti yang tersedia.

NataData berupa file statis (HTML + aset), jadi cocok dihosting di layanan hosting statis seperti GitHub Pages. Tidak ada langkah build untuk versi web.

## 1. Persiapan repository

1. Pastikan file berikut ada di akar repository (atau folder `src/` bila memakai Tauri):
   - `index.html` (**nama harus `index.html`**)
   - `logo.jpeg` dan folder `img/` berisi `logo.jpeg`
2. Commit dan push ke branch `main`:

```bash
git add .
git commit -m "Tambah aplikasi NataData dan dokumentasi"
git push origin main
```

3. Pastikan folder `.github` ada di **akar** repository (bukan di dalam subfolder), bila memakai workflow. Folder berawalan titik kadang tidak ikut terunggah saat unggah lewat antarmuka web; gunakan `git push` atau pilih "Add file → Create new file" dengan mengetik jalur `.github/workflows/nama.yml`.

## 2. Pilihan A, GitHub Pages tanpa workflow (paling sederhana)

1. Buka repository → **Settings** → **Pages**.
2. Pada **Build and deployment → Source** pilih **Deploy from a branch**.
3. Pilih branch `main` dan folder `/ (root)`, lalu **Save**.
4. Tunggu beberapa menit. Alamat situs muncul di bagian atas halaman Pages.

URL yang **diperkirakan** untuk repository ini: `https://farrelptrv.github.io/NataData---Inventaris/` **[Belum diverifikasi; salin URL dari halaman Settings → Pages]**.

Jalur `logo.jpeg` dan `img/logo.jpeg` bersifat relatif sehingga tetap bekerja di subpath tersebut, selama berkas ada di tempat yang sama dengan `index.html`.

Catatan **[Belum diverifikasi, cek ketentuan GitHub saat ini]**: GitHub Pages untuk repository privat biasanya membutuhkan paket berbayar; repository publik gratis.

## 3. Pilihan B, GitHub Pages dengan GitHub Actions (usulan)

> **Usulan, bukan file yang ada di repository, belum dijalankan.** Simpan sebagai `.github/workflows/pages.yml`. Periksa versi *action* terbaru di dokumentasi GitHub.

```yaml
name: Deploy NataData ke GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .          # ganti ke "src" bila aset web ada di folder src/
      - id: deployment
        uses: actions/deploy-pages@v4
```

Agar workflow ini bekerja, **Settings → Pages → Source** harus diset ke **GitHub Actions**.

| Bagian | Fungsi |
|---|---|
| `on.push.branches: [main]` | Pemicu: setiap push ke `main` |
| `on.workflow_dispatch` | Pemicu manual dari tab Actions |
| `permissions.pages: write` | Izin menerbitkan ke Pages |
| `permissions.id-token: write` | Izin token OIDC yang dibutuhkan `deploy-pages` |
| `configure-pages` | Memeriksa/menyiapkan konfigurasi Pages |
| `upload-pages-artifact` | Mengemas folder statis |
| `deploy-pages` | Menerbitkan hasil kemasan |

Jika `path: .`, seluruh isi repository (termasuk `docs/`, bila ada) ikut dipublikasikan. Gunakan `path: src` bila ingin hanya aset web.

## 4. Menjalankan deployment

- **Pilihan A:** otomatis setiap push ke `main` (dikelola GitHub).
- **Pilihan B:** push ke `main`, atau tab **Actions** → pilih workflow → **Run workflow**.

## 5. Memeriksa status dan mendapatkan URL

1. Tab **Actions**: cek status run (hijau = sukses, merah = gagal; klik run untuk log).
2. **Settings → Pages**: URL situs ditampilkan di bagian atas bila sudah terbit.
3. Pada Pilihan B, URL juga muncul pada langkah *deploy* di log run.
4. Buka URL, tekan Ctrl+F5, lalu cek DevTools → Console/Network bila tampilan tidak lengkap.

## 6. Perlu diketahui tentang data pada versi web

Data `localStorage` terikat pada alamat situs. Pengguna yang membuka NataData dari URL Pages akan memiliki data **terpisah** dari yang membuka file langsung atau aplikasi Tauri. Dan **siapa pun yang tahu URL dapat membuka aplikasinya** (tetapi mereka hanya melihat data di browser mereka sendiri, bukan data toko Anda).

## 7. Rilis aplikasi desktop

Pembuatan installer dibahas di [TAURI_BUILD.md](TAURI_BUILD.md), termasuk usulan workflow `workflow_dispatch` yang menghasilkan artefak. Belum ada workflow rilis di repository.

## 8. Pemecahan masalah deployment

Lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md), terutama bagian "Get Pages site failed", workflow tidak muncul, dan situs 404.

Daftar periksa cepat:

| Periksa | Benar jika |
|---|---|
| Pages aktif | Settings → Pages menampilkan Source terpilih |
| Source sesuai metode | Workflow memakai Source = GitHub Actions; tanpa workflow memakai Deploy from a branch |
| Lokasi workflow | `.github/workflows/*.yml` di akar repo |
| Izin | `pages: write` dan `id-token: write` ada pada workflow |
| Pengaturan Actions | Settings → Actions → General mengizinkan workflow berjalan |
| `index.html` | Ada di akar (atau folder yang dipublikasikan) |
