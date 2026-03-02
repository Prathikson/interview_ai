import { getCurrentUser } from '@/lib/actions/auth.action'
import { getFeebackByInterviewId, getInterviewsById } from '@/lib/actions/general.action'
import dayjs from 'dayjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const getScoreColor = (score: number) =>
  score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'

const getScoreLabel = (score: number) =>
  score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'

const page = async ({ params }: RouteParams) => {
  const { id } = await params
  const user = await getCurrentUser()
  const interview = await getInterviewsById(id)
  if (!interview) redirect('/')

  const feedback = await getFeebackByInterviewId({ interviewId: id, userId: user?.id })
  const totalScore = feedback?.totalScore ?? 0
  const scoreColor = getScoreColor(totalScore)

  return (
    <section
      style={{
        maxWidth: 820,
        margin: '0 auto',
        padding: '0 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: '8px 0 8px' }}>
        <p style={{ fontSize: '0.7rem', fontFamily: 'var(--font-dm-sans), sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8b0a0', marginBottom: 10 }}>
          Interview Feedback
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#1a1a1a', textTransform: 'capitalize', lineHeight: 1.15, marginBottom: 18 }}>
          {interview.role} Interview
        </h1>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Overall score chip */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px',
              background: '#ffffff', borderRadius: 999, border: `1.5px solid ${scoreColor}33`,
              boxShadow: `0 2px 12px ${scoreColor}15`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={scoreColor}>
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 700, color: scoreColor }}>
              {totalScore}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#b8b0a0', fontFamily: 'var(--font-dm-sans), sans-serif' }}>/100 · {getScoreLabel(totalScore)}</span>
          </div>
          {/* Date chip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#ffffff', borderRadius: 999, border: '1.5px solid rgba(26,26,26,0.08)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b8b0a0" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={{ fontSize: '0.8125rem', color: '#7a7060', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
              {feedback?.createdAt ? dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A') : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: '1.5px', background: 'rgba(26,26,26,0.07)', borderRadius: 2 }} />

      {/* ── Summary ── */}
      <div style={{ background: '#ffffff', borderRadius: 20, padding: '26px 30px', border: '1.5px solid rgba(26,26,26,0.07)' }}>
        <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-dm-sans), sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8b0a0', marginBottom: 10 }}>
          Overall Assessment
        </p>
        <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: '#2d2d2d', fontFamily: 'var(--font-dm-sans), sans-serif', margin: 0 }}>
          {feedback?.finalAssessment}
        </p>
      </div>

      {/* ── Score Breakdown ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
          Score Breakdown
        </h2>
        {feedback?.categoryScores?.map((category, index) => {
          const sc = getScoreColor(category.score)
          return (
            <div
              key={index}
              className="category-card"
              style={{ background: '#ffffff', borderRadius: 18, padding: '20px 26px', border: '1.5px solid rgba(26,26,26,0.07)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a', margin: 0 }}>
                  {index + 1}. {category.name}
                </p>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-dm-sans), sans-serif', color: sc }}>{category.score}</span>
                  <span style={{ fontSize: '0.75rem', color: '#b8b0a0' }}>/100</span>
                  <span style={{ marginLeft: 4, fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: `${sc}18`, color: sc, fontWeight: 600, fontFamily: 'var(--font-dm-sans), sans-serif' }}>
                    {getScoreLabel(category.score)}
                  </span>
                </div>
              </div>
              <div className="category-score-bar">
                <div className="category-score-fill" style={{ width: `${category.score}%`, background: sc }} />
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#7a7060', lineHeight: 1.65, marginTop: 12, fontFamily: 'var(--font-dm-sans), sans-serif' }}>
                {category.comment}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Strengths + Improvements ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* Strengths */}
        <div style={{ background: '#ffffff', borderRadius: 18, padding: '22px 26px', border: '1.5px solid rgba(22,163,74,0.18)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>✓</div>
            <h3 style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#16a34a', margin: 0 }}>
              Strengths
            </h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedback?.strengths?.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', marginTop: 7, flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontSize: '0.8125rem', color: '#2d2d2d', lineHeight: 1.6, fontFamily: 'var(--font-dm-sans), sans-serif' }}>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for improvement */}
        <div style={{ background: '#ffffff', borderRadius: 18, padding: '22px 26px', border: '1.5px solid rgba(217,119,6,0.18)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(217,119,6,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#d97706', fontWeight: 700 }}>↑</div>
            <h3 style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#d97706', margin: 0 }}>
              Improve
            </h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedback?.areasForImprovement?.map((a, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', marginTop: 7, flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontSize: '0.8125rem', color: '#2d2d2d', lineHeight: 1.6, fontFamily: 'var(--font-dm-sans), sans-serif' }}>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── CTAs ── */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '13px 30px',
            background: 'transparent', color: '#1a1a1a', border: '1.5px solid rgba(26,26,26,0.18)',
            borderRadius: 999, fontSize: '0.875rem', fontWeight: 600,
            fontFamily: 'var(--font-dm-sans), sans-serif', textDecoration: 'none', minWidth: 180, transition: 'all 0.2s ease',
          }}
        >
          ← Dashboard
        </Link>
        <Link
          href={`/interview/${id}`}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '13px 30px',
            background: '#1a1a1a', color: '#f5f0e8', borderRadius: 999, fontSize: '0.875rem',
            fontWeight: 700, fontFamily: 'var(--font-dm-sans), sans-serif', textDecoration: 'none',
            minWidth: 180, boxShadow: '0 2px 16px rgba(26,26,26,0.2)', transition: 'all 0.2s ease',
          }}
        >
          Retake Interview →
        </Link>
      </div>
    </section>
  )
}

export default page