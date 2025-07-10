export default function AppLogo() {
    return (
        <>
            {/* <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div> */}
            <img
                src="/assets/Logo.png" // Path ke gambar Anda
                alt="E-Book Store Logo"
                className="size-8 object-contain" // Sesuaikan ukuran di sini
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">E-Book Store</span>
            </div>
        </>
    );
}
