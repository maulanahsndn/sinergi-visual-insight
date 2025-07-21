import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InterviewData } from '@/types/interview';
import { Search, Users, Calendar, Award, ArrowLeft } from 'lucide-react';

interface ClientViewProps {
  data: InterviewData[];
  onBack: () => void;
}

export const ClientView = ({ data, onBack }: ClientViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(interview =>
    interview.kandidat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.posisiSaatIni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOverallScore = (scores: InterviewData['penilaian']) => {
    const values = Object.values(scores);
    const total = values.reduce((sum, score) => {
      const scoreMap = { A: 4, B: 3, C: 2, D: 1 };
      return sum + (scoreMap[score as keyof typeof scoreMap] || 0);
    }, 0);
    return (total / values.length).toFixed(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 3.5) return 'text-green-400';
    if (score >= 2.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="glass-button hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CLIENT VIEW
            </h1>
            <p className="text-muted-foreground">Tampilan untuk klien - hanya lihat data</p>
          </div>
        </div>
        <Badge variant="outline" className="glass-card border-glass-border/50 px-4 py-2">
          <Users className="w-4 h-4 mr-2" />
          {data.length} Kandidat
        </Badge>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Cari kandidat atau posisi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 glass-card border-glass-border/50 bg-glass/50"
        />
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Interview', value: data.length, icon: Users },
          { label: 'Rata-rata Skor', value: data.length > 0 ? (data.reduce((sum, item) => sum + parseFloat(getOverallScore(item.penilaian)), 0) / data.length).toFixed(1) : '0', icon: Award },
          { label: 'Interview Bulan Ini', value: data.filter(item => new Date(item.tanggalInterview).getMonth() === new Date().getMonth()).length, icon: Calendar },
          { label: 'Skor Tertinggi', value: data.length > 0 ? Math.max(...data.map(item => parseFloat(getOverallScore(item.penilaian)))).toFixed(1) : '0', icon: Award },
        ].map((stat, index) => (
          <Card key={index} className="glass-card border-glass-border/50 hover-lift">
            <CardContent className="p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <p className="text-2xl font-orbitron font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Data Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredData.map((interview, index) => {
          const overallScore = parseFloat(getOverallScore(interview.penilaian));
          return (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-glass-border/50 h-full hover-lift group">
                <CardHeader className="pb-3">
                  <CardTitle className="font-rajdhani font-bold text-lg text-foreground">
                    {interview.kandidat}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">{interview.posisiSaatIni}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tanggal Interview</span>
                    <span className="text-sm font-medium text-foreground">
                      {new Date(interview.tanggalInterview).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Skor Keseluruhan</span>
                      <span className={`text-lg font-orbitron font-bold ${getScoreColor(overallScore)}`}>
                        {overallScore}/4.0
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {Object.entries(interview.penilaian).map(([kategori, nilai]) => (
                        <div key={kategori} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground capitalize">
                            {kategori.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <Badge 
                            variant={nilai === 'A' ? 'default' : nilai === 'B' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {nilai}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {interview.catatan && (
                    <div className="pt-2 border-t border-glass-border/30">
                      <p className="text-xs text-muted-foreground italic">
                        "{interview.catatan.substring(0, 80)}..."
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">Tidak ada data yang ditemukan</p>
        </motion.div>
      )}
    </div>
  );
};