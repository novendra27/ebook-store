import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Download, Eye } from "lucide-react";
import { router } from "@inertiajs/react";
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller',
    },
    {
        title: 'Products',
        href: '/seller/products',
    },
    {
        title: 'Product Details',
        href: '/seller/products/show',
    },
];

interface Product {
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
    seller: {
        id: number;
        business_name: string;
    };
}

export default function ProductDetail({ product }: { product: Product }) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getFileUrl = (filePath: string) => {
        if (filePath.startsWith('http')) {
            return filePath;
        }
        return `/storage/${filePath}`;
    };

    const getFileName = (filePath: string) => {
        return filePath.split('/').pop() || 'file';
    };

    const getFileExtension = (filePath: string) => {
        const fileName = getFileName(filePath);
        return fileName.split('.').pop()?.toLowerCase() || '';
    };

    const isImageFile = (filePath: string) => {
        const ext = getFileExtension(filePath);
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
    };

    const isPdfFile = (filePath: string) => {
        const ext = getFileExtension(filePath);
        return ext === 'pdf';
    };

    const handleEdit = () => {
        router.get(route('products.edit', product.id));
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
                router.delete(route('products.destroy', product.id));
            }
        });
    };

    const stockStatus = (stock: number) => {
        if (stock > 10) return { color: 'text-green-600', text: 'In Stock' };
        if (stock > 0) return { color: 'text-yellow-600', text: 'Low Stock' };
        return { color: 'text-red-600', text: 'Out of Stock' };
    };

    const status = stockStatus(product.stock);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product Details - ${product.name}`} />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4 md:p-8">
                    {/* Header with Back Button */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('products.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Products
                            </Link>
                        </Button>
                    </div>

                    {/* Product Details Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Cover Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cover Image</CardTitle>
                                <CardDescription>Product cover and visual representation</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center mb-4">
                                    <img 
                                        src={getFileUrl(product.cover)}
                                        alt={product.name}
                                        className="w-full max-w-64 h-80 object-cover rounded-lg shadow-lg border"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/logo.svg';
                                        }}
                                    />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-gray-500 font-mono bg-gray-50 p-2 rounded">{product.cover}</p>
                                    <div className="flex justify-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => window.open(getFileUrl(product.cover), '_blank')}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View Full Size
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Information */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                                <CardDescription>
                                    Product ID: {product.id} | Author: {product.product_detail?.author || 'No author'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Regular Price</p>
                                            <p className="text-2xl font-bold text-green-600">{formatRupiah(product.price)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Fake Price (Strike-through)</p>
                                            <p className="text-xl font-semibold text-gray-500 line-through">{formatRupiah(product.fake_price)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Stock</p>
                                            <p className={`text-lg font-semibold ${status.color}`}>
                                                {product.stock} units ({status.text})
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Download Status</p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.is_download 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.is_download ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Sale Start Date</p>
                                            <p className="text-lg font-semibold">{formatDate(product.start_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Sale End Date</p>
                                            <p className="text-lg font-semibold">{formatDate(product.end_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Affiliate Program</p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.is_affiliate 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {product.is_affiliate ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Created At</p>
                                            <p className="text-sm text-gray-700">{formatDate(product.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Description */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Product Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                        </CardContent>
                    </Card>

                    {/* Book Details */}
                    {product.product_detail && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Book Details</CardTitle>
                                <CardDescription>Additional information about this e-book</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Author</p>
                                        <p className="text-lg font-semibold">{product.product_detail.author}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">ISBN</p>
                                        <p className="text-lg font-mono">{product.product_detail.isbn}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Language</p>
                                        <p className="text-lg">{product.product_detail.language}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Pages</p>
                                        <p className="text-lg">{product.product_detail.page} pages</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Publish Date</p>
                                        <p className="text-lg">{formatDate(product.product_detail.publish_date)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* File Information */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>File Information</CardTitle>
                            <CardDescription>E-book file and cover image details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">E-book File</p>
                                        <p className="text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded mb-2">{product.file_content}</p>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                                {getFileExtension(product.file_content).toUpperCase()}
                                            </span>
                                            {isPdfFile(product.file_content) && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                                    PDF Document
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex items-center gap-1"
                                                onClick={() => window.open(getFileUrl(product.file_content), '_blank')}
                                            >
                                                <Eye className="h-4 w-4" />
                                                Preview
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex items-center gap-1"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = getFileUrl(product.file_content);
                                                    link.download = getFileName(product.file_content);
                                                    link.click();
                                                }}
                                            >
                                                <Download className="h-4 w-4" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Cover Image File</p>
                                        <p className="text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded mb-2">{product.cover}</p>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                {getFileExtension(product.cover).toUpperCase()}
                                            </span>
                                            {isImageFile(product.cover) && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                                    Image File
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex items-center gap-1"
                                                onClick={() => window.open(getFileUrl(product.cover), '_blank')}
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Full Size
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex items-center gap-1"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = getFileUrl(product.cover);
                                                    link.download = getFileName(product.cover);
                                                    link.click();
                                                }}
                                            >
                                                <Download className="h-4 w-4" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Details */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Technical Details</CardTitle>
                            <CardDescription>System and configuration information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Product ID</p>
                                    <p className="text-lg font-mono">{product.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Payment Type ID</p>
                                    <p className="text-lg font-mono">{product.payment_type_id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Product Detail ID</p>
                                    <p className="text-lg font-mono">{product.product_detail_id || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Created At</p>
                                    <p className="text-sm text-gray-700">{formatDate(product.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Updated At</p>
                                    <p className="text-sm text-gray-700">{formatDate(product.updated_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Seller</p>
                                    <p className="text-lg font-semibold">{product.seller?.business_name || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Notes */}
                    {product.note && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Additional Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.note}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button onClick={handleEdit} className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Product
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => window.open(getFileUrl(product.file_content), '_blank')}
                                    className="flex items-center gap-2"
                                >
                                    <Eye className="h-4 w-4" />
                                    Preview E-book
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = getFileUrl(product.file_content);
                                        link.download = getFileName(product.file_content);
                                        link.click();
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download E-book
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    onClick={handleDelete}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Product
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
