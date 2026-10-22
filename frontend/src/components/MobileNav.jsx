import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Search, Library, UploadCloud } from 'lucide-react'

// Bottom tab bar shown on phones/tablets in place of the sidebar
export default function MobileNav({ userRole }) {
  const items = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/explore' },
    { icon: Library, label: 'Library', path: '/library' },
  ]

  if (userRole === 'artist') {
    items.push({ icon: UploadCloud, label: 'Studio', path: '/upload' })
  }

  return (
    <nav className="md:hidden flex items-stretch justify-around bg-black/95 backdrop-blur-xl border-t border-white/10 pb-safe select-none">
      {items.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-white' : 'text-gray-500 active:text-gray-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-primary' : ''} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
