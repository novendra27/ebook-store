<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Invoice;
use App\Models\Balance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if (!$user || !$user->seller) {
            abort(403, 'You must be a seller to access this page.');
        }

        $sellerId = $user->seller->id;

        // Product Statistics
        $totalProducts = Product::where('seller_id', $sellerId)->count();
        $activeProducts = Product::where('seller_id', $sellerId)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->count();
        $lowStockProducts = Product::where('seller_id', $sellerId)
            ->where('stock', '<=', 10)
            ->where('stock', '>', 0)
            ->count();
        $outOfStockProducts = Product::where('seller_id', $sellerId)
            ->where('stock', 0)
            ->count();

        // Transaction Statistics
        $totalTransactions = Invoice::whereHas('items.product', function($query) use ($sellerId) {
            $query->where('seller_id', $sellerId);
        })->count();

        $monthlyTransactions = Invoice::whereHas('items.product', function($query) use ($sellerId) {
            $query->where('seller_id', $sellerId);
        })
        ->whereMonth('created_at', Carbon::now()->month)
        ->whereYear('created_at', Carbon::now()->year)
        ->count();

        $todayTransactions = Invoice::whereHas('items.product', function($query) use ($sellerId) {
            $query->where('seller_id', $sellerId);
        })
        ->whereDate('created_at', Carbon::today())
        ->count();

        // Revenue Statistics
        $totalRevenue = Invoice::whereHas('items.product', function($query) use ($sellerId) {
            $query->where('seller_id', $sellerId);
        })
        ->join('invoice_products', 'invoices.id', '=', 'invoice_products.invoice_id')
        ->join('products', 'invoice_products.product_id', '=', 'products.id')
        ->where('products.seller_id', $sellerId)
        ->sum(DB::raw('invoice_products.quantity * invoice_products.amount'));

        $monthlyRevenue = Invoice::whereHas('items.product', function($query) use ($sellerId) {
            $query->where('seller_id', $sellerId);
        })
        ->join('invoice_products', 'invoices.id', '=', 'invoice_products.invoice_id')
        ->join('products', 'invoice_products.product_id', '=', 'products.id')
        ->where('products.seller_id', $sellerId)
        ->whereMonth('invoices.created_at', Carbon::now()->month)
        ->whereYear('invoices.created_at', Carbon::now()->year)
        ->sum(DB::raw('invoice_products.quantity * invoice_products.amount'));

        $todayRevenue = Invoice::whereHas('items.product', function($query) use ($sellerId) {
            $query->where('seller_id', $sellerId);
        })
        ->join('invoice_products', 'invoices.id', '=', 'invoice_products.invoice_id')
        ->join('products', 'invoice_products.product_id', '=', 'products.id')
        ->where('products.seller_id', $sellerId)
        ->whereDate('invoices.created_at', Carbon::today())
        ->sum(DB::raw('invoice_products.quantity * invoice_products.amount'));

        // Balance Statistics
        $currentBalance = Balance::where('seller_id', $sellerId)
            ->orderBy('created_at', 'desc')
            ->first();

        // Calculate withdrawals (negative change_amount values)
        $totalWithdrawals = Balance::where('seller_id', $sellerId)
            ->where('change_amount', '<', 0)
            ->sum(DB::raw('ABS(change_amount)'));

        // Calculate deposits (positive change_amount values)
        $totalDeposits = Balance::where('seller_id', $sellerId)
            ->where('change_amount', '>', 0)
            ->sum('change_amount');

        // Recent Products
        $recentProducts = Product::where('seller_id', $sellerId)
            ->with(['productDetail'])
            ->latest()
            ->take(5)
            ->get();

        // Recent Transactions
        $recentTransactions = Invoice::whereHas('items.product', function($query) use ($sellerId) {
            $query->where('seller_id', $sellerId);
        })
        ->with(['user', 'items.product'])
        ->latest()
        ->take(5)
        ->get();

        // Monthly Revenue Chart Data (last 6 months)
        $monthlyRevenueChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $revenue = Invoice::whereHas('items.product', function($query) use ($sellerId) {
                $query->where('seller_id', $sellerId);
            })
            ->join('invoice_products', 'invoices.id', '=', 'invoice_products.invoice_id')
            ->join('products', 'invoice_products.product_id', '=', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->whereMonth('invoices.created_at', $month->month)
            ->whereYear('invoices.created_at', $month->year)
            ->sum(DB::raw('invoice_products.quantity * invoice_products.amount'));

            $monthlyRevenueChart[] = [
                'month' => $month->format('M Y'),
                'revenue' => (float) $revenue
            ];
        }

        // Top Selling Products
        $topProducts = Product::where('seller_id', $sellerId)
            ->withCount(['invoiceProducts as total_sold' => function($query) {
                $query->select(DB::raw('sum(quantity)'));
            }])
            ->having('total_sold', '>', 0)
            ->orderBy('total_sold', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('seller/dashboard', [
            'stats' => [
                'products' => [
                    'total' => $totalProducts,
                    'active' => $activeProducts,
                    'lowStock' => $lowStockProducts,
                    'outOfStock' => $outOfStockProducts,
                ],
                'transactions' => [
                    'total' => $totalTransactions,
                    'monthly' => $monthlyTransactions,
                    'today' => $todayTransactions,
                ],
                'revenue' => [
                    'total' => (float) $totalRevenue,
                    'monthly' => (float) $monthlyRevenue,
                    'today' => (float) $todayRevenue,
                ],
                'balance' => [
                    'current' => $currentBalance ? (float) $currentBalance->balance_after : 0,
                    'withdrawals' => (float) $totalWithdrawals,
                    'deposits' => (float) $totalDeposits,
                ],
            ],
            'recentProducts' => $recentProducts,
            'recentTransactions' => $recentTransactions,
            'monthlyRevenueChart' => $monthlyRevenueChart,
            'topProducts' => $topProducts,
            'seller' => $user->seller,
        ]);
    }
}
