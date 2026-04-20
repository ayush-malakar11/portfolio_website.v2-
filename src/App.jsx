import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Home     = lazy(() => import('./pages/Home'))
const About    = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Contact  = lazy(() => import('./pages/Contact'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-primary animate-spin"
           style={{ borderColor: 'var(--border)', borderTopColor: '#FD4766' }} />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"         element={<Home />}     />
            <Route path="/about"    element={<About />}    />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact"  element={<Contact />}  />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
