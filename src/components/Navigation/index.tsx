'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { twMerge } from 'tailwind-merge';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import { BrandLogo } from '../Logo';
import { HeaderLinksI } from './types';
import { Separator } from '../ui/separator';

const Navigation = ({ headerLinks }: { headerLinks: HeaderLinksI[] }) => {
    const pathname = usePathname()
    const { setOpenMobile } = useSidebar();

    return (
        <div>
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-10">
                <div className="flex space-x-8">
                    {headerLinks.map((item) => {
                        const isActive = pathname === item.link
                        return (
                            <Link key={item.label} href={item.link} className={twMerge("font-medium text-sm pb-1", isActive ? "text-[#1D453F]" : "text-[#004746]")}>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <Sidebar>
                <SidebarContent>
                    <SidebarGroup className='flex'>
                        <SidebarGroupLabel>
                            <div className='my-auto mx-auto'>
                                <BrandLogo />

                            </div>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <Separator className='my-6' />
                            <SidebarMenu >
                                {headerLinks.map((item) => {
                                    const isActive = pathname === item.link
                                    return (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton asChild>
                                                <Link onClick={() => setOpenMobile(false)} key={item.link} href={item.link} className={twMerge("font-medium text-sm pb-1", isActive ? "text-[#1D453F]" : "text-[#004746]")}>
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