import { useEffect, useState } from 'react'

export function useTypewriter(words, typingSpeed = 80, deletingSpeed = 45, pause = 1800) {
  const [index, setIndex]       = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting]  = useState(false)

  useEffect(() => {
    const current = words[index]
    let timeout

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed)
    } else {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, index, words, typingSpeed, deletingSpeed, pause])

  return displayed
}
