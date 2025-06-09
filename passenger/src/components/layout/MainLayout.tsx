import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'
import { HomeIcon, MapIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  requiresAuth?: boolean
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Book', href: '/book', icon: MapIcon, requiresAuth: true },
  { name: 'Rides', href: '/rides', icon: ClockIcon, requiresAuth: true },
  { name: 'Profile', href: '/profile', icon: UserIcon, requiresAuth: true },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, isLoading } = useFrappeAuth()

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAuth && !currentUser) {
      // Save the attempted URL for redirect after login
      navigate(`/login?redirect_url=${encodeURIComponent(item.href)}`)
      return
    }
    navigate(item.href)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center py-2 px-3 w-full ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
