import AppLogo from '@/components/app-logo';
import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-4 text-[#1b1b18]/70 lg:justify-center lg:p-4 dark:bg-[#0a0a0a] dark:text-[#ededec]/70">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        <AppLogo />
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                {/*Menu MAIN*/}
                <main className="mt-10 flex w-full max-w-7xl flex-1 flex-col items-center justify-center lg:mt-0">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                            <h1 className="mt-8 text-4xl leading-tight font-bold tracking-tighter md:text-5xl lg:text-6xl">
                                Buka Jendela Dunia, <br />
                                Satu Halaman Sekaligus.
                            </h1>
                            <p className="mt-6 max-w-lg text-lg text-[#1b1b18]/70 dark:text-[#ededec]/70">
                                Temukan ribuan koleksi e-book dari berbagai genre. Mulai dari fiksi yang memikat hingga non-fiksi yang memperkaya
                                wawasan. Semua ada di ujung jarimu.
                            </p>
                            <Link
                                href={route('register')}
                                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2C62D6] px-8 py-4 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
                            >
                                Mulai Menjelajah
                                <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>
                        {/*Visual Buku */}
                        <div className="hidden lg:block">
                            <div className="relative grid grid-cols-3 gap-4">
                                <img
                                    src="assets/bookcover1.jpg"
                                    alt="Book Cover 1"
                                    className="transform-gpu rounded-lg shadow-2xl transition-transform hover:-translate-y-4"
                                />
                                <img
                                    src="assets/bookcover2.jpg"
                                    alt="Book Cover 2"
                                    className="mt-8 transform-gpu rounded-lg shadow-2xl transition-transform hover:-translate-y-4"
                                />
                                <img
                                    src="assets/bookcover3.jpg"
                                    alt="Book Cover 3"
                                    className="transform-gpu rounded-lg shadow-2xl transition-transform hover:-translate-y-4"
                                />
                            </div>
                        </div>
                        {/* Appearance Setting */}
                        <div className="space-y-6">
                            <HeadingSmall title="Appearance settings" description="Change your appearance settings" />
                            <AppearanceTabs />
                        </div>
                    </div>
                </main>
                {/* Footer */}
                <footer className="mt-20 w-full max-w-7xl py-8 text-center">
                    <p className="text-sm text-[#1b1b18]/60 dark:text-[#ededec]/60">
                        &copy; {new Date().getFullYear()} E-Book Store. Dibuat dengan cinta untuk literasi.
                    </p>
                </footer>
            </div>
        </>
    );
}
