'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export type Slide = { src: string; alt: string; title: string; href: string; programme: string }
/** A programme and the photographs it takes turns showing. */
export type Pool = { name: string; href: string; pool: Slide[] }

const INTERVAL = 5000
/** Longer than the fade, so a photograph is swapped only once it is out of sight. */
const AFTER_FADE = 1200

const shuffled = <T,>(items: T[]) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// The front page's opening screen: one photograph per programme, in programme
// order, across the whole screen, fading from one to the next. Each time round
// a programme shows its next photograph, in an order shuffled on each visit
// (except the first programme's, already on screen when the page arrives).
// Below, rounded buttons (as the filters on Daniel's portfolio) name the
// programmes, each opening its page; the one being shown is black with an
// arrow. Above them, the project in the photograph, which opens it. It moves
// on its own unless the visitor prefers reduced motion, and waits while the
// buttons have the pointer or focus.
export function Slideshow({ pools }: { pools: Pool[] }) {
  const [order, setOrder] = useState(() => pools.map((entry) => entry.pool))
  const [turns, setTurns] = useState(() => pools.map(() => 0))
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)
  const previous = useRef(0)
  const count = pools.length
  const slides = order.map((pool, n) => pool[turns[n] % pool.length])
  const current = slides[index]

  useEffect(() => { setOrder(pools.map((entry, n) => (n === 0 ? entry.pool : shuffled(entry.pool)))) }, [pools])

  useEffect(() => {
    if (held || count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(() => setIndex((shown) => (shown + 1) % count), INTERVAL)
    return () => window.clearTimeout(timer)
  }, [index, held, count])

  // Once a programme's photograph has faded out, it moves on to its next one.
  useEffect(() => {
    const left = previous.current
    previous.current = index
    if (left === index) return
    const timer = window.setTimeout(() => setTurns((all) => all.map((turn, n) => (n === left ? turn + 1 : turn))), AFTER_FADE)
    return () => window.clearTimeout(timer)
  }, [index])

  if (!current) return null
  const hold = { onPointerEnter: () => setHeld(true), onPointerLeave: () => setHeld(false), onFocus: () => setHeld(true), onBlur: () => setHeld(false) }

  return <section className="ns-show" aria-roledescription="slideshow" aria-label="Photographs from the programmes">
    {slides.map((slide, n) => <Image
      key={pools[n].name}
      className="ns-show-image"
      src={slide.src}
      alt={n === index ? slide.alt : ''}
      aria-hidden={n !== index}
      data-shown={n === index || undefined}
      fill
      sizes="100vw"
      loading={n === 0 ? 'eager' : 'lazy'}
      fetchPriority={n === 0 ? 'high' : 'auto'}
    />)}
    <div className="ns-show-bar" {...hold}>
      <Link className="ns-button" href={current.href}>↳ {current.title}</Link>
      <nav className="ns-show-programmes" aria-label="Programmes">
        {pools.map((programme) => {
          const shown = programme.name === current.programme
          return <Link key={programme.name} className="ns-button" href={programme.href} aria-current={shown || undefined}>{programme.name}{shown && ' →'}</Link>
        })}
      </nav>
    </div>
  </section>
}
