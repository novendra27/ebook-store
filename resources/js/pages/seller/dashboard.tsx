import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, BarChart3, DollarSign, Eye, Package, Plus, ShoppingCart, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller',
    },
];

interface DashboardStats {
    products: {
        total: number;
        active: number;
        lowStock: number;
        outOfStock: number;
    };
    transactions: {
        total: number;
        monthly: number;
        today: number;
    };
    revenue: {
        total: number;
        monthly: number;
        today: number;
    };
    balance: {
        current: number;
        withdrawals: number;
        deposits: number;
    };
}

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    created_at: string;
    product_detail?: {
        author: string;
    };
    total_sold?: number;
}

interface Transaction {
    id: number;
    amount: number;
    created_at: string;
    user: {
        name: string;
    };
    items: Array<{
        quantity: number;
        product: {
            name: string;
        };
    }>;
}

interface ChartData {
    month: string;
    revenue: number;
}

interface Seller {
    business_name: string;
}

interface DashboardProps {
    stats: DashboardStats;
    recentProducts: Product[];
    recentTransactions: Transaction[];
    monthlyRevenueChart: ChartData[];
    topProducts: Product[];
    seller: Seller;
}

export default function SellerDashboard({ stats, recentProducts, recentTransactions, monthlyRevenueChart, topProducts, seller }: DashboardProps) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const StatCard = ({
        title,
        value,
        description,
        icon: Icon,
        trend,
        color = 'blue',
    }: {
        title: string;
        value: string | number;
        description?: string;
        icon: any;
        trend?: 'up' | 'down' | 'neutral';
        color?: 'blue' | 'green' | 'yellow' | 'red';
    }) => {
        const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            yellow: 'bg-yellow-500',
            red: 'bg-red-500',
        };

        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <div className={`rounded-full p-2 ${colorClasses[color]} text-white`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    {description && (
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            {trend === 'up' && <TrendingUp className="mr-1 h-3 w-3 text-green-500" />}
                            {trend === 'down' && <TrendingDown className="mr-1 h-3 w-3 text-red-500" />}
                            {description}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seller Dashboard" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Welcome Section */}
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {seller.business_name}!</h1>
                            <p className="mt-2 text-gray-600">Here's what's happening with your e-book store today.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" asChild>
                                <Link href={route('seller.products.index')}>
                                    <Package className="mr-2 h-4 w-4" />
                                    Manage Products
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Products"
                        value={stats.products.total}
                        description={`${stats.products.active} active`}
                        icon={Package}
                        color="blue"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={formatRupiah(stats.revenue.total)}
                        description={`${formatRupiah(stats.revenue.monthly)} this month`}
                        icon={DollarSign}
                        color="green"
                        trend="up"
                    />
                    <StatCard
                        title="Total Transactions"
                        value={stats.transactions.total}
                        description={`${stats.transactions.today} today`}
                        icon={ShoppingCart}
                        color="blue"
                    />
                    <StatCard
                        title="Current Balance"
                        value={formatRupiah(stats.balance.current)}
                        description="Available balance"
                        icon={Wallet}
                        color="green"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Low Stock Alert"
                        value={stats.products.lowStock}
                        description="Products with low stock"
                        icon={AlertTriangle}
                        color="yellow"
                    />
                    <StatCard
                        title="Out of Stock"
                        value={stats.products.outOfStock}
                        description="Products need restocking"
                        icon={Package}
                        color="red"
                    />
                    <StatCard
                        title="Today's Revenue"
                        value={formatRupiah(stats.revenue.today)}
                        description="Sales today"
                        icon={DollarSign}
                        color="green"
                    />
                    <StatCard
                        title="Monthly Transactions"
                        value={stats.transactions.monthly}
                        description="This month's sales"
                        icon={BarChart3}
                        color="blue"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Products */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Products</CardTitle>
                                    <CardDescription>Your latest added products</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('seller.products.index')}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View All
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentProducts.length > 0 ? (
                                    recentProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {product.name.length > 40 ? `${product.name.substring(0, 40)}...` : product.name}
                                                </p>
                                                <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Price: {formatRupiah(product.price)}</span>
                                                    <span>Stock: {product.stock}</span>
                                                    <span>{product.product_detail?.author || 'No author'}</span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">{formatDate(product.created_at)}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-gray-500">
                                        <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                        <p>No products yet</p>
                                        <Button className="mt-4" asChild>
                                            <Link href={route('seller.products.create')}>Add Your First Product</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Transactions</CardTitle>
                                    <CardDescription>Latest customer purchases</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('transactions.index')}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View All
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTransactions.length > 0 ? (
                                    recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Order #{transaction.id}</p>
                                                <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Customer: {transaction.user.name}</span>
                                                    <span>{transaction.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-green-600">{formatRupiah(transaction.amount)}</div>
                                                <div className="text-xs text-gray-500">{formatDate(transaction.created_at)}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-gray-500">
                                        <ShoppingCart className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                        <p>No transactions yet</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Products & Revenue Chart */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Top Selling Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                            <CardDescription>Your best performing products</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.length > 0 ? (
                                    topProducts.map((product, index) => (
                                        <div key={product.id} className="flex items-center gap-4 rounded-lg border p-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {product.name.length > 30 ? `${product.name.substring(0, 30)}...` : product.name}
                                                </p>
                                                <p className="text-xs text-gray-500">Price: {formatRupiah(product.price)}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-green-600">{product.total_sold || 0} sold</div>
                                                <div className="text-xs text-gray-500">Stock: {product.stock}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-gray-500">
                                        <BarChart3 className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                        <p>No sales data yet</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Trend</CardTitle>
                            <CardDescription>Last 6 months revenue performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyRevenueChart.map((data, index) => {
                                    const maxRevenue = Math.max(...monthlyRevenueChart.map((d) => d.revenue));
                                    const percentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;

                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>{data.month}</span>
                                                <span className="font-medium">{formatRupiah(data.revenue)}</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-200">
                                                <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${percentage}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Manage your store efficiently</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Button asChild className="h-20 flex-col gap-2">
                                <Link href={route('seller.products.create')}>
                                    <Plus className="h-6 w-6" />
                                    Add New Product
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-20 flex-col gap-2">
                                <Link href={route('seller.products.index')}>
                                    <Package className="h-6 w-6" />
                                    Manage Products
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-20 flex-col gap-2">
                                <Link href={route('transactions.index')}>
                                    <ShoppingCart className="h-6 w-6" />
                                    View Transactions
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-20 flex-col gap-2">
                                <Link href={route('balances.index')}>
                                    <Wallet className="h-6 w-6" />
                                    Manage Balance
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
