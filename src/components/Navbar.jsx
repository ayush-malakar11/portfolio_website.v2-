import { useState, useCallback, memo } from 'react'
import { NavLink } from 'react-router-dom'
import { useScrolled } from '../hooks/useScrollSpy'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/about',    label: 'About'    },
  { to: '/projects', label: 'Projects' },
  { to: '/contact',  label: 'Contact'  },
]

const NavItem = memo(({ to, label, onClick }) => (
  <NavLink
    to={to}
    end={to === '/'}
    onClick={onClick}
    className={({ isActive }) => `nav-link-item${isActive ? ' active' : ''}`}
  >
    {label}
  </NavLink>
))
NavItem.displayName = 'NavItem'

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle"
    >
      <span
        className="transition-transform duration-500 inline-block"
        style={{ transform: dark ? 'rotate(0deg)' : 'rotate(180deg)' }}
      >
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}

export default function Navbar() {
  const scrolled        = useScrolled()
  const [open, setOpen] = useState(false)
  const close           = useCallback(() => setOpen(false), [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 30px var(--shadow)' : 'none',
        padding: scrolled ? '10px 0' : '18px 0',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            src="/images/profile.png" alt="logo"
            className="w-10 h-10 rounded-full object-cover border-2 border-primary
                       group-hover:shadow-lg group-hover:shadow-primary/40 transition-all duration-300"
          />
          <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Ayush Malakar
          </span>
        </NavLink>

        {/* Desktop nav + toggle */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((l) => <NavItem key={l.to} {...l} />)}
          </nav>
          <div className="w-px h-5 mx-2" style={{ background: 'var(--border)' }} />
          <ThemeToggle />
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex flex-col gap-1.5 p-1"
          >
            <span
              className="block w-6 h-0.5 rounded transition-all duration-300"
              style={{
                background: 'var(--text)',
                transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block w-6 h-0.5 rounded transition-all duration-300"
              style={{ background: 'var(--text)', opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-6 h-0.5 rounded transition-all duration-300"
              style={{
                background: 'var(--text)',
                transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '260px' : '0',
          borderTop: open ? '1px solid var(--border)' : 'none',
        }}
      >
        <nav
          className="flex flex-col px-6 py-4 gap-1"
          style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(12px)' }}
        >
          {NAV_LINKS.map((l) => <NavItem key={l.to} {...l} onClick={close} />)}
        </nav>
      </div>
    </header>
  )
}
