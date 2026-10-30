// The sticky Sections list beside the specimens. It is capped to the viewport and scrolls on its
// own, so with 40+ sections it marks the one being read and keeps that link in view.

import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from './section-meta'

// The section being read is the last one whose top has passed this fraction of the viewport height.
const READING_LINE = 0.2
// Shrinks the observer's root to the strip above that line, so a section crossing it fires a callback.
const READING_MARGIN = `0px 0px -${(1 - READING_LINE) * 100}% 0px`

export function Toc() {
  const listRef = useRef<HTMLElement | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Scroll-spy over the section elements: an external DOM observer, so an effect is the right tool.
  // The observer only says when to look; the answer comes from the sections' actual positions, so a
  // jump that lands between two sections still marks the right one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {
        const line = window.innerHeight * READING_LINE
        let current: string | null = null
        for (const section of SECTIONS) {
          const top = document.getElementById(section.id)?.getBoundingClientRect().top
          if (top !== undefined && top <= line) current = section.id
        }
        setActiveId(current)
      },
      { rootMargin: READING_MARGIN },
    )
    for (const section of SECTIONS) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [])

  // Keep the active link visible inside the list without scrolling the page itself.
  useEffect(() => {
    const nav = listRef.current
    const link = nav?.querySelector<HTMLElement>('[aria-current="location"]')
    if (!nav || !link) return
    const top = link.offsetTop
    const bottom = top + link.offsetHeight
    if (top < nav.scrollTop) nav.scrollTop = top
    else if (bottom > nav.scrollTop + nav.clientHeight) nav.scrollTop = bottom - nav.clientHeight
  }, [activeId])

  return (
    <nav ref={listRef} className="toc" aria-label="Sections">
      <p className="toc__heading">Sections</p>
      <ul className="toc__list">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              className="toc__link"
              href={`#${s.id}`}
              aria-current={s.id === activeId ? 'location' : undefined}
            >
              <span className="toc__num">§{s.num}</span>
              <span>{s.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
