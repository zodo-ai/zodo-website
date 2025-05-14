import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { twMerge } from 'tailwind-merge';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { BrandLogo } from '../Logo';

const Navigation = ({ headerLinks }: { headerLinks: HeaderLinksI[] }) => {
    const pathname = usePathname()

    return (
        <div>
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-10">
                <div className="flex space-x-8">
                    {headerLinks.map((item) => {
                        const isActive = pathname === item.link
                        return (
                            <Link key={item.link} href={item.link} className={twMerge("font-medium text-sm pb-1", isActive ? "text-[#1D453F]" : "text-[#004746]")}>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            <div className='my-2'>
                                <BrandLogo />

                            </div>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className='mt-5'>
                                {headerLinks.map((item) => {
                                    const isActive = pathname === item.link

                                    return (
                                        <SidebarMenuItem key={item.link}>
                                            <SidebarMenuButton asChild>
                                                <Link key={item.link} href={item.link} className={twMerge("font-medium text-sm pb-1", isActive ? "text-[#1D453F]" : "text-[#004746]")}>
                                                    {item.label}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

        </div>
    )
}

export default Navigation