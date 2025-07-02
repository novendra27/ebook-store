{{-- @extends('layouts.admin')

@section('title', 'Add Products')

@section('content')
<div class="bg-gray-900 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Breadcrumb -->
        <nav class="flex mb-6" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
                <li class="inline-flex items-center">
                    <a href="{{ route('admin.dashboard') }}" class="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white">
                        Seller Dashboard
                    </a>
                </li>
                <li>
                    <div class="flex items-center">
                        <svg class="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <a href="{{ route('admin.products.index') }}" class="ml-1 text-sm font-medium text-gray-400 hover:text-white md:ml-2">Products</a>
                    </div>
                </li>
                <li>
                    <div class="flex items-center">
                        <svg class="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span class="ml-1 text-sm font-medium text-white md:ml-2">Tambah Produk</span>
                    </div>
                </li>
            </ol>
        </nav>

        <!-- Add Products Form -->
        <div class="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-2xl">
            <h1 class="text-2xl font-bold text-white mb-6">Add Products</h1>

            @if ($errors->any())
                <div class="bg-red-600 text-white p-4 rounded-lg mb-6">
                    <ul class="list-disc list-inside">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
                @csrf

                <!-- Gambar Produk -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Gambar Produk</label>
                    <div class="relative">
                        <input type="file" name="image" id="image" accept="image/*" class="hidden" onchange="previewImage(event)">
                        <div class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition duration-200 cursor-pointer" onclick="document.getElementById('image').click()">
                            <div id="image-preview" class="hidden">
                                <img id="preview-img" src="" alt="Preview" class="max-w-full h-48 mx-auto object-cover rounded">
                                <p class="text-gray-400 text-sm mt-2">Click to change image</p>
                            </div>
                            <div id="upload-placeholder">
                                <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <p class="text-gray-400">
                                    <span class="font-medium">Choose File</span> 
                                    <span class="text-gray-500">No file chosen</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product Name -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                    <input type="text" name="name" id="name" value="{{ old('name') }}" 
                           placeholder="product name" 
                           class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <!-- Product Description -->
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-300 mb-2">Product Description</label>
                    <textarea name="description" id="description" rows="4" 
                              placeholder="product description"
                              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical">{{ old('description') }}</textarea>
                </div>

                <!-- Price -->
                <div>
                    <label for="price" class="block text-sm font-medium text-gray-300 mb-2">Price</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2 text-gray-400">Rp</span>
                        <input type="number" name="price" id="price" value="{{ old('price', 0) }}" min="0" step="0.01"
                               class="w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                </div>

                <!-- Stock -->
                <div>
                    <label for="stock" class="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                    <input type="number" name="stock" id="stock" value="{{ old('stock', 0) }}" min="0"
                           class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <!-- Submit Button -->
                <div class="flex justify-start">
                    <button type="submit" class="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-200">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-img').src = e.target.result;
            document.getElementById('image-preview').classList.remove('hidden');
            document.getElementById('upload-placeholder').classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
}
</script>
@endsection --}}