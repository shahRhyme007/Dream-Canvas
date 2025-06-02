"use client"  // This is a client component instead of server component(which is the default)
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

const Sidebar = () => {
    const pathname = usePathname()

    const sidebarVariants = {
        hidden: { x: -280, opacity: 0 },
        visible: { 
            x: 0, 
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { 
            x: 0, 
            opacity: 1,
            transition: { duration: 0.3 }
        }
    }

    return (
        <motion.aside 
            className='sidebar bg-gradient-to-b from-white to-purple-50/30 border-r border-purple-100'
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
        >
            <div className='flex size-full flex-col gap-4'>
                <motion.div variants={itemVariants}>
                    <Link href='/' className='sidebar-logo group'>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Image 
                                src='/assets/images/logo-text.png' 
                                alt='DreamCanvas logo'
                                width={180} 
                                height={28} 
                                className="group-hover:brightness-110 transition-all duration-300"
                            />
                        </motion.div>
                    </Link>
                </motion.div>

                {/* adding the navbars for the first 6 links */}
                <motion.nav className='sidebar-nav' variants={itemVariants}>
                    <SignedIn>
                        <motion.ul className='sidebar-nav_elements' variants={itemVariants}>
                            {navLinks.slice(0,6).map((link, index) =>{
                                const isActive = link.route === pathname

                                return(
                                    <motion.li 
                                        key={link.route} 
                                        className={`sidebar-nav_element group relative overflow-hidden ${isActive ? "bg-purple-gradient text-white shadow-lg" : "text-gray-600 hover:bg-purple-50"}`}
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
                                                layoutId="activeIndicator"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <Link className='sidebar-link flex items-center gap-4 relative z-10' href={link.route}>
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

                        <motion.ul className='sidebar-nav_elements' variants={itemVariants}>
                            {navLinks.slice(6).map((link, index) =>{
                                    const isActive = link.route === pathname

                                return(
                                    <motion.li 
                                        key={link.route} 
                                        className={`sidebar-nav_element group relative overflow-hidden ${isActive ? "bg-purple-gradient text-white shadow-lg" : "text-gray-600 hover:bg-purple-50"}`}
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
                                                layoutId="activeIndicator2"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <Link className='sidebar-link flex items-center gap-4 relative z-10' href={link.route}>
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
                            
                            <motion.li 
                                className='flex-center cursor-pointer gap-2 p-4'
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div
                                    className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
                                    whileHover={{ 
                                        boxShadow: "0 4px 20px rgba(139, 92, 246, 0.15)",
                                        y: -2
                                    }}
                                >
                                    <UserButton 
                                        afterSignOutUrl='/' 
                                        showName
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: "w-8 h-8",
                                                userButtonOuterIdentifier: "text-gray-700 font-medium"
                                            }
                                        }}
                                    />
                                </motion.div>
                            </motion.li>
                        </motion.ul>
                    
                    </SignedIn>

                    {/* FOR SIGNED OUT */}
                    <SignedOut>
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button asChild className='button bg-purple-gradient bg-cover hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300'>
                                <Link href='/sign-in'>Login</Link>
                            </Button>
                        </motion.div>
                    </SignedOut>

                </motion.nav>
            </div>
        </motion.aside>

    )
}

export default Sidebar