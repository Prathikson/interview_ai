'use client'
import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Link from 'next/link'
import { toast } from 'sonner'
import FormField from './FormField'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/client'
import { signIn, signUp } from '@/lib/actions/auth.action'

const authFormSchema = (type: FormType) =>
  z.object({
    name: type === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  })

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const formSchema = authFormSchema(type)
  const isSignIn = type === 'sign-in'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        const { name, email, password } = values
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        const result = await signUp({ uid: userCredentials.user.uid, name: name!, email, password })
        if (!result?.success) { toast.error(result?.message); return }
        toast.success('Account created. Please sign in.')
        router.push('/sign-in')
      } else {
        const { email, password } = values
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const idToken = await userCredential.user.getIdToken()
        if (!idToken) { toast.error('Sign in failed'); return }
        await signIn({ email, idToken })
        toast.success('Signed in successfully.')
        router.push('/')
      }
    } catch (error) {
      toast.error(`Error: ${error}`)
    }
  }

  return (
    <div
      style={{
        width: '100%', maxWidth: 460,
        background: '#ffffff', borderRadius: 24,
        border: '1.5px solid rgba(26,26,26,0.08)',
        boxShadow: '0 8px 56px rgba(26,26,26,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: '#1a1a1a', borderRadius: '24px 24px 0 0' }} />

      <div style={{ padding: '44px 40px 40px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#f5f0e8', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.1rem', fontWeight: 700 }}>M</span>
            </div>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.01em' }}>
              Mantis
            </span>
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.7rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.15, marginBottom: 8 }}>
            {isSignIn ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#b8b0a0', fontFamily: 'var(--font-dm-sans), sans-serif', margin: 0 }}>
            {isSignIn ? 'Sign in to continue your practice' : 'Start practising with AI interviews'}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full form">
            {!isSignIn && (
              <FormField control={form.control} name="name" label="Full Name" placeholder="Your name" />
            )}
            <FormField control={form.control} name="email" label="Email Address" placeholder="you@example.com" type="email" />
            <FormField control={form.control} name="password" label="Password" placeholder="Min. 3 characters" type="password" />
            <div style={{ paddingTop: 4 }}>
              <Button className="btn" type="submit">{isSignIn ? 'Sign In' : 'Create Account'}</Button>
            </div>
          </form>
        </Form>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: '0.8125rem', color: '#b8b0a0', fontFamily: 'var(--font-dm-sans), sans-serif', margin: '22px 0 0' }}>
          {isSignIn ? "Don't have an account? " : 'Already have an account? '}
          <Link
            href={isSignIn ? '/sign-up' : '/sign-in'}
            style={{ fontWeight: 700, color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm