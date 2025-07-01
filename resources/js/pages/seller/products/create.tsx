import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
// import route from 'ziggy-js';
import { route } from 'ziggy-js';

export default function CreateProduct({ auth }: { auth: any }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        payment_type_id: '',
        price: '',
        fake_price: '',
        description: '',
        cover: null,
        start_date: '',
        end_date: '',
        note: '',
        stock: '',
        file_content: null,
        is_download: false as boolean,
        is_affiliate: false,

        tipe_pembayaran: 'Produk Berbayar',
        harga: '',
        harga_coret: '',
        waktu_mulai_pembayaran: '',
        tanggal_kadaluarsa: '',
        catatan: '',
        max_jum_pembayaran: '',
        sumber_file: 'Upload Baru',
        bisa_didownload: 'Aktif',
        author: '',
        isbn: '',
        format: '',
        bahasa: '',
        jumlah_halaman: '',
        tanggal_publish: '',
        affiliate: false,
        image: null,
        file_konten: null,
    });

    const [dragActive, setDragActive] = useState({
        cover: false,
        file: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi sederhana sebelum submit
        if (!data.name || !data.description) {
            alert('Nama produk dan deskripsi harus diisi!');
            return;
        }

        console.log('Submitting data:', data); 

        post(route('products.store'), {
            forceFormData: true,
            onSuccess: () => {
                console.log('Success!');
                reset();
                window.location.href = route('products.index');
            },
            onError: (errors) => {
                console.log('Errors:', errors);
            },
            onFinish: () => {
                console.log('Request finished');
            },
        });
    };

    const handleDrag = (e: React.DragEvent, type: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive((prev) => ({ ...prev, [type]: true }));
        } else if (e.type === 'dragleave') {
            setDragActive((prev) => ({ ...prev, [type]: false }));
        }
    };

    const handleDrop = (e: React.DragEvent, type: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive((prev) => ({ ...prev, [type]: false }));

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (type === 'cover') {
                setData('image', file);
            } else if (type === 'file') {
                setData('file_konten', file);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'cover') {
                setData('image', file);
            } else if (type === 'file') {
                setData('file_konten', file);
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Buat E-Book</h2>}>
            <Head title="Buat E-Book" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-semibold text-gray-800">Buat E-Book</h1>
                                <button className="text-gray-400 hover:text-gray-600" onClick={() => window.history.back()}>
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <p className="mb-8 text-gray-600">Penjualan e-book semakin mudah dengan otomasi download dan halaman produk keren</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nama Produk */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Nama Produk*</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Wajib diisi"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Tipe Pembayaran */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Tipe Pembayaran</label>
                                    <select
                                        value={data.payment_type_id}
                                        onChange={(e) => setData('payment_type_id', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="1">Gratis</option>
                                        <option value="2">Berbayar</option>
                                    </select>
                                    {errors.payment_type_id && <p className="mt-1 text-sm text-red-600">{errors.payment_type_id}</p>}
                                </div>

                                {/* Harga */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Harga*</label>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-gray-500">Rp</span>
                                            <input
                                                type="number"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="Wajib diisi"
                                                required
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Penagihan ini menggunakan mata uang IDR (Rupiah)</p>
                                        {errors.harga && <p className="mt-1 text-sm text-red-600">{errors.harga}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Harga Coret (opsional)</label>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-gray-500">Rp</span>
                                            <input
                                                type="number"
                                                value={data.fake_price}
                                                onChange={(e) => setData('fake_price', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Harga coret harus lebih besar dari harga utama.</p>
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Deskripsi*</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                {/* Cover */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Cover (gambar untuk promo)</label>
                                    <div
                                        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                            dragActive.cover ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        onDragEnter={(e) => handleDrag(e, 'cover')}
                                        onDragLeave={(e) => handleDrag(e, 'cover')}
                                        onDragOver={(e) => handleDrag(e, 'cover')}
                                        onDrop={(e) => handleDrop(e, 'cover')}
                                    >
                                        <input
                                            type="file"
                                            id="cover-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'cover')}
                                        />
                                        <label htmlFor="cover-upload" className="cursor-pointer">
                                            <div className="mb-2 text-lg font-medium text-blue-500">Drag & drop image</div>
                                            <p className="text-gray-500">atau klik untuk browse</p>
                                        </label>
                                        {data.image && <p className="mt-2 text-sm text-green-600">File dipilih: {data.image.name}</p>}
                                    </div>
                                </div>

                                {/* Waktu Mulai Penjualan */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Waktu Mulai Penjualan</label>
                                    <input
                                        type="date"
                                        value={data.waktu_mulai_pembayaran}
                                        onChange={(e) => setData('waktu_mulai_pembayaran', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Kami akan membuka link pembayaran pada tanggal dan waktu yang anda pilih. Opsional, kosongkan untuk langsung
                                        membuka penjualan
                                    </p>
                                </div>

                                {/* Tanggal Kadaluarsa */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Tanggal Kadaluarsa</label>
                                    <input
                                        type="date"
                                        value={data.tanggal_kadaluarsa}
                                        onChange={(e) => setData('tanggal_kadaluarsa', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Kami akan menutup link pembayaran pada tanggal ini (opsional)</p>
                                </div>

                                {/* Catatan */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Catatan</label>
                                    <textarea
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        rows={4}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Catatan akan dilihat oleh pendaftar/pembeli setelah melakukan pendaftaran/membayar (opsional).
                                    </p>
                                </div>

                                {/* Maksimum Jumlah Pembayaran */}
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

                                {/* Sumber File */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Sumber File*</label>
                                    <select
                                        value={data.sumber_file}
                                        onChange={(e) => setData('sumber_file', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="Upload Baru">Upload Baru</option>
                                        <option value="Dari Library">Dari Library</option>
                                    </select>
                                </div>

                                {/* File Konten */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">File / Konten*</label>
                                    <div
                                        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                            dragActive.file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        onDragEnter={(e) => handleDrag(e, 'file')}
                                        onDragLeave={(e) => handleDrag(e, 'file')}
                                        onDragOver={(e) => handleDrag(e, 'file')}
                                        onDrop={(e) => handleDrop(e, 'file')}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            accept=".epub,.pdf"
                                            onChange={(e) => handleFileChange(e, 'file')}
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <div className="mb-2 text-lg font-medium text-blue-500">Drag Files or Click to Browse</div>
                                            <p className="text-sm text-gray-500">
                                                File harus diisi
                                                <br />
                                                Ukuran file maksimal 1GB. Harap masukkan file dengan format epub.
                                            </p>
                                        </label>
                                        {data.file_konten && <p className="mt-2 text-sm text-green-600">File dipilih: {data.file_konten.name}</p>}
                                    </div>
                                </div>

                                {/* Bisa didownload */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Bisa didownload ?</label>
                                    <select
                                        value={data.bisa_didownload}
                                        onChange={(e) => setData('bisa_didownload', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="Aktif">Aktif</option>
                                        <option value="Tidak Aktif">Tidak Aktif</option>
                                    </select>
                                </div>

                                {/* Detail Tambahan */}
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <h3 className="mb-4 text-lg font-medium text-gray-800">Detail Tambahan (opsional)</h3>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {/* Author */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Author</label>
                                            <input
                                                type="text"
                                                value={data.author}
                                                onChange={(e) => setData('author', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* ISBN */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">ISBN</label>
                                            <input
                                                type="text"
                                                value={data.isbn}
                                                onChange={(e) => setData('isbn', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Format */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Format</label>
                                            <select
                                                value={data.format}
                                                onChange={(e) => setData('format', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="">-- Pilih Opsi --</option>
                                                <option value="PDF">PDF</option>
                                                <option value="EPUB">EPUB</option>
                                                <option value="MOBI">MOBI</option>
                                            </select>
                                        </div>

                                        {/* Bahasa */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Bahasa</label>
                                            <input
                                                type="text"
                                                value={data.bahasa}
                                                onChange={(e) => setData('bahasa', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Jumlah Halaman */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Jumlah Halaman</label>
                                            <input
                                                type="number"
                                                value={data.jumlah_halaman}
                                                onChange={(e) => setData('jumlah_halaman', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Tanggal Publish */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Tanggal Publish</label>
                                            <input
                                                type="date"
                                                value={data.tanggal_publish}
                                                onChange={(e) => setData('tanggal_publish', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Produk bisa diaffiliate */}
                                    <div className="mt-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.affiliate}
                                                onChange={(e) => setData('affiliate', e.target.checked)}
                                                className="focus:ring-opacity-50 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Produk bisa diaffiliate</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-md bg-blue-600 px-4 py-3 text-lg font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? 'MENYIMPAN...' : 'BUAT E-BOOK'}
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
