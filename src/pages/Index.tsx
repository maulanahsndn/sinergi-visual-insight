import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, BarChart3, Users, Share2 } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import { InterviewForm } from '@/components/InterviewForm';
import { Dashboard } from '@/components/Dashboard';
import { ClientView } from '@/components/ClientView';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { InterviewData } from '@/types/interview';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/hooks/useTheme';
import { dummyInterviewData } from '@/data/dummyData';
import { exportToPDF, exportToExcel } from '@/utils/exportUtils';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
// Logo is loaded from public directory
type ViewMode = 'hero' | 'form' | 'dashboard' | 'client';
const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('hero');
  const [interviewData, setInterviewData] = useLocalStorage<InterviewData[]>('interview-data', dummyInterviewData);
  const [editingInterview, setEditingInterview] = useState<InterviewData | null>(null);
  const {
    theme
  } = useTheme();

  // Load dummy data if localStorage is empty
  useEffect(() => {
    if (interviewData.length === 0) {
      setInterviewData(dummyInterviewData);
    }
  }, []);
  const handleSaveInterview = (newInterview: InterviewData) => {
    if (editingInterview) {
      // Update existing interview
      setInterviewData(prev => prev.map(interview => interview.id === editingInterview.id ? newInterview : interview));
      setEditingInterview(null);
    } else {
      // Add new interview
      setInterviewData(prev => [newInterview, ...prev]);
    }
    setCurrentView('dashboard');
  };
  const handleEditInterview = (interview: InterviewData) => {
    setEditingInterview(interview);
    setCurrentView('form');
  };
  const handleDeleteInterview = (id: string) => {
    setInterviewData(prev => prev.filter(interview => interview.id !== id));
  };
  const handleExportPDF = () => {
    try {
      exportToPDF(interviewData);
      toast.success('Data berhasil diekspor ke PDF!');
    } catch (error) {
      toast.error('Gagal mengekspor ke PDF');
    }
  };
  const handleExportExcel = () => {
    try {
      exportToExcel(interviewData);
      toast.success('Data berhasil diekspor ke Excel!');
    } catch (error) {
      toast.error('Gagal mengekspor ke Excel');
    }
  };
  const handleCancelEdit = () => {
    setEditingInterview(null);
    setCurrentView('dashboard');
  };
  const renderContent = () => {
    switch (currentView) {
      case 'hero':
        return <HeroSection />;
      case 'form':
        return <InterviewForm onSave={handleSaveInterview} editingData={editingInterview} onCancel={editingInterview ? handleCancelEdit : undefined} />;
      case 'dashboard':
        return <Dashboard data={interviewData} onEdit={handleEditInterview} onDelete={handleDeleteInterview} onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} />;
      case 'client':
        return <ClientView data={interviewData} onBack={() => setCurrentView('dashboard')} />;
      default:
        return <HeroSection />;
    }
  };
  return <>
      <Toaster position="top-right" toastOptions={{
      style: {
        background: 'hsl(var(--glass))',
        border: '1px solid hsl(var(--glass-border))',
        color: 'hsl(var(--foreground))',
        backdropFilter: 'blur(20px)'
      }
    }} />
      <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <motion.nav initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-glass-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('hero')} whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
              
              <div>
                <h1 className="text-xl font-orbitron font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Interview</h1>
                <p className="text-xs text-muted-foreground font-rajdhani">Interview Management</p>
              </div>
            </motion.div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant={currentView === 'hero' ? 'default' : 'ghost'} onClick={() => setCurrentView('hero')} className="glass-button hover-lift">
                <FileText className="w-4 h-4 mr-2" />
                Beranda
              </Button>
              <Button variant={currentView === 'form' ? 'default' : 'ghost'} onClick={() => {
                setEditingInterview(null);
                setCurrentView('form');
              }} className="glass-button hover-lift">
                <Plus className="w-4 h-4 mr-2" />
                Form Baru
              </Button>
              <Button variant={currentView === 'dashboard' ? 'default' : 'ghost'} onClick={() => setCurrentView('dashboard')} className="glass-button hover-lift">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant={currentView === 'client' ? 'default' : 'ghost'} onClick={() => setCurrentView('client')} className="glass-button hover-lift">
                <Share2 className="w-4 h-4 mr-2" />
                Client View
              </Button>
            </div>

            {/* Theme Switcher & Stats */}
            <motion.div initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="hidden lg:flex items-center gap-4">
              <ThemeSwitcher />
              <Badge variant="outline" className="glass-card border-glass-border/50 px-3 py-1">
                <Users className="w-4 h-4 mr-2" />
                {interviewData.length} Interview
              </Badge>
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4">
            <div className="grid grid-cols-4 gap-2">
              <Button variant={currentView === 'hero' ? 'default' : 'ghost'} onClick={() => setCurrentView('hero')} className="glass-button text-xs" size="sm">
                <FileText className="w-3 h-3 mr-1" />
                Home
              </Button>
              <Button variant={currentView === 'form' ? 'default' : 'ghost'} onClick={() => {
                setEditingInterview(null);
                setCurrentView('form');
              }} className="glass-button text-xs" size="sm">
                <Plus className="w-3 h-3 mr-1" />
                Form
              </Button>
              <Button variant={currentView === 'dashboard' ? 'default' : 'ghost'} onClick={() => setCurrentView('dashboard')} className="glass-button text-xs" size="sm">
                <BarChart3 className="w-3 h-3 mr-1" />
                Data
              </Button>
              <Button variant={currentView === 'client' ? 'default' : 'ghost'} onClick={() => setCurrentView('client')} className="glass-button text-xs" size="sm">
                <Share2 className="w-3 h-3 mr-1" />
                Client
              </Button>
            </div>
            <div className="mt-3 flex justify-center">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20 md:pt-24">
        {renderContent()}
      </main>

      {/* Features Section (shown on hero) */}
      {currentView === 'hero' && <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="text-center mb-16">
              <h2 className="text-4xl font-poppins font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Fitur Unggulan
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Sistem manajemen interview yang lengkap dengan teknologi modern dan AI assistant
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{
              icon: FileText,
              title: 'Form Interview Lengkap',
              description: 'Form input yang comprehensive dengan 5 kategori penilaian dan validasi otomatis',
              color: 'text-blue-400'
            }, {
              icon: BarChart3,
              title: 'Dashboard Visual',
              description: 'Analisis data real-time dengan filter, pencarian, dan visualisasi yang menarik',
              color: 'text-green-400'
            }, {
              icon: Users,
              title: 'AI Assistant',
              description: 'Speech-to-text, validasi otomatis, dan saran penilaian dengan teknologi AI',
              color: 'text-purple-400'
            }].map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: index * 0.2
            }}>
                  <Card className="glass-card border-glass-border/50 h-full hover-lift group">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 ${feature.color} mx-auto mb-6 rounded-full bg-glass/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-poppins font-semibold mb-4 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>)}
            </div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.8
          }} className="text-center mt-16">
              <Button onClick={() => setCurrentView('form')} className="bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent neon-glow hover-lift text-white px-8 py-6 text-lg font-semibold rounded-lg">
                <Plus className="w-5 h-5 mr-2" />
                Mulai Interview Pertama
              </Button>
            </motion.div>
          </div>
        </section>}

      {/* Footer */}
      <footer className="glass-card border-t border-glass-border/50 py-8 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">© 2025 Interview Management System. Created by MaulanaHsndnn | Powered by AI & Modern Technology.</p>
          
        </div>
      </footer>
      </div>
    </>;
};
export default Index;