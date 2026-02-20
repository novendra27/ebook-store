# E-book Store

E-book Store is a digital marketplace platform for buying and selling e-books built with Laravel as the backend and React (Inertia.js) as the frontend. The system supports two main roles: **Buyer** and **Seller**.

## 🚀 Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, TypeScript, Inertia.js
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Database**: MySQL
- **Payment Gateway**: Xendit
- **Tools**: Vite, TanStack Table

## ✨ Features

### For Buyers:
- 🛒 Browse and search e-books
- 🛍️ Shopping cart system
- 💳 Checkout with Xendit payment gateway
- 📄 Invoice & transaction history
- 📥 Download purchased e-books
- 👤 Profile management

### For Sellers:
- 📚 Product management (CRUD)
- 💰 Balance management & withdrawal
- 📊 Transaction history
- 📈 Dashboard analytics
- 🎨 File upload for covers & e-books

## 📋 Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- NPM or Yarn
- MySQL >= 8.0
- Laragon/XAMPP/MAMP (or other web server)

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
# Copy .env.example to .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Configuration

Edit the `.env` file and adjust it to your database configuration:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ebook_store
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Xendit Configuration (Optional)

If you want to enable payment gateway, add Xendit credentials in `.env`:

```env
XENDIT_API_KEY=your_xendit_api_key
XENDIT_CALLBACK_TOKEN=your_callback_token
```

> **Note**: For development, you can use Xendit test mode. Register at [https://xendit.co](https://xendit.co) to get an API key.

### 6. Create Database

Create a new database named `ebook_store`:

```sql
CREATE DATABASE ebook_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 7. Run Migrations & Seeders

```bash
# Run migrations
php artisan migrate

# Run seeders (optional - for dummy data)
php artisan db:seed
```

### 8. Storage Link

```bash
# Create symbolic link for storage
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

Run these 3 commands in separate terminals:

```bash
# Terminal 1 - Laravel Server
php artisan serve

# Terminal 2 - Queue Worker (for background jobs)
php artisan queue:listen --tries=1

# Terminal 3 - Vite Dev Server
npm run dev
```

**Or use composer script** (easier):

```bash
composer dev
```

The application will run at:
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

After running the seeder, you can login with:

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
- Laravel Breeze for authentication
- Custom middleware `EnsureSeller` for role-based access
- Email verification

### File Management
- Upload cover images (jpeg, png, jpg, gif - max 10MB)
- Upload e-book files (pdf, epub, mobi - max 50MB)
- Storage using Laravel Storage facade

### Payment Integration
- Xendit payment gateway
- Invoice generation with auto-increment
- Payment callback handling
- Multiple payment channels

### Frontend
- React with TypeScript
- Inertia.js for SPA experience
- shadcn/ui components
- TanStack Table for data display
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
# Remove old link and create new one
rm public/storage
php artisan storage:link
```

### Error: "SQLSTATE[HY000] [1045] Access denied"
- Make sure database configuration in `.env` is correct
- Make sure MySQL service is running

### Error: "npm run dev" not working
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend not displaying styles
```bash
# Rebuild assets
npm run build
```

## 📝 Notes

- Make sure to use PHP 8.2 or higher
- For production, don't forget to change `APP_ENV=production` and `APP_DEBUG=false` in `.env`
- Backup database regularly
- For production deployment, use queue worker with supervisor
- Configure mail driver in `.env` for email verification
