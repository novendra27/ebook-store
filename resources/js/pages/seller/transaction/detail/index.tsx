import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export interface InvoiceProduct {
    id: number;
    invoice_id: number;
    product_id: number;
    amount: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        created_at: string;
        updated_at: string;
    };
    invoice: {
        id: number;
        user_id: number;
        amount: number;
        status: string;
        invoice_code: string;
        created_at: string;
        updated_at: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller',
    },
    {
        title: 'Transactions',
        href: '/seller/transaction',
    },
    {
        title: 'Transaction Details',
        href: '/seller/transaction/detail',
    },
];

export default function TransactionDetail({ invoiceProducts }: { invoiceProducts: InvoiceProduct[] }) {
    // Get invoice details from the first item (since all items belong to the same invoice)
    const invoice = invoiceProducts[0]?.invoice;

    // Calculate totals
    const totalQuantity = invoiceProducts.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = invoiceProducts.reduce((sum, item) => sum + item.amount, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transaction Details - ${invoice?.invoice_code || 'N/A'}`} />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-4 md:p-8 dark:border-sidebar-border">
                    {/* Header with Back Button */}
                    <div className="mb-6 flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('seller.transactions.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Transactions
                            </Link>
                        </Button>
                    </div>

                    {/* Transaction Summary Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Transaction Summary</CardTitle>
                            <CardDescription>Transaction Code: {invoice?.invoice_code || 'N/A'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <p className="text-lg font-semibold capitalize">{invoice?.status || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                    <p className="text-lg font-semibold">${invoice?.amount?.toFixed(2) || '0.00'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Transaction Date</p>
                                    <p className="text-lg font-semibold">
                                        {invoice?.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Products Purchased</CardTitle>
                            <CardDescription>List of all products in this transaction</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoiceProducts.length > 0 ? (
                                        invoiceProducts.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.product?.name || 'N/A'}</TableCell>
                                                <TableCell className="max-w-xs">
                                                    <p className="truncate text-sm text-gray-600">
                                                        {item.product?.description || 'No description available'}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-right">${item.product?.price?.toFixed(2) || '0.00'}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right font-medium">${item.amount?.toFixed(2) || '0.00'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                                                No products found for this transaction
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Summary Footer */}
                            {invoiceProducts.length > 0 && (
                                <div className="mt-4 border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">Total Items: {totalQuantity}</div>
                                        <div className="text-lg font-semibold">Total Amount: ${totalAmount.toFixed(2)}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
