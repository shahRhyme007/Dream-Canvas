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
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const MobileNav = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const menuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.header 
      className="header bg-white/95 backdrop-blur-sm border-b border-purple-100"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link href='/' className="flex items-center gap-2 md:py-2">
            <Image 
                src='/assets/images/logo-text.png' 
                alt='DreamCanvas logo' 
                width={180} 
                height={40}
                className="hover:brightness-110 transition-all duration-300"      
            />    
          </Link>
        </motion.div>

        {/* creating the navbar for the mobile view */}
        <nav className="flex gap-2">
            <SignedIn>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-10 h-10 border-2 border-purple-200",
                        userButtonOuterIdentifier: "hidden"
                      }
                    }}
                  />
                </motion.div>

                {/* adding sheet property from shadcn */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <motion.button
                          className="p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Image
                              src='/assets/icons/menu.svg' 
                              alt='menu' 
                              width={24} 
                              height={24}      
                          />
                        </motion.button>
                    </SheetTrigger>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <SheetContent className="sheet-content sm:w-70 bg-gradient-to-b from-white to-purple-50/30">
                            <motion.div
                              variants={menuVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                                <motion.div variants={itemVariants}>
                                  <Image
                                      src='/assets/images/logo-text.png' 
                                      alt='DreamCanvas logo' 
                                      width={180} 
                                      height={40}
                                      className="mb-8"
                                  />
                                </motion.div>

                                {/* adding the navbars for the first 6 links */}
                                <motion.ul className='header-nav_elements space-y-2' variants={itemVariants}>
                                    {navLinks.map((link, index) =>{
                                        const isActive = link.route === pathname

                                        return(
                                            <motion.li 
                                                key={link.route}
                                                className={`relative overflow-hidden rounded-xl ${isActive ? 'bg-purple-gradient text-white shadow-lg' : 'text-gray-700 hover:bg-purple-50'}`}
                                                variants={itemVariants}
                                                whileHover={{ 
                                                  scale: 1.02,
                                                  x: 5,
                                                  transition: { type: "spring", stiffness: 300 }
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {isActive && (
                                                  <motion.div
                                                    className="absolute left-0 top-0 w-1 h-full bg-white rounded-r-full"
                                                    layoutId="mobileActiveIndicator"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                  />
                                                )}
                                                <Link 
                                                  className='sidebar-link flex items-center gap-4 p-4 relative z-10' 
                                                  href={link.route}
                                                  onClick={() => setIsOpen(false)}
                                                >
                                                    <motion.div
                                                      whileHover={{ rotate: 5 }}
                                                      transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                      <Image
                                                          src={link.icon} 
                                                          alt={link.label}
                                                          width={20} 
                                                          height={20}
                                                          className={`${isActive && 'brightness-200'} transition-all duration-300`}
                                                      />
                                                    </motion.div>
                                                    <motion.span
                                                      className="font-medium"
                                                      whileHover={{ x: 2 }}
                                                      transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                      {link.label}
                                                    </motion.span>
                                                </Link>
                                                {!isActive && (
                                                  <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100"
                                                    transition={{ duration: 0.3 }}
                                                  />
                                                )}
                                            </motion.li>
                                        )
                                    })}
                                </motion.ul>
                            </motion.div>
                        </SheetContent>
                      )}
                    </AnimatePresence>
                </Sheet>

            </SignedIn>

            {/* FOR SIGNED OUT */}
            <SignedOut>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild className='button bg-purple-gradient bg-cover hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300'>
                      <Link href='/sign-in'>Login</Link>
                  </Button>
                </motion.div>
            </SignedOut>
            
        </nav>
    </motion.header>
  )
}

export default MobileNav