import React from 'react'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import Image from 'next/image'
import Link from 'next/link'
import HomeAnimations from '@/components/HomeAnimations'

const STATS = [
  { value: '10K+', label: 'Interviews Completed' },
  { value: '94%', label: 'User Satisfaction' },
  { value: '3×', label: 'Faster Prep Time' },
]

const FEATURES = [
  {
    icon: '🎙️',
    title: 'Real-Time Voice AI',
    desc: 'Conversational interviews with an AI that asks follow-up questions and adapts to your responses live.',
  },
  {
    icon: '📊',
    title: 'Instant Feedback',
    desc: 'Scored across 5 dimensions — communication, technical depth, problem-solving, culture fit, and clarity.',
  },
  {
    icon: '🎯',
    title: 'Role-Specific Questions',
    desc: 'Tailored banks covering frontend, backend, full-stack, data science, and behavioral interviews.',
  },
]

const Page = async () => {
  const user = await getCurrentUser()

  if (!user?.id) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', color: '#7a7060' }}>
          Please{' '}
          <Link href="/sign-in" style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            sign in
          </Link>{' '}
          to continue.
        </p>
      </div>
    )
  }

  const [userInterviewsRaw, latestInterviewsRaw] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ])

  const userInterviews = userInterviewsRaw ?? []
  const latestInterviews = latestInterviewsRaw ?? []

  return (
    <>
      <HomeAnimations />

      {/* ── Hero CTA ── */}
      <section
        className="card-cta reveal-up"
        style={{ animationDelay: '0ms' }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 440, height: 440, borderRadius: '50%', background: 'rgba(255,255,255,0.025)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.018)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 520, position: 'relative', zIndex: 1 }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px',
              borderRadius: 999, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)',
              fontSize: '0.7rem', fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 700,
              color: '#4ade80', letterSpacing: '0.09em', textTransform: 'uppercase', width: 'fit-content',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            AI Powered
          </span>

          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(1.75rem, 2.8vw, 2.3rem)', fontWeight: 700, color: '#f5f0e8', lineHeight: 1.15 }}>
            Land Your Dream Job with Real-Time AI Interview Practice
          </h2>

          <p style={{ fontSize: '0.9375rem', color: 'rgba(245,240,232,0.5)', fontFamily: 'var(--font-dm-sans), sans-serif', lineHeight: 1.7, maxWidth: 440 }}>
            Practice with a lifelike AI interviewer and receive instant, detailed feedback on every answer.
          </p>

          <Link
            href="/interview"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '13px 30px',
              background: '#f5f0e8', color: '#1a1a1a', borderRadius: 999, fontSize: '0.875rem',
              fontWeight: 700, fontFamily: 'var(--font-dm-sans), sans-serif', letterSpacing: '0.02em',
              textDecoration: 'none', width: 'fit-content', boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            Start an Interview →
          </Link>
        </div>

        <Image
          src="/robot.png"
          alt="AI Robot"
          width={300}
          height={300}
          className="max-sm:hidden"
          style={{ position: 'relative', zIndex: 1, opacity: 0.94, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.45))' }}
        />
      </section>

      {/* ── Stats ── */}
      <section
        className="stagger-children"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
      >
        {STATS.map(({ value, label }) => (
          <div
            key={label}
            style={{
              background: '#ffffff', borderRadius: 20, padding: '28px 24px',
              border: '1.5px solid rgba(26,26,26,0.07)', display: 'flex',
              flexDirection: 'column', gap: 6, boxShadow: '0 2px 12px rgba(26,26,26,0.04)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2.4rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>
              {value}
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#7a7060', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
              {label}
            </span>
          </div>
        ))}
      </section>

      {/* ── Your Interviews ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }} className="reveal-up">
        <SectionHeader title="Your Interviews" count={userInterviews.length > 0 ? userInterviews.length : undefined} />
        <div className="interviews-section stagger-children">
          {userInterviews.length > 0 ? (
            userInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <EmptyState message="You haven't taken any interviews yet." cta="Start your first one →" href="/interview" />
          )}
        </div>
      </section>

      {/* ── Available Interviews ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }} className="reveal-up">
        <SectionHeader title="Available Interviews" />
        <div className="interviews-section stagger-children">
          {latestInterviews.length > 0 ? (
            latestInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <EmptyState message="No new interviews available at the moment." />
          )}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }} className="reveal-up">
        <SectionHeader title="Why Mantis?" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="feature-card"
              style={{
                background: '#ffffff', borderRadius: 20, padding: '28px 26px',
                border: '1.5px solid rgba(26,26,26,0.07)', display: 'flex',
                flexDirection: 'column', gap: 12, transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>{icon}</span>
              <h3 style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#7a7060', lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.75rem', fontWeight: 600, color: '#1a1a1a', flexShrink: 0, margin: 0 }}>
        {title}
      </h2>
      {count !== undefined && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: 999,
          background: 'rgba(26,26,26,0.06)', border: '1px solid rgba(26,26,26,0.09)',
          fontSize: '0.75rem', fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 500, color: '#7a7060',
        }}>
          {count}
        </span>
      )}
      <div style={{ flex: 1, height: '1.5px', background: 'rgba(26,26,26,0.07)', borderRadius: 2 }} />
    </div>
  )
}

function EmptyState({ message, cta, href }: { message: string; cta?: string; href?: string }) {
  return (
    <div style={{
      gridColumn: '1 / -1', padding: '52px 32px', borderRadius: 20,
      border: '1.5px dashed rgba(26,26,26,0.11)', textAlign: 'center',
    }}>
      <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', color: '#b8b0a0', fontSize: '0.9375rem', margin: 0 }}>
        {message}{' '}
        {cta && href && (
          <Link href={href} style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            {cta}
          </Link>
        )}
      </p>
    </div>
  )
}

export default Page