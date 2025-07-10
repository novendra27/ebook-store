import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import BuyerLayoutTemplate from '@/layouts/app/app-header-layout';
import SellerLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    if (auth.user.role == 'seller') {
        return (
            <SellerLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
                <Toaster />
            </SellerLayoutTemplate>
        );
    }

    return (
        <BuyerLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster />
            <Footer />
        </BuyerLayoutTemplate>
    );
};
