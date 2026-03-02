'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { vapi } from '@/lib/vapi.sdk'
import { interviewer } from '@/constants'
import { createFeedback } from '@/lib/actions/general.action'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant'
  content: string
}

const STATUS_CONFIG = {
  [CallStatus.INACTIVE]: { label: 'Ready', color: 'rgba(245,240,232,0.35)', bg: 'rgba(245,240,232,0.05)' },
  [CallStatus.CONNECTING]: { label: 'Connecting…', color: '#fde047', bg: 'rgba(253,224,71,0.12)' },
  [CallStatus.ACTIVE]: { label: 'Live', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  [CallStatus.FINISHED]: { label: 'Ended', color: 'rgba(245,240,232,0.35)', bg: 'rgba(245,240,232,0.05)' },
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
  const router = useRouter()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [messages, setMessages] = useState<SavedMessage[]>([])

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED)
    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setMessages((prev) => [...prev, { role: message.role, content: message.transcript }])
      }
    }
    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)
    const onError = (error: Error) => console.log('Error', error)

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)
    return () => {
      vapi.off('call-start', onCallStart); vapi.off('call-end', onCallEnd)
      vapi.off('message', onMessage); vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd); vapi.off('error', onError)
    }
  }, [])

  const handleGenerateFeedback = useCallback(async (msgs: SavedMessage[]) => {
    const { success, feedbackId: id } = await createFeedback({ interviewId: interviewId!, userId: userId!, transcript: msgs })
    if (success && id) router.push(`/interview/${interviewId}/feedback`)
    else router.push('/')
  }, [interviewId, userId, router])

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === 'generate') router.push('/')
      else handleGenerateFeedback(messages)
    }
  }, [messages, callStatus, type, handleGenerateFeedback, router])

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING)
    if (type === 'generate') {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, { variableValues: { username: userName, userid: userId } })
    } else {
      const formattedQuestions = questions ? questions.map((q) => `- ${q}`).join('\n') : ''
      await vapi.start(interviewer, { variableValues: { questions: formattedQuestions } })
    }
  }

  const handleDisconnect = () => { setCallStatus(CallStatus.FINISHED); vapi.stop() }

  const latestMessage = messages[messages.length - 1]?.content
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
  const statusCfg = STATUS_CONFIG[callStatus]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Two-pane layout */}
      <div style={{ display: 'flex', gap: 20, width: '100%' }}>
        {/* AI Pane */}
        <div
          style={{
            flex: 1, height: 420, background: '#1a1a1a', borderRadius: 22,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 14, padding: 32,
          }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative', width: 124, height: 124 }}>
            <div style={{ width: 124, height: 124, borderRadius: '50%', overflow: 'hidden', border: '2.5px solid rgba(245,240,232,0.12)', position: 'relative', zIndex: 2 }}>
              <Image src="/ai-avatar.png" alt="AI Interviewer" width={124} height={124} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
            {isSpeaking && (
              <>
                <span style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid rgba(74,222,128,0.3)', animation: 'ping 1.2s ease infinite', zIndex: 1 }} />
                <span style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: '1px solid rgba(74,222,128,0.15)', animation: 'ping 1.2s 0.2s ease infinite', zIndex: 0 }} />
              </>
            )}
          </div>

          {/* Name + status */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.65rem', fontFamily: 'var(--font-dm-sans), sans-serif', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
              AI Interviewer
            </p>
            <h3 style={{ color: '#f5f0e8', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
              Mantis AI
            </h3>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
                borderRadius: 999, background: statusCfg.bg, border: `1px solid ${statusCfg.color}22`,
                margin: '0 auto',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusCfg.color, flexShrink: 0, display: 'inline-block' }} />
              <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-dm-sans), sans-serif', color: statusCfg.color, fontWeight: 500, letterSpacing: '0.04em' }}>
                {statusCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* User Pane */}
        <div
          style={{ flex: 1, height: 420, borderRadius: 22, overflow: 'hidden', border: '1.5px solid rgba(26,26,26,0.09)' }}
          className="max-md:hidden"
        >
          <div style={{ background: '#ede8df', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 124, height: 124, borderRadius: '50%', overflow: 'hidden', border: '2.5px solid rgba(26,26,26,0.08)', background: '#d4cec5' }}>
              <Image src="/user-avatar.png" alt="User" width={124} height={124} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(26,26,26,0.35)', fontSize: '0.65rem', fontFamily: 'var(--font-dm-sans), sans-serif', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                Candidate
              </p>
              <h3 style={{ color: '#1a1a1a', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                {userName}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript */}
      {messages.length > 0 && (
        <div style={{ border: '1.5px solid rgba(26,26,26,0.08)', borderRadius: 16, background: '#ffffff', padding: '16px 28px', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p
            key={latestMessage}
            className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}
            style={{ fontSize: '0.9375rem', textAlign: 'center', color: '#7a7060', fontStyle: 'italic', fontFamily: 'var(--font-dm-sans), sans-serif', lineHeight: 1.6, margin: 0 }}
          >
            {latestMessage}
          </p>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="btn-call" onClick={handleCall} style={{ position: 'relative' }}>
            {callStatus === CallStatus.CONNECTING && (
              <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: '#22c55e', opacity: 0.4, animation: 'ping 1s ease infinite' }} />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>
              {isCallInactiveOrFinished ? 'Start Interview' : '…'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>End Interview</button>
        )}
      </div>
    </div>
  )
}

export default Agent