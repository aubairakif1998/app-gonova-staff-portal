"use client"
import Link from 'next/link';
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  Monitor,
  PackageIcon,
  File,
  Users2,
  FileTextIcon,
  User2,
  LifeBuoyIcon
} from 'lucide-react';
import { useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { VercelLogo } from '@/components/icons';
import Providers from './providers';
import { NavItem } from './nav-item';
import { SearchInput } from './search';
import { UserWidget } from './user';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardBreadcrumb from './DashboardBreadcrumb';
import { ClipLoader } from 'react-spinners';
import { Progress } from '@radix-ui/react-progress';
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!session) {
      router.push('/sign-in');
    }
  }, [session, status, router]);
  // Show loading state while checking session
  if (status === 'loading' || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#000" loading={true} size={50} />
        <Progress value={50} /> {/* Example value */}
      </div>
    );
  }
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <DashboardBreadcrumb />
            {/* <SearchInput /> */}

            <div className="relative ml-auto flex-1 md:grow-0">
              <UserWidget />
            </div>
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  );
}





function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-8 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />
          <span className="sr-only">Nova Staff Portal</span>
        </Link>

        <NavItem href="/loads" label="Loads">
          {/* <Monitor className="h-5 w-5" /> */}
          <div className='text-sm font-bold'>Loads</div>
        </NavItem>

        <NavItem href="/loads" label="Loads">
          {/* <Monitor className="h-5 w-5" /> */}
          <div className='text-sm font-bold'>Shippers</div>
        </NavItem>

        <NavItem href="/loads" label="Loads">
          {/* <Monitor className="h-5 w-5" /> */}
          <div className='text-sm font-bold'>Carriers</div>
        </NavItem>


        {/* <NavItem href="/contracts" label="Contracts">
          <File className="h-5 w-5" />
        </NavItem>

        <NavItem href="/shipments" label="Shipments">
          <PackageIcon className="h-5 w-5" />
        </NavItem>

        <NavItem href="/invoices" label="Invoices">
          <FileTextIcon className="h-5 w-5" />
        </NavItem>

        <NavItem href="/profile" label="Profile">
          <User2 className="h-5 w-5" />
        </NavItem> */}

      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/support"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <LifeBuoyIcon className="h-5 w-5" />
              <span className="sr-only">Support</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Support</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Nova</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Monitor className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/contracts"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <File className="h-5 w-5" />
            Contracts
          </Link>
          <Link
            href="/shipments"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <PackageIcon className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="/invoices"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <FileTextIcon className="h-5 w-5" />
            Invoices
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <User2 className="h-5 w-5" />
            Profile
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

// function DashboardBreadcrumb() {
//   return (
//     <Breadcrumb className="hidden md:flex">
//       <BreadcrumbList>
//         <BreadcrumbItem>
//           <BreadcrumbLink asChild>
//             <Link href="/dashboard">Dashboard</Link>
//           </BreadcrumbLink>
//         </BreadcrumbItem>
//         <BreadcrumbSeparator />
//         {/* <BreadcrumbItem>
//           <BreadcrumbLink asChild>
//             <Link href="#">Products</Link>
//           </BreadcrumbLink>
//         </BreadcrumbItem>
//         <BreadcrumbSeparator />
//         <BreadcrumbItem>
//           <BreadcrumbPage>All Products</BreadcrumbPage>
//         </BreadcrumbItem> */}
//       </BreadcrumbList>
//     </Breadcrumb>
//   );
// }
