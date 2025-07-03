<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::latest()->get();
        return Inertia::render('seller/products/index', ['products' => $products]);
    }

    public function create()
    {
        return Inertia::render('seller/products/create');
    }

    public function store(Request $request)
    {

        // Debug: Log all request data
        Log::info('Product store request:', $request->all());

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'fake_price' => 'nullable|numeric|min:0',
            'payment_type_id' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB
            'file_konten' => 'nullable|file|mimes:pdf,epub,doc,docx|max:1048576', // 1GB
            'waktu_mulai_pembayaran' => 'nullable|date',
            'tanggal_kadaluarsa' => 'nullable|date|after_or_equal:waktu_mulai_pembayaran',
            'note' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'sumber_file' => 'required|string|in:Upload Baru,Dari Library',
            'bisa_didownload' => 'required|string|in:Aktif,Tidak Aktif',
            'author' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:50',
            'format' => 'nullable|string|in:PDF,EPUB,MOBI',
            'bahasa' => 'nullable|string|max:100',
            'jumlah_halaman' => 'nullable|integer|min:1',
            'tanggal_publish' => 'nullable|date',
            'affiliate' => 'nullable|boolean',
        ], [
            'name.required' => 'Nama produk wajib diisi',
            'description.required' => 'Deskripsi wajib diisi',
            'harga.required' => 'Harga wajib diisi',
            'harga.numeric' => 'Harga harus berupa angka',
            'harga_coret.numeric' => 'Harga coret harus berupa angka',
            'image.image' => 'Cover harus berupa file gambar',
            'image.mimes' => 'Cover harus berformat jpeg, png, jpg, gif, atau webp',
            'image.max' => 'Ukuran cover maksimal 10MB',
            'file_konten.mimes' => 'File konten harus PDF, EPUB, DOC, atau DOCX',
            'file_konten.max' => 'Ukuran file maksimal 1GB',
            'tanggal_kadaluarsa.after_or_equal' => 'Tanggal kadaluarsa harus setelah tanggal mulai',
            'tipe_pembayaran.id' => 'Tipe pembayaran tidak valid',
            'sumber_file.required' => 'Sumber file wajib dipilih',
            'bisa_didownload.required' => 'Status download wajib dipilih',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        // $data['seller_id'] = Auth::id();
        // Ambil user yang sedang login
        $user = Auth::user();

        // Pastikan user memiliki relasi seller dan ambil ID seller tersebut
        if ($user && $user->seller) {
            $data['seller_id'] = $user->seller->id;
        } else {
            // Jika user tidak memiliki profil seller, kembalikan error.
            // Ini penting untuk keamanan dan integritas data.
            return redirect()->back()
                ->with('error', 'Aksi tidak diizinkan. Anda bukan seorang penjual.')
                ->withInput();
        }

        // Upload cover image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('products/images', $imageName, 'public');
            $data['cover'] = $imagePath;
            unset($data['image']);
        }

        // Upload file content
        if ($request->hasFile('file_konten')) {
            $file = $request->file('file_konten');
            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('products/files', $fileName, 'public');
            $data['file_content'] = $filePath;
            unset($data['file_konten']);
        }
        $data['start_date'] = $data['start_date'] ?? now();
        $data['end_date'] = $data['end_date'] ?? now()->addDays(7);

        Product::create($data);

        return redirect()->route('seller.products.index')
            ->with('success', 'E-Book berhasil dibuat!');

        $mappedData = [
            'seller_id' => $data['seller_id'],
            'name' => $data['name'],
            'description' => $data['description'],
            'price' => $data['harga'],
            'fake_price' => $data['harga_coret'] ?? null,
            'payment_type' => $data['tipe_pembayaran'],
            'cover' => $data['cover'] ?? null,
            'file_content' => $data['file_content'] ?? null,
            'start_date' => $data['waktu_mulai_pembayaran'] ?? now(),
            'end_date' => $data['tanggal_kadaluarsa'] ?? null,
            'note' => $data['note'] ?? null,
            'stock' => $data['stock'] ?? 0,
            'file_source' => $data['sumber_file'],
            'is_download' => $data['bisa_didownload'] === 'Aktif',
            'is_affiliate' => $data['affiliate'] ?? false,
            'author' => $data['author'] ?? null,
            'isbn' => $data['isbn'] ?? null,
            'format' => $data['format'] ?? null,
            'language' => $data['bahasa'] ?? null,
            'page_count' => $data['jumlah_halaman'] ?? null,
            'publish_date' => $data['tanggal_publish'] ?? null,
        ];

        // try {
        //     Product::create($mappedData);
        //     Log::info('Product created successfully');
        //     return redirect()->route('products.index')->with('success', 'E-Book berhasil dibuat!');
        // } catch (\Exception $e) {
        //     Log::error('Error creating product:', ['error' => $e->getMessage()]);
        //     return redirect()->back()->with('error', 'Terjadi kesalahan saat membuat produk: ' . $e->getMessage())->withInput();
        // }

        try {
            // Gunakan transaction untuk memastikan integritas data
            DB::transaction(function () use ($validatedData, $request) {
                // 1. Siapkan dan simpan data untuk ProductDetail terlebih dahulu
                $productDetail = ProductDetail::create([
                    'author' => $validatedData['author'] ?? 'Unknown Author',
                    'isbn' => $validatedData['isbn'] ?? 'N/A',
                    'language' => $validatedData['bahasa'] ?? 'Indonesia',
                    'page' => $validatedData['jumlah_halaman'] ?? 0,
                    'publish_date' => $validatedData['tanggal_publish'] ?? now(),
                ]);

                // 2. Siapkan data untuk tabel Product
                $productData = [
                    'seller_id' => Auth::user()->seller->id, // Menggunakan relasi seller yang benar
                    'payment_type_id' => $validatedData['payment_type_id'],
                    'product_detail_id' => $productDetail->id, // Hubungkan dengan ProductDetail yang baru dibuat
                    'name' => $validatedData['name'],
                    'price' => $validatedData['price'],
                    'fake_price' => $validatedData['fake_price'] ?? 0,
                    'description' => $validatedData['description'],
                    'start_date' => $validatedData['waktu_mulai_pembayaran'] ?? now(),
                    'end_date' => $validatedData['tanggal_kadaluarsa'] ?? now()->addYear(),
                    'note' => $validatedData['note'],
                    'stock' => $validatedData['stock'] ?? 0,
                    'is_download' => $validatedData['bisa_didownload'] === 'Aktif',
                    'is_affiliate' => $validatedData['affiliate'],
                ];

                // Handle upload file
                if ($request->hasFile('image')) {
                    $path = $request->file('image')->store('products/covers', 'public');
                    $productData['cover'] = $path;
                }
                if ($request->hasFile('file_konten')) {
                    $path = $request->file('file_konten')->store('products/files', 'public');
                    $productData['file_content'] = $path;
                } else {
                    // Beri nilai default jika tidak ada file, sesuai skema tabel
                    $productData['file_content'] = 'default.pdf';
                }

                // 3. Buat Produk
                Product::create($productData);
            });
        } catch (\Exception $e) {
            Log::error('Gagal membuat produk:', ['message' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan produk.')->withInput();
        }
        return redirect()->route('seller.products.index')->with('success', 'E-Book berhasil dibuat!');

    }

    public function edit(Product $product)
    {
        // if ($product->seller_id !== Auth::id()) {
        //     abort(403);
        // }

        // return Inertia::render('seller/products/edit', ['product' => $product]);

        return Inertia::render('seller/products/edit', [
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        if ($product->seller_id !== Auth::id()) {
            abort(403);
        }

        Log::info('UPDATE PRODUCT REQUEST:', $request->all());

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'fake_price' => 'nullable|numeric|min:0',
            'payment_type_id' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'file_konten' => 'nullable|file|mimes:pdf,epub,doc,docx|max:1048576',
            'waktu_mulai_pembayaran' => 'nullable|date',
            'tanggal_kadaluarsa' => 'nullable|date|after_or_equal:waktu_mulai_pembayaran',
            'note' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'sumber_file' => 'required|string|in:Upload Baru,Dari Library',
            'bisa_didownload' => 'required|string|in:Aktif,Tidak Aktif',
            'author' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:50',
            'format' => 'nullable|string|in:PDF,EPUB,MOBI',
            'bahasa' => 'nullable|string|max:100',
            'jumlah_halaman' => 'nullable|integer|min:1',
            'tanggal_publish' => 'nullable|date',
            'affiliate' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            if ($product->cover && Storage::disk('public')->exists($product->cover)) {
                Storage::disk('public')->delete($product->cover);
            }
            $image = $request->file('image');
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('products/images', $imageName, 'public');
            $data['cover'] = $imagePath;
        }

        // Handle file upload
        if ($request->hasFile('file_konten')) {
            if ($product->file_content && Storage::disk('public')->exists($product->file_content)) {
                Storage::disk('public')->delete($product->file_content);
            }
            $file = $request->file('file_konten');
            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('products/files', $fileName, 'public');
            $data['file_content'] = $filePath;
        }

        // Map ke kolom yang sesuai di tabel
        $mappedData = [
            'name' => $data['name'],
            'description' => $data['description'],
            'price' => $data['price'],
            'fake_price' => $data['fake_price'] ?? null,
            'payment_type_id' => $data['payment_type_id'],
            'start_date' => $data['waktu_mulai_pembayaran'] ?? $product->start_date,
            'end_date' => $data['tanggal_kadaluarsa'] ?? null,
            'note' => $data['note'] ?? null,
            'stock' => $data['stock'] ?? 0,
            'file_source' => $data['sumber_file'],
            'is_download' => $data['bisa_didownload'] === 'Aktif',
            'is_affiliate' => $data['affiliate'] ?? false,
            'author' => $data['author'] ?? null,
            'isbn' => $data['isbn'] ?? null,
            'format' => $data['format'] ?? null,
            'language' => $data['bahasa'] ?? null,
            'page_count' => $data['jumlah_halaman'] ?? null,
            'publish_date' => $data['tanggal_publish'] ?? null,
        ];

        // Tambahkan file yang diunggah jika ada
        if (isset($data['cover'])) {
            $mappedData['cover'] = $data['cover'];
        }
        if (isset($data['file_content'])) {
            $mappedData['file_content'] = $data['file_content'];
        }

        // Update ke database
        $product->update($mappedData);

        return redirect()->route('seller.products.index')->with('success', 'E-Book berhasil diperbarui!');
    }


    public function destroy(Product $product)
    {
        // if ($product->seller_id !== Auth::id()) {
        //     abort(403);
        // }

        // if ($product->cover && Storage::disk('public')->exists($product->cover)) {
        //     Storage::disk('public')->delete($product->cover);
        // }

        // if ($product->file_content && Storage::disk('public')->exists($product->file_content)) {
        //     Storage::disk('public')->delete($product->file_content);
        // }

        // $product->delete();

        // return redirect()->route('products.index')->with('success', 'E-Book berhasil dihapus!');

        // $product = Product::findOrFail($product);
        $product->delete();

        return redirect()->route('seller.products.index')->with('success', 'Produk berhasil dihapus.');
    }

    public function show(Product $product)
    {
        return Inertia::render('seller/products/show', ['product' => $product]);
    }
}
