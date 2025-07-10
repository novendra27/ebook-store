import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface InvoiceProduct {
    id: number;
    title: string;
    cover: string;
}

// DIUBAH: Interface sekarang sesuai dengan data dari backend
interface InvoiceItemDetail {
    id: number;
    product: InvoiceProduct;
    quantity: number;
    amount: number;
}

interface InvoiceItem {
    id: number;
    amount: number;
    status: string;
    invoice_code: string;
    invoice_url: string;
    created_at: string;
    items: InvoiceItemDetail[];
}

interface InvoiceProps {
    invoice: InvoiceItem;
}

export default function InvoiceDetail({ invoice }: InvoiceProps) {
    // console.log('invoice.items', invoice.items);
    // console.log(invoice);

    return (
        <AppLayout>
            <Head title={`Invoice #${invoice.id}`} />
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Detail Invoice #{invoice.id}</h1>
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{new Date(invoice.created_at).toLocaleString('id-ID')}</div>
                    <Badge>{invoice.status}</Badge>
                </div>
                <div className="rounded-xl border p-4 shadow-sm">
                    <div className="divide-y">
                        {invoice.items.map((item) => (
                            // console.log(invoice),
                            <div key={item.id} className="flex items-center gap-3 py-2">
                                <img
                                    src={`/storage/${item.product.cover}`}
                                    alt={item.product.title}
                                    className="h-12 w-12 rounded border object-cover"
                                />
                                <div className="flex-1">
                                    <div className="font-medium">{item.product.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {item.quantity ?? 0} x Rp{typeof item.amount === 'number' ? item.amount.toLocaleString('id-ID') : '0'}
                                    </div>
                                    {invoice.status === 'paid' && (
                                        <Button variant="link" size="sm" asChild className="mt-1 h-auto p-0">
                                            <Link href={route('purchases.show', { product: item.product.id })}>Lihat Buku</Link>
                                        </Button>
                                    )}
                                </div>
                                <div className="text-sm font-semibold">
                                    {typeof item.amount === 'number' && typeof item.quantity === 'number'
                                        ? `Rp${(item.quantity * item.amount).toLocaleString('id-ID')}`
                                        : 'Rp0'}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between font-semibold">
                        <span>Total</span>
                        <span>Rp{(invoice.amount ?? 0).toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <Button className="mt-6" variant={'outline'} asChild>
                    <Link href={route('invoice.index')}>Kembali ke Riwayat</Link>
                </Button>
                {invoice.status === 'pending' && (
                    <Button variant={'destructive'} className="ml-2" asChild>
                        <a href={invoice.invoice_url} target="_blank">
                            Bayar
                        </a>
                    </Button>
                )}
            </div>
        </AppLayout>
    );
}
