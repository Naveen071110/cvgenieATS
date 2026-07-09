import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Send, 
  Zap, 
  Target, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Trophy, 
  Users, 
  Star,
  Menu,
  X,
  Sparkles,
  Layout,
  Search,
  Cpu
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import './_group.css';

// --- Components ---

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-cream/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">CVGenie</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">How it Works</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6">Get Started</Button>
        </div>
      </div>
    </nav>
  );
};

const HeroVisual = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/5] md:aspect-square max-w-[500px] mx-auto perspective-1000"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full" />
            <div className="space-y-2">
              <div className="w-24 h-3 bg-slate-100 rounded-full" />
              <div className="w-16 h-2 bg-slate-50 rounded-full" />
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1">
            ATS Score: 94
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="w-full h-4 bg-slate-100 rounded-full" />
          <div className="w-[90%] h-4 bg-slate-100 rounded-full" />
          <div className="w-[95%] h-4 bg-slate-100 rounded-full" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="h-20 bg-indigo-50/50 rounded-2xl border border-indigo-100 p-3 flex flex-col justify-between">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <Target size={16} />
            </div>
            <div className="w-12 h-2 bg-indigo-200 rounded-full" />
          </div>
          <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100 p-3 flex flex-col justify-between">
            <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">
              <Cpu size={16} />
            </div>
            <div className="w-12 h-2 bg-slate-300 rounded-full" />
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-20 h-2 bg-slate-100 rounded-full" />
            <div className="w-10 h-2 bg-slate-50 rounded-full" />
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full" />
          <div className="w-full h-2 bg-indigo-600/20 rounded-full relative overflow-hidden">
             <motion.div 
               initial={{ x: "-100%" }}
               animate={{ x: "0%" }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-indigo-600 w-1/3"
             />
          </div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-600 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white p-2 text-center"
      >
        <span className="text-2xl font-bold">3x</span>
        <span className="text-[10px] leading-tight">Faster<br/>Interviews</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-10 -left-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3"
      >
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <CheckCircle2 size={18} />
        </div>
        <div className="space-y-1">
          <div className="text-[10px] text-slate-400 font-medium">ATS CHECK</div>
          <div className="text-xs font-bold text-slate-900">Keywords Matched</div>
        </div>
      </motion.div>
    </div>
  );
};

const BentoGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, rotateX: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bento-grid"
        >
          {/* Big Card */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-2 row-span-2 bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-none">
                AI Powered
              </Badge>
              <h3 className="text-4xl font-bold text-slate-900 leading-tight">
                Designed to beat the algorithms.
              </h3>
              <p className="text-slate-500 max-w-sm">
                We analyze job descriptions and optimize your resume with the exact keywords hiring managers are looking for.
              </p>
            </div>
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200" />
                ))}
              </div>
              <div className="text-sm font-medium text-slate-900">
                Join 10,000+ job seekers
              </div>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col justify-center items-center text-center gap-2"
          >
            <Zap size={32} className="mb-2" />
            <div className="text-4xl font-black">60s</div>
            <div className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Generation Time</div>
          </motion.div>

          {/* Small Icon Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-emerald-50 rounded-[2rem] p-8 flex flex-col justify-between border border-emerald-100"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <div className="text-lg font-bold text-emerald-900">ATS Optimization</div>
          </motion.div>

          {/* Stat Card 2 */}
          <motion.div 
            variants={itemVariants}
            className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-center gap-4"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">98%</span>
              <span className="text-slate-400 text-sm">Success</span>
            </div>
            <div className="text-sm text-slate-300">
              Increase in interview callbacks for Pro users.
            </div>
          </motion.div>

          {/* Graphic Card */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-2 bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100 flex items-center justify-between overflow-hidden"
          >
            <div className="space-y-2">
              <div className="text-2xl font-bold text-indigo-950">Multi-Format Export</div>
              <div className="text-indigo-600/70 text-sm">PDF, Word, and Text optimized.</div>
            </div>
            <div className="flex gap-2">
              <div className="w-16 h-20 bg-white rounded-lg shadow-md border border-indigo-100 flex items-center justify-center text-indigo-200">
                <FileText size={32} />
              </div>
              <div className="w-16 h-20 bg-white rounded-lg shadow-md border border-indigo-100 flex items-center justify-center text-indigo-200 translate-y-4">
                <FileText size={32} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Upload & Paste",
      desc: "Upload your current resume and paste the job description you're targeting.",
      icon: <Download className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "AI Analysis",
      desc: "Our AI identifies key skills, requirements, and keywords from the job post.",
      icon: <Search className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Optimize & Go",
      desc: "Get an ATS-optimized resume and personalized cover letter in seconds.",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-amber-100 text-amber-600"
    }
  ];

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none px-4 py-1">Process</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">From job post to interview.</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Stop manually tailoring every application. CVGenie does the heavy lifting for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, rotateY: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.2, type: "spring", stiffness: 50 }}
              className="group relative"
            >
              <div className="absolute -inset-4 bg-slate-50 rounded-[2.5rem] scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
              <div className="relative p-6 space-y-6">
                <div className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm`}>
                  {step.icon}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-black text-slate-200 tabular-nums">0{idx + 1}</div>
                  <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureHighlight = ({ title, desc, icon: Icon, imageSide = 'right', color = 'indigo' }: any) => {
  const isRight = imageSide === 'right';
  
  return (
    <div className="py-24 group">
      <div className={`container mx-auto px-6 flex flex-col ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}>
        <motion.div 
          initial={{ opacity: 0, x: isRight ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 space-y-6"
        >
          <div className={`w-14 h-14 rounded-2xl bg-${color}-50 flex items-center justify-center text-${color}-600`}>
            <Icon size={28} />
          </div>
          <h3 className="text-4xl font-bold text-slate-900">{title}</h3>
          <p className="text-slate-500 text-lg leading-relaxed">
            {desc}
          </p>
          <Button variant="link" className={`text-${color}-600 p-0 h-auto font-bold text-lg group/btn`}>
            Learn more 
            <ArrowRight size={20} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: isRight ? 15 : -15 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          className="flex-1 w-full"
        >
          <div className={`aspect-video rounded-[2.5rem] bg-${color}-50 border border-${color}-100 shadow-xl overflow-hidden p-8 flex items-center justify-center relative`}>
            {/* Mockup elements */}
            <div className="w-full h-full bg-white rounded-xl shadow-lg p-6 space-y-4">
               <div className="w-1/3 h-4 bg-slate-100 rounded-full" />
               <div className="flex gap-2">
                 <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">MATCHED</div>
                 <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">KEYWORD</div>
               </div>
               <div className="space-y-2">
                 <div className="w-full h-2 bg-slate-50 rounded-full" />
                 <div className="w-full h-2 bg-slate-50 rounded-full" />
                 <div className="w-[80%] h-2 bg-slate-50 rounded-full" />
               </div>
            </div>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/40 backdrop-blur-md rounded-full border border-white/50 flex flex-col items-center justify-center text-slate-900"
            >
               <Sparkles className="text-indigo-600 mb-2" size={32} />
               <span className="text-sm font-bold">AI Optimized</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-white py-20">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={24} fill="currentColor" />
            <span className="text-2xl font-bold">CVGenie</span>
          </div>
          <p className="text-slate-400 text-sm">
            Empowering job seekers with AI-driven resume optimization. Get noticed, get hired.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">ATS Score</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2024 CVGenie AI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main Page ---

export function Home() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className="min-h-screen bg-cream font-sans selection:bg-indigo-100 selection:text-indigo-700">
        <Nav />
        
        {/* Simple Static Hero */}
        <section className="pt-40 pb-20 px-6">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Land your <br />
                <span className="text-indigo-600">dream job</span> <br />
                faster.
              </h1>
              <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                AI-powered resume optimization that gets you past the ATS and into the interview room.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-7 text-lg shadow-xl">
                  Build My Resume
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg border-slate-200">
                  How it works
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
               <div className="flex justify-between items-center mb-6">
                  <div className="text-lg font-bold">Resume Preview</div>
                  <Badge className="bg-emerald-100 text-emerald-700">94/100</Badge>
               </div>
               <div className="space-y-4">
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-4/6" />
               </div>
            </div>
          </div>
        </section>

        <BentoGrid />
        <HowItWorks />
        
        <div className="space-y-0">
          <FeatureHighlight 
            title="ATS Optimization"
            desc="Our proprietary algorithm matches your resume against industry-standard Applicant Tracking Systems, identifying missing keywords and formatting issues."
            icon={Target}
            color="indigo"
          />
          <FeatureHighlight 
            title="Keyword Matching"
            desc="We don't just guess. We analyze the specific job description you provide to find the exact phrasing and skills that hiring managers are scanning for."
            icon={Search}
            imageSide="left"
            color="emerald"
          />
          <FeatureHighlight 
            title="One-Click Export"
            desc="Export your polished resume in professional, recruiter-ready formats including PDF and Word. Everything is water-mark free for Pro users."
            icon={Download}
            color="amber"
          />
        </div>

        {/* Final CTA */}
        <section className="py-32 bg-cream">
          <div className="container mx-auto px-6">
            <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center text-white space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-700 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
              
              <h2 className="text-4xl md:text-6xl font-black relative z-10 leading-tight">
                Ready to level up your career?
              </h2>
              <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto relative z-10">
                Join thousands of professionals who landed roles at top companies using CVGenie.
              </p>
              <div className="relative z-10">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-full px-12 py-8 text-xl font-bold shadow-xl">
                  Get Started for Free
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      <Nav />
      
      {/* Hero Section */}
      <section className="relative pt-40 md:pt-52 pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[120px] -z-10 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px] -z-10 translate-y-1/2" />

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 text-sm font-bold text-slate-600">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              AI Resume Intelligence
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] perspective-1000">
              <motion.span 
                initial={{ opacity: 0, rotateX: 30, y: 20 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block"
              >
                Land your
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, rotateX: 30, y: 20 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block text-indigo-600"
              >
                dream job
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, rotateX: 30, y: 20 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="block"
              >
                faster.
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-slate-500 max-w-lg leading-relaxed"
            >
              Get past the ATS screening with AI-powered resume optimization. Designed for candidates who want to stand out.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-7 text-lg shadow-xl hover:-translate-y-1 transition-all duration-300">
                Build My Resume
                <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-300">
                How it works
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={12} />
                 </div>
                 <span className="text-sm font-medium text-slate-500">Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={12} />
                 </div>
                 <span className="text-sm font-medium text-slate-500">No credit card</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </section>

      <BentoGrid />
      
      <HowItWorks />

      <div className="bg-white">
        <FeatureHighlight 
          title="Beat the ATS Bots"
          desc="Applicant Tracking Systems reject 75% of resumes before a human ever sees them. CVGenie scans your content for the exact technical keywords and formatting rules those systems require."
          icon={Cpu}
          color="indigo"
        />
        <FeatureHighlight 
          title="Smart Keyword Insertion"
          desc="Stop guessing which words matter. Our AI parses job descriptions in real-time to identify the primary and secondary keywords that will trigger a 'match' in recruiter dashboards."
          icon={Search}
          imageSide="left"
          color="emerald"
        />
        <FeatureHighlight 
          title="Professional Export"
          desc="Recruiters have specific preferences. CVGenie generates high-fidelity PDF and Word documents that are guaranteed to parse correctly in every major ATS platform."
          icon={Download}
          color="amber"
        />
      </div>

      {/* Testimonials Quote */}
      <section className="py-32 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-amber-400 fill-amber-400" />)}
            </div>
            <h2 className="text-3xl md:text-5xl font-medium text-white max-w-4xl mx-auto italic leading-tight">
              "CVGenie helped me land 3 interviews in a single week after 6 months of silence. The ATS optimization is a complete game changer."
            </h2>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-slate-800" />
              <div>
                <div className="text-white font-bold">Sarah Jenkins</div>
                <div className="text-slate-500 text-sm">Product Manager @ Stripe</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-indigo-600 rounded-[3.5rem] p-12 md:p-24 text-center text-white space-y-10 relative overflow-hidden shadow-2xl"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" 
            />
            
            <div className="space-y-4 relative z-10">
              <Badge className="bg-indigo-500 text-indigo-100 hover:bg-indigo-500 border-none px-4 py-1">Limited Time</Badge>
              <h2 className="text-4xl md:text-7xl font-black leading-[0.9] tracking-tighter">
                Stop applying. <br />
                Start interviewing.
              </h2>
            </div>
            
            <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto relative z-10">
              Join 10,000+ job seekers who use CVGenie to land interviews at Google, Meta, and Amazon.
            </p>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-full px-12 py-8 text-xl font-black shadow-xl hover:-translate-y-1 transition-all duration-300">
                Get Started for Free
              </Button>
            </div>

            <div className="text-indigo-200 text-sm font-medium pt-4 relative z-10">
              No credit card required • 3 free generations
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
