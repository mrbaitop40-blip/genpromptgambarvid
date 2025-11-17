export const RACE_OPTIONS = [
    "Indonesia",
    "Indonesia-Jawa",
    "Indonesia-Sunda",
    "Indonesia-Minang",
    "Indonesia-Batak",
    "Indonesia-Padang",
    "Indonesia-Melayu",
    "Indonesia-Bugis",
    "Indonesia-Dayak",
    "Indonesia-Asmat",
    "Asia Tenggara",
    "Asia Timur",
    "Asia Selatan",
    "Timur Tengah",
    "Arab",
    "Afrika",
    "Eropa",
    "Hispanik/Latin",
    "Pribumi Amerika",
    "Lainnya..."
];
export const GENDER_OPTIONS = ["Pria", "Wanita", "Non-Biner"];
export const VOICE_OPTIONS = ["Alto", "Bass", "Baritone", "Contralto", "Mezzo-soprano", "Soprano", "Tenor", "Serak", "Lembut", "Jernih", "Robotik"];

export const LIGHTING_OPTIONS = [
  { value: "cinematic lighting", description: "Pencahayaan dramatis seperti di film, kontras tinggi." },
  { value: "natural light", description: "Cahaya alami dari matahari atau bulan." },
  { value: "soft light", description: "Cahaya lembut dengan bayangan halus, cocok untuk potret." },
  { value: "dramatic lighting", description: "Kontras tajam antara area terang dan gelap." },
  { value: "studio lighting", description: "Pencahayaan terkontrol seperti di studio foto." },
  { value: "golden hour", description: "Cahaya hangat dan keemasan saat matahari terbit/terbenam." },
  { value: "blue hour", description: "Cahaya biru sejuk setelah matahari terbenam/sebelum terbit." },
  { value: "neon lighting", description: "Pencahayaan dari lampu neon berwarna-warni." },
  { value: "low-key lighting", description: "Didominasi bayangan dan area gelap, menciptakan misteri." },
  { value: "high-key lighting", description: "Sangat terang dengan sedikit bayangan, menciptakan suasana ceria." },
];

export const CAMERA_ANGLE_OPTIONS = [
  { value: "eye-level shot", description: "Kamera sejajar dengan mata subjek, sudut pandang normal." },
  { value: "low angle shot", description: "Kamera lebih rendah dari subjek, membuatnya terlihat kuat/dominan." },
  { value: "high angle shot", description: "Kamera lebih tinggi dari subjek, membuatnya terlihat lemah/rentan." },
  { value: "dutch angle/tilt", description: "Kamera miring, menciptakan ketegangan atau disorientasi." },
  { value: "bird's-eye view", description: "Tampilan dari atas langsung, seperti mata burung." },
  { value: "worm's-eye view", description: "Tampilan dari bawah sekali, seperti mata cacing." },
  { value: "over-the-shoulder shot", description: "Pengambilan gambar dari belakang bahu satu karakter, fokus pada karakter lain." },
];

export const SHOT_TYPE_OPTIONS = [
  { value: "wide shot", description: "Menampilkan subjek sepenuhnya dalam lingkungannya." },
  { value: "long shot", description: "Subjek terlihat dari kepala hingga kaki, lingkungan masih dominan." },
  { value: "full shot", description: "Bingkai pas dengan subjek dari kepala hingga kaki." },
  { value: "medium shot", description: "Menampilkan subjek dari pinggang ke atas." },
  { value: "close-up shot", description: "Menampilkan wajah subjek untuk menekankan emosi." },
  { value: "extreme close-up", description: "Fokus pada detail kecil, seperti mata atau bibir." },
  { value: "establishing shot", description: "Biasanya wide shot di awal adegan untuk menunjukkan lokasi." },
  { value: "point of view (POV) shot", description: "Menampilkan adegan dari sudut pandang karakter." },
  { value: "tracking shot", description: "Kamera bergerak mengikuti subjek yang bergerak." },
  { value: "dolly zoom", description: "Efek vertigo, latar belakang berubah sementara subjek tetap." },
  { value: "handheld shot", description: "Kamera dipegang tangan, menciptakan kesan realistis/goyah." },
];