<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'payment_type_id',
        'product_detail_id',
        'name',
        'price',
        'fake_price',
        'description',
        'cover',
        'start_date',
        'end_date',
        'note',
        'stock',
        'file_content',
        'is_download',
        'is_affiliate',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_download' => 'boolean',
        'is_affiliate' => 'boolean',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function paymentType(): BelongsTo
    {
        return $this->belongsTo(PaymentType::class);
    }

    public function productDetail(): BelongsTo
    {
        return $this->belongsTo(ProductDetail::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    public function invoiceProducts(): HasMany
    {
        return $this->hasMany(InvoiceProduct::class);
    }
}
