import { memo } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'

const PROJECTS = [
  {
    id: 1,
    image: '/images/projects/project1.png',
    title: 'Personal Portfolio',
    tags: ['React.js', 'Tailwind CSS', 'Vite', 'React Router'],
    description:
      'A modern personal portfolio website built with React.js and Tailwind CSS, featuring page routing, animated typing effect, scroll-triggered animations, and fully responsive design.',
    link: '#',
    github: 'https://github.com/ayush-malakar11',
  },
  {
    id: 2,
    image: '/images/projects/project2.png',
    title: 'Agro Agency Website',
    tags: ['HTML', 'CSS', 'Tailwind CSS', 'JavaScript'],
    description:
      'Static website for a farmer pesticides agency with product listings and responsive theme design. Clean UI focused on accessibility and usability for rural users.',
    link: '#',
    github: 'https://github.com/ayush-malakar11',
  },
  {
    id: 3,
    image: '/images/projects/project3.png',
    title: 'E-Book Management System',
    tags: ['Java', 'JSP', 'JDBC', 'MySQL', 'Bootstrap'],
    description:
      'Full-stack app to manage and access e-books. Includes user authentication, CRUD operations, relational database design, and MySQL persistence via JDBC and Servlets.',
    link: '#',
    github: 'https://github.com/ayush-malakar11',
  },
]

const ProjectCard = memo(({ image, title, tags, description, link, github }) => {
  const [ref, visible] = useFadeIn()
  return (
    <div
      ref={ref}
      className={`section-card overflow-hidden group transition-all duration-500
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10
        ${visible ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
    >
      <div className="relative overflow-hidden h-52">
        <img
          src={image} alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-3
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a href={link} target="_blank" rel="noreferrer" className="btn-primary text-xs py-2 px-5">
            Live Demo
          </a>
          <a href={github} target="_blank" rel="noreferrer" className="btn-outline text-xs py-2 px-5">
            <i className="fab fa-github mr-1" /> Code
          </a>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>{title}</h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
})
ProjectCard.displayName = 'ProjectCard'

export default function Projects() {
  return (
    <div className="page-wrapper">
      <div className="text-center mb-16">
        <h1 className="section-title">My <span>Projects</span></h1>
        <p className="section-sub">
          A selection of projects I've built — from full-stack Java apps to modern React frontends.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {PROJECTS.map((p) => <ProjectCard key={p.id} {...p} />)}
      </div>
    </div>
  )
}
