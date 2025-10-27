import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { report } from '@/routes/';
import { index as categorieIndex } from '@/routes/categorie';
import { index as productIndex } from '@/routes/product';
import { index as salesmenIndex } from '@/routes/salesmen';
import { pembelian, penjualan } from '@/routes/transaction';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BarChart3,
    LayoutGrid,
    Package,
    ShoppingCart,
    Tag,
    Truck,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';
import { NavFooter } from './nav-footer';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        href: productIndex.url(),
        title: 'Barang',
        icon: Package,
    },

    {
        href: pembelian.url(),
        title: 'Pembelian',
        icon: Truck,
    },
    {
        href: penjualan.url(),
        title: 'Penjualan',
        icon: ShoppingCart,
    },
    {
        href: report.url(),
        title: 'Laporan',
        icon: BarChart3,
    },
];

const footerNavItems: NavItem[] = [
    {
        href: categorieIndex.url(),
        title: 'Kategori',
        icon: Tag,
    },
    {
        href: salesmenIndex.url(),
        title: 'Sales',
        icon: Users,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
