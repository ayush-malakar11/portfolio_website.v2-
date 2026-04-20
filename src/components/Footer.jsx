import { memo } from 'react'
import { Link } from 'react-router-dom'

const SOCIAL = [
  { href: 'https://linkedin.com/in/ayush-malakar385', icon: 'fa-linkedin-in', fa: 'fab' },
  { href: 'https://github.com/ayush-malakar11',       icon: 'fa-github',      fa: 'fab' },
  { href: 'mailto:ayushmalaka385@gmail.com',           icon: 'fa-envelope',    fa: 'fas' },
]

const LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/about',    label: 'About'    },
  { to: '/projects', label: 'Projects' },
  { to: '/contact',  label: 'Contact'  },
]

const SocialIcon = memo(({ href, icon, fa }) => (
  <a
    href={href} target="_blank" rel="noreferrer"
    className="w-9 h-9 rounded-full flex items-center justify-center text-sm
               transition-all duration-300 hover:bg-primary hover:border-primary
               hover:text-white hover:-translate-y-1"
    style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
  >
    <i className={`${fa} ${icon}`} />
  </a>
))
SocialIcon.displayName = 'SocialIcon'

export default function Footer() {
  return (
    <footer
      className="pt-12 transition-colors duration-300"
      style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-6 pb-10 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src="/images/logo.png" alt="logo"
              className="w-12 h-12 rounded-full border-2 border-primary object-cover" />
            <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>Ayush Malakar</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Frontend Developer building fast, scalable React.js apps with TypeScript & Tailwind CSS.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-muted)' }}>
            Quick Links
          </h4>
          <div className="flex flex-col gap-2">
            {LINKS.map(({ to, label }) => (
              <Link key={to} to={to}
                className="text-sm transition-colors duration-200 hover:text-primary"
                style={{ color: 'var(--text-muted)' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-muted)' }}>
            Connect
          </h4>
          <div className="flex gap-3 flex-wrap">
            {SOCIAL.map((s) => <SocialIcon key={s.icon} {...s} />)}
          </div>
        </div>
      </div>

      <div className="py-4 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Copyright &copy; {new Date().getFullYear()}{' '}
          <a href="#" className="text-primary hover:underline">Ayush Malakar</a>. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
