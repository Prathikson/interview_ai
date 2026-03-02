import { isAuthenticated, getCurrentUser } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const RootLayout = async ({ children }: { children: ReactNode }) => {

  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect('/sign-in');
  }

  const user = await getCurrentUser();

  return (
    <>
      <Header userName={user?.name} />
      <main className='root-layout'>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default RootLayout