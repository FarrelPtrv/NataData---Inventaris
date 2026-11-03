# Panduan Pengguna NataData

Panduan ini untuk pemilik UMKM dan pengguna non-teknis. Isinya hanya fitur yang benar-benar ada di aplikasi.

> **Penting dipahami sebelum mulai**
> - Data toko disimpan **di browser/aplikasi pada perangkat yang Anda pakai**. Data tidak otomatis muncul di HP lain atau komputer lain.
> - Jika data browser dihapus, data NataData ikut hilang. **Belum ada fitur cadangan/ekspor.**
> - Aplikasi membutuhkan **koneksi internet** agar tampilan dan grafik termuat.

## 1. Pertama kali memakai

1. Buka NataData. Muncul layar **Buat Profil Toko**.
2. Isi **Nama Toko Anda**.
3. Buat **PIN Keamanan 6 angka**, lalu ketik ulang di **Konfirmasi PIN**.
4. Tekan tombol pendaftaran. Aplikasi langsung terbuka.

Catatan: PIN harus tepat 6 angka dan kedua isian harus sama. **Catat PIN Anda.** Tidak ada fitur "lupa PIN" (lihat bagian 10).

## 2. Masuk dan keluar

- **Keluar:** tekan **Keluar Toko** (sidebar di komputer, ikon keluar di bagian atas pada HP), lalu konfirmasi. Data **tidak dihapus**, hanya sesi dikunci.
- **Masuk lagi:** ketik PIN 6 angka, tekan **Buka Toko Saya**.

## 3. Dashboard

Menampilkan ringkasan toko:

| Informasi | Arti |
|---|---|
| Total Master Produk | Jumlah jenis barang yang terdaftar |
| Stok Menipis | Jumlah barang yang stoknya sama dengan atau di bawah batas minimum |
| Penjualan (Hari Ini) | Total uang penjualan hari ini dan jumlah transaksinya |
| Estimasi Laba Kotor | Total margin dari **seluruh** penjualan sejak awal (bukan hanya hari ini) |

Juga ada:
- **Banner "Peringatan Stok Menipis"** bila ada barang yang perlu restock.
- **Aksi Cepat:** pintasan ke Barang Masuk, Penjualan, dan Laporan.
- **Aktivitas Transaksi Terbaru:** 4 transaksi terakhir.

## 4. Mengelola daftar stok (menu Stok)

Setiap barang tampil sebagai kartu berisi kategori, SKU, harga modal, harga jual, dan **Sisa Stok**.

- **Mencari:** ketik nama, kategori, atau SKU di kolom pencarian.
- **Menyaring:** pilih Semua, Makanan, Minuman, Sembako, atau Lainnya.
- **Mengubah barang:** tekan ikon pensil, ubah isian (nama, SKU, kategori, satuan, harga beli, harga jual, stok, minimum stok), lalu simpan.
- **Menghapus barang:** tekan ikon tempat sampah, lalu konfirmasi.

> ⚠️ **Hapus barang bersifat permanen** dan tidak bisa dibatalkan. Riwayat transaksi lama tetap tersimpan.
>
> ⚠️ **Mengubah angka "Jumlah Stok Saat Ini" lewat Edit tidak tercatat di riwayat transaksi.** Untuk koreksi stok yang tercatat, gunakan **Pengurangan** (bagian 7) atau **Barang Masuk** (bagian 5).

Aturan isian: angka tidak boleh negatif; minimum stok minimal 1.

## 5. Menambahkan barang masuk (menu Transaksi, tab Barang Masuk)

Dipakai untuk **barang baru** maupun **menambah stok** barang lama.

1. Buka **Transaksi**, pilih tab **Barang Masuk**.
2. Isi **Nama Barang** (wajib), SKU (terisi otomatis, boleh diubah), kategori, **Satuan** (wajib; bila kosong dianggap "Pcs"), **Harga Beli/Modal** (wajib, lebih dari 0), **Harga Jual**, **Jml Masuk** (wajib), **Min. Alert**, dan catatan/supplier (opsional).
3. Simpan.

Yang terjadi:
- Jika **nama atau SKU sama** dengan barang yang sudah ada, stok **ditambah** dan **harga beli serta harga jual diganti** dengan angka yang baru Anda isi. Kategori, satuan, dan minimum stok barang lama tidak berubah.
- Jika belum ada, barang baru dibuat.
- Tercatat satu transaksi "Barang Masuk" senilai harga beli × jumlah (dihitung sebagai modal keluar di laporan).

Tombol batal akan mengosongkan form dan kembali ke menu Stok.

## 6. Mencatat penjualan (tab Penjualan Produk)

1. Pilih **Produk Terdaftar** (daftar menampilkan sisa stok dan harga jual).
2. Isi **Jumlah Terjual**.
3. **Total Omset** dan estimasi laba terhitung otomatis.
4. Simpan.

Jika jumlah melebihi stok, aplikasi menolak dan menampilkan sisa stok. Setelah berhasil, stok berkurang otomatis dan transaksi masuk riwayat.

## 7. Mengurangi atau menyesuaikan stok (tab Penyesuaian Stok)

Untuk barang yang berkurang **bukan karena dijual**.

1. Pilih produk dan isi **Jumlah Pengurangan Stok**.
2. Pilih **Alasan**: Barang Rusak/Kadaluarsa, Pemakaian Sendiri, Barang Hilang/Rusak saat Pengiriman, Koreksi Selisih Stok Audit, atau **Lainnya** (lalu ketik alasan sendiri).
3. Simpan.

Pengurangan tidak mengubah omset maupun laba, dan tidak boleh melebihi stok.

> Tab ini hanya untuk pengurangan. Jika stok kurang dari kenyataan, tambah lewat **Barang Masuk**.

## 8. Riwayat transaksi

Daftar seluruh aktivitas (penjualan, barang masuk, pengurangan) ada di bagian bawah menu **Transaksi**, terbaru di atas. Setiap baris menampilkan nama barang, jenis, tanggal-jam, catatan/alasan, jumlah, dan nilai uang. Belum ada filter tanggal atau pencarian; riwayat yang panjang akan menjadi daftar panjang.

## 9. Laporan, notifikasi, nama toko

**Laporan** menampilkan:
- Total Omset Penjualan, Total Laba Kotor, dan Total Modal Keluar (Restock).
- **Arus Kas Bersih** = omset dikurangi total modal barang masuk. Ini hitungan **sederhana**: tidak memuat biaya lain, dan modal barang yang belum terjual ikut mengurangi.
- Produk terlaris (berdasarkan jumlah terjual).
- Grafik penjualan 7 hari terakhir dan komposisi stok per kategori (jumlah unit).

**Notifikasi** menampilkan barang dengan stok ≤ minimum, dengan tombol **Restock** menuju form Barang Masuk. Angka merah di menu menunjukkan jumlahnya.

**Mengubah nama toko dan logo:** tekan ikon pensil di dekat nama toko, ubah nama, dan (opsional) isi **Link URL Logo** berupa alamat gambar. Kosongkan untuk memakai logo bawaan. Belum ada unggah file logo.

## 10. Reset data dan lupa PIN

**Reset Data Toko** ada di sidebar tampilan komputer/layar lebar, setelah login.

> 🛑 **BERBAHAYA:** reset menghapus **semuanya**: produk, seluruh transaksi, nama toko, logo, **dan PIN**. Aplikasi kembali ke layar pendaftaran awal. **Tidak bisa dibatalkan.** Tidak ada data contoh/demo yang diisi ulang. Teks konfirmasinya hanya menyebut produk dan transaksi, padahal PIN dan profil juga ikut terhapus.

Tombol Reset tidak terlihat pada tampilan HP yang sempit.

**Lupa PIN:** tidak ada fitur pemulihan, dan tombol Reset hanya bisa dicapai setelah login. Satu-satunya jalan yang diketahui adalah menghapus data situs/aplikasi lewat pengaturan browser, yang **menghapus semua data toko**. Karena itu catat PIN di tempat aman.

## 11. Contoh alur kerja harian

**Pagi:** masuk dengan PIN → lihat Dashboard dan Notifikasi → barang menipis? Tekan **Restock**.
**Barang datang dari supplier:** Transaksi → Barang Masuk → isi nama, harga beli/jual, jumlah.
**Saat ada pembeli:** Transaksi → Penjualan Produk → pilih produk → isi jumlah → simpan.
**Barang rusak/kadaluarsa:** Transaksi → Penyesuaian Stok → pilih alasan.
**Malam:** buka Laporan, lihat omset dan produk terlaris, lalu **Keluar Toko**.

## 12. Tips agar data aman

- Pakai **satu perangkat dan satu browser** yang sama setiap hari. Browser berbeda = data berbeda.
- Jangan memakai mode penyamaran/private dan jangan menghapus "data situs".
- Catat PIN. Bila perlu, foto/catat ringkasan laporan secara berkala sebagai cadangan manual karena belum ada ekspor.
