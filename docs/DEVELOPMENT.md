# Panduan Pengembangan NataData

Untuk pengembang yang ingin menjalankan dan memodifikasi NataData.

## 1. Perangkat yang dibutuhkan

| Perangkat | Wajib? | Keterangan |
|---|---|---|
| Browser modern | Ya | Chrome / Edge / Firefox / Safari |
| Editor teks | Ya | Misalnya VS Code |
| Git | Untuk berbagi kode | [git-scm.com](https://git-scm.com) |
| Internet | Ya | Tailwind, Lucide, Chart.js, dan font dimuat dari CDN |
| Python 3 atau Node.js | Opsional | Hanya untuk server lokal atau pemeriksaan sintaks |

**Versi Node.js dan npm:** repository ini **tidak memiliki `package.json`**, jadi tidak ada versi yang diwajibkan dan tidak ada perintah `npm install`. Versi Node baru relevan jika kelak Anda menambahkan Capacitor (lihat [ANDROID_BUILD.md](ANDROID_BUILD.md)).

## 2. Mengambil kode

```bash
git clone https://github.com/FarrelPtrv/NataData---Inventaris.git
cd NataData---Inventaris
```

## 3. Memasang dependensi

Tidak ada langkah ini. Semua pustaka dimuat dari CDN saat halaman dibuka.

## 4. Menjalankan aplikasi

**Cara 1:** klik dua kali `index.html`.

**Cara 2 (disarankan):** server statis lokal, agar perilakunya mirip hosting sebenarnya.

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Tidak ada perintah `npm start` atau `npm run build` karena tidak ada `package.json`.

## 5. Mengubah kode

Seluruh aplikasi ada di `index.html`. Lihat peta fungsi di [ARCHITECTURE.md](ARCHITECTURE.md#3-peta-fungsi).

Pola yang dipakai di kode ini:

1. Fungsi `handle...` membaca form, memvalidasi, mengubah `items` / `transactions`.
2. Memanggil `saveDataToStorage()`.
3. Memanggil fungsi render: `updateDashboard()`, `renderStokList()`, `populateSelectOptions()`, `renderTransactionHistory()`, `renderNotifications()`, `updateCharts()`.

Jika Anda menambah jenis perubahan data, ingat memanggil seluruh fungsi di langkah 3, atau tampilan akan tidak konsisten.

**Catatan nama lama:** kunci `localStorage` berawalan `stokin_`. Jangan diganti tanpa migrasi data, karena data pengguna yang sudah ada akan tampak hilang.

## 6. Menguji perubahan

Belum ada pengujian otomatis. Gunakan daftar periksa manual ini.

| # | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Masuk dengan ID baru | 4 produk dan 3 transaksi contoh muncul |
| 2 | Jual produk dengan `qty` ≤ stok | Stok turun, transaksi muncul, dashboard berubah |
| 3 | Jual dengan `qty` > stok | Toast error, tidak ada perubahan |
| 4 | Barang masuk dengan nama yang sudah ada | Stok bertambah, tidak ada produk ganda |
| 5 | Penyesuaian stok | Stok turun, transaksi bertipe Pengurangan |
| 6 | Stok ≤ minimum | Lencana, banner, dan daftar notifikasi muncul |
| 7 | Muat ulang halaman | Data tetap ada, masuk otomatis |
| 8 | Keluar lalu masuk lagi tanpa memuat ulang halaman | Periksa Console. Ada dugaan error grafik (lihat [AUDIT.md](AUDIT.md), temuan T-03) |
| 9 | Reset data (layar lebar) | Kembali ke data contoh |
| 10 | Ukuran layar HP dan laptop | Sidebar vs bottom nav tampil benar |

## 7. Memeriksa kesalahan JavaScript

**Di browser:** buka Developer Tools (F12), tab **Console** untuk error, tab **Application → Local Storage** untuk melihat data (kunci `stokin_...`).

**Memeriksa sintaks tanpa browser** (butuh Python 3 dan Node.js). Ini yang dipakai saat audit, dan hasilnya valid:

```bash
python3 - <<'EOF'
import re
s = open('index.html', encoding='utf-8').read()
open('/tmp/inline.js', 'w').write(re.findall(r'<script>(.*?)</script>', s, re.S)[0])
EOF
node --check /tmp/inline.js && echo "Sintaks OK"
```

Ini hanya memeriksa sintaks, **bukan** perilaku aplikasi.

**Menghapus data uji:** di Console jalankan `localStorage.clear()` lalu muat ulang. Ini menghapus semua data situs tersebut.

## 8. Masalah umum

Lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## 9. Mengunggah (push) ke GitHub

Repository `FarrelPtrv/NataData---Inventaris` pernah terlihat kosong. Langkah berikut untuk push pertama dari komputer Anda.

**a. Siapkan identitas dan login (sekali saja)**

```bash
git config --global user.name "Nama Anda"
git config --global user.email "email-akun-github@contoh.com"
```

Login GitHub lewat GitHub Desktop atau `gh auth login` (GitHub CLI). **Jangan menempelkan token atau kata sandi ke dokumen, chat, atau kode.**

**b. Susun folder proyek** agar berisi: `index.html`, `logo.jpeg` (jika ada), `README.md`, `.gitignore`, folder `docs/`, dan folder `.github/workflows/`.

> Folder berawalan titik (`.github`) sering tidak terunggah jika Anda memakai tombol *Upload files* di web GitHub. Gunakan Git dari terminal.

**c. Push**

```bash
cd folder-proyek-anda
git init
git add .
git status                # pastikan .github/workflows/pages.yml ikut terdaftar
git commit -m "Tambah NataData dan dokumentasi"
git branch -M main
git remote add origin https://github.com/FarrelPtrv/NataData---Inventaris.git
git push -u origin main
```

**d. Jika ingin ditinjau dulu lewat branch dan Pull Request**

```bash
git checkout -b docs/natadata-documentation
git push -u origin docs/natadata-documentation
```

Lalu buka GitHub dan buat Pull Request ke `main`.

**e. Jika push ditolak (`rejected`)** karena repository sudah berisi file lain:

```bash
git pull --rebase origin main
git push -u origin main
```

## 10. Konvensi yang disarankan

- Tulis teks antarmuka dalam bahasa Indonesia, sesuai yang sudah ada.
- Jangan mengganti nama variabel atau kunci penyimpanan hanya karena perubahan merek.
- Setiap perubahan perilaku: perbarui [USER_GUIDE.md](USER_GUIDE.md) dan [ARCHITECTURE.md](ARCHITECTURE.md).
