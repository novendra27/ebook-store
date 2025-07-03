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
import { ArrowLeft, Upload, Eye, Save, X } from "lucide-react";
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
        title: 'Create Product',
        href: '/seller/products/create',
    },
];

interface PaymentType {
    id: number;
    name: string;
}

export default function CreateProduct({ paymentTypes }: { paymentTypes: PaymentType[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        fake_price: '',
        payment_type_id: '',
        cover: null as File | null,
        cover_path: '',
        start_date: '',
        end_date: '',
        file_content: null as File | null,
        file_path: '',
        stock: '0',
        note: '',
        is_download: false as boolean,
        is_affiliate: false as boolean,
        // Product Detail Fields
        author: '',
        isbn: '',
        language: '',
        page: '',
        publish_date: '',
    });

    const [coverPreview, setCoverPreview] = useState<string>('');
    const [filePreview, setFilePreview] = useState<string>('');
    const [step, setStep] = useState(1);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setData('cover', file);
        }
    };

    const handleFileContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFilePreview(file.name);
            setData('file_content', file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post(route('seller.products.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setCoverPreview('');
                setFilePreview('');
                setStep(1);
            },
        });
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return 'Basic Information';
            case 2: return 'Book Details';
            case 3: return 'Files & Media';
            case 4: return 'Configuration';
            default: return 'Product Information';
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 1: return 'Enter basic product details';
            case 2: return 'Enter book-specific information';
            case 3: return 'Upload cover image and e-book file';
            case 4: return 'Configure settings and options';
            default: return 'Complete the product setup';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
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

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold">Create New Product</h1>
                            <p className="text-sm text-gray-500">Add a new e-book product to your store.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                            i === step ? 'bg-blue-600 text-white' : 
                                            i < step ? 'bg-green-600 text-white' : 
                                            'bg-gray-200 text-gray-600'
                                        }`}>
                                            {i}
                                        </div>
                                        {i < 4 && (
                                            <div className={`w-8 h-0.5 mx-2 ${
                                                i < step ? 'bg-green-600' : 'bg-gray-200'
                                            }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{getStepTitle()}</CardTitle>
                            <CardDescription>{getStepDescription()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Product Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter product name"
                                                className="text-base"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description *</Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Enter detailed product description"
                                                rows={4}
                                                className="text-base"
                                                required
                                            />
                                            {errors.description && (
                                                <p className="text-sm text-red-600">{errors.description}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="price">Price (IDR) *</Label>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    value={data.price}
                                                    onChange={(e) => setData('price', e.target.value)}
                                                    placeholder="Enter price"
                                                    min="0"
                                                    step="1000"
                                                    className="text-base"
                                                    required
                                                />
                                                {errors.price && (
                                                    <p className="text-sm text-red-600">{errors.price}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fake_price">Strike-through Price (IDR) *</Label>
                                                <Input
                                                    id="fake_price"
                                                    type="number"
                                                    value={data.fake_price}
                                                    onChange={(e) => setData('fake_price', e.target.value)}
                                                    placeholder="Enter original price"
                                                    min="0"
                                                    step="1000"
                                                    className="text-base"
                                                    required
                                                />
                                                {errors.fake_price && (
                                                    <p className="text-sm text-red-600">{errors.fake_price}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="payment_type_id">Payment Type *</Label>
                                                <Select value={data.payment_type_id} onValueChange={(value) => setData('payment_type_id', value)}>
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
                                                <Label htmlFor="stock">Stock Quantity</Label>
                                                <Input
                                                    id="stock"
                                                    type="number"
                                                    value={data.stock}
                                                    onChange={(e) => setData('stock', e.target.value)}
                                                    placeholder="Enter stock quantity"
                                                    min="0"
                                                    className="text-base"
                                                />
                                                {errors.stock && (
                                                    <p className="text-sm text-red-600">{errors.stock}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button type="button" onClick={nextStep}>
                                                Next Step
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="author">Author</Label>
                                                <Input
                                                    id="author"
                                                    type="text"
                                                    value={data.author}
                                                    onChange={(e) => setData('author', e.target.value)}
                                                    placeholder="Enter author name"
                                                    className="text-base"
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
                                                    className="text-base"
                                                />
                                                {errors.isbn && (
                                                    <p className="text-sm text-red-600">{errors.isbn}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="language">Language</Label>
                                                <Input
                                                    id="language"
                                                    type="text"
                                                    value={data.language}
                                                    onChange={(e) => setData('language', e.target.value)}
                                                    placeholder="Enter language (e.g., Indonesian, English)"
                                                    className="text-base"
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
                                                    className="text-base"
                                                />
                                                {errors.page && (
                                                    <p className="text-sm text-red-600">{errors.page}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="publish_date">Publish Date</Label>
                                            <Input
                                                id="publish_date"
                                                type="date"
                                                value={data.publish_date}
                                                onChange={(e) => setData('publish_date', e.target.value)}
                                                className="text-base"
                                            />
                                            {errors.publish_date && (
                                                <p className="text-sm text-red-600">{errors.publish_date}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-between">
                                            <Button type="button" variant="outline" onClick={prevStep}>
                                                Previous
                                            </Button>
                                            <Button type="button" onClick={nextStep}>
                                                Next Step
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
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
                                                                        setData('cover', null);
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
                                                        value={data.cover_path}
                                                        onChange={(e) => setData('cover_path', e.target.value)}
                                                        placeholder="e.g., covers/my-book-cover.jpg"
                                                        className="text-base"
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
                                                        {data.file_content && (
                                                            <div className="text-sm text-green-600 font-medium">
                                                                📄 {filePreview || 'No file selected'}
                                                            </div>
                                                        )}
                                                    </div>
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
                                                        value={data.file_path}
                                                        onChange={(e) => setData('file_path', e.target.value)}
                                                        placeholder="e.g., ebooks/my-book.pdf"
                                                        className="text-base"
                                                    />
                                                </div>
                                                {errors.file_content && (
                                                    <p className="text-sm text-red-600">{errors.file_content}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <Button type="button" variant="outline" onClick={prevStep}>
                                                Previous
                                            </Button>
                                            <Button type="button" onClick={nextStep}>
                                                Next Step
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="start_date">Sale Start Date *</Label>
                                                <Input
                                                    id="start_date"
                                                    type="datetime-local"
                                                    value={data.start_date}
                                                    onChange={(e) => setData('start_date', e.target.value)}
                                                    className="text-base"
                                                    required
                                                />
                                                {errors.start_date && (
                                                    <p className="text-sm text-red-600">{errors.start_date}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="end_date">Sale End Date *</Label>
                                                <Input
                                                    id="end_date"
                                                    type="datetime-local"
                                                    value={data.end_date}
                                                    onChange={(e) => setData('end_date', e.target.value)}
                                                    className="text-base"
                                                    required
                                                />
                                                {errors.end_date && (
                                                    <p className="text-sm text-red-600">{errors.end_date}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="note">Additional Notes</Label>
                                            <Textarea
                                                id="note"
                                                value={data.note}
                                                onChange={(e) => setData('note', e.target.value)}
                                                placeholder="Enter any additional notes or special instructions"
                                                rows={3}
                                                className="text-base"
                                            />
                                            {errors.note && (
                                                <p className="text-sm text-red-600">{errors.note}</p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <Label>Product Settings</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                                                    <Checkbox
                                                        id="is_download"
                                                        checked={data.is_download}
                                                        onCheckedChange={(checked) => setData('is_download', checked as boolean)}
                                                    />
                                                    <div>
                                                        <Label htmlFor="is_download" className="font-medium">Allow Download</Label>
                                                        <p className="text-sm text-gray-500">Allow customers to download the e-book</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                                                    <Checkbox
                                                        id="is_affiliate"
                                                        checked={data.is_affiliate}
                                                        onCheckedChange={(checked) => setData('is_affiliate', checked as boolean)}
                                                    />
                                                    <div>
                                                        <Label htmlFor="is_affiliate" className="font-medium">Enable Affiliate</Label>
                                                        <p className="text-sm text-gray-500">Allow affiliate marketing for this product</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <Button type="button" variant="outline" onClick={prevStep}>
                                                Previous
                                            </Button>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link href="/seller/products">
                                                        Cancel
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {processing ? 'Creating...' : 'Create Product'}
                                                </Button>
                                            </div>
                                        </div>
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
