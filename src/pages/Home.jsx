import { Link } from 'react-router-dom'
import { useTypewriter } from '../hooks/useTypewriter'
import { useFadeIn } from '../hooks/useFadeIn'
import { useTheme } from '../context/ThemeContext'

const ROLES = ['Frontend Developer']


export default function Home() {
  const typed        = useTypewriter(ROLES)
  const [ref, visible] = useFadeIn()
  const { dark }     = useTheme()

  return (
    <section className="relative min-h-screen flex items-center bg-hero bg-cover bg-center bg-fixed">
      {/* Overlay — lighter in light mode */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: dark
            ? 'linear-gradient(135deg, rgba(9,16,32,0.95) 0%, rgba(14,21,37,0.80) 100%)'
            : 'linear-gradient(135deg, rgba(240,244,255,0.92) 0%, rgba(226,232,248,0.85) 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full
                      flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">

        {/* Text */}
        <div
          ref={ref}
          className={`flex-1 transition-all duration-700 ${visible ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
        >
          <p className="text-lg mb-2" style={{ color: 'var(--text-muted)' }}>👋 Hello, I'm</p>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4
                         bg-gradient-to-r from-primary via-accent to-blue bg-clip-text text-transparent">
            Ayush Malakar
          </h1>

          <h2 className="text-xl md:text-2xl font-medium mb-6 min-h-[36px]" style={{ color: 'var(--text-muted)' }}>
            <span className="text-blue-500 dark:text-blue">{typed}</span>
            <span className="text-primary animate-blink ml-0.5">|</span>
          </h2>

          <p className="text-base leading-relaxed max-w-lg mb-8" style={{ color: 'var(--text-muted)' }}>
            Frontend Developer with 1+ year of experience building React.js, Nextjs applications.
            Working with JavaScript, TypeScript, Tailwind CSS, and state management tools. Currently at{' '}
            <span className="font-semibold text-primary">Srashtasoft, Ahmedabad</span>.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link to="/projects" className="btn-primary">View Projects</Link>
            <Link to="/contact"  className="btn-outline">Hire Me</Link>
          </div>


        </div>

        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-full p-1.5
                          bg-gradient-to-br from-primary via-accent to-blue animate-glow">
            <img
              src="/images/profile.png" alt="Ayush Malakar"
              className="w-full h-full rounded-full object-cover"
              style={{ border: '4px solid var(--bg)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
