// resources/js/pages/productdetail.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout'; // <-- Tambahkan Layout
import { BreadcrumbItem } from '@/types'; // <-- Tambahkan tipe Breadcrumb
import { Head, useForm, usePage } from '@inertiajs/react'; // <-- Tambahkan Head
import { useEffect } from 'react';
import { toast } from 'sonner';

// === DEFINISI TIPE DATA YANG DIPERLUKAN ===
interface ProductDetailData {
    id: number;
    publisher: string;
    publication_year: number;
    isbn: string;
    pages: number;
    language: string;
    author: string;
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
    cover: string;
    description: string;
    seller: Seller;
    product_detail: ProductDetailData;
    stock: number;
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
    // Definisikan breadcrumbs di sini
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: product.name, href: route('products.show', product.id) },
    ];

    return (
        // Gunakan AppLayout sebagai pembungkus utama
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />
            <div className="p-4">
                <Card>
                    <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3">
                        {/* KOLOM KIRI: GAMBAR PRODUK */}
                        <div className="md:col-span-1">
                            <img
                                src={`/storage/${product.cover}`}
                                alt={product.name}
                                className="aspect-square w-full rounded-lg object-cover shadow-lg"
                            />
                        </div>

                        {/* KOLOM KANAN: DETAIL INFORMASI */}
                        <div className="md:col-span-2">
                            <Badge variant="outline" className="mb-2">
                                {product.seller.user.name}
                            </Badge>
                            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
                            <p className="mb-4 text-3xl font-bold text-green-600">{formatCurrency(product.price)}</p>
                            <p className="mb-6 text-muted-foreground">{product.description}</p>
                            <p className="text-sm text-gray-700">Stok: {product.stock}</p>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="number"
                                    name="quantity"
                                    min={1}
                                    max={product.stock}
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', Number(e.target.value))}
                                    className="mr-2 w-16 appearance-none rounded border px-1 py-1 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                {errors.quantity && <div className="mt-1 text-sm text-red-500">{errors.quantity}</div>}

                                <Button className="mt-6 rounded-lg bg-black p-3 text-white hover:bg-gray-500" type="submit" disabled={processing}>
                                    Tambah ke Keranjang
                                </Button>
                            </form>

                            <div className="border-t pt-4">
                                <h3 className="mb-3 font-semibold">Detail E-Book</h3>
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <dt className="text-muted-foreground">Penulis</dt>
                                    <dd>{product.product_detail.author}</dd>
                                    <dt className="text-muted-foreground">Penerbit</dt>
                                    <dd>{product.product_detail.publisher}</dd>
                                    <dt className="text-muted-foreground">Tahun Terbit</dt>
                                    <dd>{product.product_detail.publication_year}</dd>
                                    <dt className="text-muted-foreground">ISBN</dt>
                                    <dd>{product.product_detail.isbn}</dd>
                                    <dt className="text-muted-foreground">Jumlah Halaman</dt>
                                    <dd>{product.product_detail.pages}</dd>
                                    <dt className="text-muted-foreground">Bahasa</dt>
                                    <dd>{product.product_detail.language}</dd>
                                </dl>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
