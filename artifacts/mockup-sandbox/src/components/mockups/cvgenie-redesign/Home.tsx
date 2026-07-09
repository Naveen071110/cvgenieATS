import React, { useRef, useState, useEffect } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  AnimatePresence,
  Variants
} from 'framer-motion';
import { 
  FileText, 
  Zap, 
  Target, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Star,
  Sparkles,
  Search,
  Cpu,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import './_group.css';

// --- Sub-components ---

const ThemeToggle = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => (
  <Button 
    variant="ghost" 
    size="icon" 
    onClick={toggleTheme}
    className="rounded-full w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-all hover:scale-110 active:scale-95"
  >
    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
  </Button>
);

const Nav = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-cream/80 dark:bg-slate-900/80 backdrop-blur-xl py-3 shadow-lg border-b border-slate-200/50 dark:border-slate-800/50' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12 group-hover:scale-110">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">CVGenie</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600 dark:text-slate-400">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
          </a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group">
            How it Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
          </a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <Button variant="ghost" className="hidden sm:inline-flex text-slate-900 dark:text-white font-bold">Log in</Button>
          <Button className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-white rounded-full px-6 font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

const WordReveal = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + (i * 0.1), ease: [0.2, 0.65, 0.3, 0.9] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const HeroVisual = ({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/5] md:aspect-square max-w-[550px] mx-auto perspective-2000"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-800 p-10 flex flex-col gap-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-700">
               <Users size={28} />
            </div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-slate-100 dark:bg-slate-800 rounded-full" />
              <div className="w-20 h-3 bg-slate-50 dark:bg-slate-800/50 rounded-full" />
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
          >
            <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-none px-4 py-1.5 text-sm font-bold shadow-sm">
              ATS Score: 94
            </Badge>
          </motion.div>
        </div>

        <div className="space-y-5">
          <div className="w-full h-5 bg-slate-100 dark:bg-slate-800 rounded-full" />
          <div className="w-[90%] h-5 bg-slate-100 dark:bg-slate-800 rounded-full" />
          <div className="w-[95%] h-5 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="h-24 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 p-4 flex flex-col justify-between"
          >
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
              <Target size={20} />
            </div>
            <div className="w-16 h-2.5 bg-indigo-200 dark:bg-indigo-900/60 rounded-full" />
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="h-24 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800 p-4 flex flex-col justify-between"
          >
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm">
              <Cpu size={20} />
            </div>
            <div className="w-16 h-2.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </motion.div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Optimization Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400">85%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
             <motion.div 
               initial={{ x: "-100%" }}
               animate={{ x: "0%" }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-indigo-600 dark:bg-indigo-500 w-1/3 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
             />
          </div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <AnimatePresence>
        {!prefersReducedMotion && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
              transition={{ delay: 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600 dark:bg-indigo-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white p-4 text-center z-10"
              style={{ rotateZ: 5 }}
            >
              <span className="text-4xl font-black mb-1">3x</span>
              <span className="text-xs font-bold leading-tight opacity-90 uppercase tracking-tighter">Faster<br/>Interviews</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
              transition={{ delay: 1, duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-12 -left-12 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 p-6 flex items-center gap-4 z-10"
              style={{ rotateZ: -3 }}
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">ATS VALIDATED</div>
                <div className="text-sm font-black text-slate-900 dark:text-white">Keywords Matched</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-20 -left-10 text-indigo-400/30 blur-sm"
            >
              <Sparkles size={120} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const BentoGrid = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 0.5], [10, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const getItemVariants = (i: number): Variants => ({
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  });

  return (
    <section ref={scrollRef} className="py-32 bg-cream dark:bg-[#050505] transition-colors duration-700 overflow-hidden relative">
      <div className="bg-noise absolute inset-0 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          style={{ rotateX: rotate, scale, opacity }}
          className="bento-grid"
        >
          {/* Big Card */}
          <motion.div 
            variants={getItemVariants(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="bento-item-1 bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col justify-between group overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl transition-all group-hover:scale-110" />
            <div className="space-y-6 relative z-10">
              <Badge className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 border-none px-4 py-1 font-bold">
                AI Powered
              </Badge>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
                Designed to beat <br/>the algorithms.
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-sm leading-relaxed font-medium">
                We analyze job descriptions and optimize your resume with the exact keywords hiring managers are looking for.
              </p>
            </div>
            <div className="mt-16 flex items-center gap-3 relative z-10">
              <ArrowRight size={18} className="text-indigo-600 dark:text-indigo-400" />
              <div className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">
                Built for job seekers who want an edge
              </div>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div 
            variants={getItemVariants(1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bento-item-2 bg-indigo-600 dark:bg-indigo-500 rounded-[2.5rem] p-10 text-white flex flex-col justify-center items-center text-center gap-3 shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/20"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
               <Zap size={48} className="text-indigo-200" fill="currentColor" />
            </motion.div>
            <div className="text-6xl font-black tracking-tighter">60s</div>
            <div className="text-indigo-100 text-xs font-black uppercase tracking-[0.2em]">Generation Time</div>
          </motion.div>

          {/* Small Icon Card */}
          <motion.div 
            variants={getItemVariants(2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="bento-item-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2.5rem] p-10 flex flex-col justify-between border border-emerald-100 dark:border-emerald-900/50 shadow-sm transition-all"
          >
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <div className="text-xl font-black text-emerald-900 dark:text-emerald-400 tracking-tight">ATS Optimization</div>
          </motion.div>

          {/* Stat Card 2 */}
          <motion.div 
            variants={getItemVariants(3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="bento-item-4 bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-10 text-white flex flex-col justify-center gap-6 shadow-2xl"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter">98%</span>
              <span className="text-indigo-400 text-sm font-black uppercase tracking-widest">Success</span>
            </div>
            <div className="text-sm text-slate-400 dark:text-slate-300 leading-relaxed font-medium">
              Of resumes pass automated ATS keyword screening after optimization.
            </div>
          </motion.div>

          {/* Graphic Card */}
          <motion.div 
            variants={getItemVariants(4)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="bento-item-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] p-10 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between overflow-hidden relative"
          >
            <div className="space-y-3 relative z-10">
              <div className="text-3xl font-black text-indigo-950 dark:text-white tracking-tight">Multi-Format Export</div>
              <div className="text-indigo-600/70 dark:text-indigo-400/70 font-bold text-lg">PDF, Word, and Text optimized.</div>
            </div>
            <div className="flex gap-4 relative z-10">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-28 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-indigo-100 dark:border-slate-700 flex items-center justify-center text-indigo-200 dark:text-slate-600"
              >
                <FileText size={40} />
              </motion.div>
              <motion.div 
                animate={{ y: [20, 10, 20] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-20 h-28 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-indigo-100 dark:border-slate-700 flex items-center justify-center text-indigo-100 dark:text-slate-700"
              >
                <FileText size={40} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorks = ({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.33) setActiveStep(0);
      else if (latest < 0.66) setActiveStep(1);
      else setActiveStep(2);
    });
    return () => unsubscribe();
  }, [scrollYProgress, prefersReducedMotion]);

  const steps = [
    {
      title: "Upload & Paste",
      desc: "Upload your current resume and paste the job description you're targeting.",
      icon: <Download size={64} />,
      color: "bg-blue-600",
      accent: "blue"
    },
    {
      title: "AI Analysis",
      desc: "Our AI identifies key skills, requirements, and keywords from the job post.",
      icon: <Search size={64} />,
      color: "bg-purple-600",
      accent: "purple"
    },
    {
      title: "Optimize & Go",
      desc: "Get an ATS-optimized resume and personalized cover letter in seconds.",
      icon: <Zap size={64} />,
      color: "bg-amber-600",
      accent: "amber"
    }
  ];

  if (prefersReducedMotion) {
    return (
      <section className="py-32 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 space-y-6">
            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border-none px-6 py-2 font-black uppercase tracking-widest text-xs">Process</Badge>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">From job post <br/>to interview.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium">
              Stop manually tailoring every application. CVGenie does the heavy lifting for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[3rem] space-y-8">
                 <div className={`${step.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl`}>
                    {step.icon}
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{step.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{step.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-white dark:bg-slate-900 transition-colors duration-700">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-16">
            <div className="space-y-6">
               <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-6 py-2 font-black uppercase tracking-widest text-xs">The Workflow</Badge>
               <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
                  From job post <br/>to <span className="text-indigo-600 dark:text-indigo-400">interview.</span>
               </h2>
            </div>
            
            <div className="relative space-y-12">
               {steps.map((step, idx) => (
                 <div key={idx} className="flex gap-8 group cursor-pointer transition-all">
                    <div className="flex flex-col items-center">
                       <motion.div 
                        animate={{ 
                          scale: activeStep === idx ? 1.2 : 1,
                          backgroundColor: activeStep === idx ? '#4f46e5' : 'rgb(226, 232, 240)'
                        }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg relative z-10`}
                       >
                          {idx + 1}
                       </motion.div>
                       {idx < 2 && <div className="w-1 flex-1 bg-slate-100 dark:bg-slate-800 mt-2 mb-2 rounded-full overflow-hidden">
                          <motion.div 
                            style={{ 
                              height: idx === 0 
                                ? useTransform(scrollYProgress, [0, 0.33], ["0%", "100%"]) 
                                : idx === 1 
                                  ? useTransform(scrollYProgress, [0.33, 0.66], ["0%", "100%"]) 
                                  : "0%" 
                            }}
                            className="bg-indigo-600 w-full"
                          />
                       </div>}
                    </div>
                    <motion.div 
                      animate={{ 
                        opacity: activeStep === idx ? 1 : 0.3,
                        x: activeStep === idx ? 10 : 0
                      }}
                      className="space-y-2 py-1"
                    >
                       <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{step.title}</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-md">{step.desc}</p>
                    </motion.div>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative aspect-square max-w-xl mx-auto hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.2, rotateY: -30 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="w-full h-full rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800 p-12 flex flex-col justify-center items-center gap-12 bg-white dark:bg-slate-800 relative"
              >
                <div className="bg-noise absolute inset-0 rounded-[4rem] pointer-events-none" />
                <motion.div 
                  animate={{ y: [0, -20, 0], rotateZ: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`${steps[activeStep].color} w-40 h-40 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative z-10`}
                >
                  {steps[activeStep].icon}
                </motion.div>
                <div className="text-center space-y-4 relative z-10">
                  <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Step 0{activeStep + 1}</div>
                  <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{steps[activeStep].title}</h4>
                </div>
                
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-${steps[activeStep].accent}-500/5 blur-[100px] rounded-full pointer-events-none transition-all duration-700`} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureHighlight = ({ title, desc, icon: Icon, imageSide = 'right', color = 'indigo', prefersReducedMotion }: any) => {
  const isRight = imageSide === 'right';
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [isRight ? 100 : -100, isRight ? -100 : 100]);
  
  return (
    <div ref={containerRef} className="py-40 group relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-700">
      <div className={`container mx-auto px-6 flex flex-col ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-20 relative z-10`}>
        <motion.div 
          initial={{ opacity: 0, x: isRight ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 space-y-8"
        >
          <div className={`w-20 h-20 rounded-3xl bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center text-${color}-600 dark:text-${color}-400 shadow-sm`}>
            <Icon size={40} />
          </div>
          <div className="space-y-4">
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed font-medium">
              {desc}
            </p>
          </div>
          <Button variant="link" className={`text-${color}-600 dark:text-${color}-400 p-0 h-auto font-black text-xl group/btn tracking-tight`}>
            Learn more 
            <ArrowRight size={24} className="ml-3 transition-transform group-hover/btn:translate-x-2" />
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateX: isRight ? -20 : 20 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 w-full perspective-2000"
        >
          <div className={`aspect-[4/3] rounded-[3.5rem] bg-${color}-50/50 dark:bg-${color}-900/10 border border-${color}-100 dark:border-${color}-900/30 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden p-12 flex items-center justify-center relative group`}>
            <div className="bg-noise absolute inset-0 pointer-events-none" />
            
            <motion.div 
               whileHover={{ scale: 1.02, rotateY: isRight ? -5 : 5 }}
               className="w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-10 space-y-8 border border-slate-100 dark:border-slate-700 relative z-10"
            >
               <div className="flex justify-between items-center">
                  <div className="w-1/3 h-5 bg-slate-100 dark:bg-slate-700 rounded-full" />
                  <div className="flex gap-3">
                    <div className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">MATCHED</div>
                    <div className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">OPTIMIZED</div>
                  </div>
               </div>
               <div className="space-y-4">
                 <div className="w-full h-4 bg-slate-50 dark:bg-slate-700/50 rounded-full" />
                 <div className="w-full h-4 bg-slate-50 dark:bg-slate-700/50 rounded-full" />
                 <div className="w-[85%] h-4 bg-slate-50 dark:bg-slate-700/50 rounded-full" />
                 <div className="w-full h-4 bg-slate-50 dark:bg-slate-700/50 rounded-full" />
               </div>
               <div className="mt-6 flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20" />
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800" />
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800" />
               </div>
            </motion.div>
            
            {!prefersReducedMotion && (
              <motion.div 
                animate={{ y: [0, -20, 0], rotateZ: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[3rem] border border-white/80 dark:border-slate-700/80 flex flex-col items-center justify-center text-slate-900 dark:text-white shadow-2xl z-20"
              >
                 <Sparkles className="text-indigo-600 dark:text-indigo-400 mb-3" size={48} />
                 <span className="text-lg font-black tracking-tight">AI Augmented</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {!prefersReducedMotion && (
        <motion.div 
          style={{ x }}
          className="absolute bottom-0 left-0 text-[20rem] font-black text-slate-100 dark:text-slate-800/20 whitespace-nowrap pointer-events-none select-none z-0"
        >
          {title.toUpperCase()}
        </motion.div>
      )}
    </div>
  );
};

const Footer = () => (
  <footer className="bg-slate-950 text-white py-32 relative overflow-hidden border-t border-slate-900 transition-colors duration-700">
    <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid md:grid-cols-4 gap-20 mb-24">
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <span className="text-3xl font-black tracking-tighter">CVGenie</span>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Empowering job seekers with AI-driven resume optimization. Get noticed, get hired.
          </p>
          <div className="flex gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
                  <Star size={20} />
               </div>
             ))}
          </div>
        </div>
        <div>
          <h4 className="font-black text-slate-500 text-xs uppercase tracking-[0.2em] mb-8">Product</h4>
          <ul className="space-y-5 text-lg font-bold text-slate-400">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">ATS Score</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Career Tools</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-slate-500 text-xs uppercase tracking-[0.2em] mb-8">Company</h4>
          <ul className="space-y-5 text-lg font-bold text-slate-400">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Press Kit</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-slate-500 text-xs uppercase tracking-[0.2em] mb-8">Legal</h4>
          <ul className="space-y-5 text-lg font-bold text-slate-400">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Accessibility</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-bold text-slate-500">
        <p>© 2024 CVGenie AI. Crafted for job seekers worldwide.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main Page ---

export function Home() {
  const [theme, setTheme] = useState('light');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className={`${theme} min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-700`}>
      <div className="relative bg-cream dark:bg-slate-950 transition-colors duration-700 min-h-screen">
        <div className="bg-noise absolute inset-0 pointer-events-none z-50" />
        
        <Nav theme={theme} toggleTheme={toggleTheme} />
        
        {/* Hero Section */}
        <section ref={heroRef} className="pt-48 pb-32 px-6 relative overflow-hidden">
          <motion.div 
            style={{ y: prefersReducedMotion ? 0 : heroY, opacity: heroOpacity }}
            className="container mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10"
          >
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="bg-indigo-600 dark:bg-indigo-500 text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-600/20">
                  New v2.0 is live
                </Badge>
              </motion.div>
              
              <h1 className="text-7xl md:text-[9.5rem] font-black text-slate-900 dark:text-white tracking-tighter leading-[0.8] transition-colors duration-700">
                <WordReveal text="Land your" /> <br />
                <span className="text-indigo-600 dark:text-indigo-400">
                  <WordReveal text="dream job" delay={0.3} />
                </span> <br />
                <WordReveal text="faster." delay={0.6} />
              </h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-2xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium transition-colors duration-700"
              >
                AI-powered resume optimization that gets you past the ATS and into the interview room.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex flex-wrap gap-6 pt-4"
              >
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-10 py-8 text-xl font-black shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all hover:scale-105 active:scale-95 group">
                  Build My Resume
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-10 py-8 text-xl font-black border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-all hover:scale-105 active:scale-95">
                  How it works
                </Button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-3 pt-8 border-t border-slate-200 dark:border-slate-800 transition-colors"
              >
                <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Free to start &middot; No credit card required
                </div>
              </motion.div>
            </div>

            <div className="relative">
               <HeroVisual prefersReducedMotion={prefersReducedMotion} />
            </div>
          </motion.div>

          {!prefersReducedMotion && (
            <>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-100/20 dark:bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"
              />
            </>
          )}
        </section>

        <BentoGrid />
        
        <HowItWorks prefersReducedMotion={prefersReducedMotion} />
        
        <div className="space-y-0 transition-colors duration-700">
          <FeatureHighlight 
            title="ATS Optimization"
            desc="Our proprietary algorithm matches your resume against industry-standard Applicant Tracking Systems, identifying missing keywords and formatting issues."
            icon={Target}
            color="indigo"
            prefersReducedMotion={prefersReducedMotion}
          />
          <FeatureHighlight 
            title="Keyword Matching"
            desc="We don't just guess. We analyze the specific job description you provide to find the exact phrasing and skills that hiring managers are scanning for."
            icon={Search}
            imageSide="left"
            color="emerald"
            prefersReducedMotion={prefersReducedMotion}
          />
          <FeatureHighlight 
            title="One-Click Export"
            desc="Export your polished resume in professional, recruiter-ready formats including PDF and Word. Everything is water-mark free for Pro users."
            icon={Download}
            color="amber"
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* Final CTA */}
        <section className="py-48 px-6 bg-cream dark:bg-[#050505] transition-colors duration-700">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-indigo-600 dark:bg-indigo-500 rounded-[5rem] p-16 md:p-32 text-center text-white space-y-12 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.5)]"
            >
              <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2" />
              
              <div className="space-y-6 relative z-10">
                <Badge className="bg-white/20 text-white border-none px-8 py-2 rounded-full font-black uppercase tracking-[0.3em] text-sm backdrop-blur-md">Ready to start?</Badge>
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">Your next role is <br/>one click away.</h2>
                <p className="text-2xl text-indigo-100 max-w-2xl mx-auto font-medium">
                  Join thousands of professionals who have used CVGenie to land interviews at top-tier companies.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-8 relative z-10">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 rounded-full px-12 py-10 text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                  Get Started Free
                  <Sparkles className="ml-3 transition-transform group-hover:rotate-12" />
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/30 hover:bg-white/10 text-white rounded-full px-12 py-10 text-2xl font-black transition-all hover:scale-105 active:scale-95">
                  View Pricing
                </Button>
              </div>

              <div className="absolute bottom-10 left-10 opacity-20 hidden md:block">
                 <Sparkles size={100} />
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
