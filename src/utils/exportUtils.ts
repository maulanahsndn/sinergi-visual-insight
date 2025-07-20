import { InterviewData } from '@/types/interview';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = (data: InterviewData[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Laporan Hasil Interview', 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Digenerate pada: ${format(new Date(), 'dd MMMM yyyy', { locale: id })}`, 20, 30);
  
  // Prepare table data
  const tableData = data.map((interview, index) => [
    index + 1,
    interview.kandidat,
    interview.posisiSaatIni,
    format(new Date(interview.tanggalInterview), 'dd/MM/yyyy'),
    interview.penilaian.komunikasi,
    interview.penilaian.pengetahuanPosisi,
    interview.penilaian.kerjaSamaTim,
    interview.penilaian.sikapKepribadian,
    interview.penilaian.kemampuanMengatasi,
    interview.catatan.slice(0, 50) + (interview.catatan.length > 50 ? '...' : '')
  ]);
  
  // Add table
  doc.autoTable({
    head: [[
      'No',
      'Nama Kandidat',
      'Posisi',
      'Tanggal',
      'Komunikasi',
      'Pengetahuan',
      'Kerja Tim',
      'Sikap',
      'Problem Solving',
      'Catatan'
    ]],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [71, 85, 105],
      textColor: 255
    },
    columnStyles: {
      9: { cellWidth: 30 } // Catatan column
    }
  });
  
  // Save the PDF
  doc.save(`laporan-interview-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportToExcel = (data: InterviewData[]) => {
  // Prepare data for Excel
  const excelData = data.map((interview, index) => ({
    'No': index + 1,
    'Nama Kandidat': interview.kandidat,
    'Posisi Saat Ini': interview.posisiSaatIni,
    'Tanggal Interview': format(new Date(interview.tanggalInterview), 'dd/MM/yyyy'),
    'Komunikasi': interview.penilaian.komunikasi,
    'Pengetahuan Posisi': interview.penilaian.pengetahuanPosisi,
    'Kerja Sama Tim': interview.penilaian.kerjaSamaTim,
    'Sikap & Kepribadian': interview.penilaian.sikapKepribadian,
    'Kemampuan Mengatasi Masalah': interview.penilaian.kemampuanMengatasi,
    'Catatan': interview.catatan,
    'Dibuat': format(new Date(interview.createdAt), 'dd/MM/yyyy HH:mm'),
    'Diperbarui': format(new Date(interview.updatedAt), 'dd/MM/yyyy HH:mm')
  }));
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths
  const columnWidths = [
    { wch: 5 },   // No
    { wch: 20 },  // Nama Kandidat
    { wch: 20 },  // Posisi
    { wch: 15 },  // Tanggal
    { wch: 12 },  // Komunikasi
    { wch: 15 },  // Pengetahuan
    { wch: 12 },  // Kerja Tim
    { wch: 15 },  // Sikap
    { wch: 18 },  // Problem Solving
    { wch: 40 },  // Catatan
    { wch: 15 },  // Dibuat
    { wch: 15 }   // Diperbarui
  ];
  
  ws['!cols'] = columnWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan Interview');
  
  // Save the file
  XLSX.writeFile(wb, `laporan-interview-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};