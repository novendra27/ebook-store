import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Balance, columns } from './columns';
import { DataTable } from './data-table';

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

export default function Balances({ balances, currentBalance }: { balances: Balance[]; currentBalance: number }) {
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
                <div className="rounded-xl border border-sidebar-border/70 p-4 md:p-8 dark:border-sidebar-border">
                    <h1 className="text-2xl font-semibold">Balance</h1>
                    <p className="mb-6 text-sm text-gray-500 md:w-2xl">Monitor your account balance changes and transaction history.</p>

                    {/* Balance Information Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Current Balance</CardTitle>
                            <CardDescription>Your available balance for withdrawal</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-center sm:text-left">
                                    <p className="text-2xl font-bold text-green-600 sm:text-3xl">{formatCurrency(currentBalance)}</p>
                                    <p className="mt-1 text-sm text-gray-500">Available for withdrawal</p>
                                </div>
                                <Button variant="default" size="lg" disabled={currentBalance <= 0} className="w-full sm:w-auto" asChild>
                                    <Link href={route('seller.balances.create')}>Withdraw</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Balance History Table */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold">Balance History</h2>
                        <DataTable columns={columns} data={balances} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
