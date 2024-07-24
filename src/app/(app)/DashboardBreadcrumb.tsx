import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation'

export default function DashboardBreadcrumb() {
    const router = useRouter();
    const pathname = usePathname()
    const pathnames = pathname.split('/').filter((x) => x);

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {/* <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem> */}
                {pathnames.map((pathname, index) => {
                    const routePath = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    return (
                        <React.Fragment key={routePath}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={routePath}>{pathname}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {/* {isLast && (
                                <React.Fragment>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{pathname}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </React.Fragment>
                            )} */}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
