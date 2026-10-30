# Membangun NataData Desktop dengan Tauri 2, Rust, dan SQLite

Panduan langkah demi langkah untuk mengubah NataData dari satu file web (`localStorage`) menjadi **aplikasi desktop** dengan **Tauri 2**, logika bisnis di **Rust**, dan database **SQLite lokal**.

> ## Status dokumen
>
> - Langkah scaffolding dan konsep mengikuti dokumentasi resmi Tauri 2 (v2.tauri.app) pada saat penulisan.
> - **Kode Rust dan JavaScript di bawah belum dikompilasi atau dijalankan** oleh penulis (lingkungan penulis tidak punya akses jaringan untuk mengunduh crate). Anggap sebagai titik awal yang harus Anda uji. Jika kompilasi gagal, kirim pesan errornya.
> - Nomor versi sengaja tidak dikunci di sini. Gunakan versi stabil terbaru dan **kunci versinya di `Cargo.lock` dan `package-lock.json`** setelah berhasil.

## 0. Keputusan dan asumsi

| Hal | Keputusan | Alasan |
|---|---|---|
| "SQLite versi 2" | Dipahami sebagai **Tauri v2 + SQLite**. SQLite sendiri versi mayor **3** (tidak ada SQLite 2 yang masih dipakai) | Jika yang Anda maksud lain, sesuaikan |
| Akses database | **Rust memegang database** lewat crate `rusqlite` (SQLite dibundel). Frontend hanya memanggil *command* Rust | Sesuai permintaan "Rust untuk backend". Aturan stok dan transaksi atomik tidak bisa dilewati oleh JavaScript |
| Alternatif | Plugin resmi `tauri-plugin-sql` (berbasis sqlx) memberi frontend akses SQL langsung dari JavaScript. Lebih cepat dibuat, tetapi logika bisnis ada di JS | Tidak dipakai di panduan ini |
| Frontend | Tetap HTML/CSS/JS vanilla, memakai UI `index.html` yang ada | Perubahan minimal |
| Jumlah toko | **Satu toko per instalasi** (tanpa ID Toko dan PIN) | PIN lokal tidak memberi keamanan nyata (lihat [AUDIT.md](AUDIT.md), K-01) |
| Uang | **Bilangan bulat rupiah** (`INTEGER`) | Menghindari galat pecahan desimal |
| Perbaikan sekaligus | Transaksi menyimpan `product_id` dan salinan nama/satuan, stok hanya berubah lewat transaksi, waktu tersimpan lengkap | Menyelesaikan M-02, M-03, M-05, M-06 di [AUDIT.md](AUDIT.md) |

Letakkan proyek Tauri di **folder atau branch terpisah** (misalnya `desktop/`) agar versi web yang sekarang tidak rusak.

## 1. Prasyarat

Ikuti halaman resmi: <https://v2.tauri.app/start/prerequisites/>. Ringkasnya:

| OS | Yang dibutuhkan |
|---|---|
| Windows | Microsoft C++ Build Tools (beban kerja *Desktop development with C++*), WebView2 (umumnya sudah ada di Windows 10/11 terbaru), Rust |
| macOS | Xcode Command Line Tools (`xcode-select --install`) untuk desktop saja, Rust |
| Linux | Paket pengembangan WebKitGTK dan pustaka pendukung sesuai distribusi (lihat halaman resmi), Rust |
| Semua | **Rust** lewat `rustup` (rustup.rs), **Node.js LTS** (untuk CLI dan template) |

Periksa:

```bash
rustc --version
cargo --version
node --version
npm --version
```

## 2. Membuat proyek

```bash
mkdir desktop && cd desktop
npm create tauri-app@latest
```

Jawab pertanyaan interaktif:

| Pertanyaan | Isian |
|---|---|
| Project name | `natadata` |
| Identifier | Misalnya `id.contoh.natadata`. **Putuskan sekarang**: identifier menentukan folder data aplikasi, dan mengubahnya kelak membuat data lama tidak ditemukan |
| Frontend language / template | **Vanilla** dengan **JavaScript** (nama pilihan bisa sedikit berbeda antarversi) |

Lalu:

```bash
cd natadata
npm install
npm run tauri dev
```

Jendela aplikasi contoh akan terbuka (kompilasi pertama bisa beberapa menit). Jika sudah tampil, fondasinya benar.

Struktur hasilnya (kira-kira):

```text
natadata/
├── package.json
├── src/                    # frontend (index.html, main.js, styles.css)
└── src-tauri/
    ├── Cargo.toml
    ├── tauri.conf.json     # konfigurasi aplikasi
    ├── capabilities/       # izin API (Tauri 2)
    └── src/
        ├── main.rs
        └── lib.rs          # titik masuk Rust
```

## 3. Menambah dependensi Rust

```bash
cd src-tauri
cargo add rusqlite --features bundled
cargo add serde --features derive
cargo add serde_json
```

`bundled` membuat SQLite ikut dikompilasi ke dalam aplikasi, jadi pengguna tidak perlu memasang SQLite. Kompilasinya butuh *C compiler* (sudah termasuk di prasyarat).

## 4. Skema database dan migrasi

Buat folder dan file `src-tauri/migrations/001_init.sql`:

```sql
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE products (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  sku        TEXT UNIQUE,
  name       TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'Lainnya',
  unit       TEXT NOT NULL DEFAULT 'Pcs',
  buy_price  INTEGER NOT NULL DEFAULT 0 CHECK (buy_price  >= 0),
  sell_price INTEGER NOT NULL DEFAULT 0 CHECK (sell_price >= 0),
  stock      INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_stock  INTEGER NOT NULL DEFAULT 5 CHECK (min_stock >= 1),
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE transactions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  kind         TEXT NOT NULL CHECK (kind IN ('sale','stock_in','adjustment')),
  product_id   INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,   -- salinan nama saat transaksi
  unit         TEXT NOT NULL,   -- salinan satuan saat transaksi
  qty          INTEGER NOT NULL CHECK (qty > 0),
  total        INTEGER NOT NULL DEFAULT 0,  -- sale: omset, stock_in: modal keluar
  profit       INTEGER NOT NULL DEFAULT 0,  -- hanya untuk sale
  note         TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX idx_tx_created ON transactions(created_at);
CREATE INDEX idx_tx_kind    ON transactions(kind);
```

Pemetaan dari versi web:

| Web (`localStorage`) | SQLite |
|---|---|
| `items[]` | tabel `products` |
| `transactions[]` (`penjualan`/`masuk`/`keluar`) | tabel `transactions` (`sale`/`stock_in`/`adjustment`) |
| `storeName`, `storeLogo` | tabel `settings` (kunci `store_name`, `store_logo`) |
| `stokin_active_session` | tidak diperlukan |

Penghapusan produk **tidak** menghapus riwayat: `product_id` menjadi `NULL`, nama tetap ada di `product_name`.

## 5. Kode Rust

### 5.1 `src-tauri/src/db.rs`

```rust
use rusqlite::Connection;
use std::path::Path;

// Tambahkan file migrasi baru di akhir daftar. JANGAN mengubah yang sudah dirilis.
const MIGRATIONS: &[&str] = &[include_str!("../migrations/001_init.sql")];

pub fn open(path: &Path) -> rusqlite::Result<Connection> {
    let mut conn = Connection::open(path)?;
    conn.execute_batch("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;")?;
    migrate(&mut conn)?;
    Ok(conn)
}

#[cfg(test)]
pub fn open_memory() -> rusqlite::Result<Connection> {
    let mut conn = Connection::open_in_memory()?;
    conn.execute_batch("PRAGMA foreign_keys = ON;")?;
    migrate(&mut conn)?;
    Ok(conn)
}

fn migrate(conn: &mut Connection) -> rusqlite::Result<()> {
    let current: i64 = conn.query_row("PRAGMA user_version", [], |r| r.get(0))?;
    for (i, sql) in MIGRATIONS.iter().enumerate() {
        let target = (i + 1) as i64;
        if current < target {
            let tx = conn.transaction()?;
            tx.execute_batch(sql)?;
            tx.pragma_update(None, "user_version", target)?;
            tx.commit()?;
        }
    }
    Ok(())
}
```

Versi skema dicatat di `PRAGMA user_version`, sehingga migrasi hanya dijalankan sekali dan dalam satu transaksi.

### 5.2 `src-tauri/src/commands.rs`

```rust
use rusqlite::{params, Connection, OptionalExtension, Transaction};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

pub struct AppState {
    pub db: Mutex<Connection>,
}

type Res<T> = Result<T, String>;

fn err<E: std::fmt::Display>(e: E) -> String {
    e.to_string()
}

// ---------- Tipe data ----------

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Product {
    pub id: i64,
    pub sku: Option<String>,
    pub name: String,
    pub category: String,
    pub unit: String,
    pub buy_price: i64,
    pub sell_price: i64,
    pub stock: i64,
    pub min_stock: i64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProductInput {
    pub id: Option<i64>,
    pub sku: Option<String>,
    pub name: String,
    pub category: String,
    pub unit: String,
    pub buy_price: i64,
    pub sell_price: i64,
    pub min_stock: i64,
    pub initial_stock: Option<i64>, // hanya dipakai saat membuat produk baru
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TxRow {
    pub id: i64,
    pub kind: String,
    pub product_name: String,
    pub unit: String,
    pub qty: i64,
    pub total: i64,
    pub note: Option<String>,
    pub created_at: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Dashboard {
    pub total_products: i64,
    pub low_stock: i64,
    pub sales_today: i64,
    pub profit_today: i64,
    pub sales_count_today: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DayTotal {
    pub date: String,
    pub total: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Report {
    pub revenue: i64,
    pub capital: i64,
    pub top_product: Option<String>,
    pub top_qty: i64,
    pub last7: Vec<DayTotal>,
}

// ---------- Logika (dipisah dari command agar bisa diuji) ----------

fn row_to_product(r: &rusqlite::Row) -> rusqlite::Result<Product> {
    Ok(Product {
        id: r.get(0)?,
        sku: r.get(1)?,
        name: r.get(2)?,
        category: r.get(3)?,
        unit: r.get(4)?,
        buy_price: r.get(5)?,
        sell_price: r.get(6)?,
        stock: r.get(7)?,
        min_stock: r.get(8)?,
    })
}

pub fn list_products_db(conn: &Connection) -> Res<Vec<Product>> {
    let mut st = conn
        .prepare(
            "SELECT id, sku, name, category, unit, buy_price, sell_price, stock, min_stock
             FROM products ORDER BY name COLLATE NOCASE",
        )
        .map_err(err)?;
    let rows = st.query_map([], row_to_product).map_err(err)?;
    let list = rows.collect::<Result<Vec<_>, _>>().map_err(err)?;
    Ok(list)
}

fn insert_tx(
    tx: &Transaction,
    kind: &str,
    product_id: i64,
    name: &str,
    unit: &str,
    qty: i64,
    total: i64,
    profit: i64,
    note: Option<&str>,
) -> rusqlite::Result<()> {
    tx.execute(
        "INSERT INTO transactions (kind, product_id, product_name, unit, qty, total, profit, note)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![kind, product_id, name, unit, qty, total, profit, note],
    )?;
    Ok(())
}

pub fn save_product_db(conn: &mut Connection, p: ProductInput) -> Res<i64> {
    let name = p.name.trim().to_string();
    if name.is_empty() {
        return Err("Nama produk wajib diisi".into());
    }
    if p.buy_price < 0 || p.sell_price < 0 {
        return Err("Harga tidak boleh negatif".into());
    }
    if p.min_stock < 1 {
        return Err("Minimum stok minimal 1".into());
    }
    let sku = p.sku.map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
    let unit = if p.unit.trim().is_empty() { "Pcs".to_string() } else { p.unit.trim().to_string() };

    let tx = conn.transaction().map_err(err)?;
    let id = match p.id {
        Some(id) => {
            let n = tx
                .execute(
                    "UPDATE products SET sku=?1, name=?2, category=?3, unit=?4,
                     buy_price=?5, sell_price=?6, min_stock=?7 WHERE id=?8",
                    params![sku, name, p.category, unit, p.buy_price, p.sell_price, p.min_stock, id],
                )
                .map_err(err)?;
            if n != 1 {
                return Err("Produk tidak ditemukan".into());
            }
            id
        }
        None => {
            tx.execute(
                "INSERT INTO products (sku, name, category, unit, buy_price, sell_price, min_stock)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
                params![sku, name, p.category, unit, p.buy_price, p.sell_price, p.min_stock],
            )
            .map_err(err)?;
            let id = tx.last_insert_rowid();
            let qty = p.initial_stock.unwrap_or(0);
            if qty > 0 {
                tx.execute("UPDATE products SET stock = ?1 WHERE id = ?2", params![qty, id])
                    .map_err(err)?;
                insert_tx(&tx, "stock_in", id, &name, &unit, qty, p.buy_price * qty, 0, Some("Stok awal"))
                    .map_err(err)?;
            }
            id
        }
    };
    tx.commit().map_err(err)?;
    Ok(id)
}

pub fn delete_product_db(conn: &Connection, id: i64) -> Res<()> {
    conn.execute("DELETE FROM products WHERE id = ?1", [id]).map_err(err)?;
    Ok(())
}

fn load_for_update(tx: &Transaction, id: i64) -> Res<(String, String, i64, i64, i64)> {
    tx.query_row(
        "SELECT name, unit, buy_price, sell_price, stock FROM products WHERE id = ?1",
        [id],
        |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?, r.get(4)?)),
    )
    .optional()
    .map_err(err)?
    .ok_or_else(|| "Produk tidak ditemukan".to_string())
}

pub fn record_sale_db(conn: &mut Connection, product_id: i64, qty: i64, note: Option<&str>) -> Res<()> {
    if qty <= 0 {
        return Err("Jumlah harus lebih dari 0".into());
    }
    let tx = conn.transaction().map_err(err)?;
    let (name, unit, buy, sell, stock) = load_for_update(&tx, product_id)?;
    if qty > stock {
        return Err(format!("Stok tidak mencukupi. Sisa: {stock} {unit}"));
    }
    tx.execute("UPDATE products SET stock = stock - ?1 WHERE id = ?2", params![qty, product_id])
        .map_err(err)?;
    insert_tx(&tx, "sale", product_id, &name, &unit, qty, sell * qty, (sell - buy) * qty, note)
        .map_err(err)?;
    tx.commit().map_err(err)
}

pub fn stock_in_db(
    conn: &mut Connection,
    product_id: i64,
    qty: i64,
    buy_price: Option<i64>,
    sell_price: Option<i64>,
    note: Option<&str>,
) -> Res<()> {
    if qty <= 0 {
        return Err("Jumlah harus lebih dari 0".into());
    }
    let tx = conn.transaction().map_err(err)?;
    let (name, unit, old_buy, old_sell, _) = load_for_update(&tx, product_id)?;
    let buy = buy_price.unwrap_or(old_buy);
    let sell = sell_price.unwrap_or(old_sell);
    if buy < 0 || sell < 0 {
        return Err("Harga tidak boleh negatif".into());
    }
    tx.execute(
        "UPDATE products SET stock = stock + ?1, buy_price = ?2, sell_price = ?3 WHERE id = ?4",
        params![qty, buy, sell, product_id],
    )
    .map_err(err)?;
    insert_tx(&tx, "stock_in", product_id, &name, &unit, qty, buy * qty, 0, note).map_err(err)?;
    tx.commit().map_err(err)
}

pub fn adjust_stock_db(conn: &mut Connection, product_id: i64, qty: i64, reason: &str) -> Res<()> {
    if qty <= 0 {
        return Err("Jumlah harus lebih dari 0".into());
    }
    let tx = conn.transaction().map_err(err)?;
    let (name, unit, _, _, stock) = load_for_update(&tx, product_id)?;
    if qty > stock {
        return Err("Jumlah pengurangan melebihi sisa stok".into());
    }
    tx.execute("UPDATE products SET stock = stock - ?1 WHERE id = ?2", params![qty, product_id])
        .map_err(err)?;
    insert_tx(&tx, "adjustment", product_id, &name, &unit, qty, 0, 0, Some(reason)).map_err(err)?;
    tx.commit().map_err(err)
}

pub fn list_transactions_db(conn: &Connection, limit: i64) -> Res<Vec<TxRow>> {
    let mut st = conn
        .prepare(
            "SELECT id, kind, product_name, unit, qty, total, note, created_at
             FROM transactions ORDER BY id DESC LIMIT ?1",
        )
        .map_err(err)?;
    let rows = st
        .query_map([limit], |r| {
            Ok(TxRow {
                id: r.get(0)?,
                kind: r.get(1)?,
                product_name: r.get(2)?,
                unit: r.get(3)?,
                qty: r.get(4)?,
                total: r.get(5)?,
                note: r.get(6)?,
                created_at: r.get(7)?,
            })
        })
        .map_err(err)?;
    let list = rows.collect::<Result<Vec<_>, _>>().map_err(err)?;
    Ok(list)
}

pub fn dashboard_db(conn: &Connection) -> Res<Dashboard> {
    conn.query_row(
        "SELECT
           (SELECT COUNT(*) FROM products),
           (SELECT COUNT(*) FROM products WHERE stock <= min_stock),
           COALESCE((SELECT SUM(total)  FROM transactions WHERE kind='sale' AND date(created_at)=date('now','localtime')), 0),
           COALESCE((SELECT SUM(profit) FROM transactions WHERE kind='sale' AND date(created_at)=date('now','localtime')), 0),
           (SELECT COUNT(*) FROM transactions WHERE kind='sale' AND date(created_at)=date('now','localtime'))",
        [],
        |r| {
            Ok(Dashboard {
                total_products: r.get(0)?,
                low_stock: r.get(1)?,
                sales_today: r.get(2)?,
                profit_today: r.get(3)?,
                sales_count_today: r.get(4)?,
            })
        },
    )
    .map_err(err)
}

pub fn report_db(conn: &Connection) -> Res<Report> {
    let (revenue, capital): (i64, i64) = conn
        .query_row(
            "SELECT COALESCE(SUM(CASE WHEN kind='sale'     THEN total END), 0),
                    COALESCE(SUM(CASE WHEN kind='stock_in' THEN total END), 0)
             FROM transactions",
            [],
            |r| Ok((r.get(0)?, r.get(1)?)),
        )
        .map_err(err)?;

    let top: Option<(String, i64)> = conn
        .query_row(
            "SELECT product_name, SUM(qty) AS q FROM transactions
             WHERE kind='sale' GROUP BY product_name ORDER BY q DESC LIMIT 1",
            [],
            |r| Ok((r.get(0)?, r.get(1)?)),
        )
        .optional()
        .map_err(err)?;

    let mut st = conn
        .prepare(
            "SELECT date(created_at) AS d, SUM(total) FROM transactions
             WHERE kind='sale' AND date(created_at) >= date('now','localtime','-6 days')
             GROUP BY d ORDER BY d",
        )
        .map_err(err)?;
    let rows = st
        .query_map([], |r| Ok(DayTotal { date: r.get(0)?, total: r.get(1)? }))
        .map_err(err)?;
    let last7 = rows.collect::<Result<Vec<_>, _>>().map_err(err)?;

    Ok(Report {
        revenue,
        capital,
        top_product: top.as_ref().map(|t| t.0.clone()),
        top_qty: top.map(|t| t.1).unwrap_or(0),
        last7,
    })
}

// ---------- Command Tauri (lapisan tipis) ----------

#[tauri::command]
pub fn list_products(state: State<AppState>) -> Res<Vec<Product>> {
    let conn = state.db.lock().map_err(err)?;
    list_products_db(&conn)
}

#[tauri::command]
pub fn save_product(state: State<AppState>, input: ProductInput) -> Res<i64> {
    let mut conn = state.db.lock().map_err(err)?;
    save_product_db(&mut conn, input)
}

#[tauri::command]
pub fn delete_product(state: State<AppState>, id: i64) -> Res<()> {
    let conn = state.db.lock().map_err(err)?;
    delete_product_db(&conn, id)
}

#[tauri::command]
pub fn record_sale(state: State<AppState>, product_id: i64, qty: i64, note: Option<String>) -> Res<()> {
    let mut conn = state.db.lock().map_err(err)?;
    record_sale_db(&mut conn, product_id, qty, note.as_deref())
}

#[tauri::command]
pub fn stock_in(
    state: State<AppState>,
    product_id: i64,
    qty: i64,
    buy_price: Option<i64>,
    sell_price: Option<i64>,
    note: Option<String>,
) -> Res<()> {
    let mut conn = state.db.lock().map_err(err)?;
    stock_in_db(&mut conn, product_id, qty, buy_price, sell_price, note.as_deref())
}

#[tauri::command]
pub fn adjust_stock(state: State<AppState>, product_id: i64, qty: i64, reason: String) -> Res<()> {
    let mut conn = state.db.lock().map_err(err)?;
    adjust_stock_db(&mut conn, product_id, qty, &reason)
}

#[tauri::command]
pub fn list_transactions(state: State<AppState>, limit: Option<i64>) -> Res<Vec<TxRow>> {
    let conn = state.db.lock().map_err(err)?;
    list_transactions_db(&conn, limit.unwrap_or(200))
}

#[tauri::command]
pub fn get_dashboard(state: State<AppState>) -> Res<Dashboard> {
    let conn = state.db.lock().map_err(err)?;
    dashboard_db(&conn)
}

#[tauri::command]
pub fn get_report(state: State<AppState>) -> Res<Report> {
    let conn = state.db.lock().map_err(err)?;
    report_db(&conn)
}

#[tauri::command]
pub fn get_setting(state: State<AppState>, key: String) -> Res<Option<String>> {
    let conn = state.db.lock().map_err(err)?;
    conn.query_row("SELECT value FROM settings WHERE key = ?1", [key], |r| r.get(0))
        .optional()
        .map_err(err)
}

#[tauri::command]
pub fn set_setting(state: State<AppState>, key: String, value: String) -> Res<()> {
    let conn = state.db.lock().map_err(err)?;
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        params![key, value],
    )
    .map_err(err)?;
    Ok(())
}

// ---------- Pengujian ----------

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db;

    fn beras(initial: i64) -> ProductInput {
        ProductInput {
            id: None,
            sku: None,
            name: "Beras".into(),
            category: "Sembako".into(),
            unit: "Karung".into(),
            buy_price: 65000,
            sell_price: 74000,
            min_stock: 5,
            initial_stock: Some(initial),
        }
    }

    fn stock_of(conn: &Connection, id: i64) -> i64 {
        conn.query_row("SELECT stock FROM products WHERE id=?1", [id], |r| r.get(0)).unwrap()
    }

    #[test]
    fn sale_reduces_stock_and_rejects_oversell() {
        let mut conn = db::open_memory().unwrap();
        let id = save_product_db(&mut conn, beras(10)).unwrap();
        record_sale_db(&mut conn, id, 3, None).unwrap();
        assert_eq!(stock_of(&conn, id), 7);
        assert!(record_sale_db(&mut conn, id, 8, None).is_err());
        assert_eq!(stock_of(&conn, id), 7); // gagal = tidak ada perubahan
    }

    #[test]
    fn delete_keeps_history() {
        let mut conn = db::open_memory().unwrap();
        let id = save_product_db(&mut conn, beras(5)).unwrap();
        record_sale_db(&mut conn, id, 1, None).unwrap();
        delete_product_db(&conn, id).unwrap();
        let rows = list_transactions_db(&conn, 10).unwrap();
        assert_eq!(rows.len(), 2); // stok awal + penjualan
        assert_eq!(rows[0].product_name, "Beras");
    }
}
```

### 5.3 `src-tauri/src/lib.rs`

Pertahankan baris plugin bawaan template (misalnya `opener`) jika ada. Bagian penting:

```rust
mod commands;
mod db;

use std::{fs, sync::Mutex};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let dir = app.path().app_data_dir()?;
            fs::create_dir_all(&dir)?;
            let conn = db::open(&dir.join("natadata.db"))?;
            app.manage(commands::AppState { db: Mutex::new(conn) });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::list_products,
            commands::save_product,
            commands::delete_product,
            commands::record_sale,
            commands::stock_in,
            commands::adjust_stock,
            commands::list_transactions,
            commands::get_dashboard,
            commands::get_report,
            commands::get_setting,
            commands::set_setting,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

File database dibuat otomatis di folder data aplikasi (`app_data_dir`), yang turunannya dari *identifier* aplikasi. Di Windows biasanya di bawah `%APPDATA%`. Lokasi pastinya periksa langsung setelah aplikasi berjalan.

### 5.4 Jalankan pengujian Rust

```bash
cd src-tauri
cargo test
```

Pengujian memakai database di memori, jadi tidak menyentuh data asli.

## 6. Menyambung frontend

Salin `index.html` NataData ke `src/index.html` (ganti yang dibuat template), dan pindahkan blok `<script>` ke `src/main.js` agar rapi.

**a. Pastikan objek `window.__TAURI__` tersedia.** Di `src-tauri/tauri.conf.json`, bagian `app`, periksa `"withGlobalTauri": true`. Jika tidak ada, tambahkan. (Alternatif: memasang paket `@tauri-apps/api` dan memakai bundler.)

**b. Buat `src/api.js`:**

```js
const { invoke } = window.__TAURI__.core;

export const api = {
  listProducts:     ()                  => invoke('list_products'),
  saveProduct:      (input)             => invoke('save_product', { input }),
  deleteProduct:    (id)                => invoke('delete_product', { id }),
  recordSale:       (productId, qty, note = null) => invoke('record_sale', { productId, qty, note }),
  stockIn:          (productId, qty, buyPrice = null, sellPrice = null, note = null) =>
                      invoke('stock_in', { productId, qty, buyPrice, sellPrice, note }),
  adjustStock:      (productId, qty, reason) => invoke('adjust_stock', { productId, qty, reason }),
  listTransactions: (limit = 200)       => invoke('list_transactions', { limit }),
  getDashboard:     ()                  => invoke('get_dashboard'),
  getReport:        ()                  => invoke('get_report'),
  getSetting:       (key)               => invoke('get_setting', { key }),
  setSetting:       (key, value)        => invoke('set_setting', { key, value }),
};
```

Nama argumen JavaScript memakai **camelCase** (`productId`), dan Tauri mencocokkannya ke parameter Rust `product_id`. Field di dalam objek `input` juga camelCase karena `#[serde(rename_all = "camelCase")]`.

**c. Muat sebagai modul** di `index.html`: `<script type="module" src="main.js"></script>`. Fungsi yang dipanggil dari atribut `onclick="..."` harus ditempelkan ke `window` (misalnya `window.switchTab = switchTab;`) karena modul tidak membuat fungsi global.

**d. Ganti lapisan data.** Hapus `localStorage`, `DEFAULT_ITEMS`, `DEFAULT_TRANSACTIONS`, dan `saveDataToStorage`. Pemetaannya:

| Fungsi lama | Pengganti |
|---|---|
| `loadStoreData` + `saveDataToStorage` | `refreshAll()` yang memanggil `listProducts`, `getDashboard`, `listTransactions`, `getReport` lalu merender |
| `handleLogin`, `handleLogout`, layar login | Dihapus |
| `handleSaveEditBarang` | `api.saveProduct({ id, ... })` (stok tidak diedit di sini) |
| `executeDelete` (hapus produk) | `api.deleteProduct(id)` |
| `handleBarangMasuk` | Produk baru: `api.saveProduct({ ..., initialStock })`. Produk lama: `api.stockIn(...)` |
| `handlePenjualan` | `api.recordSale(...)` |
| `handleBarangKeluar` | `api.adjustStock(...)` |
| `updateDashboard`, `updateCharts` | Isi dari `getDashboard()` dan `getReport()` |
| `resetDataDefault` | Dihapus (aplikasi produksi tidak butuh data demo). Untuk reset saat pengembangan, hapus file `natadata.db` |

**Contoh** `handlePenjualan` setelah diubah:

```js
async function handlePenjualan(e) {
  e.preventDefault();
  const productId = Number(document.getElementById('selectBarangJual').value);
  const qty = parseInt(document.getElementById('jumlahJual').value, 10);
  try {
    await api.recordSale(productId, qty);   // stok dan transaksi diubah atomik di Rust
    await refreshAll();
    showToast('Penjualan berhasil dicatat!');
  } catch (err) {
    showToast(String(err), true);           // contoh: "Stok tidak mencukupi. Sisa: 2 Karung"
  }
}
```

Perhatikan: tampilan **tidak lagi menghitung stok sendiri**. Rust yang memutuskan, frontend hanya menampilkan hasil. Harga dari form dikirim sebagai bilangan bulat rupiah (`Math.round(...)`).

**e. Bug lama yang otomatis hilang:** double-escape (T-05) hilang bila data teks disimpan mentah dan ditampilkan lewat `textContent` (jangan lagi memanggil `sanitizeInput` sebelum menyimpan). Reset-stok (T-07) dan grafik ganda (T-03) tidak relevan lagi bila Anda membuang reset dan membuat grafik sekali.

## 7. Menjadikan aplikasi benar-benar offline

Versi web memuat Tailwind, Lucide, dan Chart.js dari CDN. Di aplikasi desktop, itu berarti **tidak berjalan tanpa internet** dan bisa terblokir oleh *Content Security Policy* (CSP) Tauri bila Anda mengaturnya. Rekomendasi:

1. Pasang pustaka lewat npm (`npm install chart.js lucide`) dan salin berkas hasil build-nya (folder `dist` masing-masing paket) ke `src/vendor/`. Periksa nama berkas yang tepat di folder `dist` tiap paket.
2. Buat CSS Tailwind dengan CLI Tailwind (ikuti dokumentasi resmi Tailwind untuk versi yang Anda pasang) menjadi satu `src/styles.css`.
3. Unduh font Inter dan referensikan secara lokal, atau pakai font sistem.
4. Setelah semua lokal, atur CSP di `tauri.conf.json` (`app.security.csp`) yang hanya mengizinkan sumber sendiri.

## 8. Menjalankan dan membangun

```bash
npm run tauri dev       # mode pengembangan (hot reload frontend)
npm run tauri build     # build rilis
```

Hasil build berada di `src-tauri/target/release/bundle/` (installer sesuai OS, misalnya MSI/NSIS di Windows). Periksa lokasi pastinya setelah build berhasil.

Build rilis hanya menghasilkan installer untuk **OS tempat Anda membangun**. Untuk Windows, macOS, dan Linux sekaligus, biasanya dipakai CI (GitHub Actions) dengan runner masing-masing. Itu langkah lanjutan yang belum disiapkan di repository ini.

Penandatanganan kode (code signing) bersifat opsional untuk uji coba, tetapi tanpa tanda tangan Windows SmartScreen atau macOS Gatekeeper akan memunculkan peringatan saat pengguna memasang. Simpan sertifikat dan kata sandinya di luar repository.

## 9. Data, cadangan, dan migrasi dari versi web

- **Cadangan paling sederhana:** salin file `natadata.db` (hentikan aplikasi dulu agar file WAL ikut konsisten). Tambahkan tombol "Cadangkan" yang memakai dialog simpan Tauri sebagai tahap berikutnya.
- **Memindahkan data dari versi web:** versi web belum punya ekspor. Opsi: (1) di versi web, jalankan di Console `copy(JSON.stringify({items: localStorage.getItem('stokin_items_<idToko>'), trx: localStorage.getItem('stokin_trx_<idToko>')}))` lalu simpan hasilnya ke file; (2) tulis command Rust `import_legacy` yang membaca JSON itu dan memasukkannya ke tabel (produk dulu, lalu transaksi dengan mencocokkan nama). Kode impor ini **belum ditulis**. Waktu transaksi lama hanya punya tanggal (`dateIso`), bukan jam.
- **Ubah skema kelak:** tambah `002_xxx.sql` ke `MIGRATIONS`, jangan menyunting `001_init.sql` yang sudah dipakai pengguna.

## 10. Izin dan keamanan

- Command aplikasi buatan sendiri (`#[tauri::command]`) umumnya tidak memerlukan entri izin tambahan di Tauri 2, tetapi **plugin** (dialog, filesystem, dll.) memerlukannya lewat `src-tauri/capabilities/`. Periksa dokumentasi izin Tauri bila menambah plugin. Beri izin seminimal mungkin.
- Dengan desain ini JavaScript **tidak bisa** menjalankan SQL sembarang. Hanya fungsi yang Anda daftarkan di `generate_handler!` yang dapat dipanggil.
- Database **tidak dienkripsi** dan tidak ada login. Siapa pun yang memegang komputer dan akun pengguna OS-nya dapat membuka file `natadata.db`. Jika perlu proteksi, pertimbangkan enkripsi database (misalnya varian SQLite terenkripsi) dan kunci login, sebagai keputusan terpisah.
- **Tidak ada sinkronisasi antarperangkat.** Satu komputer = satu database. Untuk banyak perangkat dibutuhkan server dan akun (lihat [AUDIT.md](AUDIT.md), bagian 4).

## 11. Urutan pengerjaan yang disarankan

1. Scaffold dan pastikan `npm run tauri dev` jalan (bagian 2).
2. Tambah dependensi, skema, `db.rs` (bagian 3–5.1). Jalankan `cargo test`.
3. Tambah `commands.rs` dan `lib.rs` (5.2–5.3). Jalankan `cargo test` lagi.
4. Sambungkan **satu** fitur dulu (misalnya daftar produk + tambah produk) untuk membuktikan jalur frontend → Rust → SQLite.
5. Pindahkan fitur lain satu per satu: barang masuk, penjualan, penyesuaian, riwayat, dashboard, laporan.
6. Jadikan aplikasi offline (bagian 7).
7. Uji manual memakai daftar periksa di [DEVELOPMENT.md](DEVELOPMENT.md#6-menguji-perubahan) (sesuaikan: tidak ada login/reset).
8. `npm run tauri build`, pasang di komputer lain, uji ulang.

## 12. Yang belum tercakup

Ekspor/impor dan cadangan lewat antarmuka, pembatalan transaksi, enkripsi database, pembaruan otomatis (*updater*), CI untuk build multi-OS, dan impor data dari versi web. Semuanya dapat ditambahkan sebagai tahap lanjutan.
