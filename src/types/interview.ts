export interface InterviewData {
  id: string;
  kandidat: string;
  posisiSaatIni: string;
  tanggalInterview: string;
  penilaian: {
    komunikasi: 'A' | 'B' | 'C' | 'D';
    pengetahuanPosisi: 'A' | 'B' | 'C' | 'D';
    kerjaSamaTim: 'A' | 'B' | 'C' | 'D';
    sikapKepribadian: 'A' | 'B' | 'C' | 'D';
    kemampuanMengatasi: 'A' | 'B' | 'C' | 'D';
  };
  catatan: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  kandidat: string;
  posisiSaatIni: string;
  tanggalInterview: string;
  penilaian: {
    komunikasi: 'A' | 'B' | 'C' | 'D' | '';
    pengetahuanPosisi: 'A' | 'B' | 'C' | 'D' | '';
    kerjaSamaTim: 'A' | 'B' | 'C' | 'D' | '';
    sikapKepribadian: 'A' | 'B' | 'C' | 'D' | '';
    kemampuanMengatasi: 'A' | 'B' | 'C' | 'D' | '';
  };
  catatan: string;
}

export type FilterType = 'all' | 'A' | 'B' | 'C' | 'D';
export type SortType = 'newest' | 'oldest' | 'name' | 'position';