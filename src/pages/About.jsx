import { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { useFadeIn } from '../hooks/useFadeIn'

const SKILLS = [
  { name: 'React.js',          hex: '#22d3ee' },
  { name: 'Next.js',           hex: '#94a3b8' },
  { name: 'TypeScript',        hex: '#60a5fa' },
  { name: 'JavaScript (ES6+)', hex: '#facc15' },
  { name: 'HTML5',             hex: '#f87171' },
  { name: 'CSS3',              hex: '#38bdf8' },
  { name: 'Tailwind CSS',      hex: '#2dd4bf' },
  { name: 'Bootstrap',         hex: '#a78bfa' },
  { name: 'Material UI',       hex: '#818cf8' },
  { name: 'Styled Components', hex: '#f472b6' },
  { name: 'Redux',             hex: '#c084fc' },
  { name: 'Zustand',           hex: '#fb923c' },
  { name: 'React Query',       hex: '#f87171' },
  { name: 'REST APIs',         hex: '#4ade80' },
  { name: 'Git',               hex: '#fb923c' },
  { name: 'Java',              hex: '#f97316' },
  { name: 'MySQL',             hex: '#2dd4bf' },
  { name: 'Cursor AI',         hex: '#FD4766' },
  { name: 'GitHub Copilot',    hex: '#94a3b8' },
  { name: 'Claude',            hex: '#1C99FE' },
]

const EXPERIENCE = [
  {
    icon: '💼',
    company: 'Srashtasoft',
    role: 'Front-End Developer',
    period: 'May 2025 – Present',
    location: 'Ahmedabad, Gujarat',
    points: [
      'Built responsive, high-performance UIs using React.js & Tailwind CSS, reducing page load time by ~20%.',
      'Reduced dev cycle time by ~35% by embedding AI tools (Cursor AI, GitHub Copilot) into workflows.',
      'Architected scalable state management using Redux & Zustand with zero critical data-flow regressions.',
      'Led modular component library initiative, improving code reuse by ~40% across 3+ product features.',
    ],
  },
  {
    icon: '🎓',
    company: 'AMSTECH Incorporation',
    role: 'Java Full Stack Intern',
    period: 'Aug 2023 – Jan 2024',
    location: 'Indore, Madhya Pradesh',
    points: [
      'Developed web applications using Java, MySQL, HTML, CSS, Bootstrap, and JavaScript.',
      'Designed relational database schemas with JDBC and Servlets; built and deployed 2 self-made projects.',
    ],
  },
]

const EDUCATION = [
  {
    icon: '🏛️',
    title: 'B.Tech — Computer Science & Engineering',
    place: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal, M.P.',
    year:  '2021 – 2025',
    extra: 'CGPA: 7.77',
  },
]

const INFO_CARDS = [
  { label: 'Experience',   value: '1+ Year',         icon: '⚡' },
  { label: 'Location',     value: 'Ahmedabad, GJ',   icon: '📍' },
  { label: 'Current Role', value: 'Frontend Dev',    icon: '💻' },
  { label: 'CGPA',         value: '7.77 / 10',       icon: '🎓' },
  { label: 'AI Tools',     value: 'Cursor, Copilot', icon: '🤖' },
  { label: 'Availability', value: 'Open to Work',    icon: '✅' },
]

const SkillBadge = memo(({ name, hex }) => (
  <span
    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
               hover:-translate-y-1 hover:shadow-lg cursor-default"
    style={{
      background: 'var(--surface)',
      border: `1px solid var(--border)`,
      color: 'var(--text-muted)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = hex
      e.currentTarget.style.color = hex
      e.currentTarget.style.boxShadow = `0 4px 16px ${hex}30`
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border)'
      e.currentTarget.style.color = 'var(--text-muted)'
      e.currentTarget.style.boxShadow = 'none'
    }}
  >
    {name}
  </span>
))
SkillBadge.displayName = 'SkillBadge'

const ExpCard = memo(({ icon, company, role, period, location, points }) => (
  <div className="section-card p-6">
    <div className="flex items-start gap-4 mb-4">
      <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-semibold text-base" style={{ color: 'var(--text)' }}>{role}</h4>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold whitespace-nowrap">
            {period}
          </span>
        </div>
        <p className="text-primary text-sm font-medium mt-0.5">{company}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{location}</p>
      </div>
    </div>
    <ul className="space-y-2 pl-2">
      {points.map((p, i) => (
        <li key={i} className="text-sm leading-relaxed flex gap-2" style={{ color: 'var(--text-muted)' }}>
          <span className="text-primary mt-1 flex-shrink-0">▸</span>{p}
        </li>
      ))}
    </ul>
  </div>
))
ExpCard.displayName = 'ExpCard'

const EduCard = memo(({ icon, title, place, year, extra }) => (
  <div className="section-card flex gap-4 items-start p-5">
    <span className="text-3xl flex-shrink-0">{icon}</span>
    <div>
      <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{title}</h4>
      <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{place}</p>
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">{year}</span>
        {extra && <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold">{extra}</span>}
      </div>
    </div>
  </div>
))
EduCard.displayName = 'EduCard'

const TABS = ['skills', 'experience', 'education']

export default function About() {
  const [tab, setTab]    = useState('skills')
  const [ref, visible]   = useFadeIn()

  return (
    <div className="page-wrapper">
      <div className="text-center mb-16">
        <h1 className="section-title">About <span>Me</span></h1>
        <p className="section-sub">
          Frontend Developer with 1+ year of experience building fast, scalable React.js applications
        </p>
      </div>

      <div
        ref={ref}
        className={`transition-all duration-700 ${visible ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
      >
        {/* Bio + info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-5" style={{ color: 'var(--text)' }}>Get to know me!</h3>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <p>
                I'm a <span className="font-semibold" style={{ color: 'var(--text)' }}>Frontend Developer</span> with
                1+ year of experience building fast, scalable React.js applications. Currently working at{' '}
                <span className="text-primary font-medium">Srashtasoft, Ahmedabad</span>.
              </p>
              <p>
                Proficient in <span className="font-semibold" style={{ color: 'var(--text)' }}>TypeScript, Tailwind CSS</span>,
                Redux, Zustand, and AI tools like Cursor AI and GitHub Copilot.
              </p>
              <p>
                Previously interned at AMSTECH Incorporation as a Java Full Stack Developer. B.Tech CSE from RGPV (CGPA: 7.77).
                Open to on-site, hybrid, and remote roles.
              </p>
            </div>
            <div className="flex gap-4 mt-8 flex-wrap">
              <a href="https://linkedin.com/in/ayush-malakar385" target="_blank" rel="noreferrer" className="btn-primary">
                LinkedIn
              </a>
              <Link to="/contact" className="btn-outline">Contact Me</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {INFO_CARDS.map(({ label, value, icon }) => (
              <div key={label} className="section-card p-4">
                <span className="text-xl">{icon}</span>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 capitalize"
              style={{
                background:   tab === t ? 'rgba(253,71,102,0.1)' : 'transparent',
                border:       `1px solid ${tab === t ? '#FD4766' : 'var(--border)'}`,
                color:        tab === t ? 'var(--text)' : 'var(--text-muted)',
              }}
            >
              {t === 'skills' ? 'Technical Skills' : t === 'experience' ? 'Experience' : 'Education'}
            </button>
          ))}
        </div>

        {tab === 'skills' && (
          <div className="flex flex-wrap gap-2.5">
            {SKILLS.map((s) => <SkillBadge key={s.name} {...s} />)}
          </div>
        )}
        {tab === 'experience' && (
          <div className="flex flex-col gap-5">
            {EXPERIENCE.map((e) => <ExpCard key={e.company} {...e} />)}
          </div>
        )}
        {tab === 'education' && (
          <div className="flex flex-col gap-4">
            {EDUCATION.map((e) => <EduCard key={e.title} {...e} />)}
          </div>
        )}
      </div>
    </div>
  )
}
