import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
// this is where all the pages will be located

const Layout = ({children}: {children: React.ReactNode}) => {
  const { userId } = auth();

  // If user is not authenticated, show full-width layout
  if (!userId) {
    return (
      <main className='min-h-screen'>
        {children}
        <Toaster/>
      </main>
    )
  }

  // If user is authenticated, show layout with sidebar and mobile nav
  return (
    <main className='root'>
       <Sidebar/>
       <MobileNav/>
        <div className='root-container'>
            <div className="wrapper">
                {children}
            </div>
        </div>
        <Toaster/>
    </main>
  )
}

export default Layout