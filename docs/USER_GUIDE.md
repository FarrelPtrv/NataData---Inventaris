# Panduan Pengguna NataData

Panduan ini untuk pemilik usaha dan pengguna non-teknis. Isinya hanya fitur yang benar-benar ada di aplikasi.

> ## Baca dulu: di mana data Anda disimpan
>
> Data NataData disimpan **di browser perangkat yang Anda pakai**, bukan di internet.
>
> - Data di HP tidak muncul di laptop, dan sebaliknya.
> - Jika Anda **menghapus data browser / cache / data situs**, atau memakai **mode penyamaran (incognito)**, data bisa **hilang dan tidak bisa dikembalikan**.
> - Aplikasi **belum punya fitur cadangan atau ekspor**. Sebagai pengaman sementara, catat angka penting (stok, omset) di buku atau tangkapan layar secara berkala.
> - **PIN belum berfungsi sebagai pengaman.** Jangan anggap data Anda terkunci.

## Daftar Isi

1. [Masuk ke toko](#1-masuk-ke-toko)
2. [Mengenal tampilan](#2-mengenal-tampilan)
3. [Dashboard](#3-dashboard)
4. [Mengelola daftar stok](#4-mengelola-daftar-stok)
5. [Menambah barang masuk](#5-menambah-barang-masuk)
6. [Mencatat penjualan](#6-mencatat-penjualan)
7. [Mengurangi atau menyesuaikan stok](#7-mengurangi-atau-menyesuaikan-stok)
8. [Riwayat transaksi](#8-riwayat-transaksi)
9. [Memahami laporan](#9-memahami-laporan)
10. [Notifikasi stok menipis](#10-notifikasi-stok-menipis)
11. [Mengubah nama toko dan logo](#11-mengubah-nama-toko-dan-logo)
12. [Reset data demo](#12-reset-data-demo)
13. [Keluar dari toko](#13-keluar-dari-toko)
14. [Contoh alur kerja harian](#14-contoh-alur-kerja-harian)

## 1. Masuk ke toko

1. Buka NataData.
2. Isi **ID Toko / Username**, misalnya `toko_berkah`. Huruf besar diubah menjadi kecil, dan hanya huruf, angka, serta garis bawah (`_`) yang dipakai. Spasi dan tanda baca dibuang.
3. Isi **Nama Toko** (nama yang tampil di layar).
4. Isi **PIN 4 digit**. Saat ini PIN hanya diminta, **tidak disimpan dan tidak diperiksa**.
5. Tekan **Buka Sesi Toko Saya**.

Catatan penting:

- Pada masuk pertama dengan ID Toko baru, aplikasi mengisi **4 produk dan 3 transaksi contoh**. Hapus atau ganti dengan data asli Anda.
- Memakai ID Toko yang **sama** di browser yang sama akan membuka data yang sama. Memakai ID berbeda membuka toko terpisah.
- Selama Anda belum menekan keluar, membuka ulang aplikasi akan langsung masuk ke toko terakhir.

## 2. Mengenal tampilan

| Menu | Di layar lebar (laptop) | Di HP (bar bawah) |
|---|---|---|
| Ringkasan | Beranda / Dashboard | Beranda |
| Daftar produk | Daftar Stok Barang | Stok |
| Catat transaksi | Transaksi & Stok | Transaksi |
| Grafik dan angka | Laporan Analisis | Laporan |
| Peringatan | Notifikasi | Notif (ikon lonceng di atas) |

Pada layar lebar, tombol **Reset Data Demo** dan **Keluar Toko** ada di bagian bawah sidebar kiri. Pada HP, tombol keluar ada di ikon di pojok kanan atas, dan **tombol reset tidak tersedia**.

## 3. Dashboard

Menampilkan:

- **Total Master Produk:** jumlah jenis produk.
- **Stok Menipis:** jumlah produk yang stoknya sudah sama dengan atau di bawah batas minimum.
- **Penjualan (Hari Ini):** total omset dan jumlah transaksi penjualan hari ini.
- **Laba Bersih (Hari Ini):** jumlah laba dari penjualan hari ini (selisih harga jual dan harga beli).
- **Peringatan Stok Menipis:** banner kuning berisi nama produk yang perlu dibeli lagi (muncul jika ada).
- **Aksi Cepat:** pintasan ke Input Barang Masuk, Catat Penjualan, dan Lihat Laporan.
- **Aktivitas Transaksi Terbaru:** 4 transaksi terakhir.

## 4. Mengelola daftar stok

Buka **Daftar Stok Barang** (atau **Stok** di HP).

**Mencari:** ketik di kolom pencarian (nama, SKU, atau kategori).

**Memfilter:** tekan salah satu tombol kategori: Semua, Makanan, Minuman, Sembako, Lainnya.

**Membaca kartu produk:** menampilkan kategori, SKU, nama, harga modal, harga jual, dan sisa stok. Produk dengan stok menipis diberi label merah **Menipis**.

**Mengubah produk:**

1. Tekan ikon pensil pada produk.
2. Ubah nama, SKU, kategori, satuan, harga beli, harga jual, jumlah stok, atau minimum stok alert.
3. Tekan **Simpan Perubahan**.

**Menghapus produk:**

1. Tekan ikon tempat sampah.
2. Baca pesan konfirmasi, lalu tekan **Ya, Lanjutkan**.

> **Peringatan:** produk yang dihapus **hilang permanen**. Riwayat transaksi lama tetap ada dan tetap menyebut nama produknya.

## 5. Menambah barang masuk

Dipakai saat Anda **membeli barang dari supplier**, baik produk baru maupun menambah stok produk lama.

1. Buka **Transaksi & Stok**, lalu tab **Barang Masuk** (atau tekan **Input Barang Masuk** di dashboard).
2. Isi:
   - **Nama Barang** (wajib)
   - **SKU / Kode Unik** (terisi otomatis, boleh diganti)
   - **Kategori**
   - **Satuan** (wajib), contoh: Pcs, Bks
   - **Harga Beli/Modal** (wajib) dan **Harga Jual** (wajib)
   - **Jml Masuk** (wajib, minimal 1)
   - **Min. Alert** (batas stok menipis)
   - **Catatan / Supplier** (opsional)
3. Tekan **Simpan Stok**.

Yang terjadi:

- Jika **nama barang sama** (huruf besar/kecil tidak dibedakan) **atau SKU sama** dengan produk yang ada, stok produk itu **bertambah**, dan harga beli serta harga jual diperbarui. Kategori, satuan, dan minimum alert **tidak berubah**.
- Jika tidak ada yang sama, produk **baru** dibuat.
- Satu transaksi *Barang Masuk* tercatat. Nilainya (harga beli × jumlah) dihitung sebagai **modal keluar** di Laporan.

Tombol **Batal** atau **Kembali** mengosongkan form dan membawa Anda ke daftar stok.

## 6. Mencatat penjualan

1. Buka **Transaksi & Stok**, lalu tab **Penjualan Produk**.
2. Pilih produk pada **Pilih Produk Terdaftar**. Sisa stok dan harga jual tampil di pilihan.
3. Isi **Jumlah Terjual**.
4. **Total Omset** dan **Estimasi Laba Kotor** terisi otomatis.
5. Tekan **Simpan Transaksi Penjualan**.

Yang terjadi: stok berkurang, penjualan masuk riwayat, dashboard dan laporan ikut berubah. Jika jumlah melebihi stok, muncul pesan **Stok tidak mencukupi** dan transaksi tidak disimpan.

> Harga jual diambil dari data produk. Tidak ada kolom untuk memberi diskon atau mengubah harga per transaksi. Jika perlu harga lain, ubah dulu harga jual produk di daftar stok.

## 7. Mengurangi atau menyesuaikan stok

Dipakai saat stok berkurang **bukan karena penjualan**: barang rusak, dipakai sendiri, hilang, atau selisih saat hitung ulang.

1. Buka **Transaksi & Stok**, lalu tab **Penyesuaian Stok**.
2. Pilih produk dan isi **Jumlah Pengurangan Stok**.
3. Pilih **Alasan Penyesuaian**: Barang Rusak/Kadaluarsa, Pemakaian Sendiri, Barang Hilang / Rusak Saat Pengiriman, Koreksi Selisih Stok Audit, atau **Lainnya** (lalu ketik alasan sendiri).
4. Tekan **Simpan Pengurangan Stok**.

> Fitur ini **hanya bisa mengurangi** stok. Untuk menambah stok, gunakan **Barang Masuk**, atau ubah jumlah stok lewat ikon pensil di daftar stok (perubahan lewat cara ini **tidak tercatat** di riwayat).

Penyesuaian tidak dihitung sebagai penjualan maupun modal di laporan.

## 8. Riwayat transaksi

Ada di bagian bawah halaman **Transaksi & Stok**, berisi semua transaksi dengan yang terbaru di atas.

| Label | Arti | Angka di kanan |
|---|---|---|
| **Penjualan** (hijau) | Barang terjual | `+` nilai penjualan |
| **Barang Masuk** (biru) | Pembelian stok | `-` nilai modal |
| **Pengurangan** (merah) | Penyesuaian stok | tidak ada nilai |

Catatan: kolom jumlah selalu bertuliskan **"Pcs"** walaupun satuan produknya lain (misalnya Karung atau Bks). Keterangan waktu selalu tertulis **"Hari Ini, jam:menit"** walau transaksinya sudah beberapa hari lalu. Tidak ada cara mengubah atau menghapus transaksi.

## 9. Memahami laporan

Buka **Laporan Analisis**.

| Angka | Arti |
|---|---|
| **Saldo Kas Bersih (Omset − Modal Keluar)** | Seluruh omset penjualan dikurangi seluruh modal barang masuk, dari awal pemakaian |
| **Total Omset Penjualan** | Jumlah semua penjualan |
| **Total Modal Keluar (Restock)** | Jumlah semua nilai barang masuk |
| **Produk Terlaris** | Produk dengan jumlah terjual terbanyak |
| **Grafik Penjualan 7 Hari Terakhir** | Omset harian 7 hari terakhir |
| **Komposisi Stok Per Kategori** | Perbandingan jumlah stok (unit) tiap kategori |

**Penting:** *Saldo Kas Bersih* **bukan** sama dengan laba. Jika Anda baru membeli banyak stok, angkanya bisa negatif (tampil dengan tanda minus) walaupun penjualan bagus, karena stok yang belum terjual sudah dihitung sebagai uang keluar. Untuk melihat laba dari barang yang terjual, lihat **Laba Bersih (Hari Ini)** di Dashboard.

## 10. Notifikasi stok menipis

Sebuah produk dianggap **menipis** jika `stok ≤ minimum stok alert`. Pemberitahuan muncul di:

- Lencana merah pada menu Notifikasi,
- Banner di Dashboard,
- Halaman **Notifikasi** (dengan tombol **Restock** yang membuka form Barang Masuk).

Tombol **Bersihkan** hanya mengosongkan tampilan daftar untuk sementara. Daftar muncul lagi saat ada perubahan data atau aplikasi dibuka ulang, dan lencana tidak ikut hilang.

Anda bisa mengatur batas per produk lewat **Min. Alert** (saat barang masuk) atau **Minimum Stok Alert** (saat edit produk).

## 11. Mengubah nama toko dan logo

1. Tekan ikon pensil di kartu toko (sidebar), ikon toko di bagian atas (HP), atau ikon pensil di banner Dashboard.
2. Ubah **Nama Toko / Usaha UMKM**.
3. Opsional: isi **Link URL Logo** dengan alamat gambar di internet (contoh: `https://contoh.com/gambar.png`). Kosongkan untuk memakai logo bawaan.
4. Tekan **Simpan**.

ID Toko **tidak bisa** diubah dari sini. Mengubahnya sama dengan membuat toko baru yang datanya kosong.

## 12. Reset data demo

Hanya tersedia di tampilan layar lebar: tombol **Reset Data Demo** di sidebar.

> ## ⚠️ Peringatan: tindakan ini menghapus data
>
> Reset **mengganti seluruh produk dan seluruh transaksi** toko yang sedang aktif dengan data contoh, dan mengembalikan nama toko ke nama bawaan (*Toko Berkah Utama*). **Data asli Anda hilang dan tidak bisa dikembalikan.**
>
> Gunakan hanya untuk mencoba aplikasi, jangan pada toko yang sudah berisi data nyata.

Langkah: tekan **Reset Data Demo**, baca pesan, lalu **Ya, Lanjutkan** (atau **Batal**).

## 13. Keluar dari toko

Tekan **Keluar Toko** (sidebar) atau ikon keluar (HP), lalu **Ya, Lanjutkan**. Data **tidak dihapus**. Anda hanya kembali ke layar masuk. Masuk lagi dengan ID Toko yang sama akan membuka data yang sama.

## 14. Contoh alur kerja harian

**Pagi**
1. Buka NataData lalu lihat Dashboard. Periksa banner **Stok Menipis**.
2. Jika ada barang tiba dari supplier, catat lewat **Barang Masuk**.

**Siang dan sore**
3. Setiap ada penjualan, catat lewat **Penjualan Produk**. Boleh dikumpulkan lalu dicatat sekaligus, asalkan dilakukan di hari yang sama agar grafik harian benar.

**Malam**
4. Cek **Dashboard** untuk omset dan laba hari ini.
5. Jika ada barang rusak atau dipakai sendiri, catat lewat **Penyesuaian Stok**.
6. Cocokkan stok di aplikasi dengan stok di rak untuk beberapa barang. Jika selisih, catat lewat **Koreksi Selisih Stok Audit**.
7. Catat angka penting di buku sebagai cadangan.
