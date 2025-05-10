import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

const RootLayout = async ({children} : {children: ReactNode}) => {

  const isUserAuthenticated = await isAuthenticated();

  if(!isUserAuthenticated){
    redirect('/sign-in');
  } 
  
  return (
    <div className='root-layout'>
      <nav>
        <Link href='/' className='flex items-center gap-2'>
          <Image src="/logo.svg" alt='logo' width={200} height={100} />
        </Link>

        
      </nav>

      {children}

    </div>
  )
}

export default RootLayout