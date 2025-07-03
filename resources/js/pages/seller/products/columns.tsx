import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Swal from 'sweetalert2'
import { router } from '@inertiajs/react'

export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    fake_price: number;
    stock: number;
    cover: string;
    start_date: string;
    end_date: string;
    note?: string;
    file_content: string;
    is_download: boolean;
    is_affiliate: boolean;
    created_at: string;
    updated_at: string;
    payment_type_id: number;
    product_detail_id?: number;
    product_detail?: {
        id: number;
        author: string;
        isbn: string;
        language: string;
        page: number;
        publish_date: string;
    };
}

// Utility functions
const getFileUrl = (filePath: string) => {
    if (filePath.startsWith('http')) {
        return filePath;
    }
    return `/storage/${filePath}`;
};

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => {
            const index = row.index + 1
            return <div className="font-medium">{index}</div>
        },
    },
    {
        accessorKey: 'cover',
        header: 'Cover',
        cell: ({ row }) => {
            const cover = row.getValue('cover') as string;
            return (
                <div className="flex items-center justify-center">
                    <img 
                        src={getFileUrl(cover)}
                        alt={row.original.name}
                        className="w-12 h-16 object-cover rounded shadow-sm border"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/logo.svg'; // fallback image
                        }}
                    />
                </div>
            );
        }
    },
    {
        accessorKey: 'name',
        header: 'Product Name',
        cell: ({ row }) => {
            const name = row.getValue('name') as string;
            const displayName = name && name.length > 50 ? `${name.substring(0, 50)}...` : name || 'No name';
            return <div className="font-medium">{displayName}</div>
        }
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const description = row.getValue('description') as string;
            const displayDescription = description && description.length > 60 ? `${description.substring(0, 60)}...` : description || 'No description';
            return <div className="text-sm text-gray-600">{displayDescription}</div>
        }
    },
    {
        accessorKey: 'product_detail.author',
        header: 'Author',
        cell: ({ row }) => {
            const productDetail = row.original.product_detail;
            return <div className="font-medium">{productDetail?.author || 'No author'}</div>
        }
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('price') as string);
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }).format(price);
            return <div className="font-medium text-green-600">{formatted}</div>
        }
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
            const stock = row.getValue('stock') as number;
            const stockColor = stock > 10 ? 'text-green-600' : stock > 0 ? 'text-yellow-600' : 'text-red-600';
            return <div className={`font-medium ${stockColor}`}>{stock}</div>
        }
    },
    {
        accessorKey: 'created_at',
        header: 'Created Date',
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
        header: 'Actions',
        cell: ({ row }) => {
            const product = row.original

            const handleEdit = () => {
                router.get(route('seller.products.edit', product.id));
            };

            const handleView = () => {
                router.get(route('seller.products.show', product.id));
            };

            const handleDelete = () => {
                Swal.fire({
                    title: 'Are you sure?',
                    text: `"${product.name}" will be deleted permanently!`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.delete(route('seller.products.destroy', product.id));
                    }
                });
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={handleView}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
