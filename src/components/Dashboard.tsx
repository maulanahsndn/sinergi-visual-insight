import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Trash2, 
  Edit3, 
  Eye, 
  Users,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { InterviewData, FilterType, SortType } from '@/types/interview';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DashboardProps {
  data: InterviewData[];
  onEdit: (interview: InterviewData) => void;
  onDelete: (id: string) => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

const gradeColors = {
  A: 'bg-green-500/20 text-green-400 border-green-500/30',
  B: 'bg-blue-500/20 text-blue-400 border-blue-500/30', 
  C: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  D: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  onEdit, 
  onDelete, 
  onExportPDF, 
  onExportExcel 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [selectedInterview, setSelectedInterview] = useState<InterviewData | null>(null);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalInterviews = data.length;
    const gradeDistribution = data.reduce((acc, interview) => {
      const grades = Object.values(interview.penilaian);
      grades.forEach(grade => {
        acc[grade] = (acc[grade] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const averageGrades = data.map(interview => {
      const grades = Object.values(interview.penilaian);
      const gradeValues = grades.map(g => ({ A: 4, B: 3, C: 2, D: 1 }[g] || 0));
      return gradeValues.reduce((sum, val) => sum + val, 0) / gradeValues.length;
    });

    const overallAverage = averageGrades.reduce((sum, avg) => sum + avg, 0) / averageGrades.length;

    return {
      total: totalInterviews,
      gradeDistribution,
      averageScore: overallAverage.toFixed(1),
      recentCount: data.filter(interview => {
        const interviewDate = new Date(interview.tanggalInterview);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return interviewDate >= weekAgo;
      }).length
    };
  }, [data]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = data.filter(interview => {
      const matchesSearch = 
        interview.kandidat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.posisiSaatIni.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterGrade === 'all' || 
        Object.values(interview.penilaian).some(grade => grade === filterGrade);
      
      return matchesSearch && matchesFilter;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.tanggalInterview).getTime() - new Date(a.tanggalInterview).getTime();
        case 'oldest':
          return new Date(a.tanggalInterview).getTime() - new Date(b.tanggalInterview).getTime();
        case 'name':
          return a.kandidat.localeCompare(b.kandidat);
        case 'position':
          return a.posisiSaatIni.localeCompare(b.posisiSaatIni);
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, filterGrade, sortBy]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data interview ${name}?`)) {
      onDelete(id);
      toast.success('Data berhasil dihapus');
    }
  };

  const getAverageGrade = (interview: InterviewData) => {
    const grades = Object.values(interview.penilaian);
    const gradeValues = grades.map(g => ({ A: 4, B: 3, C: 2, D: 1 }[g] || 0));
    const average = gradeValues.reduce((sum, val) => sum + val, 0) / gradeValues.length;
    
    if (average >= 3.5) return 'A';
    if (average >= 2.5) return 'B';
    if (average >= 1.5) return 'C';
    return 'D';
  };

  return (
    <div className="min-h-screen bg-background py-12" id="dashboard">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-poppins font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Dashboard Interview
          </h2>
          <p className="text-xl text-muted-foreground">
            Kelola dan analisis semua data hasil interview
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-card border-glass-border/50 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Interview</p>
                  <p className="text-3xl font-bold text-primary">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border/50 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Rata-rata Skor</p>
                  <p className="text-3xl font-bold text-accent">{stats.averageScore}</p>
                </div>
                <Award className="w-8 h-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border/50 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Minggu Ini</p>
                  <p className="text-3xl font-bold text-green-400">{stats.recentCount}</p>
                </div>
                <Clock className="w-8 h-8 text-green-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border/50 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Grade A</p>
                  <p className="text-3xl font-bold text-green-400">{stats.gradeDistribution.A || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400/50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card border-glass-border/50 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama kandidat atau posisi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card border-glass-border/50 focus:neon-glow"
                />
              </div>

              <Select value={filterGrade} onValueChange={(value: FilterType) => setFilterGrade(value)}>
                <SelectTrigger className="w-full sm:w-[150px] glass-card border-glass-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border/50">
                  <SelectItem value="all">Semua Grade</SelectItem>
                  <SelectItem value="A">Grade A</SelectItem>
                  <SelectItem value="B">Grade B</SelectItem>
                  <SelectItem value="C">Grade C</SelectItem>
                  <SelectItem value="D">Grade D</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortType) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-[150px] glass-card border-glass-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border/50">
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="oldest">Terlama</SelectItem>
                  <SelectItem value="name">Nama A-Z</SelectItem>
                  <SelectItem value="position">Posisi A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onExportPDF}
                variant="outline"
                className="glass-button hover-lift"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button
                onClick={onExportExcel}
                variant="outline"
                className="glass-button hover-lift"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card border-glass-border/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-glass/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-primary">Kandidat</th>
                  <th className="text-left p-4 font-semibold text-primary">Posisi</th>
                  <th className="text-left p-4 font-semibold text-primary">Tanggal</th>
                  <th className="text-center p-4 font-semibold text-primary">Rata-rata</th>
                  <th className="text-center p-4 font-semibold text-primary">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((interview, index) => (
                  <motion.tr
                    key={interview.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-glass-border/30 hover:bg-glass/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-foreground">{interview.kandidat}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {interview.catatan.slice(0, 50)}...
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="glass-card border-glass-border/50">
                        {interview.posisiSaatIni}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {format(new Date(interview.tanggalInterview), 'dd MMM yyyy', { locale: id })}
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={cn("text-sm", gradeColors[getAverageGrade(interview) as keyof typeof gradeColors])}>
                        {getAverageGrade(interview)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedInterview(interview)}
                          className="hover:bg-primary/20"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(interview)}
                          className="hover:bg-blue-500/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(interview.id, interview.kandidat)}
                          className="hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Tidak ada data interview ditemukan</p>
              <p className="text-muted-foreground">
                {searchTerm || filterGrade !== 'all' 
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Mulai tambahkan data interview pertama Anda'
                }
              </p>
            </div>
          )}
        </motion.div>

        {/* Detail Modal */}
        {selectedInterview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInterview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card border-glass-border/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-primary">Detail Interview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInterview(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Kandidat</p>
                    <p className="text-lg font-semibold">{selectedInterview.kandidat}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posisi Saat Ini</p>
                    <p className="text-lg font-semibold">{selectedInterview.posisiSaatIni}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Interview</p>
                    <p className="text-lg font-semibold">
                      {format(new Date(selectedInterview.tanggalInterview), 'dd MMMM yyyy', { locale: id })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rata-rata Grade</p>
                    <Badge className={cn("text-lg font-bold", gradeColors[getAverageGrade(selectedInterview) as keyof typeof gradeColors])}>
                      {getAverageGrade(selectedInterview)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Penilaian Kompetensi</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(selectedInterview.penilaian).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 glass-card border-glass-border/30 rounded-lg">
                        <span className="text-sm font-medium">
                          {key === 'komunikasi' && 'Komunikasi'}
                          {key === 'pengetahuanPosisi' && 'Pengetahuan Posisi'}
                          {key === 'kerjaSamaTim' && 'Kerja Sama Tim'}
                          {key === 'sikapKepribadian' && 'Sikap & Kepribadian'}
                          {key === 'kemampuanMengatasi' && 'Kemampuan Mengatasi'}
                        </span>
                        <Badge className={cn("text-sm", gradeColors[value as keyof typeof gradeColors])}>
                          {value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Catatan</p>
                  <div className="glass-card border-glass-border/30 p-4 rounded-lg">
                    <p className="text-foreground leading-relaxed">
                      {selectedInterview.catatan || 'Tidak ada catatan tambahan'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};