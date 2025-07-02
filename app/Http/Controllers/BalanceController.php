<?php

namespace App\Http\Controllers;

use App\Models\Balance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BalanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $balances = Balance::where('seller_id', $user->seller->id)
            ->with(['invoice'])
            ->latest()
            ->get();

        // Get the current balance from the latest balance record
        $currentBalance = $balances->first()->balance_after ?? 0;

        return Inertia::render('seller/balance/index', [
            'balances' => $balances,
            'currentBalance' => $currentBalance,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();

        // Get the current balance from the latest balance record
        $currentBalance = $user->seller->balances()->latest()->first()->balance_after ?? 0;

        return Inertia::render('seller/balance/create', [
            'currentBalance' => $currentBalance,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'amount' => 'required|numeric|min:10000', // Minimum withdraw 10,000
            'note' => 'nullable|string|max:255',
        ]);

        // Get current balance
        $currentBalance = $user->seller->balances()->latest()->first()->balance_after ?? 0;

        // Check if sufficient balance
        if ($request->amount > $currentBalance) {
            return back()->withErrors(['amount' => 'Insufficient balance for withdrawal.']);
        }

        // Create withdraw balance record
        Balance::create([
            'seller_id' => $user->seller->id,
            'invoice_id' => null, // No invoice for withdraw
            'note' => $request->note ?? 'Withdrawal',
            'change_amount' => $request->amount, // Negative for withdrawal
            'balance_after' => $currentBalance - $request->amount,
        ]);

        return redirect()->route('seller.balances.index')->with('success', 'Withdrawal processed successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
