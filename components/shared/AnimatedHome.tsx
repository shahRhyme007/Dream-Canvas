"use client"

import { Collection } from "@/components/shared/Collection"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface AnimatedHomeProps {
  images: any;
  page: number;
  navLinks: any[];
}

const AnimatedHome = ({ images, page, navLinks }: AnimatedHomeProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const heroVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  function getFeatureDescription(label: string): string {
    const descriptions: { [key: string]: string } = {
      "Image Restore": "Bring old photos back to life with AI-powered restoration",
      "Generative Fill": "Intelligently fill and expand images with contextual content",
      "Object Remove": "Seamlessly remove unwanted objects from your photos",
      "Object Recolor": "Change colors of specific objects with precision",
      "Background Remove": "Create professional cutouts with perfect edges"
    };
    return descriptions[label] || "Transform your images with AI";
  }

  return (
    <>
      <motion.section 
        className="relative home overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-blue-600/20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          <motion.h1 
            className="home-heading bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Unleash Your Creative Vision with <br />
            <motion.span 
              className="inline-block bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent font-bold"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              DreamCanvas
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-white/90 text-lg mt-4 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Transform your images with cutting-edge AI technology. Create, enhance, and reimagine your visual content like never before.
          </motion.p>
        </div>
      </motion.section>

      <motion.section 
        className="mt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
        >
          {navLinks.slice(1, 5).map((link, index) => (
            <motion.div
              key={link.route}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={link.route}
                className="group block p-6 bg-white rounded-2xl shadow-lg border border-purple-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                      <Image 
                        src={link.icon} 
                        alt={link.label} 
                        width={28} 
                        height={28} 
                        className="brightness-0 invert"
                      />
                    </div>
                    <motion.div 
                      className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{link.label}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {getFeatureDescription(link.label)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Collection 
            hasSearch={true}
            images={images?.data}
            totalPages={images?.totalPages}
            page={page}
          />
        </motion.div>
      </motion.section>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  )
}

export default AnimatedHome 