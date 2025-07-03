import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Eye, X } from "lucide-react";
import { FormEventHandler, useState } from "react";

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
        title: 'Edit Product',
        href: '/seller/products/edit',
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
    payment_type_id: number;
    product_detail?: {
        id: number;
        author: string;
        isbn: string;
        language: string;
        page: number;
        publish_date: string;
    };
}

interface PaymentType {
    id: number;
    name: string;
}

const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
};

export default function EditProduct({ product, paymentTypes }: { product: Product, paymentTypes: PaymentType[] }) {
    // Debug: Log product data untuk melihat struktur data yang diterima
    console.log('Product data:', product);
    console.log('Product detail:', product.product_detail);
    
    const [coverPreview, setCoverPreview] = useState<string>('');
    const [filePreview, setFilePreview] = useState<string>('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [contentFile, setContentFile] = useState<File | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        fake_price: product.fake_price || '',
        payment_type_id: product.payment_type_id || '',
        cover: null as File | null,
        cover_path: product.cover || '',
        start_date: formatDateForInput(product.start_date),
        end_date: formatDateForInput(product.end_date),
        file_content: null as File | null,
        file_path: product.file_content || '',
        stock: product.stock || '',
        note: product.note || '',
        is_download: product.is_download as boolean,
        is_affiliate: product.is_affiliate as boolean,
        // Product Detail Fields
        author: product.product_detail?.author || '',
        isbn: product.product_detail?.isbn || '',
        language: product.product_detail?.language || '',
        page: product.product_detail?.page?.toString() || '',
        publish_date: product.product_detail?.publish_date ? product.product_detail.publish_date.split(' ')[0] : '',
        _method: 'PUT',
    });

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setCoverFile(file);
            setData('cover', file);
        }
    };

    const handleFileContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFilePreview(file.name);
            setContentFile(file);
            setData('file_content', file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('products.update', product.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Product - ${product.name}`} />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4 md:p-8">
                    {/* Header with Back Button */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/seller/products">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Products
                            </Link>
                        </Button>
                    </div>

                    <h1 className="text-2xl font-semibold mb-2">Edit Product</h1>
                    <p className="mb-6 text-sm text-gray-500">Update your product information.</p>

                    {/* Product Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                            <CardDescription>Update the details for your product</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter product name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter product description"
                                        rows={4}
                                        required
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (IDR)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="Enter price"
                                            min="0"
                                            required
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-600">{errors.price}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fake_price">Fake Price (IDR)</Label>
                                        <Input
                                            id="fake_price"
                                            type="number"
                                            value={data.fake_price}
                                            onChange={(e) => setData('fake_price', e.target.value)}
                                            placeholder="Enter fake price"
                                            min="0"
                                            required
                                        />
                                        {errors.fake_price && (
                                            <p className="text-sm text-red-600">{errors.fake_price}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="payment_type_id">Payment Type</Label>
                                        <Select value={data.payment_type_id.toString()} onValueChange={(value) => setData('payment_type_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.payment_type_id && (
                                            <p className="text-sm text-red-600">{errors.payment_type_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            placeholder="Enter stock quantity"
                                            min="0"
                                        />
                                        {errors.stock && (
                                            <p className="text-sm text-red-600">{errors.stock}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Book Details Section */}
                                <div className="space-y-4">
                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-medium mb-4">Book Details (Optional)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="author">Author</Label>
                                                <Input
                                                    id="author"
                                                    type="text"
                                                    value={data.author}
                                                    onChange={(e) => setData('author', e.target.value)}
                                                    placeholder="Enter author name"
                                                />
                                                {errors.author && (
                                                    <p className="text-sm text-red-600">{errors.author}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="isbn">ISBN</Label>
                                                <Input
                                                    id="isbn"
                                                    type="text"
                                                    value={data.isbn}
                                                    onChange={(e) => setData('isbn', e.target.value)}
                                                    placeholder="Enter ISBN number"
                                                />
                                                {errors.isbn && (
                                                    <p className="text-sm text-red-600">{errors.isbn}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="language">Language</Label>
                                                <Input
                                                    id="language"
                                                    type="text"
                                                    value={data.language}
                                                    onChange={(e) => setData('language', e.target.value)}
                                                    placeholder="Enter language (e.g., Indonesian, English)"
                                                />
                                                {errors.language && (
                                                    <p className="text-sm text-red-600">{errors.language}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="page">Number of Pages</Label>
                                                <Input
                                                    id="page"
                                                    type="number"
                                                    value={data.page}
                                                    onChange={(e) => setData('page', e.target.value)}
                                                    placeholder="Enter number of pages"
                                                    min="1"
                                                />
                                                {errors.page && (
                                                    <p className="text-sm text-red-600">{errors.page}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <Label htmlFor="publish_date">Publish Date</Label>
                                            <Input
                                                id="publish_date"
                                                type="date"
                                                value={data.publish_date}
                                                onChange={(e) => setData('publish_date', e.target.value)}
                                            />
                                            {errors.publish_date && (
                                                <p className="text-sm text-red-600">{errors.publish_date}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Cover Image Upload */}
                                    <div className="space-y-4">
                                        <Label>Cover Image *</Label>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                            {coverPreview ? (
                                                <div className="space-y-3">
                                                    <img
                                                        src={coverPreview}
                                                        alt="Cover preview"
                                                        className="w-32 h-40 object-cover mx-auto rounded-lg border"
                                                    />
                                                    <div className="flex justify-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setCoverPreview('');
                                                                setData('cover', product.cover);
                                                            }}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Remove
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.open(coverPreview, '_blank')}
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Preview
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : data.cover ? (
                                                <div className="space-y-3">
                                                    <div className="w-32 h-40 bg-gray-200 mx-auto rounded-lg border flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">Current Cover</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{data.cover}</p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const input = document.createElement('input');
                                                            input.type = 'file';
                                                            input.accept = 'image/*';
                                                            input.onchange = (e) => {
                                                                const target = e.target as HTMLInputElement;
                                                                const file = target.files?.[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onload = (e) => {
                                                                        setCoverPreview(e.target?.result as string);
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                    setData('cover', file.name);
                                                                }
                                                            };
                                                            input.click();
                                                        }}
                                                    >
                                                        <Upload className="h-4 w-4 mr-1" />
                                                        Change Cover
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Click to upload cover image
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            PNG, JPG, JPEG up to 10MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cover_path">Or enter cover path</Label>
                                            <Input
                                                id="cover_path"
                                                type="text"
                                                value={data.cover}
                                                onChange={(e) => setData('cover', e.target.value)}
                                                placeholder="e.g., covers/my-book-cover.jpg"
                                            />
                                        </div>
                                        {errors.cover && (
                                            <p className="text-sm text-red-600">{errors.cover}</p>
                                        )}
                                    </div>

                                    {/* E-book File Upload */}
                                    <div className="space-y-4">
                                        <Label>E-book File *</Label>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                            {filePreview ? (
                                                <div className="space-y-3">
                                                    <div className="text-6xl">📄</div>
                                                    <div className="text-sm text-green-600 font-medium">
                                                        {filePreview}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setFilePreview('');
                                                            setData('file_content', product.file_content);
                                                        }}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            ) : data.file_content ? (
                                                <div className="space-y-3">
                                                    <div className="text-6xl">📄</div>
                                                    <p className="text-sm text-gray-600">{data.file_content}</p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const input = document.createElement('input');
                                                            input.type = 'file';
                                                            input.accept = '.pdf,.epub,.mobi';
                                                            input.onchange = (e) => {
                                                                const target = e.target as HTMLInputElement;
                                                                const file = target.files?.[0];
                                                                if (file) {
                                                                    setFilePreview(file.name);
                                                                    setData('file_content', file.name);
                                                                }
                                                            };
                                                            input.click();
                                                        }}
                                                    >
                                                        <Upload className="h-4 w-4 mr-1" />
                                                        Change File
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Click to upload e-book file
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            PDF, EPUB, MOBI up to 50MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept=".pdf,.epub,.mobi"
                                                onChange={handleFileContentChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="file_content_path">Or enter file path</Label>
                                            <Input
                                                id="file_content_path"
                                                type="text"
                                                value={data.file_content}
                                                onChange={(e) => setData('file_content', e.target.value)}
                                                placeholder="e.g., ebooks/my-book.pdf"
                                            />
                                        </div>
                                        {errors.file_content && (
                                            <p className="text-sm text-red-600">{errors.file_content}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Start Date</Label>
                                        <Input
                                            id="start_date"
                                            type="datetime-local"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="text-sm text-red-600">{errors.start_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">End Date</Label>
                                        <Input
                                            id="end_date"
                                            type="datetime-local"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            required
                                        />
                                        {errors.end_date && (
                                            <p className="text-sm text-red-600">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="note">Note (Optional)</Label>
                                    <Textarea
                                        id="note"
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        placeholder="Enter additional notes"
                                        rows={3}
                                    />
                                    {errors.note && (
                                        <p className="text-sm text-red-600">{errors.note}</p>
                                    )}
                                </div>

                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_download"
                                            checked={data.is_download}
                                            onCheckedChange={(checked) => setData('is_download', checked as boolean)}
                                        />
                                        <Label htmlFor="is_download">Allow Download</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_affiliate"
                                            checked={data.is_affiliate}
                                            onCheckedChange={(checked) => setData('is_affiliate', checked as boolean)}
                                        />
                                        <Label htmlFor="is_affiliate">Enable Affiliate</Label>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto"
                                    >
                                        {processing ? 'Updating...' : 'Update Product'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                        className="w-full sm:w-auto"
                                    >
                                        <Link href="/seller/products">
                                            Cancel
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
