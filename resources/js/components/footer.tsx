import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';
import { Github, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-auto border-t bg-background">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Kolom 1: Logo dan Deskripsi */}
                    <div className="col-span-1 space-y-4 md:col-span-2">
                        <AppLogo />
                        <p className="max-w-md text-sm text-muted-foreground">
                            Platform jual beli e-book terbaik untuk menemukan dan menerbitkan karya digital Anda. Bergabunglah dengan komunitas
                            penulis dan pembaca kami.
                        </p>
                    </div>

                    {/* Kolom 2: Link Navigasi */}
                    <div>
                        <h3 className="mb-4 font-semibold text-foreground">Jelajahi</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href={route('dashboard')} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href={route('dashboard')} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link href={route('about')} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href={'#'} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 3: Link Legal */}
                    <div>
                        <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href={route('privacy.policy')} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                    Kebijakan Privasi
                                </Link>
                            </li>
                            <li>
                                <Link href={'#'} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                    Syarat & Ketentuan
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} E-Book Store. All Rights Reserved.</p>
                    <div className="mt-4 flex items-center gap-4 sm:mt-0">
                        <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                            <Instagram size={20} />
                        </a>
                        <a href="https://github.com/novendra27/ebook-store" className="text-muted-foreground transition-colors hover:text-primary">
                            <Github size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
