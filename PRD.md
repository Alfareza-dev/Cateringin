# Product Requirement Document (PRD)
**Nama Proyek:** Platform Catering Harian & Order System  
**Versi Dokumen:** 1.0
**Tanggal:** 30 Juli 2026  
**Tech Stack Utama:**  
- **Backend:** NestJS (Modular Monolith, Clean Architecture)  
- **Database & ORM:** PostgreSQL + Prisma ORM  
- **Payment Gateway:** Louvin API  
- **API Documentation:** Scalar (`@scalar/nestjs-api-reference`)  
- **Development Tool:** Google Antigravity Agentic Ecosystem  

---

## 1. Executive Summary & Objective

Membangun platform catering harian *end-to-end* yang memungkinkan pelanggan berlangganan paket makanan harian secara fleksibel (kustomisasi jadwal, lokasi, dan fitur *pause/skip* hari), mempermudah operasional dapur melalui pengelompokan pesanan secara otomatis (*batching*), memfasilitasi status pengiriman dengan estimasi kedatangan (ETA), serta menyediakan dasbor analitik bisnis yang komprehensif untuk manajemen/admin.

---

## 2. User Roles & Permissions

| Role | Deskripsi & Hak Akses |
| :--- | :--- |
| **Customer** | Mengakses landing page, registrasi/login, membeli paket harian/langganan, mengelola *pause/skip* hari, checkout via Louvin PG, melihat estimasi kedatangan (ETA) & status pesanan, serta memberikan ulasan. |
| **Admin / Owner** | Mengakses dasbor eksekutif, kelola menu harian, kelola slot jam pengiriman, memproses status pesanan, kelola CRM customer, dan konfigurasi profil usaha. |
| **Kitchen Staff** | Mengakses *Kitchen Display System (KDS)* untuk melihat total porsi masakan yang harus disiapkan per slot waktu (*batch production view*). |
| **Driver / Kurir** | Mengakses antarmuka sederhana untuk mengubah status pesanan dari `IN_KITCHEN` -> `ON_DELIVERY` -> `DELIVERED` dan mengunggah bukti pengiriman (*proof of delivery*). |

---

## 3. Detailed Scope & Functional Requirements

### A. Public Landing Page & Branding
1. **Hero Section:** Banner promo, penawaran utama, dan Call to Action (CTA) "Pesan Sekarang".
2. **Katalog & Daftar Menu:** Display katalog favorit, paket harian/mingguan/bulanan, detail komposisi, dan kalori/nutrisi (jika ada).
3. **Cek Coverage Area Pengiriman:** Input alamat/koordinat untuk memeriksa apakah alamat pelanggan masuk dalam radius operasional dapur.
4. **Testimoni & Ulasan:** Menampilkan ulasan bintang (1–5) dan masukan dari pelanggan sebelumnya.
5. **Informasi Usaha & Standar Mutu:** Halaman informasi higienitas, komitmen kualitas bahan, visi-misi, serta alamat lokasi dapur utama.
6. **Transparansi Harga:** Simulasi/kalkulator harga paket berlangganan berdasarkan durasi dan jumlah porsi.

---

### B. Authentication & Customer Portal
1. **Authentication Engine:**
   * Register, Login, Logout, Forgot/Reset Password (JWT Access & Refresh Tokens).
   * Guard otorisasi berdasarkan Role (`CUSTOMER`, `ADMIN`, `KITCHEN`, `DRIVER`).
2. **User Profile & Address Management:**
   * Manajemen profil (Nama, No. WhatsApp, Email).
   * Alamat Pengiriman (*Multiple Addresses*): Menyimpan nama alamat (Rumah, Kantor), detail instruksi, serta Pinpoint Lat/Long Google Maps untuk kalkulasi jarak.
   * Preferensi Diet & Alergi: Catatan sistemik terkait pantangan makanan.
3. **Subscription Management System:**
   * Pelanggan dapat memilih durasi langganan (misal: 5 Hari, 10 Hari, 30 Hari).
   * **Aturan Bisnis "Pause & Skip Day":**
     * Pelanggan dapat membatalkan/menggeser pengiriman untuk tanggal tertentu.
     * *Cut-off Time:* Maksimal H-1 jam 18:00 WIB.
     * Kuota hari yang di-*skip* otomatis menambahkan kuota aktif di akhir periode (*subscription extension*).
   * **Opsi Penerimaan:** *Delivery* (antar ke alamat) atau *Pickup* (ambil sendiri di dapur).

---

### C. Checkout & Payment Gateway Integration (Louvin)
1. **Checkout Engine:**
   * Validasi dan pemilihan slot jam pengiriman/pengambilan (Contoh: Slot Pagi 06:30–08:00, Slot Siang 11:00–12:30).
   * Kalkulasi biaya pengiriman dinamis berdasarkan jarak dari lokasi dapur ke alamat customer.
   * Input *Special Notes* per transaksi (misal: "Tanpa pedas", "Satu sendok kayu saja").
2. **Louvin Payment Gateway Integration:**
   * Pembuatan transaksi pembayaran (*Create Payment/Invoice*) via API Louvin.
   * Mendukung opsi pembayaran yang disediakan Louvin (Virtual Account, QRIS, E-Wallet, dll).
   * **Webhook Callback Listener:**
     * Handler untuk menerima notifikasi callback status transaksi dari Louvin (`PAID`, `EXPIRED`, `FAILED`).
     * Verifikasi *signature/token* webhook Louvin demi keamanan data.
     * *Auto-reconciliation:* Mengubah status pesanan otomatis menjadi `PAID` ketika callback `SUCCESS` diterima.

---

### D. Order Tracking, ETA & Review System
1. **Status Pipeline & Estimasi Kedatangan (ETA):**
   * *Status Lifecycle:* `PENDING_PAYMENT` $\rightarrow$ `PAID` $\rightarrow$ `IN_KITCHEN` $\rightarrow$ `ON_DELIVERY` $\rightarrow$ `DELIVERED` $\rightarrow$ `COMPLETED`.
   * **Estimasi Waktu Kedatangan (ETA):** Kalkulasi estimasi jam tiba berdasarkan waktu pesanan masuk ke status `ON_DELIVERY` + estimasi menit perjalanan berdasarkan jarak pengiriman.
   * Tampilan *progress bar* status pesanan yang mudah dipahami di portal customer.
2. **Pickup Order Flow:**
   * Untuk pesanan *Pickup*, sistem menyediakan tombol buka Google Maps lokasi dapur.
   * Generasi Kode Verifikasi Penjemputan (PIN 4 Digit / QR Code) yang ditunjukkan ke tim dapur saat mengambil makanan.
3. **Review & Feedback System:**
   * Form review terbuka setelah status pesanan berubah menjadi `DELIVERED` / `COMPLETED`.
   * Input: Rating Bintang (1–5), Teks Kritik/Saran, dan Unggah Foto (*optional*).

---

### E. Kitchen Display System (KDS) & Operations
1. **Kitchen Batching View:**
   * Rekapitulasi otomatis total porsi masakan berdasarkan **Tanggal** dan **Slot Jam Pengiriman**.
   * *Contoh Output KDS:*
     > **Slot Siang (11:00 - 12:30) | Total: 100 Porsi**  
     > - Ayam Betutu: 60 Porsi  
     > - Nasi Merah: 40 Porsi | Nasi Putih: 60 Porsi  
     > - Special Notes: 5 Porsi Tanpa Pedas.
2. **Packing Labeling Engine:**
   * Generasi label/resi siap cetak per paket pelanggan berisi: Nama Customer, No HP, Alamat/Slot, Menu, & Special Notes.

---

### F. Admin Dashboard & Business Management
1. **Executive Dashboard:**
   * Ringkasan Metrik: Total Revenue, Total Pesanan Aktif, Total Active Subscribers.
   * Chart & Grafik Penjualan (Filter: Harian, Mingguan, Bulanan).
   * **Urgent Order Alert:** Indikator visual untuk pesanan baru masuk yang memerlukan tindakan dapur/admin segera.
2. **Order Management:**
   * Filter pesanan berdasarkan status, tanggal, slot waktu, dan tipe (Delivery/Pickup).
   * Pembatalan/penyesuaian pesanan secara manual oleh admin jika ada kendala operasional.
3. **Daily Menu Scheduler (CRUD):**
   * Mengatur variasi menu yang akan disajikan pada tanggal-tanggal tertentu di kalender.
4. **Slot & Capacity Management:**
   * Mengatur batas kuota maksimal pesanan per slot jam pengiriman untuk mencegah *overload* kapasitas produksi dapur.
5. **Customer Relationship Management (CRM):**
   * Database pelanggan, riwayat transaksi, riwayat *pause/skip*, dan penanganan komplain.
6. **Business Profile Settings:**
   * Pengaturan profil usaha, koordinat lokasi dapur utama, jam operasional, radius maksimal pengiriman, & banner promo landing page.

---

## 4. Non-Functional Requirements (Technical Standards)

1. **Architecture:** Clean Architecture & Modular Monolith pada NestJS.
2. **Database:** PostgreSQL dengan Prisma ORM (lengkap dengan *Migration Script* dan *Data Seeder*).
3. **API Documentation:** **Scalar API Reference** (`@scalar/nestjs-api-reference`) yang terintegrasi dengan OpenAPI spec NestJS untuk mempermudah eksplorasi API.
4. **Keamanan & Validasi:**
   * JWT Authentication dengan Expiry Time & Refresh Mechanism.
   * Input Validation menggunakan `class-validator` & `class-transformer`.
   * Verifikasi Signature Webhook Louvin.