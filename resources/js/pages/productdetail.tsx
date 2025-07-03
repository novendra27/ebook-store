// resources/js/pages/productdetail.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Download, Star, Heart, Share2, Shield, Truck, Clock, Users, Award, BookOpen, Calendar, Globe, Hash, Eye, ThumbsUp } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

// === DEFINISI TIPE DATA YANG DIPERLUKAN ===
interface ProductDetailData {
    id: number;
    author: string;
    isbn: string;
    language: string;
    page: number;
    publish_date: string;
}

interface PaymentType {
    id: number;
    name: string;
}

interface Seller {
    id: number;
    user: {
        name: string;
    };
}

interface Product {
    id: number;
    name: string;
    price: number;
    fake_price: number;
    cover: string;
    description: string;
    seller: Seller;
    product_detail?: ProductDetailData;
    payment_type: PaymentType;
    stock: number;
    is_download: boolean;
    is_affiliate: boolean;
    start_date: string;
    end_date: string;
    note?: string;
    created_at?: string;
    updated_at?: string;
}

// Props yang diterima dari controller
interface ProductDetail {
    product: Product;
}

// Helper untuk format mata uang
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function ProductDetail({ product }: ProductDetail) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        quantity: 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cart.store'), {
            onSuccess: () => {
                window.dispatchEvent(new Event('cart-updated'));
            },
        });
    };

    // Generate dummy data untuk e-commerce experience
    const dummyRating = 4.5;
    const dummyReviews = Math.floor(Math.random() * 500) + 50;
    const dummySold = Math.floor(Math.random() * 1000) + 100;
    const dummyViews = Math.floor(Math.random() * 5000) + 500;
    const isPopular = dummySold > 500;
    const isNewRelease = new Date(product.created_at || new Date()).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: product.name, href: route('products.show', product.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Product Hero Section */}
                <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
                            {/* KOLOM KIRI: GAMBAR PRODUK */}
                            <div className="relative p-6 lg:p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                                <div className="relative max-w-sm w-full">
                                    {/* Frame/Border untuk cover */}
                                    <div className="relative bg-white dark:bg-gray-800 p-3 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                                        {/* Inner shadow untuk efek depth */}
                                        <div className="absolute inset-3 rounded-lg shadow-inner bg-gradient-to-b from-transparent to-black/5 dark:to-white/5"></div>
                                        
                                        {/* Gambar cover */}
                                        <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                                            <img
                                                src={`/storage/${product.cover}`}
                                                alt={product.name}
                                                className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA5MEgxMjBWMTA3SDgwVjkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTIwSDE0MFYxMjVINjBWMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTMwSDE0MFYxMzVINjBWMTMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTQwSDEyMFYxNDVINjBWMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                                }}
                                            />
                                            {/* Overlay gradient untuk efek profesional */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>
                                        </div>
                                        
                                        {/* Refleksi/gloss effect */}
                                        <div className="absolute top-3 left-3 right-3 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-lg pointer-events-none"></div>
                                    </div>
                                    
                                    {/* Garis dekoratif di sekitar frame */}
                                    <div className="absolute -top-3 -left-3 w-8 h-8 border-l-4 border-t-4 border-blue-500 dark:border-blue-400 rounded-tl-xl opacity-80"></div>
                                    <div className="absolute -top-3 -right-3 w-8 h-8 border-r-4 border-t-4 border-blue-500 dark:border-blue-400 rounded-tr-xl opacity-80"></div>
                                    <div className="absolute -bottom-3 -left-3 w-8 h-8 border-l-4 border-b-4 border-blue-500 dark:border-blue-400 rounded-bl-xl opacity-80"></div>
                                    <div className="absolute -bottom-3 -right-3 w-8 h-8 border-r-4 border-b-4 border-blue-500 dark:border-blue-400 rounded-br-xl opacity-80"></div>
                                    
                                    {/* Garis tengah untuk efek tambahan */}
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-60"></div>
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-60"></div>
                                </div>
                                
                                {/* Badges overlay */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                    {product.payment_type.id === 2 && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 shadow-md hover:shadow-lg transition-shadow">
                                            <Award className="h-3 w-3 mr-1" />
                                            GRATIS
                                        </Badge>
                                    )}
                                    {product.is_download && (
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800 shadow-md hover:shadow-lg transition-shadow">
                                            <Download className="h-3 w-3 mr-1" />
                                            Digital
                                        </Badge>
                                    )}
                                    {isPopular && (
                                        <Badge variant="default" className="bg-purple-100 text-purple-800 shadow-md hover:shadow-lg transition-shadow">
                                            <ThumbsUp className="h-3 w-3 mr-1" />
                                            Popular
                                        </Badge>
                                    )}
                                    {isNewRelease && (
                                        <Badge variant="default" className="bg-orange-100 text-orange-800 shadow-md hover:shadow-lg transition-shadow">
                                            <Star className="h-3 w-3 mr-1" />
                                            New
                                        </Badge>
                                    )}
                                </div>
                                
                                {/* Discount badge */}
                                {product.fake_price > product.price && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge variant="destructive" className="bg-red-500 text-white shadow-lg">
                                            -{Math.round(((product.fake_price - product.price) / product.fake_price) * 100)}% OFF
                                        </Badge>
                                    </div>
                                )}
                                
                                {/* Trust Badge */}
                                <div className="absolute bottom-4 left-4 z-10">
                                    <Badge variant="outline" className="bg-white/90 text-gray-700 shadow-sm">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Terpercaya
                                    </Badge>
                                </div>
                            </div>

                            {/* KOLOM KANAN: DETAIL INFORMASI */}
                            <div className="p-6 lg:p-8">
                                {/* Seller Badge & Social Proof */}
                                <div className="flex items-center justify-between mb-3">
                                    <Badge variant="outline" className="text-xs">
                                        <Users className="h-3 w-3 mr-1" />
                                        {product.seller.user.name}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                
                                {/* Product Title */}
                                <h1 className="mb-3 text-2xl lg:text-3xl font-bold line-clamp-2">{product.name}</h1>
                                
                                {/* Rating & Reviews */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`h-4 w-4 ${i < Math.floor(dummyRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                            />
                                        ))}
                                        <span className="text-sm font-medium ml-1">{dummyRating}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">({dummyReviews} ulasan)</span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">{dummySold} terjual</span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {dummyViews}
                                    </span>
                                </div>
                                
                                {/* Price Section */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl lg:text-3xl font-bold text-green-600">
                                            {formatCurrency(product.price)}
                                        </span>
                                        {product.fake_price > product.price && (
                                            <span className="text-lg text-gray-500 line-through">
                                                {formatCurrency(product.fake_price)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Truck className="h-4 w-4" />
                                            Stok: {product.stock}
                                        </span>
                                        {product.stock <= 5 && product.stock > 0 && (
                                            <span className="text-orange-600 font-medium">Stok terbatas!</span>
                                        )}
                                        {product.is_download && (
                                            <span className="flex items-center gap-1 text-blue-600">
                                                <Clock className="h-4 w-4" />
                                                Instant download
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                                    <p className="text-sm lg:text-base text-gray-700 line-clamp-4">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Action Form */}
                                <form onSubmit={handleSubmit} className="mb-6">
                                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="quantity" className="text-sm font-medium">Jumlah:</label>
                                            <input
                                                id="quantity"
                                                type="number"
                                                name="quantity"
                                                min={1}
                                                max={product.stock}
                                                value={data.quantity}
                                                onChange={(e) => setData('quantity', Number(e.target.value))}
                                                className="w-20 appearance-none rounded border px-3 py-2 text-center text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                            />
                                        </div>
                                    </div>
                                    {errors.quantity && <div className="mb-4 text-sm text-red-500">{errors.quantity}</div>}

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button 
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg" 
                                            type="submit" 
                                            disabled={processing || product.stock === 0}
                                        >
                                            {processing ? 'Menambahkan...' : product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            type="button"
                                            className="px-6"
                                        >
                                            Beli Sekarang
                                        </Button>
                                    </div>
                                </form>

                                {/* Trust Indicators */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Shield className="h-4 w-4 text-blue-600" />
                                        <span>100% Aman</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Award className="h-4 w-4 text-blue-600" />
                                        <span>Kualitas Terjamin</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Truck className="h-4 w-4 text-blue-600" />
                                        <span>Akses Instan</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span>24/7 Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Comprehensive Product Information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Specifications */}
                        <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                    Spesifikasi E-Book
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {product.product_detail?.author && (
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">Penulis</dt>
                                                <dd className="text-sm text-gray-900 font-medium">{product.product_detail.author}</dd>
                                            </div>
                                        </div>
                                    )}
                                    {product.product_detail?.isbn && (
                                        <div className="flex items-start gap-3">
                                            <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">ISBN</dt>
                                                <dd className="text-sm text-gray-900 font-mono">{product.product_detail.isbn}</dd>
                                            </div>
                                        </div>
                                    )}
                                    {product.product_detail?.page && (
                                        <div className="flex items-start gap-3">
                                            <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">Jumlah Halaman</dt>
                                                <dd className="text-sm text-gray-900 font-medium">{product.product_detail.page} halaman</dd>
                                            </div>
                                        </div>
                                    )}
                                    {product.product_detail?.language && (
                                        <div className="flex items-start gap-3">
                                            <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">Bahasa</dt>
                                                <dd className="text-sm text-gray-900 font-medium">{product.product_detail.language}</dd>
                                            </div>
                                        </div>
                                    )}
                                    {product.product_detail?.publish_date && (
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">Tanggal Terbit</dt>
                                                <dd className="text-sm text-gray-900 font-medium">{new Date(product.product_detail.publish_date).toLocaleDateString('id-ID')}</dd>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">Tipe Pembayaran</dt>
                                            <dd className="text-sm text-gray-900 font-medium">{product.payment_type.name}</dd>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Digital Features */}
                        <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5 text-blue-600" />
                                    Fitur Digital
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg border-2 ${product.is_download ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Download className={`h-5 w-5 ${product.is_download ? 'text-green-600' : 'text-gray-400'}`} />
                                            <span className="font-medium">Download</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {product.is_download ? 'File dapat didownload setelah pembelian' : 'Download tidak tersedia'}
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-lg border-2 ${product.is_affiliate ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className={`h-5 w-5 ${product.is_affiliate ? 'text-purple-600' : 'text-gray-400'}`} />
                                            <span className="font-medium">Program Afiliasi</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {product.is_affiliate ? 'Tersedia program afiliasi untuk produk ini' : 'Program afiliasi tidak tersedia'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Availability & Stock */}
                        <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                    Ketersediaan & Stok
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">Stok Tersedia</p>
                                            <p className="text-sm text-gray-600">Unit yang dapat dipesan</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-bold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                                {product.stock}
                                            </p>
                                            <p className="text-sm text-gray-500">unit</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium">Mulai</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{new Date(product.start_date).toLocaleDateString('id-ID')}</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar className="h-4 w-4 text-orange-600" />
                                                <span className="text-sm font-medium">Berakhir</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{new Date(product.end_date).toLocaleDateString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Notes */}
                        {product.note && (
                            <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-blue-600" />
                                        Catatan Penting
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-gray-700">{product.note}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Seller Information */}
                        <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Penjual
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{product.seller.user.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">Verified Seller</p>
                                    <div className="flex justify-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-lg font-bold text-blue-600">{Math.floor(Math.random() * 50) + 10}</p>
                                            <p className="text-xs text-gray-600">Produk</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-green-600">{Math.floor(Math.random() * 1000) + 100}</p>
                                            <p className="text-xs text-gray-600">Terjual</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Price Breakdown */}
                        {product.fake_price > product.price && (
                            <Card className="border border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-800">
                                        <Award className="h-5 w-5" />
                                        Penghematan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Harga Normal</span>
                                            <span className="text-sm line-through text-gray-500">{formatCurrency(product.fake_price)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Harga Promo</span>
                                            <span className="text-sm font-bold text-green-600">{formatCurrency(product.price)}</span>
                                        </div>
                                        <hr className="border-green-200" />
                                        <div className="flex justify-between">
                                            <span className="font-medium">Total Hemat</span>
                                            <span className="font-bold text-green-600">
                                                {formatCurrency(product.fake_price - product.price)}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                Hemat {Math.round(((product.fake_price - product.price) / product.fake_price) * 100)}%
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security & Trust */}
                        <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    Jaminan & Keamanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-green-600" />
                                        <span className="text-sm">Pembayaran Aman</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Award className="h-5 w-5 text-green-600" />
                                        <span className="text-sm">Kualitas Terjamin</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-green-600" />
                                        <span className="text-sm">Support 24/7</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Download className="h-5 w-5 text-green-600" />
                                        <span className="text-sm">Akses Selamanya</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
