import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { columns, Invoice } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller',
    },
    {
        title: 'Transactions',
        href: '/seller/transaction',
    },
];

export default function Transactions({ transactions }: { transactions: Invoice[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4 md:p-8">
                    <h1 className="text-2xl font-semibold">Transaction</h1>
                    <p className="mb-4 text-sm text-gray-500 md:w-2xl">Monitor all your sales transactions here.</p>
                    <DataTable columns={columns} data={transactions} />
                </div>
            </div>
        </AppLayout>
    )
}