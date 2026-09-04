# Cateringin — Backend API

> **NestJS · Prisma · MySQL · Louvin Payment · Cloudinary**

REST API backend untuk platform katering harian. Mengelola pesanan, langganan, pembayaran, dapur (KDS), pengiriman, dan ulasan dengan RBAC 4 role.

---

## Daftar Isi

- [Tech Stack](#tech-stack)
- [Cara Menjalankan](#cara-menjalankan)
- [Environment Variables](#environment-variables)
- [Dokumentasi API (Scalar)](#dokumentasi-api-scalar)
- [Role & Hak Akses](#role--hak-akses)
- [Alur Aplikasi](#alur-aplikasi)
- [Daftar Endpoint API](#daftar-endpoint-api)
- [Struktur Response](#struktur-response)
- [Mapping ke Frontend](#mapping-ke-frontend)
- [Database & Prisma](#database--prisma)

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | [NestJS](https://nestjs.com/) (TypeScript) |
| Database | MySQL via [Prisma ORM](https://www.prisma.io/) |
| Auth | JWT Access Token + Refresh Token |
| Payment | [Louvin Payment Gateway](https://louvin.dev) |
| Storage | [Cloudinary](https://cloudinary.com) (foto menu & bukti kirim) |
| API Docs | [Scalar](https://scalar.com) (diakses via `/docs`) |

---

## Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Salin dan isi environment variables
cp .env.example .env

# 3. Generate Prisma client
npx prisma generate

# 4. Jalankan migrasi (saat database sudah siap)
npx prisma migrate dev

# 5. Jalankan development server
npm run start:dev
```

Server berjalan di: `http://localhost:3000`
Dokumentasi API: `http://localhost:3000/docs`

---

## Environment Variables

Salin `.env.example` ke `.env` dan isi nilainya:

```env
# Database MySQL
DATABASE_URL="mysql://username:password@localhost:3306/cateringin"

# JWT
JWT_SECRET="your_jwt_secret_here"

# Louvin Payment Gateway
LOUVIN_API_KEY="your_api_key_here"
LOUVIN_BASE_URL="https://api.louvin.dev"

# Cloudinary (upload foto menu & bukti pengiriman)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Port (opsional, default 3000)
PORT=3000
```

---

## Dokumentasi API (Scalar)

Setelah server berjalan, buka:

```
http://localhost:3000/docs
```

Scalar menampilkan semua endpoint secara interaktif dengan fitur **Try it out**. Gunakan endpoint `POST /auth/login` untuk mendapatkan `accessToken`, lalu masukkan ke field **Authorize** (Bearer token) di bagian atas halaman.

---

## Role & Hak Akses

Sistem menggunakan **Role-Based Access Control (RBAC)**. Setiap request ke endpoint terproteksi harus menyertakan header:

```
Authorization: Bearer <accessToken>
```

| Role | Deskripsi |
|---|---|
| `PUBLIC` | Tidak perlu login — akses katalog menu, slot, dan cek jangkauan |
| `CUSTOMER` | User yang sudah login — pesan, langganan, profil, ulasan |
| `ADMIN` | Kelola seluruh sistem — menu, pesanan, customer, analitik, settings |
| `KITCHEN` | Staf dapur — lihat antrian masak, update status memasak, cetak label |
| `DRIVER` | Kurir — lihat list pengiriman, update status kirim, upload bukti |

---

## Alur Aplikasi

### 🛒 Alur Order Reguler (Customer)

```
1. [PUBLIC]    GET  /public/menus/active       → Lihat menu hari ini
2. [PUBLIC]    GET  /public/slots              → Pilih slot waktu
3. [PUBLIC]    POST /public/coverage-check     → Cek jangkauan alamat
4. [CUSTOMER]  POST /cart/calculate            → Hitung harga + ongkir
5. [CUSTOMER]  POST /order/checkout            → Checkout → Louvin payment dibuat
   └─ Response: { qr_string / va_number, expired_at }
6. [SYSTEM]    POST /payments/louvin/callback  → Webhook: payment settled → Order jadi PAID
7. [KITCHEN]   PATCH /kitchen/batch/start-cooking → Order PAID → IN_KITCHEN
8. [DRIVER]    PATCH /driver/orders/:id/status → IN_KITCHEN → ON_DELIVERY → DELIVERED
9. [CUSTOMER]  PATCH /user/orders/:id/complete → DELIVERED → COMPLETED
10. [CUSTOMER] POST  /user/orders/:id/review   → Beri ulasan
```

### 📅 Alur Langganan (Subscription)

```
1. [CUSTOMER]  POST /subscription/create       → Buat langganan (durasi, slot, alamat)
2. [CUSTOMER]  POST /order/checkout            → Checkout langganan → bayar via Louvin
3. [SYSTEM]    POST /payments/louvin/callback  → Subscription jadi ACTIVE setelah bayar
4. [CUSTOMER]  POST /subscription/:id/skip-day → Skip 1 hari tertentu
5. [CUSTOMER]  POST /subscription/:id/pause    → Pause sementara
6. [CUSTOMER]  POST /subscription/:id/resume   → Lanjutkan lagi
```

### 📊 Order Status State Machine

```
PENDING_PAYMENT → PAID → IN_KITCHEN → ON_DELIVERY → DELIVERED → COMPLETED
                                ↓
                           CANCELLED (+ rejectionReason wajib)
```

| Status | Siapa yang update |
|---|---|
| `PENDING_PAYMENT` | Sistem (saat checkout) |
| `PAID` | Webhook Louvin (`payment.settled`) |
| `IN_KITCHEN` | Kitchen / Admin |
| `ON_DELIVERY` | Driver / Admin |
| `DELIVERED` | Driver / Admin |
| `COMPLETED` | Customer (`/user/orders/:id/complete`) |
| `CANCELLED` | Admin (`/admin/orders/:id/status` + `rejectionReason`) atau webhook (`payment.failed`) |

---

## Daftar Endpoint API

### 🔓 Auth

| Method | Path | Role | Keterangan |
|---|---|---|---|
| POST | `/auth/register` | PUBLIC | Daftar akun customer baru |
| POST | `/auth/login` | PUBLIC | Login, dapat `accessToken` & `refreshToken` |
| POST | `/auth/refresh` | PUBLIC | Refresh token |

---

### 👤 User & Alamat

| Method | Path | Role | Keterangan |
|---|---|---|---|
| GET | `/user/profile` | ANY_AUTH | Profil user yang login |
| PATCH | `/user/profile` | ANY_AUTH | Update nama, HP, password |
| GET | `/user/orders` | CUSTOMER | List pesanan customer (aktif & riwayat) |
| PATCH | `/user/orders/:id/complete` | CUSTOMER | Konfirmasi pesanan diterima |
| GET | `/user/orders/:id/tracking` | CUSTOMER, ADMIN | Tracking status + ETA |
| POST | `/user/orders/:id/review` | CUSTOMER | Beri ulasan (rating + komentar) |
| POST | `/user/addresses` | CUSTOMER | Tambah alamat |
| GET | `/user/addresses` | CUSTOMER | List semua alamat |
| GET | `/user/addresses/:id` | CUSTOMER | Detail alamat |
| PATCH | `/user/addresses/:id` | CUSTOMER | Edit alamat |
| DELETE | `/user/addresses/:id` | CUSTOMER | Hapus alamat |
| PATCH | `/user/addresses/:id/primary` | CUSTOMER | Set alamat utama |

**Query params `GET /user/orders`:**
```
?status=PAID|IN_KITCHEN|ON_DELIVERY|DELIVERED|COMPLETED|CANCELLED
&page=1
&limit=10
```

---

### 🌐 Public (Tanpa Login)

| Method | Path | Role | Keterangan |
|---|---|---|---|
| GET | `/public/menus/active` | PUBLIC | Katalog menu aktif + pagination |
| GET | `/public/schedules` | PUBLIC | Jadwal menu per tanggal |
| GET | `/public/slots` | PUBLIC | Daftar slot pengiriman aktif |
| POST | `/public/coverage-check` | PUBLIC | Cek jangkauan (Haversine formula) |
| GET | `/public/reviews` | PUBLIC | Ulasan publik untuk landing page |

---

### 🛒 Cart & Subscription

| Method | Path | Role | Keterangan |
|---|---|---|---|
| POST | `/cart/calculate` | CUSTOMER | Hitung subtotal + ongkir + durasi |
| POST | `/subscription/create` | CUSTOMER | Buat langganan baru |
| GET | `/subscription/my` | CUSTOMER | List langganan saya |
| GET | `/subscription/:id` | CUSTOMER | Detail langganan |
| POST | `/subscription/:id/skip-day` | CUSTOMER | Skip 1 hari |
| POST | `/subscription/:id/pause` | CUSTOMER | Pause langganan |
| POST | `/subscription/:id/resume` | CUSTOMER | Resume langganan |

---

### 📦 Order & Payment

| Method | Path | Role | Keterangan |
|---|---|---|---|
| POST | `/order/checkout` | CUSTOMER | Checkout → buat order + payment Louvin |
| POST | `/payments/louvin/callback` | SYSTEM (webhook) | Webhook dari Louvin, update status otomatis |

---

### 👨‍💼 Admin — Orders

| Method | Path | Role | Keterangan |
|---|---|---|---|
| GET | `/admin/orders` | ADMIN | List semua pesanan |
| GET | `/admin/orders/:id` | ADMIN | Detail 1 pesanan lengkap |
| PATCH | `/admin/orders/:id/status` | ADMIN | Update status (+ `rejectionReason` wajib saat CANCELLED) |

**Query params `GET /admin/orders`:**
```
?search=nama|email|no_pesanan
&status=PAID|IN_KITCHEN|ON_DELIVERY|...
&page=1
&limit=10
```

**Body `PATCH /admin/orders/:id/status` saat batalkan:**
```json
{
  "status": "CANCELLED",
  "rejectionReason": "Alasan pembatalan wajib diisi"
}
```

---

### 👨‍💼 Admin — Menu & Jadwal

| Method | Path | Role | Keterangan |
|---|---|---|---|
| POST | `/admin/menus` | ADMIN | Tambah menu |
| GET | `/admin/menus` | ADMIN | List menu + filter + pagination |
| GET | `/admin/menus/:id` | ADMIN | Detail menu |
| PATCH | `/admin/menus/:id` | ADMIN | Edit menu |
| DELETE | `/admin/menus/:id` | ADMIN | Hapus menu (soft delete) |
| POST | `/admin/menu-schedules` | ADMIN | Jadwalkan menu ke tanggal tertentu |
| POST | `/admin/menu-schedules/bulk` | ADMIN | Jadwalkan massal beberapa tanggal |
| GET | `/admin/menu-schedules` | ADMIN | Lihat jadwal menu |
| DELETE | `/admin/menu-schedules/:id` | ADMIN | Hapus jadwal menu |

---

### 👨‍💼 Admin — Customers, Slots, Analytics, Settings

| Method | Path | Role | Keterangan |
|---|---|---|---|
| GET | `/admin/customers` | ADMIN | List customer + search + pagination |
| GET | `/admin/customers/:id` | ADMIN | Detail customer + riwayat pesanan |
| PATCH | `/admin/customers/:id/status` | ADMIN | Aktif/nonaktif akun |
| POST | `/admin/slots` | ADMIN | Tambah slot waktu |
| GET | `/admin/slots` | ADMIN | List slot |
| PATCH | `/admin/slots/:id` | ADMIN | Edit slot |
| DELETE | `/admin/slots/:id` | ADMIN | Hapus slot |
| GET | `/admin/analytics/overview` | ADMIN | Metrik dashboard (revenue, pesanan, dll) |
| GET | `/admin/analytics/charts` | ADMIN | Data grafik per periode |
| GET | `/admin/reviews` | ADMIN | Semua ulasan + search |
| GET | `/admin/settings` | ADMIN | Konfigurasi sistem (biaya, lokasi dapur) |
| PATCH | `/admin/settings` | ADMIN | Update konfigurasi |

---

### 🍳 Kitchen (KDS)

| Method | Path | Role | Keterangan |
|---|---|---|---|
| GET | `/kitchen/batch-view` | KITCHEN, ADMIN | Antrian masak per tanggal & slot |
| PATCH | `/kitchen/batch/start-cooking` | KITCHEN, ADMIN | Batch PAID → IN_KITCHEN |
| GET | `/kitchen/labels` | KITCHEN, ADMIN | Label kemasan untuk dicetak |
| GET | `/kitchen/orders/:id/label` | KITCHEN, ADMIN | Label 1 pesanan |
| PATCH | `/kitchen/orders/:id/status` | KITCHEN, ADMIN | Update status masak |

---

### 🚚 Driver

| Method | Path | Role | Keterangan |
|---|---|---|---|
| GET | `/driver/deliveries` | DRIVER, ADMIN | Daftar pengiriman hari ini |
| PATCH | `/driver/orders/:id/status` | DRIVER, ADMIN | Update `ON_DELIVERY` / `DELIVERED` |
| POST | `/driver/upload-proof` | DRIVER, ADMIN | Upload foto bukti pengiriman |

---

### 📤 Upload

| Method | Path | Role | Keterangan |
|---|---|---|---|
| POST | `/upload/image` | ADMIN | Upload foto menu ke Cloudinary |

**Request:** `multipart/form-data`, field `file` (max 5MB, hanya image).
**Response:** `{ data: { url: "https://res.cloudinary.com/..." } }`

---

## Struktur Response

Semua endpoint mengembalikan envelope yang konsisten:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pesan deskriptif",
  "data": { ... }
}
```

Untuk list dengan pagination:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

Error response:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Pesan error yang deskriptif"
}
```

---

## Mapping ke Frontend

Tabel berikut menunjukkan koneksi antara halaman FE dan endpoint BE:

| Halaman FE | File FE | Endpoint BE |
|---|---|---|
| Landing Page | `LandingPage.jsx` | `GET /public/menus/active`, `GET /public/reviews` |
| Menu / Katalog | `MenuPage.jsx` | `GET /public/menus/active`, `GET /public/schedules`, `GET /public/slots` |
| Login | `LoginPage.jsx` | `POST /auth/login` |
| Register | `RegisterPage.jsx` | `POST /auth/register` |
| Checkout | `CheckoutPage.jsx` | `POST /public/coverage-check`, `POST /cart/calculate`, `POST /order/checkout` |
| Pesanan Aktif | `PesananPage.jsx` | `GET /user/orders?status=PAID,IN_KITCHEN,ON_DELIVERY` |
| Riwayat | `RiwayatPage.jsx` | `GET /user/orders?status=COMPLETED,CANCELLED` |
| Profil | `ProfilePage.jsx` | `GET /user/profile`, `PATCH /user/profile` |
| Admin Dashboard | `AdminDashboardPage.jsx` | `GET /admin/analytics/overview` |
| Admin Pesanan | `AdminOrdersPage.jsx` | `GET /admin/orders`, `PATCH /admin/orders/:id/status` |
| Admin Detail Pesanan | `AdminOrderDetailPage.jsx` | `GET /admin/orders/:id`, `PATCH /admin/orders/:id/status` |
| Admin Menu | `AdminMenuPage.jsx` | `GET/POST/PATCH/DELETE /admin/menus` |
| Admin Slots | `AdminSlotsPage.jsx` | `GET/POST/PATCH/DELETE /admin/slots` |
| Admin Customers | `AdminCustomersPage.jsx` | `GET /admin/customers`, `PATCH /admin/customers/:id/status` |
| Admin Reviews | `AdminReviewsPage.jsx` | `GET /admin/reviews` |
| Admin Reports | `AdminReportsPage.jsx` | `GET /admin/analytics/overview`, `GET /admin/analytics/charts` |

---

## Database & Prisma

### Schema Utama

```
User → Address, Order, Subscription, Review
Order → OrderItem, Payment, Review, DeliverySlot, Address
Subscription → SubscriptionSkip, Order, DeliverySlot, Address
Menu → DailyMenuSchedule, OrderItem
Payment → Order
SystemSetting (id=1, singleton)
```

### Perintah Prisma Berguna

```bash
# Generate Prisma Client (setelah edit schema.prisma)
npx prisma generate

# Buat & jalankan migrasi baru
npx prisma migrate dev --name nama_migrasi

# Reset database (hati-hati: menghapus semua data!)
npx prisma migrate reset

# Buka Prisma Studio (GUI database)
npx prisma studio

# Push schema ke DB tanpa membuat file migrasi (dev only)
npx prisma db push
```

### Migrasi yang Perlu Dijalankan

Setelah project ini di-clone dan DB sudah siap:

```bash
npx prisma migrate dev
```

Ini akan menjalankan semua migrasi termasuk penambahan kolom `rejectionReason` pada tabel `Order`.

