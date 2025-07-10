import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Download, Eye } from 'lucide-react';

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
    // const formatRupiah = (amount: number) => {
    //     return new Intl.NumberFormat('id-ID', {
    //         style: 'currency',
    //         currency: 'IDR',
    //         minimumFractionDigits: 0,
    //     }).format(amount);
    // };

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

    // const stockStatus = (stock: number) => {
    //     if (stock > 10) return { color: 'text-green-600', text: 'In Stock' };
    //     if (stock > 0) return { color: 'text-yellow-600', text: 'Low Stock' };
    //     return { color: 'text-red-600', text: 'Out of Stock' };
    // };

    // const status = stockStatus(product.stock);

    return (
        <AppLayout>
            <Head title={`Product Details - ${product.name}`} />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-4 md:p-8 dark:border-sidebar-border">
                    {/* Product Details Card */}
                    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Cover Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cover Image</CardTitle>
                                <CardDescription>Product cover and visual representation</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src={getFileUrl(product.cover)}
                                        alt={product.name}
                                        className="h-80 w-full max-w-64 rounded-lg border object-cover shadow-lg"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/logo.svg';
                                        }}
                                    />
                                </div>
                                <div className="space-y-2 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => window.open(getFileUrl(product.cover), '_blank')}>
                                            <Eye className="mr-1 h-4 w-4" />
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
                                <CardDescription>Author: {product.product_detail?.author || 'No author'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                            <p className="text-sm font-medium text-gray-500">Download Status</p>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    product.is_download ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {product.is_download ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Affiliate Program</p>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    product.is_affiliate ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {product.is_affiliate ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Created At</p>
                                            <p className="text-sm text-gray-700">{formatDate(product.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {/* Book Details */}
                                        {product.product_detail && (
                                            <Card className="mb-6">
                                                <CardHeader>
                                                    <CardTitle>Book Details</CardTitle>
                                                    <CardDescription>Additional information about this e-book</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                                                        <div className="grid grid-cols-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Author</dt>
                                                            <dd className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0 dark:text-gray-200">
                                                                {product.product_detail.author}
                                                            </dd>
                                                        </div>
                                                        <div className="grid grid-cols-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">ISBN</dt>
                                                            <dd className="mt-1 font-mono text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-gray-200">
                                                                {product.product_detail.isbn}
                                                            </dd>
                                                        </div>
                                                        <div className="grid grid-cols-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Language</dt>
                                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-gray-200">
                                                                {product.product_detail.language}
                                                            </dd>
                                                        </div>
                                                        <div className="grid grid-cols-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Pages</dt>
                                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-gray-200">
                                                                {product.product_detail.page} pages
                                                            </dd>
                                                        </div>
                                                        <div className="grid grid-cols-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Publish Date</dt>
                                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-gray-200">
                                                                {formatDate(product.product_detail.publish_date)}
                                                            </dd>
                                                        </div>
                                                    </dl>
                                                </CardContent>
                                            </Card>
                                        )}
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
                            <p className="leading-relaxed whitespace-pre-wrap text-gray-700">{product.description}</p>
                        </CardContent>
                    </Card>

                    {/* File Information */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>File Information</CardTitle>
                            <CardDescription>E-book file and cover image details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">E-book File</p>
                                        <p className="mb-2 rounded bg-gray-100 p-2 font-mono text-sm text-gray-700">{product.file_content}</p>
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                {getFileExtension(product.file_content).toUpperCase()}
                                            </span>
                                            {isPdfFile(product.file_content) && (
                                                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
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
                                        <p className="mb-2 rounded bg-gray-100 p-2 font-mono text-sm text-gray-700">{product.cover}</p>
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                                {getFileExtension(product.cover).toUpperCase()}
                                            </span>
                                            {isImageFile(product.cover) && (
                                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
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

                    {/* Additional Notes */}
                    {product.note && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Additional Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed whitespace-pre-wrap text-gray-700">{product.note}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
