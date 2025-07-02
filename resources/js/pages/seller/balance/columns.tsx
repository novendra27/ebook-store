'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

export type Balance = {
    id: number;
    seller_id: number;
    invoice_id: number;
    note: string;
    change_amount: number;
    balance_after: number;
    created_at: string;
    updated_at: string;
    invoice: {
        id: number;
        invoice_code: string;
        amount: number;
        status: string;
        created_at: string;
    };
};

export const columns: ColumnDef<Balance>[] = [
    {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => {
            const index = row.index + 1;
            return <div className="font-medium">{index}</div>;
        },
    },
    {
        accessorKey: 'invoice.invoice_code',
        header: 'Invoice Code',
        cell: ({ row }) => {
            const invoice = row.original.invoice;
            return <div className="font-medium">{invoice?.invoice_code || 'Withdraw'}</div>;
        },
    },
    {
        accessorKey: 'note',
        header: 'Note',
        cell: ({ row }) => {
            const note = row.getValue('note') as string;
            const displayNote = note && note.length > 35 ? `${note.substring(0, 35)}...` : note || 'No note';
            return <div className="font-medium">{displayNote}</div>;
        },
    },
    {
        accessorKey: 'change_amount',
        header: 'Amount Change',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('change_amount') as string);
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }).format(amount);
            const invoice = row.original.invoice;
            const colorClass = invoice?.invoice_code ? 'text-green-600' : 'text-red-600';
            return <div className={`font-medium ${colorClass}`}>{formatted}</div>;
        },
    },
    {
        accessorKey: 'balance_after',
        header: 'Balance After',
        cell: ({ row }) => {
            const balance = parseFloat(row.getValue('balance_after') as string);
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }).format(balance);
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at') as string);
            const formatted = date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const balance = row.original;
            const hasInvoice = balance.invoice_id && balance.invoice;

            if (!hasInvoice) {
                return (
                    <Button variant={'outline'} disabled>
                        No Details
                    </Button>
                );
            }

            return (
                <Button asChild variant={'outline'}>
                    <Link href={route('seller.transactions.show', balance.invoice.id)}>View Details</Link>
                </Button>
            );
        },
    },
];
