// resources/js/pages/dashboard.tsx

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// === DEFINISI TIPE DATA (Hanya yang diperlukan) ===

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

// Helper untuk format mata uang
export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <h1>Selamat Datang di dashboard Penjual</h1>
            </div>
        </AppLayout>
    );
}
