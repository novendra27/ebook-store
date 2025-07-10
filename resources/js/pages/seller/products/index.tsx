import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { columns, Product } from './columns';
import { DataTable } from './data-table';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller',
    },
    {
        title: 'Products',
        href: '/seller/products',
    },
];

export default function Products({ products }: { products: Product[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold">Products</h1>
                            <p className="text-sm text-gray-500 md:w-2xl">Manage your e-book products here.</p>
                        </div>
                    </div>

                    <DataTable columns={columns} data={products} />
                </div>
            </div>
        </AppLayout>
    )
}
