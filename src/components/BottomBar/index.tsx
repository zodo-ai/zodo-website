'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarCheck,
  Home,
  Hospital,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'

interface BottomBarItem {
  label: string
  link: string
  icon: LucideIcon
}

const bottomBarItems: BottomBarItem[] = [
  {
    label: 'Home',
    link: '/',
    icon: Home,
  },
  {
    label: 'Doctors',
    link: '/doctors',
    icon: Stethoscope,
  },
  {
    label: 'Hospitals',
    link: '/hospitals',
    icon: Hospital,
  },
  {
    label: 'Bookings',
    link: '/my-bookings',
    icon: CalendarCheck,
  },
]

const BottomBar = () => {
  const pathname = usePathname()

  // Don't show on auth pages
  if (pathname.startsWith('/auth')) {
    return null
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden behind bottom bar */}
      <div className="h-20 lg:hidden" />

      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-[#e5e7eb] bg-white/95 backdrop-blur-lg"
        style={{
          boxShadow: '0 -4px 20px rgba(0, 71, 70, 0.08)',
        }}
      >
        <div className="flex items-center justify-around h-[68px] px-2 max-w-lg mx-auto">
          {bottomBarItems.map((item) => {
            const isActive =
              item.link === '/'
                ? pathname === '/'
                : pathname.startsWith(item.link)
            const Icon = item.icon

            return (
              <Link
                key={item.label}
                href={item.link}
                className="relative flex flex-col items-center justify-center gap-1 flex-1 py-1.5 group"
              >
                {/* Active indicator pill */}
                {isActive && (
                  <span
                    className="absolute -top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full bg-[#1D453F]"
                    style={{
                      animation: 'bottomBarSlideIn 0.25s ease-out',
                    }}
                  />
                )}

                {/* Icon container */}
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${isActive
                    ? 'text-[#1D453F] bg-[#1D453F]/10 scale-105'
                    : 'text-[#8A9A9D] group-hover:text-[#347D73] group-hover:bg-[#347D73]/5'
                    }`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.2 : 1.8} />
                </span>

                {/* Label */}
                <span
                  className={`text-[11px] font-semibold leading-none tracking-wide transition-colors duration-200 ${isActive
                    ? 'text-[#1D453F]'
                    : 'text-[#8A9A9D] group-hover:text-[#347D73]'
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Safe area for devices with home indicator */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* Keyframe animation */}
      <style jsx global>{`
        @keyframes bottomBarSlideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 2.5rem;
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

export default BottomBar
