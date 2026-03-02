import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1.5px solid rgba(26,26,26,0.08)',
        background: '#f5f0e8',
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image src="/logo.svg" alt="Mantis logo" width={200} height={100}  />
          </Link>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#b8b0a0',
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}
          >
            AI-Powered Interview Practice
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {['Dashboard', 'New Interview'].map((label) => (
            <Link
              key={label}
              href={label === 'Dashboard' ? '/' : '/interview'}
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                color: '#7a7060',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            color: '#b8b0a0',
          }}
        >
          © {new Date().getFullYear()} Mantis. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer