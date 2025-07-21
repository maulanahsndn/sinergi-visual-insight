import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    const stageInterval = setInterval(() => {
      setStage(prev => (prev + 1) % 4);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(stageInterval);
    };
  }, [isLoading, onComplete]);

  const loadingStages = [
    "LOADING SABAR YA",
    "LOADING SABAR YA.",
    "LOADING SABAR YA..",
    "LOADING SABAR YA..."
  ];

  const cubes = Array.from({ length: 27 }, (_, i) => {
    const x = (i % 3) - 1;
    const y = Math.floor((i % 9) / 3) - 1;
    const z = Math.floor(i / 9) - 1;
    return { x, y, z, id: i };
  });

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 animate-pulse" />
            <div className="grid grid-cols-20 gap-1 h-full w-full">
              {Array.from({ length: 400 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-primary/20 rounded-full"
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.01,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </div>

          {/* 3D Cube Animation */}
          <div className="perspective-1000 relative">
            <motion.div
              className="relative preserve-3d"
              animate={{
                rotateX: [0, 360],
                rotateY: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(0)",
              }}
            >
              {cubes.map((cube) => (
                <motion.div
                  key={cube.id}
                  className="absolute w-8 h-8 bg-gradient-to-br from-primary to-accent border border-primary/30 rounded-sm"
                  style={{
                    transform: `translate3d(${cube.x * 40}px, ${cube.y * 40}px, ${cube.z * 40}px)`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    delay: cube.id * 0.1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Loading Text with 3D Effect */}
          <motion.div
            className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.h1
              key={stage}
              initial={{ opacity: 0, y: 20, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 90 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-space-grotesk font-bold text-transparent bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text tracking-widest uppercase"
              style={{
                textShadow: `
                  0 0 20px hsl(var(--primary) / 0.5),
                  0 0 40px hsl(var(--primary) / 0.3),
                  0 0 60px hsl(var(--primary) / 0.1)
                `,
                transform: "perspective(500px) rotateX(10deg)",
              }}
            >
              {loadingStages[stage]}
            </motion.h1>
          </motion.div>

          {/* Progress Bar */}
          <motion.div 
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-full h-full bg-glass/30 rounded-full border border-glass-border/50 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent relative"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </motion.div>
            </div>
            <motion.p
              className="text-center mt-4 text-sm font-jetbrains text-primary/80 tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {Math.round(progress)}% MEMUAT SISTEM FUTURISTIK
            </motion.p>
          </motion.div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/40 rounded-full"
                style={{
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>

          {/* Scanning Line Effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(90deg, transparent 0%, transparent 48%, hsl(var(--primary) / 0.3) 49%, hsl(var(--primary) / 0.3) 51%, transparent 52%, transparent 100%)",
                "linear-gradient(90deg, transparent 0%, transparent 98%, hsl(var(--primary) / 0.3) 99%, hsl(var(--primary) / 0.3) 100%, transparent 100%, transparent 100%)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};