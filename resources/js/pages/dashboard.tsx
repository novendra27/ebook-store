// resources/js/pages/dashboard.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Download, Eye, Search, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

// === DEFINISI TIPE DATA ===
interface Product {
    id: number;
    name: string;
    price: number;
    fake_price: number;
    cover: string;
    description: string;
    stock: number;
    is_download: boolean;
    payment_type_id: number;
    seller?: {
        id: number;
        user: {
            name: string;
        };
    };
    product_detail?: {
        author: string;
        language: string;
        page: number;
    };
}

interface DashboardProps {
    auth: {
        user: User;
    };
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

// Helper untuk format mata uang
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function Dashboard({ products }: DashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Hero Section */}
                <div className="relative h-[50vh] overflow-hidden rounded-xl border border-sidebar-border/70 lg:h-[70vh] dark:border-sidebar-border">
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-transparent"></div>
                    <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 text-white sm:p-12 lg:p-20">
                        <div className="max-w-2xl">
                            <h1 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">"Baca hari ini, pimpin esok hari."</h1>
                            <p className="mb-6 max-w-lg text-sm text-gray-200 sm:text-base lg:text-lg">
                                Temukan ebook terbaik yang ingin kalian baca. Dapatkan pengetahuan baru, hiburan, dan inspirasi dari berbagai genre
                                yang tersedia di toko kami.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button className="bg-blue-600 px-6 py-3 text-white shadow-lg hover:bg-blue-700">
                                    <a href="#product-catalog" className="width-full flex items-center justify-center gap-2">
                                        <Search className="mr-2 h-4 w-4" />
                                        Jelajahi E-Book
                                    </a>
                                </Button>
                                {/* <Button
                                    variant="outline"
                                    className="border-2 border-white bg-white/10 px-6 py-3 text-white shadow-lg backdrop-blur-sm hover:bg-white hover:text-blue-600"
                                >
                                    <Heart className="mr-2 h-4 w-4" />
                                    Wishlist
                                </Button> */}
                            </div>
                        </div>
                    </div>
                    <img className="h-full w-full object-cover object-center" src="/assets/dashboard.jpg" alt="Dashboard Hero" />
                </div>

                {/* Search Section */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            placeholder="Cari ebook, penulis, atau kategori..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            {filteredProducts.length} dari {products.length} produk
                        </span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Ebook</p>
                                <p className="text-2xl font-bold">{products.length}</p>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <Download className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ebook Gratis</p>
                                <p className="text-2xl font-bold">{products.filter((p) => p.payment_type_id === 2).length}</p>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                <Star className="h-4 w-4 text-green-600" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ebook Premium</p>
                                <p className="text-2xl font-bold">{products.filter((p) => p.payment_type_id === 1).length}</p>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                <ShoppingCart className="h-4 w-4 text-purple-600" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tersedia</p>
                                <p className="text-2xl font-bold">{products.filter((p) => p.stock > 0).length}</p>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                                <Eye className="h-4 w-4 text-orange-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Products Section */}
                <Card id="product-catalog">
                    <CardHeader className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                        <div>
                            <CardTitle className="text-xl">Katalog Produk</CardTitle>
                            <CardDescription>Koleksi ebook terbaik dan terlengkap untuk kebutuhan membaca Anda</CardDescription>
                        </div>
                        <Link href={route('dashboard')} className="text-sm text-primary hover:underline">
                            Lihat Semua
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filteredProducts.map((product) => (
                                <Link
                                    href={route('products.show', product.id)}
                                    key={product.id}
                                    className="group block overflow-hidden rounded-lg border transition-all hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="relative">
                                        <img
                                            src={`/storage/${product.cover}`}
                                            alt={product.name}
                                            className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA5MEgxMjBWMTA3SDgwVjkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTIwSDE0MFYxMjVINjBWMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTMwSDE0MFYxMzVINjBWMTMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTQwSDEyMFYxNDVINjBWMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                            }}
                                        />
                                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                                            {product.payment_type_id === 2 && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                    Gratis
                                                </Badge>
                                            )}
                                            {product.is_download && (
                                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                                    <Download className="mr-1 h-3 w-3" />
                                                    Download
                                                </Badge>
                                            )}
                                        </div>
                                        {product.fake_price > product.price && (
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="destructive" className="bg-red-500 text-white">
                                                    -{Math.round(((product.fake_price - product.price) / product.fake_price) * 100)}%
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2 p-3">
                                        <h3 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
                                            {product.name}
                                        </h3>
                                        {product.product_detail?.author && (
                                            <p className="text-xs text-gray-500">oleh {product.product_detail.author}</p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-green-600">{formatCurrency(product.price)}</span>
                                                {product.fake_price > product.price && (
                                                    <span className="text-xs text-gray-400 line-through">{formatCurrency(product.fake_price)}</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">Stok: {product.stock}</div>
                                        </div>
                                        {product.product_detail && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                {product.product_detail.language && <span>{product.product_detail.language}</span>}
                                                {product.product_detail.page && <span>• {product.product_detail.page} hal</span>}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* No Products State */}
                        {filteredProducts.length === 0 && searchTerm && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">Tidak ada hasil</h3>
                                <p className="mb-4 text-sm text-gray-600">Tidak ditemukan produk dengan kata kunci "{searchTerm}"</p>
                                <Button variant="outline" onClick={() => setSearchTerm('')} className="text-sm">
                                    Hapus Pencarian
                                </Button>
                            </div>
                        )}

                        {/* Empty State */}
                        {products.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">Belum Ada Produk</h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    Data produk masih kosong. Silakan jalankan seeder untuk menambahkan data sample.
                                </p>
                                <code className="rounded bg-gray-100 px-3 py-2 font-mono text-xs dark:bg-gray-800">
                                    php artisan migrate:fresh --seed
                                </code>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
