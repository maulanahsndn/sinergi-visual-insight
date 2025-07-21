import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Bot, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Zap
} from 'lucide-react';
import { InterviewData, FormData } from '@/types/interview';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AIAssistantProps {
  formData: FormData;
  onSuggestion: (suggestion: Partial<FormData>) => void;
  onValidation: (isValid: boolean, errors: string[]) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  formData, 
  onSuggestion, 
  onValidation 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  // AI-powered form validation
  const validateFormWithAI = () => {
    setValidationStatus('validating');
    
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!formData.kandidat.trim()) {
      errors.push('Nama kandidat harus diisi');
    }
    
    if (!formData.posisiSaatIni.trim()) {
      errors.push('Posisi saat ini harus diisi');
    }
    
    if (!formData.tanggalInterview) {
      errors.push('Tanggal interview harus diisi');
    }

    // Advanced AI-like validation
    if (formData.kandidat.length < 3) {
      warnings.push('Nama kandidat terlalu pendek');
    }

    const assessmentCount = Object.values(formData.penilaian).filter(val => val !== '').length;
    if (assessmentCount < 5) {
      errors.push('Semua kategori penilaian harus diisi');
    }

    if (formData.catatan.length < 10) {
      warnings.push('Catatan terlalu singkat, pertimbangkan untuk menambahkan detail');
    }

    setTimeout(() => {
      if (errors.length === 0) {
        setValidationStatus('valid');
        toast.success('Form tervalidasi dengan baik!');
        onValidation(true, []);
      } else {
        setValidationStatus('invalid');
        toast.error(`Ditemukan ${errors.length} error dalam form`);
        onValidation(false, errors);
      }

      if (warnings.length > 0) {
        warnings.forEach(warning => {
          toast(warning, { icon: '⚠️' });
        });
      }
    }, 1500);
  };

  // AI suggestions based on form data
  const generateSuggestions = () => {
    const newSuggestions: string[] = [];

    // Position-based suggestions
    const position = formData.posisiSaatIni.toLowerCase();
    if (position.includes('engineer') || position.includes('developer')) {
      newSuggestions.push('Pertimbangkan menilai kemampuan teknis dan problem-solving lebih tinggi');
      newSuggestions.push('Tanyakan tentang experience dengan technology stack terbaru');
    }
    
    if (position.includes('manager') || position.includes('lead')) {
      newSuggestions.push('Fokus pada kemampuan leadership dan komunikasi');
      newSuggestions.push('Evaluasi experience dalam team management');
    }
    
    if (position.includes('designer')) {
      newSuggestions.push('Tanyakan tentang portfolio dan design process');
      newSuggestions.push('Evaluasi creativity dan understanding of user experience');
    }

    // Assessment-based suggestions
    const grades = Object.values(formData.penilaian).filter(val => val !== '');
    const averageGrade = grades.length > 0 ? grades.reduce((acc, grade) => {
      return acc + ({ A: 4, B: 3, C: 2, D: 1 }[grade] || 0);
    }, 0) / grades.length : 0;

    if (averageGrade >= 3.5) {
      newSuggestions.push('Kandidat menunjukkan performa excellent, rekomendasikan untuk posisi senior');
    } else if (averageGrade >= 2.5) {
      newSuggestions.push('Kandidat memiliki potensi baik, pertimbangkan untuk training tambahan');
    } else if (averageGrade < 2.5 && grades.length > 0) {
      newSuggestions.push('Kandidat memerlukan development significant, pertimbangkan fit dengan role');
    }

    setSuggestions(newSuggestions);
  };

  // Speech recognition for voice input
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Browser Anda tidak mendukung speech recognition');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';

    setIsListening(true);
    
    recognition.onstart = () => {
      toast.info('AI Assistant sedang mendengarkan...');
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      // Process voice commands
      processVoiceCommand(transcript.toLowerCase());
    };

    recognition.onerror = () => {
      toast.error('Terjadi kesalahan saat mendengarkan');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      toast.success('Voice input selesai');
    };

    recognition.start();
  };

  const stopVoiceInput = () => {
    setIsListening(false);
  };

  const processVoiceCommand = (command: string) => {
    if (command.includes('validasi') || command.includes('check')) {
      validateFormWithAI();
    } else if (command.includes('saran') || command.includes('suggest')) {
      generateSuggestions();
    } else if (command.includes('grade a') || command.includes('nilai a')) {
      // Auto-fill with high grades as example
      onSuggestion({
        penilaian: {
          komunikasi: 'A',
          pengetahuanPosisi: 'A',
          kerjaSamaTim: 'A',
          sikapKepribadian: 'A',
          kemampuanMengatasi: 'A'
        }
      });
      toast.success('Mengisi dengan grade A untuk semua kategori');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* AI Assistant Header */}
      <Card className="glass-card border-glass-border/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Bot className="w-6 h-6 text-primary animate-glow-pulse" />
            AI Assistant
            <Sparkles className="w-5 h-5 text-accent" />
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Bantu validasi dan optimalisasi form interview dengan AI
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Voice Controls */}
          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              variant={isListening ? "destructive" : "default"}
              className={cn(
                "flex-1",
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-r from-primary to-primary-glow neon-glow"
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Command
                </>
              )}
            </Button>
          </div>

          {/* AI Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={validateFormWithAI}
              variant="outline"
              className="glass-button hover-lift"
              disabled={validationStatus === 'validating'}
            >
              <Brain className="w-4 h-4 mr-2" />
              {validationStatus === 'validating' ? 'Validating...' : 'AI Validation'}
            </Button>
            
            <Button
              onClick={generateSuggestions}
              variant="outline"
              className="glass-button hover-lift"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate Tips
            </Button>
          </div>

          {/* Validation Status */}
          {validationStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg glass-card border-glass-border/30"
            >
              {validationStatus === 'validating' && (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">AI sedang memvalidasi form...</span>
                </>
              )}
              {validationStatus === 'valid' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Form sudah valid dan siap disimpan!</span>
                </>
              )}
              {validationStatus === 'invalid' && (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Ditemukan error dalam form</span>
                </>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border-glass-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 glass-card border-glass-border/30 rounded-lg hover-lift"
                >
                  <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 text-xs">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Voice Commands Help */}
      <Card className="glass-card border-glass-border/50">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Voice Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• "Validasi form" - Validasi AI</div>
            <div>• "Berikan saran" - Generate tips</div>
            <div>• "Grade A" - Fill dengan nilai A</div>
            <div>• "Check form" - Periksa kelengkapan</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};