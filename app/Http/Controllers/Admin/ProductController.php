<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\PaymentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user || !$user->seller) {
            abort(403, 'You must be a seller to access this page.');
        }

        $products = Product::where('seller_id', $user->seller->id)
            ->with(['productDetail'])
            ->latest()
            ->get();

        return Inertia::render('seller/products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();

        $productDetails = ProductDetail::all();
        $paymentTypes = PaymentType::all();

        return Inertia::render('seller/products/create', [
            'productDetails' => $productDetails,
            'paymentTypes' => $paymentTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->seller) {
            abort(403, 'You must be a seller to access this page.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'fake_price' => 'required|numeric|min:0',
            'payment_type_id' => 'required|exists:payment_types,id',
            'cover' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
            'cover_path' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'file_content' => 'nullable|file|mimes:pdf,epub,mobi|max:51200', // 50MB max
            'file_path' => 'nullable|string|max:255',
            'stock' => 'nullable|integer|min:0',
            'note' => 'nullable|string',
            'is_download' => 'boolean',
            'is_affiliate' => 'boolean',
            // Product Detail Fields
            'author' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:100',
            'page' => 'nullable|integer|min:1',
            'publish_date' => 'nullable|date',
        ]);

        // Handle file uploads
        $coverPath = null;
        $filePath = null;

        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('covers', 'public');
        } elseif ($request->cover_path) {
            $coverPath = $request->cover_path;
        }

        if ($request->hasFile('file_content')) {
            $filePath = $request->file('file_content')->store('ebooks', 'public');
        } elseif ($request->file_path) {
            $filePath = $request->file_path;
        }

        // Create or find product detail if any detail field is provided
        $productDetailId = null;
        if ($request->author || $request->isbn || $request->language || $request->page || $request->publish_date) {
            $productDetail = ProductDetail::create([
                'author' => $request->author,
                'isbn' => $request->isbn,
                'language' => $request->language,
                'page' => $request->page,
                'publish_date' => $request->publish_date,
            ]);
            $productDetailId = $productDetail->id;
        }

        Product::create([
            'seller_id' => $user->seller->id,
            'payment_type_id' => $request->payment_type_id,
            'product_detail_id' => $productDetailId,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'fake_price' => $request->fake_price,
            'cover' => $coverPath,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'file_content' => $filePath,
            'stock' => $request->stock ?? 0,
            'note' => $request->note,
            'is_download' => $request->is_download ?? false,
            'is_affiliate' => $request->is_affiliate ?? false,
        ]);

        return redirect()->route('seller.products.index')
            ->with('success', 'Product created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();

        if (!$user || !$user->seller) {
            abort(403, 'You must be a seller to access this page.');
        }

        $product = Product::where('seller_id', $user->seller->id)
            ->with(['productDetail', 'seller'])
            ->findOrFail($id);

        return Inertia::render('seller/products/show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = Auth::user();

        $product = Product::where('seller_id', $user->seller->id)
            ->with(['productDetail'])
            ->findOrFail($id);

        $paymentTypes = PaymentType::all();

        return Inertia::render('seller/products/edit', [
            'product' => $product,
            'paymentTypes' => $paymentTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();

        if (!$user || !$user->seller) {
            abort(403, 'You must be a seller to access this page.');
        }

        $product = Product::where('seller_id', $user->seller->id)
            ->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'fake_price' => 'required|numeric|min:0',
            'payment_type_id' => 'required|exists:payment_types,id',
            'cover' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
            'cover_path' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'file_content' => 'nullable|file|mimes:pdf,epub,mobi|max:51200', // 50MB max
            'file_path' => 'nullable|string|max:255',
            'stock' => 'nullable|integer|min:0',
            'note' => 'nullable|string',
            'is_download' => 'boolean',
            'is_affiliate' => 'boolean',
            // Product Detail Fields
            'author' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:100',
            'page' => 'nullable|integer|min:1',
            'publish_date' => 'nullable|date',
        ]);

        // Handle file uploads
        $coverPath = $product->cover; // Keep current cover if no new one uploaded
        $filePath = $product->file_content; // Keep current file if no new one uploaded

        if ($request->hasFile('cover')) {
            // Delete old cover if exists
            if ($product->cover && Storage::disk('public')->exists($product->cover)) {
                Storage::disk('public')->delete($product->cover);
            }
            $coverPath = $request->file('cover')->store('covers', 'public');
        } elseif ($request->cover_path) {
            $coverPath = $request->cover_path;
        }

        if ($request->hasFile('file_content')) {
            // Delete old file if exists
            if ($product->file_content && Storage::disk('public')->exists($product->file_content)) {
                Storage::disk('public')->delete($product->file_content);
            }
            $filePath = $request->file('file_content')->store('ebooks', 'public');
        } elseif ($request->file_path) {
            $filePath = $request->file_path;
        }

        // Handle product detail creation/update
        $productDetailId = $product->product_detail_id;
        if ($request->author || $request->isbn || $request->language || $request->page || $request->publish_date) {
            if ($product->productDetail) {
                // Update existing product detail
                $product->productDetail->update([
                    'author' => $request->author,
                    'isbn' => $request->isbn,
                    'language' => $request->language,
                    'page' => $request->page,
                    'publish_date' => $request->publish_date,
                ]);
            } else {
                // Create new product detail
                $productDetail = ProductDetail::create([
                    'author' => $request->author,
                    'isbn' => $request->isbn,
                    'language' => $request->language,
                    'page' => $request->page,
                    'publish_date' => $request->publish_date,
                ]);
                $productDetailId = $productDetail->id;
            }
        } else {
            // If no detail fields provided, remove product detail association
            $productDetailId = null;
        }

        $product->update([
            'payment_type_id' => $request->payment_type_id,
            'product_detail_id' => $productDetailId,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'fake_price' => $request->fake_price,
            'cover' => $coverPath,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'file_content' => $filePath,
            'stock' => $request->stock ?? 0,
            'note' => $request->note,
            'is_download' => $request->is_download ?? false,
            'is_affiliate' => $request->is_affiliate ?? false,
        ]);

        return redirect()->route('seller.products.index')
            ->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();

        if (!$user || !$user->seller) {
            abort(403, 'You must be a seller to access this page.');
        }

        $product = Product::where('seller_id', $user->seller->id)
            ->findOrFail($id);

        $product->delete();

        return redirect()->route('seller.products.index')
            ->with('success', 'Product deleted successfully!');
    }
}
