import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    fake_price?: number;
    payment_type_id: number;
    cover?: string;
    file_content?: string;
    start_date?: string;
    end_date?: string;
    note?: string;
    stock?: number;
    file_source: string;
    is_download: boolean;
    is_affiliate: boolean;
    author?: string;
    isbn?: string;
    format?: string;
    language?: string;
    page_count?: number;
    publish_date?: string;
}

interface Auth {
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface EditProps {
    auth: Auth;
    product: Product;
}

interface ProductFormData {
    name: string;
    description: string;
    price: string | number;
    fake_price?: string | number;
    payment_type_id: string | number;
    image: File | null;
    waktu_mulai_pembayaran?: string;
    tanggal_kadaluarsa?: string;
    note?: string;
    stock?: string | number;
    sumber_file: string;
    file_konten: File | null;
    bisa_didownload: string;
    author?: string;
    isbn?: string;
    format?: string;
    bahasa?: string;
    jumlah_halaman?: string | number;
    tanggal_publish?: string;
    affiliate?: boolean;
}

const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
};

export default function Edit({ auth, product }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        fake_price: product.fake_price || '',
        payment_type_id: product.payment_type_id || 1,
        image: null,
        waktu_mulai_pembayaran: formatDate(product.start_date),
        tanggal_kadaluarsa: formatDate(product.end_date),
        note: product.note || '',
        stock: product.stock || '',
        sumber_file: product.file_source || 'Upload Baru',
        file_konten: null,
        bisa_didownload: product.is_download ? 'Aktif' : 'Tidak Aktif',
        author: product.author || '',
        isbn: product.isbn || '',
        format: product.format || '',
        bahasa: product.language || '',
        jumlah_halaman: product.page_count || '',
        tanggal_publish: formatDate(product.publish_date),
        affiliate: product.is_affiliate || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('products.update', product.id), {
            data,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Edit E-Book</h2>}>
            <Head title="Edit E-Book" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <h1 className="mb-6 text-2xl font-semibold text-gray-800">Edit E-Book</h1>
                            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                                    <input
                                        name="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-md border px-3 py-2"
                                        required
                                    />

                                    {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                    <textarea
                                        name="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full rounded-md border px-3 py-2"
                                        required
                                    />
                                    {errors.description && <div className="text-sm text-red-600">{errors.description}</div>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Harga</label>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="w-full rounded-md border px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Harga Coret</label>
                                        <input
                                            type="number"
                                            value={data.fake_price}
                                            onChange={(e) => setData('fake_price', e.target.value)}
                                            className="w-full rounded-md border px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cover Baru (opsional)</label>
                                    <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File Konten Baru (opsional)</label>
                                    <input type="file" accept=".pdf,.epub" onChange={(e) => setData('file_konten', e.target.files?.[0] ?? null)} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                        <input
                                            type="date"
                                            value={data.waktu_mulai_pembayaran}
                                            onChange={(e) => setData('waktu_mulai_pembayaran', e.target.value)}
                                            className="w-full rounded-md border px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Kadaluarsa</label>
                                        <input
                                            type="date"
                                            value={data.tanggal_kadaluarsa}
                                            onChange={(e) => setData('tanggal_kadaluarsa', e.target.value)}
                                            className="w-full rounded-md border px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Catatan</label>
                                    <textarea
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Maksimum Jumlah Pembayaran (Kuota / QTY)</label>
                                    <input
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Kami akan menutup link pembayaran setelah melewati batas jumlah maksimal. Kosongkan untuk tanpa limit jumlah
                                        (unlimited)
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sumber File</label>
                                    <select
                                        value={data.sumber_file}
                                        onChange={(e) => setData('sumber_file', e.target.value)}
                                        className="w-full rounded-md border px-3 py-2"
                                    >
                                        <option value="Upload Baru">Upload Baru</option>
                                        <option value="Dari Library">Dari Library</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Format</label>
                                        <select
                                            value={data.format}
                                            onChange={(e) => setData('format', e.target.value)}
                                            className="w-full rounded-md border px-3 py-2"
                                        >
                                            <option value="">-- Pilih Format --</option>
                                            <option value="PDF">PDF</option>
                                            <option value="EPUB">EPUB</option>
                                            <option value="MOBI">MOBI</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bahasa</label>
                                        <input
                                            type="text"
                                            value={data.bahasa}
                                            onChange={(e) => setData('bahasa', e.target.value)}
                                            className="w-full rounded-md border px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bisa Didownload?</label>
                                    <select
                                        value={data.bisa_didownload}
                                        onChange={(e) => setData('bisa_didownload', e.target.value)}
                                        className="w-full rounded-md border px-3 py-2"
                                    >
                                        <option value="Aktif">Aktif</option>
                                        <option value="Tidak Aktif">Tidak Aktif</option>
                                    </select>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                                    >
                                        {processing ? 'Memperbarui...' : 'Perbarui E-Book'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
