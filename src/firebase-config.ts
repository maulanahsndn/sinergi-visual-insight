// src/firebase/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Konfigurasi Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyAuVrRZeYjsUEV7cK_wEPrUZzqiRWK5580",
  authDomain: "data-wawancara.firebaseapp.com",
  projectId: "data-wawancara",
  storageBucket: "data-wawancara.appspot.com",
  messagingSenderId: "446349786210",
  appId: "1:446349786210:web:dd509a3e57a2798fcca53b",
  measurementId: "G-0RGYFY7VSH"
};

// Inisialisasi Firebase dan layanan yang dibutuhkan
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Ekspor layanan Firebase yang diperlukan
export { db, analytics };
