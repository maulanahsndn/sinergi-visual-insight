import { motion } from "framer-motion";
import { Sparkles, Rocket, Users } from "lucide-react";
// Hero background image is loaded from public directory
const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden cinematic-hero">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(/lovable-uploads/bc55cc81-4345-4ab7-8c67-840d506ae6d8.png)`
    }} />
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 z-10" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-float" style={{
        animationDelay: "2s"
      }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-glow/10 rounded-full blur-[150px] animate-glow-pulse" />
      </div>

      {/* Hero Content */}
      <motion.div initial={{
      opacity: 0,
      y: 50
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 1,
      ease: "easeOut"
    }} className="relative z-20 text-center max-w-5xl mx-auto px-6">
        <motion.div initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="flex items-center justify-center gap-2 mb-6">
          
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
        </span>
        </motion.div>

        <motion.h1 initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }} className="text-5xl md:text-7xl lg:text-8xl font-poppins font-bold mb-6 leading-tight my-[26px] mx-[21px] py-0 px-[28px]">
          <span className="bg-gradient-to-r from-foreground via-primary-glow to-accent bg-clip-text text-transparent my-0 text-4xl">
            Laporan Interview
          </span>
          <br />
          
        </motion.h1>

        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.6
      }} className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed md:text-lg">
          Kelola dan analisis hasil interview dengan teknologi canggih. 
          Sistem modern untuk proses rekrutmen yang lebih efisien dan terstruktur.
        </motion.p>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.8
      }} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="glass-card px-8 py-4 text-lg font-semibold text-primary hover:neon-glow transition-all duration-300 hover-lift" onClick={() => document.getElementById('dashboard')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            <Sparkles className="w-5 h-5 inline mr-2" />
            Mulai Sekarang
          </motion.button>
          
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="glass-button px-8 py-4 text-lg font-medium hover-lift" onClick={() => document.getElementById('features')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            <Users className="w-5 h-5 inline mr-2" />
            Lihat Fitur
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 1
      }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[{
          number: "30+",
          label: "Laporan Interview",
          icon: Users
        }, {
          number: "100%",
          label: "Responsif",
          icon: Sparkles
        }, {
          number: "AI",
          label: "Powered Assistant",
          icon: Rocket
        }].map((stat, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 1.2 + index * 0.1
        }} className="glass-card p-6 text-center hover-lift">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>)}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 1,
      delay: 1.5
    }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <motion.div animate={{
          y: [0, 12, 0]
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="w-1 h-3 bg-primary rounded-full mt-2" />
        </div>
      </motion.div>
    </section>;
};
export default HeroSection;