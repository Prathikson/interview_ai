import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { getFeebackByInterviewId } from '@/lib/actions/general.action';

// High-quality Unsplash images for professional interview contexts
const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=85',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=85',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=85',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=85',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=85',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=85',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=85',
];

const getImageForRole = (role: string): string => {
  const hash = role.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return COVER_IMAGES[hash % COVER_IMAGES.length];
};

const TYPE_CONFIG: Record<string, { color: string }> = {
  Technical: { color: '#2563eb' },
  Behavioral: { color: '#d97706' },
  Mixed: { color: '#7c3aed' },
};

const InterviewCard = async ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && id
      ? await getFeebackByInterviewId({ interviewId: id, userId })
      : null;

  const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');
  const coverImg = getImageForRole(role);
  const typeStyle = TYPE_CONFIG[normalizedType] ?? TYPE_CONFIG.Technical;
  const isCompleted = !!feedback;
  const score = feedback?.totalScore ?? null;
  const scoreColor = score === null ? '#b8b0a0' : score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';

  return (
    <div
      className="interview-card-root"
      style={{
        width: '100%',
        border: '1.5px solid rgba(26,26,26,0.09)',
        borderRadius: 22,
        overflow: 'hidden',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 16px rgba(26,26,26,0.06)',
        transition: 'transform 0.25s cubic-bezier(.2,.8,.4,1), box-shadow 0.25s ease',
      }}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: '#ede8df', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImg}
          alt={role}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: isCompleted ? 'none' : 'grayscale(0.2) brightness(0.92)',
            transition: 'transform 0.4s ease',
          }}
        />
        {/* Dark gradient scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Top pill tags — editorial style like reference */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          <span
            style={{
              padding: '4px 13px',
              borderRadius: 999,
              background: 'rgba(245,240,232,0.93)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255,255,255,0.5)',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontWeight: 600,
              color: typeStyle.color,
              letterSpacing: '0.04em',
            }}
          >
            {normalizedType}
          </span>
          <span
            style={{
              padding: '4px 13px',
              borderRadius: 999,
              background: isCompleted ? 'rgba(22,163,74,0.88)' : 'rgba(26,26,26,0.75)',
              backdropFilter: 'blur(10px)',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '0.04em',
            }}
          >
            {isCompleted ? '✓ Completed' : 'Not Started'}
          </span>
        </div>

        {/* Score badge on image */}
        {isCompleted && score !== null && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.94)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255,255,255,0.6)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill={scoreColor}>
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-dm-sans), sans-serif', color: scoreColor }}>
              {score}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#b8b0a0', fontFamily: 'var(--font-dm-sans), sans-serif' }}>/100</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>
        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#1a1a1a',
            textTransform: 'capitalize',
            lineHeight: 1.25,
          }}
        >
          {role} Interview
        </h3>

        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c4bdb5" strokeWidth="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style={{ fontSize: '0.75rem', color: '#c4bdb5', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
            {formattedDate}
          </span>
        </div>

        {/* Assessment */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: '#7a7060',
            lineHeight: 1.65,
            fontFamily: 'var(--font-dm-sans), sans-serif',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {feedback?.finalAssessment ||
            'Take this interview to receive detailed AI-powered feedback on your communication, technical skills, and more.'}
        </p>

        {/* Score bar */}
        {isCompleted && score !== null && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.6875rem', color: '#c4bdb5', fontFamily: 'var(--font-dm-sans)' }}>Performance</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: scoreColor, fontFamily: 'var(--font-dm-sans)' }}>
                {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(26,26,26,0.07)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${score}%`, height: '100%', background: scoreColor, borderRadius: 999 }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1.5px solid rgba(26,26,26,0.06)',
          }}
        >
          <DisplayTechIcons techStack={techstack} />
          <Link
            href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '8px 18px',
              background: '#1a1a1a',
              color: '#f5f0e8',
              borderRadius: 999,
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: 'var(--font-dm-sans), sans-serif',
              letterSpacing: '0.02em',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {feedback ? 'View Feedback' : 'Start Interview'} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;