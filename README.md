# Cateringin

Cateringin adalah sistem manajemen layanan katering yang dibangun menggunakan arsitektur backend modern. Sistem ini memfasilitasi pengelolaan pesanan katering, penjadwalan slot (Pagi, Siang, Sore), dan manajemen berbagai peran pengguna seperti Admin, staf Dapur (Kitchen), dan Pengemudi (Driver).

## Fitur Utama (Features)
- **Manajemen Pengguna (User Management):** Role-based access control (RBAC) untuk Admin, Dapur, dan Pengemudi.
- **Manajemen Slot Waktu:** Pengaturan slot pengiriman katering (Pagi, Siang, Sore).
- **Integrasi Database Terstruktur:** Pengelolaan data terpusat menggunakan Prisma ORM dan MariaDB.
- **Dokumentasi API Terpusat:** Dokumentasi interaktif dengan Scalar dan Swagger API.

## Prasyarat (Prerequisites)
Pastikan Anda telah menginstal perangkat lunak berikut sebelum memulai:
- **Node.js** (versi 18.x atau yang lebih baru direkomendasikan)
- **npm** atau **yarn**
- **MariaDB** (berjalan secara lokal atau menggunakan layanan cloud)

## Instalasi & Cara Menjalankan (Getting Started / Installation)
1. **Clone repository ini:**
   ```bash
   git clone <url-repository-anda>
   cd Cateringin
   ```
2. **Instal dependensi:**
   ```bash
   npm install
   ```
3. **Konfigurasi Environment:**
   Buat file `.env` di root direktori dan sesuaikan pengaturan database Anda:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/cateringin"
   ```
4. **Jalankan migrasi dan seed database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
5. **Jalankan aplikasi:**
   ```bash
   # mode development
   npm run start
   
   # mode watch (direkomendasikan untuk development)
   npm run start:dev
   
   # mode production
   npm run start:prod
   ```

## Panduan Penggunaan (Usage / Demo)
Setelah aplikasi berjalan, dokumentasi API dapat diakses melalui browser dengan mengunjungi base URL aplikasi Anda (misalnya `http://localhost:3000`).
Anda dapat menggunakan dokumentasi API bawaan untuk menguji endpoint seperti login, manajemen pengguna, dan pengelolaan pesanan.

## Teknologi yang Digunakan (Tech Stack)
- **Framework Utama:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** MariaDB
- **Dokumentasi API:** Scalar / Swagger
- **Bahasa Pemrograman:** TypeScript

## Struktur Folder (Project Structure)
```text
Cateringin/
├── src/                # Kode sumber utama aplikasi (Controllers, Services, Modules)
├── prisma/             # Skema Prisma, file konfigurasi, dan seed database
├── test/               # File pengujian (Unit & E2E Tests)
├── .env                # File konfigurasi environment
├── package.json        # Informasi project dan dependensi
└── README.md           # Dokumentasi project
```

## Panduan Kontribusi (Contributing)
Kami menyambut kontribusi dari siapa saja! 
1. Lakukan *Fork* pada repository ini.
2. Buat *branch* fitur Anda (`git checkout -b feature/fitur-baru`).
3. Lakukan *commit* pada perubahan Anda (`git commit -m 'feat: menambahkan fitur baru'`).
4. *Push* ke branch Anda (`git push origin feature/fitur-baru`).
5. Buat *Pull Request*.

Pastikan kode Anda mengikuti standar *linting* (dengan menjalankan `npm run lint`) dan semua tes berjalan lancar.

## Pengujian (Testing)
Aplikasi ini menggunakan Jest untuk pengujian. Anda dapat menjalankan tes dengan perintah:
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Lisensi & Kredit (License & Authors)
- **Lisensi:** UNLICENSED (Proyek Privat)
- **Authors:** Cateringin Team
