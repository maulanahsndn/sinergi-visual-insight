import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, Mic, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FormData, InterviewData } from '@/types/interview';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AIAssistant } from './AIAssistant';

interface InterviewFormProps {
  onSave: (data: InterviewData) => void;
  editingData?: InterviewData | null;
  onCancel?: () => void;
}

const gradeColors = {
  A: 'bg-green-500/20 text-green-400 border-green-500/30',
  B: 'bg-blue-500/20 text-blue-400 border-blue-500/30', 
  C: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  D: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const competencyCategories = [
  { key: 'komunikasi', label: 'Komunikasi', icon: '💬' },
  { key: 'pengetahuanPosisi', label: 'Pengetahuan Tentang Posisi', icon: '📚' },
  { key: 'kerjaSamaTim', label: 'Kerja Sama Tim', icon: '🤝' },
  { key: 'sikapKepribadian', label: 'Sikap & Kepribadian', icon: '😊' },
  { key: 'kemampuanMengatasi', label: 'Kemampuan Mengatasi Masalah', icon: '🧩' }
] as const;

export const InterviewForm: React.FC<InterviewFormProps> = ({ 
  onSave, 
  editingData, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<FormData>({
    kandidat: editingData?.kandidat || '',
    posisiSaatIni: editingData?.posisiSaatIni || '',
    tanggalInterview: editingData?.tanggalInterview || '',
    penilaian: {
      komunikasi: editingData?.penilaian.komunikasi || '',
      pengetahuanPosisi: editingData?.penilaian.pengetahuanPosisi || '',
      kerjaSamaTim: editingData?.penilaian.kerjaSamaTim || '',
      sikapKepribadian: editingData?.penilaian.sikapKepribadian || '',
      kemampuanMengatasi: editingData?.penilaian.kemampuanMengatasi || ''
    },
    catatan: editingData?.catatan || ''
  });

  const [date, setDate] = useState<Date | undefined>(
    editingData?.tanggalInterview ? new Date(editingData.tanggalInterview) : undefined
  );
  
  const [isListening, setIsListening] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Speech to text functionality
  const startSpeechToText = (field: string) => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Browser Anda tidak mendukung speech recognition');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'id-ID';

    setIsListening(true);
    
    recognition.onstart = () => {
      toast.info('Mulai mendengarkan...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (field === 'catatan') {
        setFormData(prev => ({ ...prev, catatan: transcript }));
      } else {
        setFormData(prev => ({ ...prev, [field]: transcript }));
      }
      toast.success('Teks berhasil diinput!');
    };

    recognition.onerror = () => {
      toast.error('Terjadi kesalahan saat mendengarkan');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.kandidat.trim()) {
      newErrors.kandidat = 'Nama kandidat harus diisi';
    }
    
    if (!formData.posisiSaatIni.trim()) {
      newErrors.posisiSaatIni = 'Posisi saat ini harus diisi';
    }
    
    if (!formData.tanggalInterview) {
      newErrors.tanggalInterview = 'Tanggal interview harus diisi';
    }

    // Check if all assessment categories are filled
    const assessmentKeys = Object.keys(formData.penilaian) as Array<keyof typeof formData.penilaian>;
    const missingAssessments = assessmentKeys.filter(key => !formData.penilaian[key]);
    
    if (missingAssessments.length > 0) {
      newErrors.penilaian = 'Semua kategori penilaian harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    const interviewData: InterviewData = {
      id: editingData?.id || Date.now().toString(),
      kandidat: formData.kandidat,
      posisiSaatIni: formData.posisiSaatIni,
      tanggalInterview: formData.tanggalInterview,
      penilaian: {
        komunikasi: formData.penilaian.komunikasi as 'A' | 'B' | 'C' | 'D',
        pengetahuanPosisi: formData.penilaian.pengetahuanPosisi as 'A' | 'B' | 'C' | 'D',
        kerjaSamaTim: formData.penilaian.kerjaSamaTim as 'A' | 'B' | 'C' | 'D',
        sikapKepribadian: formData.penilaian.sikapKepribadian as 'A' | 'B' | 'C' | 'D',
        kemampuanMengatasi: formData.penilaian.kemampuanMengatasi as 'A' | 'B' | 'C' | 'D'
      },
      catatan: formData.catatan,
      createdAt: editingData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(interviewData);
    toast.success(editingData ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!');
    
    // Reset form if it's a new entry
    if (!editingData) {
      setFormData({
        kandidat: '',
        posisiSaatIni: '',
        tanggalInterview: '',
        penilaian: {
          komunikasi: '',
          pengetahuanPosisi: '',
          kerjaSamaTim: '',
          sikapKepribadian: '',
          kemampuanMengatasi: ''
        },
        catatan: ''
      });
      setDate(undefined);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        tanggalInterview: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
  };

  const handleAISuggestion = (suggestion: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...suggestion,
      penilaian: { ...prev.penilaian, ...suggestion.penilaian }
    }));
  };

  const handleAIValidation = (isValid: boolean, errors: string[]) => {
    if (!isValid) {
      const newErrors: Record<string, string> = {};
      errors.forEach(error => {
        if (error.includes('kandidat')) newErrors.kandidat = error;
        if (error.includes('posisi')) newErrors.posisiSaatIni = error;
        if (error.includes('tanggal')) newErrors.tanggalInterview = error;
        if (error.includes('penilaian')) newErrors.penilaian = error;
      });
      setErrors(newErrors);
    } else {
      setErrors({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
      <Card className="glass-card border-glass-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-poppins bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {editingData ? 'Edit Laporan Interview' : 'Form Laporan Hasil Interview'}
          </CardTitle>
          <p className="text-muted-foreground">
            Isi data hasil interview kandidat dengan lengkap dan akurat
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-primary mb-4">📋 Informasi Dasar</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="kandidat" className="text-foreground font-medium">
                    Nama Kandidat *
                  </Label>
                  <div className="relative">
                    <Input
                      id="kandidat"
                      value={formData.kandidat}
                      onChange={(e) => setFormData(prev => ({ ...prev, kandidat: e.target.value }))}
                      className="glass-card border-glass-border/50 focus:neon-glow"
                      placeholder="Masukkan nama lengkap kandidat"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                      onClick={() => startSpeechToText('kandidat')}
                      disabled={isListening}
                    >
                      <Mic className={cn("w-4 h-4", isListening && "text-red-500 animate-pulse")} />
                    </Button>
                  </div>
                  {errors.kandidat && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.kandidat}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="posisiSaatIni" className="text-foreground font-medium">
                    Posisi Saat Ini *
                  </Label>
                  <div className="relative">
                    <Input
                      id="posisiSaatIni"
                      value={formData.posisiSaatIni}
                      onChange={(e) => setFormData(prev => ({ ...prev, posisiSaatIni: e.target.value }))}
                      className="glass-card border-glass-border/50 focus:neon-glow"
                      placeholder="Contoh: Software Engineer"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                      onClick={() => startSpeechToText('posisiSaatIni')}
                      disabled={isListening}
                    >
                      <Mic className={cn("w-4 h-4", isListening && "text-red-500 animate-pulse")} />
                    </Button>
                  </div>
                  {errors.posisiSaatIni && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.posisiSaatIni}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  Tanggal Interview *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal glass-card border-glass-border/50",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-card border-glass-border/50" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.tanggalInterview && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.tanggalInterview}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Assessment Categories */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-primary mb-4">⭐ Penilaian Kompetensi</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {competencyCategories.map((category, index) => (
                  <motion.div
                    key={category.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="space-y-3"
                  >
                    <Label className="text-foreground font-medium flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.label} *
                    </Label>
                    <Select
                      value={formData.penilaian[category.key as keyof typeof formData.penilaian]}
                      onValueChange={(value) => 
                        setFormData(prev => ({
                          ...prev,
                          penilaian: {
                            ...prev.penilaian,
                            [category.key]: value
                          }
                        }))
                      }
                    >
                      <SelectTrigger className="glass-card border-glass-border/50 focus:neon-glow">
                        <SelectValue placeholder="Pilih nilai" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-glass-border/50">
                        {['A', 'B', 'C', 'D'].map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            <div className="flex items-center gap-2">
                              <Badge className={cn("text-xs", gradeColors[grade as keyof typeof gradeColors])}>
                                {grade}
                              </Badge>
                              <span>
                                {grade === 'A' && 'Sangat Baik'}
                                {grade === 'B' && 'Baik'}
                                {grade === 'C' && 'Cukup'}
                                {grade === 'D' && 'Kurang'}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                ))}
              </div>
              
              {errors.penilaian && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.penilaian}
                </p>
              )}
            </motion.div>

            {/* Notes */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <Label htmlFor="catatan" className="text-foreground font-medium flex items-center gap-2">
                📝 Catatan Tambahan
              </Label>
              <div className="relative">
                <Textarea
                  id="catatan"
                  value={formData.catatan}
                  onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                  className="glass-card border-glass-border/50 focus:neon-glow min-h-[120px] resize-none"
                  placeholder="Tulis catatan, kesan, atau rekomendasi untuk kandidat ini..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 p-1"
                  onClick={() => startSpeechToText('catatan')}
                  disabled={isListening}
                >
                  <Mic className={cn("w-4 h-4", isListening && "text-red-500 animate-pulse")} />
                </Button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary neon-glow hover-lift text-white"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {editingData ? 'Perbarui Data' : 'Simpan Laporan'}
              </Button>
              
              {editingData && onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 glass-button hover-lift"
                  size="lg"
                >
                  Batal
                </Button>
              )}
            </motion.div>
          </form>
        </CardContent>
      </Card>
          </motion.div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <AIAssistant
              formData={formData}
              onSuggestion={handleAISuggestion}
              onValidation={handleAIValidation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};