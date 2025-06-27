<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'author',
        'isbn',
        'language',
        'page',
        'publish_date',
    ];

    protected $casts = [
        'publish_date' => 'datetime',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
