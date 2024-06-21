"use client"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { navLinks } from "@/constants"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

const MobileNav = () => {
  const pathname = usePathname()
  return (
    <header className="header">
        <Link href='/' className="flex items-center gap-2 md:py-2">
        <Image 
            src= '/assets/images/logo-text.png' alt='logo' width={200} height={50}      
        />    
        </Link>
        {/* creating the navbar for the mobile view */}
        <nav className="flex gap-2">
            <SignedIn>
                <UserButton afterSignOutUrl="/"/>

                {/* adding sheet property from shadcn */}
                <Sheet>
                    <SheetTrigger>
                        <Image
                            src= '/assets/icons/menu.svg' alt='menu' width={25} height={20}      />
                    </SheetTrigger>
                    <SheetContent className="sheet-content sm:w-70">
                        <>
                            <Image
                                src= '/assets/images/logo-text.png' 
                                alt='logo' width={200} height={50}
                            />

                            {/* adding the navbars for the first 6 links */}
                            <ul className='header-nav_elements'>
                                {navLinks.map((link) =>{
                                    const isActive = link.route === pathname

                                    return(
                                        <li 
                                            className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}

                                            key={link.route}>
                                                <Link className='sidebar-link flex items-center gap-2 cursor-pointer' href={link.route}>
                                                    <Image
                                                        src={link.icon} 
                                                        alt= "logo"
                                                        width={20} height={20}
                                                    />
                                                    {link.label}
                                                </Link>
                                        </li>
                                    )
                                })}
                    </ul>

                        </>
                        
                    </SheetContent>
                </Sheet>

            </SignedIn>


                  {/* FOR SIGNED OUT */}
                  <SignedOut>
                    <Button asChild className='button bg-purple-gradient bg-cover'>
                        <Link href='/sign-in'>Login</Link>
                    </Button>
                </SignedOut>
            
        </nav>
    </header>
  )
}

export default MobileNav