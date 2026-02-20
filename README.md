# E-book Store

Aplikasi E-book Store adalah platform marketplace digital untuk jual-beli e-book yang dibangun dengan Laravel sebagai backend dan React (Inertia.js) sebagai frontend. Sistem ini mendukung dua role utama: **Buyer** (pembeli) dan **Seller** (penjual).

## 🚀 Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, TypeScript, Inertia.js
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Database**: MySQL
- **Payment Gateway**: Xendit
- **Tools**: Vite, TanStack Table

## ✨ Features

### Untuk Buyer:
- 🛒 Browse dan pencarian e-book
- 🛍️ Shopping cart system
- 💳 Checkout dengan Xendit payment gateway
- 📄 Invoice & transaction history
- 📥 Download e-book yang sudah dibeli
- 👤 Profile management

### Untuk Seller:
- 📚 Product management (CRUD)
- 💰 Balance management & withdrawal
- 📊 Transaction history
- 📈 Dashboard analytics
- 🎨 File upload untuk cover & e-book

## 📋 Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- NPM atau Yarn
- MySQL >= 8.0
- Laragon/XAMPP/MAMP (atau web server lainnya)

## 🔧 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd ebook-store
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy file .env.example ke .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Configuration

Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ebook_store
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Xendit Configuration (Optional)

Jika ingin mengaktifkan payment gateway, tambahkan Xendit credentials di `.env`:

```env
XENDIT_API_KEY=your_xendit_api_key
XENDIT_CALLBACK_TOKEN=your_callback_token
```

> **Note**: Untuk development, Anda bisa menggunakan Xendit test mode. Daftar di [https://xendit.co](https://xendit.co) untuk mendapatkan API key.

### 6. Create Database

Buat database baru dengan nama `ebook_store`:

```sql
CREATE DATABASE ebook_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 7. Run Migrations & Seeders

```bash
# Run migrations
php artisan migrate

# Run seeders (optional - untuk data dummy)
php artisan db:seed
```

### 8. Storage Link

```bash
# Create symbolic link untuk storage
php artisan storage:link
```

### 9. Build Frontend Assets

```bash
# Development mode
npm run dev

# Production build
npm run build
```

## 🎯 Running the Application

### Development Mode

Jalankan 3 command ini di terminal terpisah:

```bash
# Terminal 1 - Laravel Server
php artisan serve

# Terminal 2 - Queue Worker (untuk background jobs)
php artisan queue:listen --tries=1

# Terminal 3 - Vite Dev Server
npm run dev
```

**Atau gunakan composer script** (lebih mudah):

```bash
composer dev
```

Aplikasi akan berjalan di:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

### Production Mode

```bash
# Build assets
npm run build

# Start server
php artisan serve
```

## 👥 Default Credentials

Setelah menjalankan seeder, Anda bisa login dengan:

### Buyer Account
- **Email**: adi.novendra.p@gmail.com
- **Password**: password

### Seller Account
- **Email**: seller@gmail.com
- **Password**: seller

## 📁 Project Structure

```
ebook-store/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/          # Seller controllers
│   │   │   ├── User/           # Buyer controllers
│   │   │   └── Auth/           # Authentication
│   │   └── Middleware/
│   └── Models/                 # Eloquent models
├── database/
│   ├── migrations/             # Database migrations
│   ├── factories/              # Model factories
│   └── seeders/                # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/         # React components
│   │   ├── pages/              # Inertia pages
│   │   ├── layouts/            # Layout components
│   │   └── types/              # TypeScript types
│   └── css/                    # Styles
├── routes/
│   ├── web.php                 # Web routes
│   ├── api.php                 # API routes
│   └── auth.php                # Auth routes
└── public/                     # Public assets
```

## 🗄️ Database Schema

### Main Tables:
- **users** - User accounts (buyers & sellers)
- **sellers** - Seller profiles
- **products** - E-book products
- **product_details** - Product metadata (author, ISBN, etc)
- **payment_types** - Payment method types
- **carts** - Shopping cart items
- **invoices** - Transaction records
- **invoice_products** - Invoice line items
- **balances** - Seller balance tracking

## 🔑 Key Features Implementation

### Authentication & Authorization
- Laravel Breeze untuk authentication
- Custom middleware `EnsureSeller` untuk role-based access
- Email verification

### File Management
- Upload cover images (jpeg, png, jpg, gif - max 10MB)
- Upload e-book files (pdf, epub, mobi - max 50MB)
- Storage menggunakan Laravel Storage facade

### Payment Integration
- Xendit payment gateway
- Invoice generation dengan auto-increment
- Payment callback handling
- Multiple payment channels

### Frontend
- React dengan TypeScript
- Inertia.js untuk SPA experience
- shadcn/ui components
- TanStack Table untuk data display
- Responsive design

## 🛠️ Development Commands

```bash
# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh migration with seed
php artisan migrate:fresh --seed

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate IDE helper (optional)
php artisan ide-helper:generate
php artisan ide-helper:models

# Run tests
php artisan test

# Code formatting
npm run format
npm run lint
```

## 🐛 Troubleshooting

### Error: "No application encryption key has been specified"
```bash
php artisan key:generate
```

### Error: "Storage link already exists"
```bash
# Hapus link lama dan buat baru
rm public/storage
php artisan storage:link
```

### Error: "SQLSTATE[HY000] [1045] Access denied"
- Pastikan konfigurasi database di `.env` sudah benar
- Pastikan MySQL service sudah running

### Error: "npm run dev" tidak jalan
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Frontend tidak menampilkan styles
```bash
# Build ulang assets
npm run build
```

## 📝 Notes

- Pastikan menggunakan PHP 8.2 atau lebih tinggi
- Untuk production, jangan lupa mengubah `APP_ENV=production` dan `APP_DEBUG=false` di `.env`
- Backup database secara berkala
- Untuk production deployment, gunakan queue worker dengan supervisor
- Konfigurasi mail driver di `.env` untuk email verification
