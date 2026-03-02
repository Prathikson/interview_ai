'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const Header = ({ userName }: { userName?: string }) => {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(245,240,232,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1.5px solid rgba(26,26,26,0.08)' : '1.5px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <Image src="/logo.svg" alt="Mantis logo" width={120} height={100} />
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[
            { href: '/', label: 'Dashboard' },
            { href: '/interview', label: 'New Interview' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: '7px 16px',
                borderRadius: 999,
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontWeight: 500,
                color: pathname === href ? '#1a1a1a' : '#7a7060',
                background: pathname === href ? 'rgba(26,26,26,0.07)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                letterSpacing: '0.01em',
              }}
            >
              {label}
            </Link>
          ))}

          {/* User pill */}
          {userName && (
            <div
              style={{
                marginLeft: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px 6px 6px',
                borderRadius: 999,
                background: '#ffffff',
                border: '1.5px solid rgba(26,26,26,0.1)',
                boxShadow: '0 1px 6px rgba(26,26,26,0.06)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    textTransform: 'uppercase',
                  }}
                >
                  {userName.charAt(0)}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontWeight: 500,
                  color: '#1a1a1a',
                }}
              >
                {userName.split(' ')[0]}
              </span>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header