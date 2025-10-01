# Database Setup Guide

## Masalah yang Ditemukan

1. **File .env tidak ada** - Konfigurasi database tidak ditemukan
2. **Prisma client tidak sinkron** - Model masih menggunakan `Work` bukan `works`
3. **PowerShell error** - Mencegah perintah npm berjalan

## Langkah-langkah Perbaikan

### 1. Buat File .env

Buat file `.env` di root project dengan konfigurasi berikut:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# MySQL Database Configuration (for lib/db.ts)
DB_HOST=localhost
DB_USER=username
DB_PASS=password
DB_NAME=database_name

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Production URL (update this for your hosting)
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 2. Update Konfigurasi untuk Hosting

Untuk hosting, ganti konfigurasi berikut:

```env
# Production Database
DATABASE_URL="mysql://your_hosting_user:your_hosting_password@your_hosting_host:3306/your_database_name"

DB_HOST=your_hosting_host
DB_USER=your_hosting_user
DB_PASS=your_hosting_password
DB_NAME=your_database_name

# Production URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 3. Regenerate Prisma Client

Karena ada masalah PowerShell, coba jalankan perintah ini secara manual:

```bash
# Di terminal hosting atau local
npx prisma generate
npx prisma db push
```

### 4. Test Koneksi Database

Jalankan script test:

```bash
npx tsx scripts/test-db-connection.ts
```

## Troubleshooting

### Error PowerShell
Jika ada error PowerShell, coba:
1. Gunakan Command Prompt (cmd) bukan PowerShell
2. Atau jalankan perintah langsung di hosting panel

### Error Database Connection
1. Pastikan database server berjalan
2. Periksa kredensial database
3. Pastikan database dan tabel sudah dibuat
4. Periksa firewall dan network connectivity

### Error Prisma
1. Pastikan schema.prisma sudah benar
2. Jalankan `npx prisma generate`
3. Jalankan `npx prisma db push`
4. Restart aplikasi

## Struktur Database yang Diperlukan

### Tabel `works`
```sql
CREATE TABLE works (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  year VARCHAR(255),
  img VARCHAR(255),
  description TEXT NOT NULL
);
```

### Tabel `work_gallery`
```sql
CREATE TABLE work_gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  work_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
);
```

## Checklist Setup

- [ ] File .env dibuat dengan konfigurasi yang benar
- [ ] Database server berjalan
- [ ] Tabel works dan work_gallery sudah dibuat
- [ ] Prisma client di-regenerate
- [ ] Test koneksi berhasil
- [ ] Aplikasi bisa start tanpa error

## Kontak Support

Jika masih ada masalah, berikan informasi berikut:
1. Error message lengkap
2. Konfigurasi hosting yang digunakan
3. Hasil dari script test-db-connection.ts
4. Log dari aplikasi

