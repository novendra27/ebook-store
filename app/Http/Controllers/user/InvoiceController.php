<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Invoice;
use App\Models\InvoiceProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use Haruncpi\LaravelIdGenerator\IdGenerator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    public function __construct()
    {
        Configuration::setXenditKey(config('xendit.API_KEY'));
    }

    public function index()
    {
        $userId = Auth::id();
        $invoices = Invoice::with('items.product')
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('invoice',compact('invoices'));
    }

    public function store(){
        DB::beginTransaction();
        try {
            $userId = Auth::id();
            $carts = Cart::with('product')
                ->where([['user_id', $userId], ['status','active']])
                ->get();
            // dd($carts);
            $items = array();
            $amount = 0;
            foreach ($carts as $cart) {
                $items[] = [
                    'name' => $cart->product->name,
                    'price' => $cart->product->price,
                    'quantity' => $cart->quantity,

                ];
                $amount += $cart->product->price * $cart->quantity;
            };
            //dd($items);
            $invoice_code = IdGenerator::generate([
                'table' => 'invoices',
                'field' => 'invoice_code',
                'length' => 11,
                'reset_on_prefix_change' => true,
                'prefix' => 'INV-'.date('y')
            ]);
            $invoice = Invoice::create([
                'user_id' => $userId,
                'invoice_code' => $invoice_code,
                'amount' => $amount,
            ]);

            //request create invoice
            $xendit_create_invoice = new CreateInvoiceRequest([
                'external_id' => $invoice_code,
                'customer' => [
                    'given_names' => Auth::user()->name,
                    'email' => Auth::user()->email,
                ],
                'amount' => $amount,
                'items' => $items,
                'failure_redirect_url' => route('invoice.show',['id'=> $invoice->id]),
                'success_redirect_url' => route('invoice.show',['id'=> $invoice->id]),
            ]);

            // instance api xendit
            $xendit_api_instace = new InvoiceApi();

            // dd([
            //     'invoice_code' => $invoice_code,
            //     'customer_name' => Auth::user()->name,
            //     'customer_email' => Auth::user()->email,
            //     'amount' => $amount,
            //     'items' => $items,
            // ]);
            // create xendit invoice
            $xendit_invoice = $xendit_api_instace->createInvoice($xendit_create_invoice);

            $invoice->update([
                'invoice_url' => $xendit_invoice['invoice_url'],
            ]);

            foreach ($carts as $cart) {
                $cart->update([
                    'status' => 'ordered',
                ]);

                $cart->product->update([
                    'stock' => $cart->product->stock - $cart->quantity
                ]);

                InvoiceProduct::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $cart->product_id,
                    'amount' => $cart->product->price,
                    'quantity' => $cart->quantity,
                ]);
            }

            DB::commit();
            return Inertia::location($xendit_invoice['invoice_url']);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }

    }

    public function show($id)
    {
        $invoice = Invoice::with('items','items.product')->findOrFail($id);
        // dd($invoice);
        return Inertia::render('invoice-detail', compact('invoice'));
    }

    public function callbackXendit(Request $request)
    {

        Log::info('Xendit Callback Hit', $request->all());
        Log::info('Headers', $request->headers->all());

        $getToken = $request->header('x-callback-token');
        $callbackToken = config('xendit.CALLBACK_TOKEN');

        if ($getToken != $callbackToken) {
            Log::warning('Invalid token: ' . $getToken);
            return response()->json([
                'message' => 'unauthorized',
            ], 401);
        }

        // cek invoice id dari xendit dengan external id di database
        $invoice = Invoice::where('invoice_code', $request->external_id)->first();
        if (!$invoice) {
            Log::warning('Invoice Not Found: ' . $request->external_id);
            return response()->json([
                'message' => 'Invoice Not Found',
            ], 404);
        }
        $data = date_create($request->paid_at);
        $paid_at = date_format($data, 'Y-m-d H:i:s');
        $invoice->update([
            'paid_at' => $paid_at,
            'status' => ($request->status == 'PAID' || $request->status == 'SETTLED') ? 'paid' : 'failed',
            'payment_method' => $request->payment_method,
            'payment_channel' => $request->payment_channel
        ]);

        Log::info('Invoice updated successfully', ['invoice_id' => $invoice->id]);

        return response()->json([
            'message' => 'Success',
        ], 200);
    }

}
