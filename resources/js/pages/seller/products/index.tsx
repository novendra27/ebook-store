import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Copy, X } from 'lucide-react';
import EditButton from './button_edit';
import DeleteButton from './button_delete';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller',
    },
    {
        title: 'Products',
        href: '/seller/product',
    },
];

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    created_at: string;
    updated_at: string;
}

interface ProductsIndexProps {
    products: Product[];
}

export default function ProductsIndex({ products }: ProductsIndexProps) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const ProductCard = ({ product }: { product: Product }) => {
        const [showMenu, setShowMenu] = useState(false);

        const handleEdit = () => {
            alert('Edit produk: ' + product.title);
        };

        const handleDelete = () => {
            const confirmDelete = confirm(`Yakin hapus produk? "${product.title}"?`);
            if (confirmDelete) {
            console.log('Produk dihapus!');    alert('Produk dihapus!');

            }
        };

        return (
            <Card className="overflow-hidden border-gray-700 bg-gray-800 relative">
                <div className="relative">
                    <img
                        src={product.image || '/placeholder-image.jpg'}
                        alt={product.title}
                        className="h-48 w-full object-cover"
                    />
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="absolute top-2 right-2 rounded-full bg-black/50 p-1 hover:bg-black/70"
                    >
                        <MoreHorizontal className="h-4 w-4 text-white" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-2 top-10 z-10 w-52 rounded-md border bg-white shadow-lg flex flex-col gap-2 p-2">
                            <EditButton onClick={handleEdit} />
                            <DeleteButton onClick={handleDelete} />
                            <button className="flex w-full items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100">
                                <Copy size={16} />
                                DUPLICATE PRODUCT
                            </button>
                            <button
                                className="flex w-full items-center justify-center px-4 py-2 text-red-500 hover:bg-red-100"
                                onClick={() => setShowMenu(false)}
                            >
                                <X size={16} />
                                TUTUP
                            </button>
                        </div>
                    )}
                </div>
                <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-white">{product.title}</h3>
                    <p className="mb-2 text-sm text-gray-400">Product Description: {product.description}</p>
                    <p className="font-semibold text-white">Harga: {formatRupiah(product.price)}</p>
                    <p className="mt-1 text-xs text-gray-400">Stock: {product.stock}</p>
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products List" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border-4 border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">Products List</h1>
                            <p className="mt-1 text-sm text-gray-400">Tambahkan produk anda disini</p>
                        </div>

                        <div className="flex justify-start">
                            <Link href={route('products.create')}>
                                <Button className="bg-white text-black hover:bg-gray-100">Tambah Produk</Button>
                            </Link>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-gray-400">Belum ada produk. Silakan tambah produk baru.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}