import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { columns, Balance } from './columns';
import { DataTable } from './data-table';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller',
    },
    {
        title: 'Balance',
        href: '/seller/balances',
    },
];

export default function Balances({ balances, currentBalance }: { balances: Balance[], currentBalance: number }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Balance" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4 md:p-8">
                    <h1 className="text-2xl font-semibold">Balance</h1>
                    <p className="mb-6 text-sm text-gray-500 md:w-2xl">Monitor your account balance changes and transaction history.</p>
                    
                    {/* Balance Information Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Current Balance</CardTitle>
                            <CardDescription>Your available balance for withdrawal</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-2xl sm:text-3xl font-bold text-green-600">
                                        {formatCurrency(currentBalance)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Available for withdrawal</p>
                                </div>
                                <Button 
                                    variant="default" 
                                    size="lg"
                                    disabled={currentBalance <= 0}
                                    className="w-full sm:w-auto"
                                    asChild
                                >
                                    <Link href={route('balances.create')}>
                                        Withdraw
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Balance History Table */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Balance History</h2>
                        <DataTable columns={columns} data={balances} />
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
