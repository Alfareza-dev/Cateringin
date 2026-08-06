# Platform Catering Harian & Order System

Platform Catering Harian & Order System adalah sistem komprehensif yang dirancang untuk mengelola pemesanan katering, penjadwalan, manajemen dapur, dan pelacakan pengiriman. Sistem ini memisahkan secara jelas akses dan fitur berdasarkan peran pengguna untuk memastikan efisiensi dan keamanan operasional.

## 1. Overview Proyek & Tech Stack Utama

Proyek ini dibangun menggunakan arsitektur modern yang skalabel dan mudah dipelihara, baik dari sisi backend maupun integrasi pihak ketiga.

- **Framework Backend:** [NestJS](https://nestjs.com/) (TypeScript) - Menawarkan arsitektur modular yang kuat dan maintainable.
- **Database & ORM:** PostgreSQL dengan [Prisma ORM](https://www.prisma.io/) - Mengelola relasi data kompleks dengan performa tinggi dan tipe data yang aman (type-safe).
- **Payment Gateway:** [Louvin Payment Gateway] - Terintegrasi untuk pemrosesan transaksi otomatis, checkout order, dan validasi status pembayaran via webhook.
- **Dokumentasi API:** [Scalar API Docs] - Dokumentasi API yang interaktif, modern, dan terpusat (dapat diakses pada endpoint `/reference`).

## 2. Matrix User Roles & Hak Akses

Sistem ini menerapkan Role-Based Access Control (RBAC) yang ketat untuk mengamankan fungsionalitas dan data:

| Role       | Akses & Kemampuan Utama |
|------------|-------------------------|
| **PUBLIC** | Mengakses menu aktif, jadwal publik, slot yang tersedia, dan cek jangkauan pengiriman. Tidak memerlukan autentikasi. |
| **CUSTOMER** | Mendaftar/Login, mengelola profil dan alamat (termasuk alamat utama), melihat menu, menghitung keranjang, checkout pesanan, membuat dan mengelola langganan (pause, resume, skip day), melacak pesanan, dan memberikan ulasan (review). |
| **ADMIN**  | Mengelola keseluruhan sistem (CRUD): Pengguna/Customer, Slot Waktu, Menu, Jadwal Menu, Settings, memantau Analitik, memperbarui status pesanan secara manual, dan memantau ulasan. |
| **KITCHEN**| Memantau pesanan dalam *batch view* (KDS), memulai proses memasak, serta mencetak atau melihat label pesanan dan mencetak label pengiriman. Memperbarui status pesanan dari dapur. |
| **DRIVER** | Melihat daftar pengiriman yang ditugaskan dan memperbarui status pengiriman secara real-time di perjalanan. |

## 3. Pemetaan Sitemap & Page Routing Frontend

Meskipun sistem backend beroperasi melalui API, berikut adalah rancangan pemetaan sitemap untuk implementasi Frontend:

### Landing Page & Public
- `/` - Halaman Utama (Hero, Fitur, Testimoni Singkat)
- `/menus` - Katalog Menu & Jadwal Makanan Harian
- `/coverage` - Cek Area Pengiriman
- `/auth/login` - Masuk ke Akun
- `/auth/register` - Daftar Akun Baru

### Customer Portal (Membutuhkan Login `CUSTOMER`)
- `/dashboard` - Ringkasan Pesanan & Langganan Aktif
- `/profile` - Pengaturan Profil & Manajemen Alamat
- `/cart` - Keranjang Belanja & Kalkulasi Harga
- `/checkout` - Halaman Pembayaran & Konfirmasi (Integrasi Louvin)
- `/orders` - Riwayat & Pelacakan Status Pesanan
- `/subscriptions` - Manajemen Langganan (Pause, Resume, Skip Day)

### Admin Dashboard (Membutuhkan Login `ADMIN`)
- `/admin` - Overview & Analitik
- `/admin/customers` - Manajemen Data Pelanggan
- `/admin/menus` - CRUD Katalog Menu & Varian
- `/admin/schedules` - Pengaturan Jadwal Menu Harian
- `/admin/slots` - Pengaturan Waktu/Slot Pengiriman (Pagi, Siang, Sore)
- `/admin/orders` - Pemantauan Semua Pesanan & Transaksi
- `/admin/reviews` - Moderasi Ulasan
- `/admin/settings` - Konfigurasi Sistem Utama

### Kitchen Display System / KDS (Membutuhkan Login `KITCHEN`)
- `/kitchen` - Layar Utama KDS (Daftar Antrean Pesanan per Slot/Hari)
- `/kitchen/batch` - Tampilan Batch Memasak
- `/kitchen/labels` - Cetak Label Kemasan & Label Pengiriman

### Driver View (Membutuhkan Login `DRIVER`)
- `/driver` - Daftar Tugas Pengiriman Hari Ini
- `/driver/route` - Panduan Rute & Detail Pengantaran
- `/driver/deliveries` - Konfirmasi Pengiriman Selesai

## 4. Daftar Lengkap Endpoint API per Modul

Sistem menyediakan antarmuka API RESTful. Endpoint dikelompokkan berdasarkan modul dengan otorisasi khusus:

### Auth Modul (Auth)
- `POST /auth/register` - Pendaftaran pengguna baru (`PUBLIC`)
- `POST /auth/login` - Autentikasi dan pembuatan token (`PUBLIC`)
- `POST /auth/refresh` - Refresh access token (`PUBLIC`)

### Modul Pengguna & Alamat (User / Address)
- `GET /user/profile` - Mengambil profil user login (`CUSTOMER`/`ANY_AUTH`)
- `PATCH /user/profile` - Memperbarui profil (`CUSTOMER`/`ANY_AUTH`)
- `POST /user/addresses` - Menambah alamat baru (`CUSTOMER`)
- `GET /user/addresses` - Mengambil daftar alamat (`CUSTOMER`)
- `GET /user/addresses/:id` - Detail alamat tertentu (`CUSTOMER`)
- `PATCH /user/addresses/:id` - Memperbarui alamat (`CUSTOMER`)
- `DELETE /user/addresses/:id` - Menghapus alamat (`CUSTOMER`)
- `PATCH /user/addresses/:id/primary` - Menjadikan alamat sebagai utama (`CUSTOMER`)

### Modul Katalog & Slot (Public / Menu / Slot)
*Public Endpoints:*
- `GET /public/menus/active` - Daftar menu yang aktif (`PUBLIC`)
- `GET /public/schedules` - Daftar jadwal katering (`PUBLIC`)
- `GET /public/slots` - Daftar slot pengiriman aktif (`PUBLIC`)
- `POST /public/coverage-check` - Pengecekan cakupan pengiriman (`PUBLIC`)

*Admin Menu Management:*
- `POST /admin/menus` - Menambah menu baru (`ADMIN`)
- `GET /admin/menus` - Daftar semua menu (`ADMIN`)
- `GET /admin/menus/:id` - Detail menu (`ADMIN`)
- `PATCH /admin/menus/:id` - Memperbarui menu (`ADMIN`)
- `DELETE /admin/menus/:id` - Menghapus menu (`ADMIN`)
- `POST /admin/menu-schedules` - Menambah jadwal menu (`ADMIN`)
- `POST /admin/menu-schedules/bulk` - Tambah jadwal menu massal (`ADMIN`)
- `GET /admin/menu-schedules` - Lihat jadwal menu admin (`ADMIN`)
- `DELETE /admin/menu-schedules/:id` - Hapus jadwal menu (`ADMIN`)

*Admin Slot Management:*
- `POST /admin/slots` - Menambah slot pengiriman (`ADMIN`)
- `GET /admin/slots` - Daftar semua slot (`ADMIN`)
- `PATCH /admin/slots/:id` - Memperbarui detail slot (`ADMIN`)
- `DELETE /admin/slots/:id` - Menghapus slot (`ADMIN`)

### Modul Keranjang & Langganan (Cart / Subscription)
- `POST /cart/calculate` - Kalkulasi subtotal, pajak, & ongkir keranjang (`CUSTOMER`)
- `POST /subscription/create` - Membuat langganan baru (`CUSTOMER`)
- `GET /subscription/my` - Daftar langganan saya (`CUSTOMER`)
- `GET /subscription/:id` - Detail langganan (`CUSTOMER`)
- `POST /subscription/:id/skip-day` - Melewati satu hari langganan (`CUSTOMER`)
- `POST /subscription/:id/pause` - Menghentikan sementara langganan (`CUSTOMER`)
- `POST /subscription/:id/resume` - Melanjutkan langganan (`CUSTOMER`)

### Modul Order & Payment (Louvin Integration)
- `POST /order/checkout` - Checkout dan inisiasi pembayaran via Louvin (`CUSTOMER`)
- `PATCH /admin/orders/:id/status` - Update status pesanan secara manual (`ADMIN`)
- `PATCH /user/orders/:id/complete` - Konfirmasi pesanan selesai oleh pelanggan (`CUSTOMER`)
- `GET /user/orders/:id/tracking` - Pelacakan status pesanan (`CUSTOMER`, `ADMIN`)
- `POST /payments/louvin/callback` - Webhook untuk menerima update pembayaran Louvin (`PUBLIC/SYSTEM`)

### Modul Dapur / KDS (Kitchen)
- `GET /kitchen/batch-view` - Tampilan batch pesanan untuk diproses (`KITCHEN`, `ADMIN`)
- `PATCH /kitchen/batch/start-cooking` - Memulai proses masak (`KITCHEN`, `ADMIN`)
- `GET /kitchen/labels` - Mendapatkan daftar label masakan (`KITCHEN`, `ADMIN`)
- `GET /kitchen/orders/:id/label` - Cetak label spesifik (`KITCHEN`, `ADMIN`)
- `PATCH /kitchen/orders/:id/status` - Update status masakan dari dapur (`KITCHEN`, `ADMIN`)

### Modul Pengemudi (Driver)
- `GET /driver/deliveries` - Daftar pesanan yang harus dikirim hari ini (`DRIVER`, `ADMIN`)
- `PATCH /driver/orders/:id/status` - Pembaruan status pengiriman di jalan (`DRIVER`, `ADMIN`)

### Modul Ulasan (Review)
- `POST /user/orders/:id/review` - Memberikan ulasan/rating untuk pesanan (`CUSTOMER`)
- `GET /public/reviews` - Mengambil ulasan publik untuk ditampilkan (`PUBLIC`)
- `GET /admin/reviews` - Memantau seluruh ulasan pelanggan (`ADMIN`)

### Modul Admin: Analytics, Customers, & Settings
- `GET /admin/analytics/overview` - Dashboard analitik utama (`ADMIN`)
- `GET /admin/analytics/charts` - Data grafik untuk dashboard (`ADMIN`)
- `GET /admin/customers` - Manajemen data pengguna/customer (`ADMIN`)
- `GET /admin/customers/:id` - Detail data customer (`ADMIN`)
- `PATCH /admin/customers/:id/status` - Mengaktifkan/menonaktifkan akun pengguna (`ADMIN`)
- `GET /admin/settings` - Mengambil konfigurasi sistem (`ADMIN`)
- `PATCH /admin/settings` - Memperbarui konfigurasi sistem (`ADMIN`)
