'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Gavel,
  FolderOpen,
  Users,
  Settings,
  BarChart3,
  FileText,
} from 'lucide-react'

interface Profile {
  role: string
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Auktioner', href: '/admin/auctions', icon: Gavel },
  { name: 'Kategorier', href: '/admin/categories', icon: FolderOpen },
  { name: 'Innehåll', href: '/admin/content', icon: FileText, roles: ['superadmin', 'admin'] },
  { name: 'Användare', href: '/admin/users', icon: Users, roles: ['superadmin', 'admin'] },
  { name: 'Statistik', href: '/admin/stats', icon: BarChart3 },
  { name: 'Inställningar', href: '/admin/settings', icon: Settings, roles: ['superadmin'] },
]

export function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  const filteredNav = navigation.filter(
    (item) => !item.roles || item.roles.includes(profile.role)
  )

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
