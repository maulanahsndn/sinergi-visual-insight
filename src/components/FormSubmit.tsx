import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config"; // Pastikan path ini benar, sesuaikan jika berbeda

const FormSubmit: React.FC = () => {
  const [nama, setNama] = useState("");
  const [total, setTotal] = useState(0);
  const [komunikasiNoted, setKomunikasiNoted] = useState("");
  const [kerjaSamaTimNoted, setKerjaSamaTimNoted] = useState("");
  const [kemampuanMengatasiMasalahNoted, setKemampuanMengatasiMasalahNoted] = useState("");
  const [pengetahuanTentangPosisiNoted, setPengetahuanTentangPosisiNoted] = useState("");
  const [sikapKepribadianNoted, setSikapKepribadianNoted] = useState("");
  const [catatanTambahan, setCatatanTambahan] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "laporan_wawancara"), {
        nama,
        total,
        tanggal: new Date().toISOString(),
        komunikasiNoted,
        kerjaSamaTimNoted,
        kemampuanMengatasiMasalahNoted,
        pengetahuanTentangPosisiNoted,
        sikapKepribadianNoted,
        catatanTambahan,
      });

      alert("Laporan berhasil dikirim!");

      // Reset form
      setNama("");
      setTotal(0);
      setKomunikasiNoted("");
      setKerjaSamaTimNoted("");
      setKemampuanMengatasiMasalahNoted("");
      setPengetahuanTentangPosisiNoted("");
      setSikapKepribadianNoted("");
      setCatatanTambahan("");
    } catch (error) {
      console.error("Gagal mengirim laporan:", error);
      alert("Gagal mengirim laporan. Silakan coba lagi.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-6 bg-black text-white"
    >
      {/* Komunikasi */}
      <div className="flex flex-col col-span-1">
        <label className="font-semibold text-emerald-400 mb-1">🗣️ Komunikasi *</label>
        <textarea
          value={komunikasiNoted}
          onChange={(e) => setKomunikasiNoted(e.target.value)}
          placeholder="Catat hasil wawancara tentang komunikasi kandidat..."
          className="bg-gray-900 border border-emerald-600 text-white p-3 rounded-md"
          rows={3}
          required
        />
      </div>

      {/* Kerja Sama Tim */}
      <div className="flex flex-col col-span-1">
        <label className="font-semibold text-emerald-400 mb-1">🤝 Kerja Sama Tim *</label>
        <textarea
          value={kerjaSamaTimNoted}
          onChange={(e) => setKerjaSamaTimNoted(e.target.value)}
          placeholder="Catat hasil kerja sama tim kandidat..."
          className="bg-gray-900 border border-emerald-600 text-white p-3 rounded-md"
          rows={3}
          required
        />
      </div>

      {/* Kemampuan Mengatasi Masalah */}
      <div className="flex flex-col col-span-1">
        <label className="font-semibold text-emerald-400 mb-1">❎ Kemampuan Mengatasi Masalah *</label>
        <textarea
          value={kemampuanMengatasiMasalahNoted}
          onChange={(e) => setKemampuanMengatasiMasalahNoted(e.target.value)}
          placeholder="Catat kemampuan mengatasi masalah..."
          className="bg-gray-900 border border-emerald-600 text-white p-3 rounded-md"
          rows={3}
          required
        />
      </div>

      {/* Pengetahuan Tentang Posisi */}
      <div className="flex flex-col col-span-1">
        <label className="font-semibold text-emerald-400 mb-1">📚 Pengetahuan Tentang Posisi *</label>
        <textarea
          value={pengetahuanTentangPosisiNoted}
          onChange={(e) => setPengetahuanTentangPosisiNoted(e.target.value)}
          placeholder="Catat pemahaman kandidat terhadap posisi..."
          className="bg-gray-900 border border-emerald-600 text-white p-3 rounded-md"
          rows={3}
          required
        />
      </div>

      {/* Sikap & Kepribadian */}
      <div className="flex flex-col col-span-1">
        <label className="font-semibold text-emerald-400 mb-1">😊 Sikap & Kepribadian *</label>
        <textarea
          value={sikapKepribadianNoted}
          onChange={(e) => setSikapKepribadianNoted(e.target.value)}
          placeholder="Catat sikap dan kepribadian kandidat..."
          className="bg-gray-900 border border-emerald-600 text-white p-3 rounded-md"
          rows={3}
          required
        />
      </div>

      {/* Catatan Tambahan */}
      <div className="flex flex-col col-span-full">
        <label className="font-semibold text-emerald-400 mb-1">📝 Catatan Tambahan</label>
        <textarea
          value={catatanTambahan}
          onChange={(e) => setCatatanTambahan(e.target.value)}
          placeholder="Tulis kesan, rekomendasi, atau saran lainnya..."
          className="bg-gray-900 border border-emerald-600 text-white p-3 rounded-md"
          rows={4}
        />
      </div>

      {/* Nama */}
      <div className="flex flex-col col-span-full">
        <label className="font-semibold text-emerald-400 mb-1">👤 Nama Kandidat *</label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Masukkan nama kandidat"
          className="bg-gray-900 border border-emerald-600 text-white p-3 rounded-md"
          required
        />
      </div>

      {/* Total Nilai */}
      <div className="flex flex-col col-span-full">
        <label className="font-semibold text-emerald-400 mb-1">📊 Total Skor *</label>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
          placeholder="Total nilai akhir"
          className="bg-gray-900 border border-emerald-600 text-white p-3 rounded-md"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 col-span-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-md transition"
      >
        💾 Simpan Laporan
      </button>
    </form>
  );
};

export default FormSubmit;
