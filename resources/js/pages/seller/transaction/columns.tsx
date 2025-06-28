"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"

export type Invoice = {
  id: number;
  amount: number;
  status: string;
  invoice_code: string;
  invoice_url: string;
  created_at: string;
  user: {
    name: string;
  }
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'no',
    header: 'No',
    cell: ({ row }) => {
      const index = row.index + 1
      return <div className="font-medium">{index}</div>
    },
  },
  {
    accessorKey: 'invoice_code',
    header: 'Transaction Code',
  },
  {
    accessorKey: 'user.name',
    header: 'Customer',
    cell: ({ row }) => {
      const user = row.original.user;
      return <div className="font-medium">{user.name}</div>
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount') as string);
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount);
      return <div className="font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusColor = status === 'paid' ? 'text-green-600' : status === 'pending' ? 'text-yellow-600' : 'text-red-600';
      return <div className={`font-medium ${statusColor}`}>{status}</div>
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at') as string);
      const formatted = date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return <div className="font-medium">{formatted}</div>
    }
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <Button asChild variant={'outline'}>
          <Link href={route('transactions.show', invoice.id)}>
            View Details
          </Link>
        </Button>
      )
    },
  },
]