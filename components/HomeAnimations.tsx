'use client'
import { useEffect } from 'react'

/**
 * Handles all scroll-triggered reveal animations.
 * Uses IntersectionObserver (no external deps needed).
 * Add class `reveal-up`, `reveal-fade`, or `stagger-children` to any element.
 */
export default function HomeAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const targets = document.querySelectorAll('.reveal-up, .reveal-fade, .stagger-children')
    targets.forEach((el) => observer.observe(el))

    // Elements already in viewport on mount
    requestAnimationFrame(() => {
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92) {
          el.classList.add('is-visible')
        }
      })
    })

    // Card hover — add via JS since Next.js SSR doesn't support CSS :hover for transform well
    const cards = document.querySelectorAll<HTMLElement>('.interview-card-root')
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)'
        card.style.boxShadow = '0 20px 56px rgba(26,26,26,0.14)'
      })
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)'
        card.style.boxShadow = '0 2px 16px rgba(26,26,26,0.06)'
      })
    })

    // Feature card hover
    const featureCards = document.querySelectorAll<HTMLElement>('.feature-card')
    featureCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-3px)'
        card.style.boxShadow = '0 10px 32px rgba(26,26,26,0.09)'
      })
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)'
        card.style.boxShadow = 'none'
      })
    })

    return () => observer.disconnect()
  }, [])

  return null
}