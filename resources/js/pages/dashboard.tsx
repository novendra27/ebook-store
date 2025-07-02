// resources/js/pages/dashboard.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, Link } from '@inertiajs/react';

// === DEFINISI TIPE DATA (Hanya yang diperlukan) ===
interface Product {
    id: number;
    name: string;
    price: number;
    cover: string;
    description: string;
}

interface DashboardProps {
    auth: {
        user: User;
    };
    products: Product[]; // Hanya menerima props 'products'
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="relative h-[70vh] overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="items-left absolute inset-0 flex flex-col justify-center p-20 text-black">
                        <h1 className="text-2xl font-bold md:text-3xl">"Baca hari ini, pimpin esok hari."</h1>
                        <p className="text-gray-600 md:w-[100vh]">
                            Temukan ebook terbaik yang ingin kalian baca. Dapatkan pengetahuan baru, hiburan, dan inspirasi dari berbagai genre yang
                            tersedia di toko kami.
                        </p>
                        <Button className="w-[20vh] !bg-black text-white" variant="outline">
                            Lihat Ebook
                        </Button>
                    </div>
                    <img className="h-full w-full object-cover object-top" src="/assets/dashboard.jpg" style={{ maxHeight: 'none' }} alt="Gambar" />
                </div>
                {/* === BAGIAN UTAMA: DAFTAR PRODUK === */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Katalog Produk</CardTitle>
                            <CardDescription>Berikut adalah produk-produk yang tersedia di toko.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {products.map((product) => (
                                <Link
                                    href={route('products.show', product.id)} // halaman detail produk
                                    key={product.id}
                                    className="group block overflow-hidden rounded-lg border transition-all hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <img src={`/storage/${product.cover}`} alt={product.name} className="aspect-square w-full object-cover" />
                                    <div className="p-3">
                                        <p className="truncate font-semibold group-hover:text-primary">{product.name}</p>
                                        <p className="text-md font-bold text-green-600">{formatCurrency(product.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Tampilan jika tidak ada produk */}
                        {products.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-lg border py-20 text-center">
                                <h3 className="text-lg font-semibold">Belum Ada Produk</h3>
                                <p className="text-sm text-muted-foreground">Data produk masih kosong. Coba jalankan seeder.</p>
                                <code className="mt-2 rounded bg-gray-100 p-1 text-xs dark:bg-gray-800">php artisan migrate:fresh --seed</code>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
