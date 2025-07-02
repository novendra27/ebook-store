import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller',
    },
    {
        title: 'Balance',
        href: '/seller/balances',
    },
    {
        title: 'Withdraw',
        href: '/seller/balances/create',
    },
];

export default function CreateWithdraw({ currentBalance }: { currentBalance: number }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        note: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('seller.balances.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setData('amount', value);
    };

    const formatAmountDisplay = (amount: string) => {
        if (!amount) return '';
        const numericAmount = parseInt(amount);
        return formatCurrency(numericAmount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Withdraw Balance" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-4 md:p-8 dark:border-sidebar-border">
                    {/* Header with Back Button */}
                    <div className="mb-6 flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/seller/balances">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Balance
                            </Link>
                        </Button>
                    </div>

                    <h1 className="mb-2 text-2xl font-semibold">Withdraw Balance</h1>
                    <p className="mb-6 text-sm text-gray-500">Request a withdrawal from your account balance.</p>

                    {/* Current Balance Info */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Available Balance</CardTitle>
                            <CardDescription>Your current available balance for withdrawal</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(currentBalance)}</p>
                        </CardContent>
                    </Card>

                    {/* Withdraw Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Withdrawal Details</CardTitle>
                            <CardDescription>Enter the amount you want to withdraw</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount to Withdraw</Label>
                                    <Input
                                        id="amount"
                                        type="text"
                                        value={data.amount}
                                        onChange={handleAmountChange}
                                        placeholder="Enter amount in IDR"
                                        className="text-lg"
                                    />
                                    {data.amount && <p className="text-sm text-gray-600">Amount: {formatAmountDisplay(data.amount)}</p>}
                                    {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                                    <p className="text-xs text-gray-500">Minimum withdrawal: {formatCurrency(10000)}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="note">Note (Optional)</Label>
                                    <Input
                                        id="note"
                                        type="text"
                                        value={data.note}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('note', e.target.value)}
                                        placeholder="Add a note for this withdrawal..."
                                    />
                                    {errors.note && <p className="text-sm text-red-600">{errors.note}</p>}
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.amount || parseInt(data.amount) > currentBalance}
                                        className="w-full sm:w-auto"
                                    >
                                        {processing ? 'Processing...' : 'Submit Withdrawal'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                                        <Link href="/seller/balances">Cancel</Link>
                                    </Button>
                                </div>

                                {data.amount && parseInt(data.amount) > currentBalance && (
                                    <div className="rounded-md border border-red-200 bg-red-50 p-4">
                                        <p className="text-sm text-red-600">
                                            Insufficient balance. Maximum withdrawal: {formatCurrency(currentBalance)}
                                        </p>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
