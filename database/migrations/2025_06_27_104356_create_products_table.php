<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
            $table->foreignId('payment_type_id')->constrained('payment_types');
            $table->foreignId('product_detail_id')->nullable()->constrained('product_details');
            $table->string('name');
            $table->bigInteger('price');
            $table->bigInteger('fake_price');
            $table->text('description');
            $table->string('cover');
            $table->datetime('start_date');
            $table->datetime('end_date');
            $table->text('note')->nullable();
            $table->bigInteger('stock')->default(0);
            $table->string('file_content');
            $table->boolean('is_download')->default(false);
            $table->boolean('is_affiliate')->default(false);
            $table->timestamp('created_at');
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
