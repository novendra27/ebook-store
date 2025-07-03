// resources/js/pages/dashboard.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, Search, Star, Download, Eye, Heart } from 'lucide-react';
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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Hero Section */}
                <div className="relative h-[50vh] lg:h-[70vh] overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
                    <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12 lg:p-20 text-white z-20">
                        <div className="max-w-2xl">
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                                "Baca hari ini, pimpin esok hari."
                            </h1>
                            <p className="text-gray-200 text-sm sm:text-base lg:text-lg mb-6 max-w-lg">
                                Temukan ebook terbaik yang ingin kalian baca. Dapatkan pengetahuan baru, hiburan, dan inspirasi dari berbagai genre yang
                                tersedia di toko kami.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 shadow-lg">
                                    <Search className="h-4 w-4 mr-2" />
                                    Jelajahi E-Book
                                </Button>
                                <Button variant="outline" className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-600 px-6 py-3 shadow-lg">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Wishlist
                                </Button>
                            </div>
                        </div>
                    </div>
                    <img
                        className="h-full w-full object-cover object-center"
                        src="/assets/dashboard.jpg"
                        alt="Dashboard Hero"
                    />
                </div>

                {/* Search Section */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Ebook</p>
                                <p className="text-2xl font-bold">{products.length}</p>
                            </div>
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Download className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ebook Gratis</p>
                                <p className="text-2xl font-bold">{products.filter(p => p.payment_type_id === 2).length}</p>
                            </div>
                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Star className="h-4 w-4 text-green-600" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ebook Premium</p>
                                <p className="text-2xl font-bold">{products.filter(p => p.payment_type_id === 1).length}</p>
                            </div>
                            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="h-4 w-4 text-purple-600" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tersedia</p>
                                <p className="text-2xl font-bold">{products.filter(p => p.stock > 0).length}</p>
                            </div>
                            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <Eye className="h-4 w-4 text-orange-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Products Section */}
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
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
                                            className="aspect-[3/4] w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA5MEgxMjBWMTA3SDgwVjkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTIwSDE0MFYxMjVINjBWMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTMwSDE0MFYxMzVINjBWMTMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTQwSDEyMFYxNDVINjBWMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
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
                                                    <Download className="h-3 w-3 mr-1" />
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
                                    <div className="p-3 space-y-2">
                                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                        {product.product_detail?.author && (
                                            <p className="text-xs text-gray-500">
                                                oleh {product.product_detail.author}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-green-600">
                                                    {formatCurrency(product.price)}
                                                </span>
                                                {product.fake_price > product.price && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {formatCurrency(product.fake_price)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Stok: {product.stock}
                                            </div>
                                        </div>
                                        {product.product_detail && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                {product.product_detail.language && (
                                                    <span>{product.product_detail.language}</span>
                                                )}
                                                {product.product_detail.page && (
                                                    <span>• {product.product_detail.page} hal</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* No Products State */}
                        {filteredProducts.length === 0 && searchTerm && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Tidak ada hasil</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Tidak ditemukan produk dengan kata kunci "{searchTerm}"
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchTerm('')}
                                    className="text-sm"
                                >
                                    Hapus Pencarian
                                </Button>
                            </div>
                        )}

                        {/* Empty State */}
                        {products.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Belum Ada Produk</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Data produk masih kosong. Silakan jalankan seeder untuk menambahkan data sample.
                                </p>
                                <code className="rounded bg-gray-100 px-3 py-2 text-xs font-mono dark:bg-gray-800">
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
