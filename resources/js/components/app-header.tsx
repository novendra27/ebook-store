import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Home, Menu, ShoppingCart, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { post } = useForm();

    interface CartItem {
        id: number;
        quantity: number;
        price: number;
        product: {
            id: number;
            title: string;
            cover: string;
            price: number;
        };
    }

    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const fetchCart = () => {
            fetch(route('cart.list'))
                .then((res) => res.json())
                .then((data) => setCart(data));
        };

        fetchCart();

        window.addEventListener('cart-updated', fetchCart);
        return () => window.removeEventListener('cart-updated', fetchCart);
    }, []);

    const { processing } = useForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('invoice.store'), {
            onSuccess: () => {
                toast.success('Checkout berhasil!');
                window.dispatchEvent(new Event('cart-updated'));
                setTimeout(() => {
                    window.location.href = route('invoice.store'); // jika `res.props.url` dikirim di response inertia
                }, 4000);
            },
            onError: () => toast.error('Checkout gagal.'),
        });
    };
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link key={item.title} href={item.href} className="flex items-center space-x-2 font-medium">
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                    >
                                                        <span className="sr-only">Cart</span>
                                                        <Icon iconNode={ShoppingCart} className="size-5 opacity-80 group-hover:opacity-100" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="ms-4 w-80">
                                                    <div className="mb-2 font-semibold">Keranjang</div>
                                                    {cart.length === 0 ? (
                                                        <div className="text-sm text-muted-foreground">Keranjang belanja kamu masih kosong.</div>
                                                    ) : (
                                                        <>
                                                            <div className="divide-y">
                                                                {cart.map((item) => (
                                                                    <div key={item.id} className="flex items-center gap-3 py-2">
                                                                        <img
                                                                            src={`/storage/${item.product.cover}`}
                                                                            alt={item.product.title}
                                                                            className="h-12 w-12 rounded border object-cover"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <div className="font-medium">{item.product.title}</div>
                                                                            <div className="text-xs text-muted-foreground">
                                                                                {item.quantity} x Rp{item.product.price.toLocaleString('id-ID')}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col items-end gap-1">
                                                                            <div className="text-sm font-semibold">
                                                                                Rp{(item.quantity * item.product.price).toLocaleString('id-ID')}
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                className="flex items-center text-xs text-red-500 hover:underline"
                                                                                title="Hapus"
                                                                                onClick={() => {
                                                                                    post(route('cart.cancel', item.id), {
                                                                                        onSuccess: () =>
                                                                                            window.dispatchEvent(new Event('cart-updated')),
                                                                                        preserveScroll: true,
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <Trash className="mr-1 h-3 w-3" /> Hapus
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="mt-3 flex items-center justify-between font-semibold">
                                                                <span>Total</span>
                                                                <span>
                                                                    Rp
                                                                    {cart
                                                                        .reduce((sum, item) => sum + item.quantity * item.product.price, 0)
                                                                        .toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                            {/* <Button
                                                                className="mt-4 w-full"
                                                                size="sm"
                                                                onClick={() => {
                                                                    axios.post(route('invoice.store')).then((res) => {
                                                                        if (res.data.url) {
                                                                            toast.success('Checkout Berhasil!, silakan lanjutkan ke pembayaran.');
                                                                            window.dispatchEvent(new Event('cart-updated'));
                                                                            setTimeout(() => {
                                                                                window.location.href = res.data.url;
                                                                            }, 4000); //tunggu 6 detik sebelum redirect
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                Checkout
                                                            </Button> */}
                                                            <form onSubmit={handleSubmit}>
                                                                <Button type="submit" className="mt-4 w-full" size="sm" disabled={processing}>
                                                                    Checkout
                                                                </Button>
                                                            </form>
                                                        </>
                                                    )}
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/" prefetch className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <div className="hidden lg:flex">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                        >
                                            <span className="sr-only">Cart</span>
                                            <Icon iconNode={ShoppingCart} className="size-5 opacity-80 group-hover:opacity-100" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="mb-2 font-semibold">Keranjang</div>
                                        {cart.length === 0 ? (
                                            <div className="text-sm text-muted-foreground">Keranjang belanja kamu masih kosong.</div>
                                        ) : (
                                            <>
                                                <div className="divide-y">
                                                    {cart.map((item) => (
                                                        <div key={item.id} className="flex items-center gap-3 py-2">
                                                            <img
                                                                src={`/storage/${item.product.cover}`}
                                                                alt={item.product.title}
                                                                className="h-12 w-12 rounded border object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="font-medium">{item.product.title}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {item.quantity} x Rp{item.product.price.toLocaleString('id-ID')}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <div className="text-sm font-semibold">
                                                                    Rp{(item.quantity * item.product.price).toLocaleString('id-ID')}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="flex items-center text-xs text-red-500 hover:underline"
                                                                    title="Hapus"
                                                                    onClick={() => {
                                                                        post(route('cart.cancel', item.id), {
                                                                            onSuccess: () => window.dispatchEvent(new Event('cart-updated')),
                                                                            preserveScroll: true,
                                                                        });
                                                                    }}
                                                                >
                                                                    <Trash className="mr-1 h-3 w-3" /> Hapus
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 flex items-center justify-between font-semibold">
                                                    <span>Total</span>
                                                    <span>
                                                        Rp
                                                        {cart
                                                            .reduce((sum, item) => sum + item.quantity * item.product.price, 0)
                                                            .toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                {/* <Button
                                                    className="mt-4 w-full"
                                                    size="sm"
                                                    onClick={() => {
                                                        axios.post(route('invoice.store')).then((res) => {
                                                            if (res.data.url) {
                                                                toast.success('Checkout Berhasil!, silakan lanjutkan ke pembayaran.');
                                                                window.dispatchEvent(new Event('cart-updated'));
                                                                setTimeout(() => {
                                                                    window.location.href = res.data.url;
                                                                }, 4000); //tunggu 6 detik sebelum redirect
                                                            }
                                                        });
                                                    }}
                                                >
                                                    Checkout
                                                </Button> */}
                                                <form onSubmit={handleSubmit}>
                                                    <Button type="submit" className="mt-4 w-full" size="sm" disabled={processing}>
                                                        Checkout
                                                    </Button>
                                                </form>
                                            </>
                                        )}
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
