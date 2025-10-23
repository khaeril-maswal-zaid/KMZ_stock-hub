import { NavFooter } from '@/components/nav-footer';
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
import { index as purchaseIndex } from '@/routes/purchase';
import { index as salesmenIndex } from '@/routes/salesmen';
import { index as sellingIndex } from '@/routes/selling';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Folder,
    LayoutGrid,
    Package,
    ShoppingCart,
    Tag,
    Truck,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

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
        href: categorieIndex.url(),
        title: 'Kategori',
        icon: Tag,
    },
    {
        href: salesmenIndex.url(),
        title: 'Sales',
        icon: Users,
    },
    {
        href: purchaseIndex.url(),
        title: 'Pembelian',
        icon: Truck,
    },
    {
        href: sellingIndex.url(),
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
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
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
