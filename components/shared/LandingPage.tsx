"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Sparkles, Zap, Shield, Users, Palette, Download, Camera, Image as ImageIcon, Wand2, Play, ArrowRight, Book, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"

// Cursor Trail Component
const CursorTrail = () => {
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);
  const trailIdRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        id: trailIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      };

      setTrails(prev => [...prev, newTrail]);

      // Remove trail after 1 second
      setTimeout(() => {
        setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
      }, 1000);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMounted]);

  // Don't render anything on the server
  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.8)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.8)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {trails.map((trail, index) => {
          const nextTrail = trails[index + 1];
          if (!nextTrail) return null;

          const age = (Date.now() - trail.timestamp) / 3000; // 0 to 1 over 3 seconds
          const opacity = Math.max(0, 1 - age);

          return (
            <motion.line
              key={`${trail.id}-${nextTrail.id}`}
              x1={trail.x}
              y1={trail.y}
              x2={nextTrail.x}
              y2={nextTrail.y}
              stroke="url(#trailGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ opacity: 0.8, pathLength: 0 }}
              animate={{ 
                opacity: opacity,
                pathLength: 1
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                pathLength: { duration: 0.1 },
                opacity: { duration: 3, ease: "easeOut" }
              }}
            />
          );
        })}

        {/* Animated sparkles at cursor position */}
        {trails.slice(-5).map((trail, index) => {
          const age = (Date.now() - trail.timestamp) / 1000;
          if (age > 0.5) return null;

          return (
            <motion.circle
              key={`sparkle-${trail.id}`}
              cx={trail.x + (Math.random() - 0.5) * 20}
              cy={trail.y + (Math.random() - 0.5) * 20}
              r="2"
              fill="rgba(255, 255, 255, 0.8)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Book Pages Component
const BookPages = ({ features }: { features: any[] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const nextPage = () => {
    if (currentPage < features.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(pageIndex);
        setIsFlipping(false);
      }, 300);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Book Container */}
      <div className="relative perspective-1000">
        <div className="relative w-full h-[600px] bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl shadow-2xl border-4 border-amber-200 overflow-hidden">
          {/* Book Spine */}
          <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-b from-amber-600 to-amber-800 shadow-inner"></div>
          
          {/* Page Content */}
          <div className="relative w-full h-full p-12 pl-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ rotateY: isFlipping ? -90 : 0, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="h-full flex flex-col items-center justify-center text-center"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Feature Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 150 }}
                  className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r ${features[currentPage].gradient} flex items-center justify-center text-white mb-8 shadow-2xl`}
                >
                  <div className="text-4xl">
                    {features[currentPage].icon}
                  </div>
                </motion.div>

                {/* Feature Title */}
                <motion.h3
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-4xl font-bold text-gray-800 mb-6"
                >
                  {features[currentPage].title}
                </motion.h3>

                {/* Feature Description */}
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-xl text-gray-600 leading-relaxed max-w-2xl font-medium"
                >
                  {features[currentPage].description}
                </motion.p>

                {/* Decorative Elements */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.1 }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="absolute top-8 right-8 text-8xl text-purple-300"
                >
                  ✨
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.1 }}
                  transition={{ delay: 1.1, duration: 1 }}
                  className="absolute bottom-8 left-16 text-6xl text-pink-300"
                >
                  🎨
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className={`absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 ${
              currentPage === 0 || isFlipping 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-white hover:shadow-xl'
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextPage}
            disabled={currentPage === features.length - 1 || isFlipping}
            className={`absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 ${
              currentPage === features.length - 1 || isFlipping 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-white hover:shadow-xl'
            }`}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </motion.button>

          {/* Page Number */}
          <div className="absolute bottom-6 right-8 text-amber-700 font-semibold text-lg">
            {currentPage + 1} / {features.length}
          </div>
        </div>

        {/* Page Dots Navigation */}
        <div className="flex justify-center mt-8 gap-3">
          {features.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToPage(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Swipe Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-center mt-6 text-gray-500 text-sm flex items-center justify-center gap-2"
        >
          <span>💡</span>
          <span>Click the arrows or dots to explore each AI tool</span>
        </motion.div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }

  const features = [
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "AI Image Restore",
      description: "Bring old photos back to life with cutting-edge AI restoration technology",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Smart Object Recolor",
      description: "Change colors of specific objects with precision and natural results",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      title: "Generative Fill",
      description: "Intelligently expand and fill images with contextual AI-generated content",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Object Removal",
      description: "Seamlessly remove unwanted objects while preserving image quality",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const stats = [
    { number: "50K+", label: "Images Transformed" },
    { number: "10K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "User Rating" }
  ]

  const beforeAfterDemo = [
    { before: "Old Photo", after: "Restored", color: "from-gray-400 to-gray-600" },
    { before: "Object", after: "Removed", color: "from-red-400 to-red-600" },
    { before: "Plain", after: "Enhanced", color: "from-blue-400 to-blue-600" },
    { before: "Small", after: "Expanded", color: "from-green-400 to-green-600" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" style={{ opacity: 0.3 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Cursor Trail Effect */}
      <CursorTrail />

      {/* Header */}
      <motion.header 
        className="relative z-50 px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-purple-100/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image 
              src="/assets/images/logo-text.png" 
              alt="DreamCanvas" 
              width={300} 
              height={60}
              className="h-10 w-auto"
            />
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" asChild className="hidden sm:flex border-purple-200 text-purple-700 hover:bg-purple-50">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative z-40 px-6 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants}>
            <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Image Editing
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-gray-900 via-purple-700 to-gray-900 bg-clip-text text-transparent">
              Transform Your Images with{" "}
            </span>
            <motion.span
              className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              AI Magic
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed font-medium"
            variants={itemVariants}
          >
            Unleash your creativity with DreamCanvas - the most advanced AI-powered image editing platform. 
            Restore, enhance, and transform your photos like never before.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/sign-up">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Creating Free
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-purple-200 text-purple-700 hover:bg-purple-50 shadow-md hover:shadow-lg transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Hero Demo */}
          <motion.div 
            className="relative max-w-5xl mx-auto z-30"
            variants={itemVariants}
            animate={floatingAnimation}
          >
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 p-8">
              <div className="text-center mb-6">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                  <Wand2 className="w-4 h-4 mr-2" />
                  AI Transformation Preview
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {beforeAfterDemo.map((demo, i) => (
                  <motion.div
                    key={i}
                    className="relative"
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="space-y-3">
                      {/* Before */}
                      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 h-24 flex items-center justify-center shadow-sm">
                        <span className="text-gray-600 font-medium text-sm">{demo.before}</span>
                      </div>
                      
                      {/* Arrow */}
                      <div className="flex justify-center">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight className="w-6 h-6 text-purple-500 rotate-90" />
                        </motion.div>
                      </div>
                      
                      {/* After */}
                      <div className={`relative bg-gradient-to-br ${demo.color} rounded-xl p-4 h-24 flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-medium text-sm drop-shadow-sm">{demo.after}</span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="relative z-30 px-6 py-16 bg-white/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section - Book Style */}
      <motion.section 
        className="relative z-30 px-6 py-20 bg-gradient-to-br from-white to-purple-50/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6 text-gray-900"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powerful AI Tools
              </span>{" "}
              <span className="text-gray-900">at Your Fingertips</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl mx-auto font-medium mb-8"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Experience the future of image editing with our cutting-edge AI technology
            </motion.p>
            <motion.p 
              className="text-sm text-gray-500 flex items-center justify-center gap-2"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Book className="w-4 h-4" />
              Click or drag to turn pages
            </motion.p>
          </div>

          <BookPages features={features} />
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="relative z-30 px-6 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
            <div className="relative z-10">
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-6"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Ready to Transform Your Images?
              </motion.h2>
              <motion.p 
                className="text-xl mb-8 opacity-95"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join thousands of creators who trust DreamCanvas for their image editing needs
              </motion.p>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/sign-up">
                    <Star className="w-5 h-5 mr-2" />
                    Get Started Now - It&apos;s Free!
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="relative z-30 px-6 py-12 border-t border-purple-100 bg-white/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <Image 
            src="/assets/images/logo-text.png" 
            alt="DreamCanvas" 
            width={150} 
            height={30}
            className="h-8 w-auto mx-auto mb-4"
          />
          <p className="text-gray-700 mb-4 font-medium">
            © 2024 DreamCanvas. All rights reserved.
          </p>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Powered by cutting-edge AI technology</span>
          </div>
        </div>
      </motion.footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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
    </div>
  )
}

export default LandingPage 