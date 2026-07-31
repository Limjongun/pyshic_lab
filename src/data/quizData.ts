export interface Question {
  id: number;
  module: string;
  moduleId: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const QUIZ_DATA: Question[] = [
  // ================= MODULE 1: KINEMATIKA =================
  {
    id: 1,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Manakah pernyataan di bawah ini yang paling tepat tentang kelajuan dan kecepatan?",
    options: [
      "Kelajuan adalah vektor, kecepatan adalah skalar",
      "Kelajuan memiliki arah, sedangkan kecepatan tidak",
      "Kelajuan mengukur jarak tempuh, sedangkan kecepatan mengukur perpindahan beserta arahnya",
      "Keduanya persis sama dalam ilmu fisika"
    ],
    correct: 2,
    explanation: "Kelajuan adalah besaran skalar (hanya punya nilai) yang berhubungan dengan jarak, sedangkan Kecepatan adalah besaran vektor (punya nilai dan arah) yang berhubungan dengan perpindahan."
  },
  {
    id: 2,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Sebuah mobil bergerak ke utara sejauh 40 km, lalu berbelok ke selatan sejauh 40 km. Berapakah perpindahan total mobil tersebut?",
    options: ["80 km", "40 km", "0 km", "160 km"],
    correct: 2,
    explanation: "Perpindahan dihitung dari titik awal ke titik akhir. Karena mobil kembali ke tempat semula (ke utara lalu kembali ke selatan sejauh yang sama), posisinya tidak berubah, sehingga perpindahannya 0 km."
  },
  {
    id: 3,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Ciri utama dari Gerak Lurus Beraturan (GLB) adalah...",
    options: ["Percepatan konstan", "Kecepatan berubah beraturan", "Kecepatan selalu tetap dan percepatan nol", "Percepatan semakin meningkat"],
    correct: 2,
    explanation: "Dalam GLB, benda tidak mengalami percepatan (a = 0), sehingga laju dan arahnya alias kecepatannya (v) selalu tetap dan konstan."
  },
  {
    id: 4,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Apa nama alat ukur yang biasa digunakan di kendaraan untuk mengukur kelajuan?",
    options: ["Odometer", "Speedometer", "Akselerometer", "Velocimeter"],
    correct: 1,
    explanation: "Speedometer hanya mengukur seberapa cepat laju (speed/kelajuan) sesaat roda kendaraan berputar, tanpa mempedulikan arah ke mana kendaraan itu menuju."
  },
  {
    id: 5,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Rumus matematis dari percepatan adalah...",
    options: ["a = (v₂ - v₁) / t", "a = s / t", "a = v × t", "a = m × g"],
    correct: 0,
    explanation: "Percepatan (a) adalah selisih atau perubahan kecepatan (dari v₁ menjadi v₂) dibagi dengan waktu (t) yang dibutuhkan untuk berubah."
  },
  {
    id: 6,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Buah kelapa yang jatuh bebas dari pohon merupakan contoh gerak...",
    options: ["Gerak Lurus Beraturan (GLB)", "Gerak Melingkar Beraturan (GMB)", "Gerak Lurus Berubah Beraturan (GLBB) Dipercepat", "Gerak Lurus Berubah Beraturan (GLBB) Diperlambat"],
    correct: 2,
    explanation: "Jatuh bebas adalah GLBB dipercepat karena buah kelapa ditarik oleh gravitasi bumi secara terus-menerus, sehingga makin ke bawah lajunya makin cepat."
  },
  {
    id: 7,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Jika nilai percepatan bernilai negatif (-), hal ini menandakan bahwa benda tersebut...",
    options: ["Bergerak mundur", "Mengalami perlambatan (pengereman)", "Sedang diam", "Kecepatannya terus bertambah"],
    correct: 1,
    explanation: "Percepatan negatif sering disebut perlambatan. Artinya, kecepatan benda tersebut semakin lama semakin berkurang (misalnya saat di-rem)."
  },
  {
    id: 8,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Satuan Internasional (SI) untuk percepatan adalah...",
    options: ["m/s", "km/jam", "m/s²", "Newton"],
    correct: 2,
    explanation: "Satuan SI percepatan adalah meter per sekon kuadrat (m/s²), yang melambangkan berapa meter per sekon pertambahan kecepatan yang terjadi setiap detiknya."
  },
  {
    id: 9,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Syarat mutlak untuk dapat menyatakan bahwa suatu benda bergerak adalah adanya...",
    options: ["Gaya", "Massa", "Kecepatan tinggi", "Titik Acuan"],
    correct: 3,
    explanation: "Gerak bersifat relatif. Sebuah benda hanya bisa dikatakan bergerak jika ada 'Titik Acuan' yang diamati mengalami perubahan jarak atau posisi dari benda tersebut."
  },
  {
    id: 10,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Garis lintasan lurus yang dibentuk oleh pesawat jet yang melaju dengan laju 900 km/jam stabil tanpa di-gas atau di-rem adalah penerapan dari...",
    options: ["Gerak Lurus Berubah Beraturan", "Gerak Relatif", "Gerak Parabola", "Gerak Lurus Beraturan"],
    correct: 3,
    explanation: "Laju tetap (stabil 900km/jam) di lintasan yang lurus adalah syarat mutlak dari Gerak Lurus Beraturan (GLB)."
  },

  // ================= MODULE 2: DINAMIKA =================
  {
    id: 11,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Hukum Pertama Newton (Hukum Kelembaman/Inersia) menyatakan bahwa...",
    options: [
      "Setiap aksi memiliki reaksi yang berlawanan",
      "Percepatan sebanding dengan gaya",
      "Benda akan tetap diam atau bergerak lurus beraturan jika resultan gaya sama dengan nol",
      "Massa benda akan selalu bertambah seiring kecepatan"
    ],
    correct: 2,
    explanation: "Hukum I Newton berbunyi: Jika total gaya yang bekerja bernilai nol (ΣF=0), benda yang diam akan tetap diam, dan benda yang bergerak lurus beraturan akan terus bergerak."
  },
  {
    id: 12,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Rumus Matematis yang paling menggambarkan Hukum II Newton adalah...",
    options: ["W = m × g", "F = m × a", "F₁ = -F₂", "s = v × t"],
    correct: 1,
    explanation: "Hukum II Newton menyatakan Gaya total (F) sama dengan massa benda (m) dikali percepatannya (a)."
  },
  {
    id: 13,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Peristiwa tangan terasa sakit saat meninju tembok dengan keras paling tepat dijelaskan menggunakan...",
    options: ["Hukum Gravitasi", "Hukum I Newton", "Hukum II Newton", "Hukum III Newton"],
    correct: 3,
    explanation: "Hukum III Newton (Aksi-Reaksi). Pukulanmu ke tembok adalah Aksi, dan tembok akan memberikan gaya Reaksi memukul tanganmu dengan kekuatan yang persis sama ke arah yang berlawanan."
  },
  {
    id: 14,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Manakah pernyataan yang benar mengenai Massa dan Berat?",
    options: [
      "Massa bergantung gravitasi, berat tetap",
      "Massa tetap di manapun, berat bergantung pada gravitasi",
      "Massa dan berat adalah hal yang sama dalam fisika",
      "Berat diukur dalam Kilogram, massa diukur dalam Newton"
    ],
    correct: 1,
    explanation: "Massa (kilogram) adalah jumlah partikel materi di tubuhmu, sifatnya selalu tetap. Berat (Newton) adalah gaya tarik bumi/planet ke tubuhmu, yang bisa berubah jika gravitasinya berbeda."
  },
  {
    id: 15,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Gaya yang muncul antara dua permukaan yang bersentuhan dan selalu melawan arah gerak benda disebut...",
    options: ["Gaya Normal", "Gaya Pegas", "Gaya Magnet", "Gaya Gesek"],
    correct: 3,
    explanation: "Gaya Gesek (Friction) terjadi saat dua benda bergesekan, dan arahnya selalu menghambat atau berlawanan arah dengan arah laju benda."
  },
  {
    id: 16,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Sebuah mobil mogok ddorong dengan gaya 500 N, namun mobil tetap diam. Hal ini terjadi karena...",
    options: [
      "Gaya dorong lebih besar dari gaya gesek",
      "Gaya dorong diimbangi oleh gaya gesek statis yang besarnya sama",
      "Gaya normal menghancurkan gaya dorong",
      "Mobil tersebut kehilangan massa jenisnya"
    ],
    correct: 1,
    explanation: "Sesuai Hukum I Newton, jika benda tetap diam, artinya resultan gayanya nol. Gaya dorongmu 500N ke depan di-cancel atau dibatalkan oleh Gaya Gesek Statis ban ke jalan sebesar 500N ke belakang."
  },
  {
    id: 17,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Apa satuan ukur yang digunakan untuk menyatakan nilai dari Berat (W) sebuah benda?",
    options: ["Kilogram (kg)", "Newton (N)", "Joule (J)", "Pascal (Pa)"],
    correct: 1,
    explanation: "Dalam fisika, Berat (Weight) adalah sebuah 'Gaya' tarik dari bumi, sehingga satuannya adalah sama dengan gaya, yaitu Newton (N)."
  },
  {
    id: 18,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Gaya Normal adalah gaya yang...",
    options: [
      "Menarik benda ke pusat bumi",
      "Tegak lurus dengan permukaan bidang tempat benda berada",
      "Sejajar dengan arah gerak benda",
      "Sama dengan nol saat berada di bidang miring"
    ],
    correct: 1,
    explanation: "Gaya Normal (N) adalah gaya reaksi permukaan (lantai/meja) yang mendorong benda ke atas agar benda tidak menembus jatuh ke dalam lantai. Arahnya selalu 90 derajat atau tegak lurus lantai."
  },
  {
    id: 19,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Bagaimana cara roket di ruang angkasa hampa udara bisa terdorong maju?",
    options: [
      "Mendorong udara dengan sayap kipasnya",
      "Ditarik oleh gravitasi planet terdekat",
      "Menyemburkan gas api ke belakang (Aksi), sehingga terdorong ke depan (Reaksi)",
      "Ruang hampa mengisap ruang mesin roket"
    ],
    correct: 2,
    explanation: "Ini murni aplikasi Hukum III Newton. Karena semburan massa gas api ke belakang sangat kuat, maka akan ada reaksi sebaliknya yang mendorong roket maju ke depan."
  },
  {
    id: 20,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Sebuah benda bermassa 10 kg didorong gaya 50 N di lantai licin (gesekan=0). Berapa percepatannya?",
    options: ["0.5 m/s²", "2 m/s²", "5 m/s²", "500 m/s²"],
    correct: 2,
    explanation: "Gunakan Hukum II Newton: a = F / m. Percepatan = 50 N dibagi 10 kg = 5 m/s²."
  },

  // ================= MODULE 3: ENERGI =================
  {
    id: 21,
    module: "Energi",
    moduleId: "energy",
    text: "Dalam tinjauan fisika, kamu dikatakan melakukan 'Usaha' (W) apabila...",
    options: [
      "Kamu berkeringat dan lelah",
      "Kamu mendorong benda dan benda itu berpindah tempat",
      "Kamu mendorong tembok sekuat tenaga tanpa bergerak sedikitpun",
      "Kamu memegang tas berat sambil berdiri diam di halte bus"
    ],
    correct: 1,
    explanation: "Usaha (W = F × s). Jika jarak perpindahannya nol (s=0), maka Usahanya dalam Fisika dianggap mutlak bernilai Nol, tidak peduli seberapa capek dirimu."
  },
  {
    id: 22,
    module: "Energi",
    moduleId: "energy",
    text: "Energi Kinetik sangat bergantung kepada dua faktor utama, yaitu...",
    options: ["Ketinggian dan Gravitasi", "Waktu dan Jarak", "Massa dan Kecepatan (Laju)", "Massa dan Waktu"],
    correct: 2,
    explanation: "Rumus Ek = ½ m v². Artinya Energi Kinetik sangat dipengaruhi oleh Massa (berat) benda dan Kuadrat Kecepatannya."
  },
  {
    id: 23,
    module: "Energi",
    moduleId: "energy",
    text: "Apel di pohon memiliki Energi Potensial karena...",
    options: ["Apel tersebut bergetar tertiup angin", "Memiliki kecepatan jatuh yang besar", "Posisinya berada pada ketinggian tertentu dari tanah", "Proses fotosintesis kimia"],
    correct: 2,
    explanation: "Energi Potensial Gravitasi (Ep = m × g × h) adalah 'energi cadangan' yang tersimpan dalam suatu benda hanya karena posisinya (Ketinggiannya / h) terhadap tanah."
  },
  {
    id: 24,
    module: "Energi",
    moduleId: "energy",
    text: "Hukum Kekekalan Energi menyatakan bahwa energi...",
    options: [
      "Dapat diciptakan dari kehampaan asalkan ada mesin canggih",
      "Dapat dihancurkan di dalam lubang hitam (black hole)",
      "Tidak dapat diciptakan maupun dimusnahkan, hanya dapat diubah bentuknya",
      "Selalu berkurang seiring berjalannya waktu"
    ],
    correct: 2,
    explanation: "Ini adalah dasar fundamental semesta. Energi total tidak pernah hilang, ia sekadar berubah wujud. Misalnya energi kinetik bergesekan dengan jalan berubah wujud menjadi energi panas."
  },
  {
    id: 25,
    module: "Energi",
    moduleId: "energy",
    text: "Sebuah batu dilempar ke atas. Apa yang terjadi saat batu mencapai titik paling puncak lintasan?",
    options: [
      "Energi Kinetik Maksimum, Energi Potensial Nol",
      "Energi Potensial Maksimum, Energi Kinetik Nol",
      "Keduanya bernilai Nol",
      "Keduanya bernilai Maksimum"
    ],
    correct: 1,
    explanation: "Di titik tertinggi, batu sejenak berhenti sebelum jatuh turun (Kecepatan = 0, jadi Energi Kinetik = 0). Namun ketinggiannya maksimal, sehingga Energi Potensialnya sedang penuh-penuhnya."
  },
  {
    id: 26,
    module: "Energi",
    moduleId: "energy",
    text: "Kemampuan untuk melakukan kerja (Usaha) tiap satu detik (satuan waktu) disebut...",
    options: ["Momentum", "Daya (Power)", "Energi Kinetik", "Gaya"],
    correct: 1,
    explanation: "Daya atau Power (P = W / t) menunjukkan seberapa cepat energi itu dibuang atau seberapa cepat sebuah mesin bisa melakukan usahanya."
  },
  {
    id: 27,
    module: "Energi",
    moduleId: "energy",
    text: "Satuan Internasional (SI) untuk mengukur Energi dan Usaha adalah...",
    options: ["Newton (N)", "Watt (W)", "Joule (J)", "Kelvin (K)"],
    correct: 2,
    explanation: "Joule (J) adalah standar ukuran energi di seluruh dunia. Newton untuk Gaya, dan Watt untuk Daya."
  },
  {
    id: 28,
    module: "Energi",
    moduleId: "energy",
    text: "Roller Coaster bergerak sangat kencang ketika turun dari bukit tajam berkat perubahan energi...",
    options: [
      "Kinetik menjadi Potensial",
      "Potensial menjadi Kinetik",
      "Mekanik menjadi Panas",
      "Listrik menjadi Magnet"
    ],
    correct: 1,
    explanation: "Di puncak bukit, kereta punya Energi Potensial raksasa. Saat ia meluncur ke bawah, energi itu dicairkan wujudnya berubah perlahan menjadi Energi Kinetik (gerak) yang luar biasa kencang."
  },
  {
    id: 29,
    module: "Energi",
    moduleId: "energy",
    text: "Rumus matematis dari Daya (Power) adalah...",
    options: ["P = W / t", "P = m × g", "P = F × s", "P = ½ m v²"],
    correct: 0,
    explanation: "Daya (P) = Usaha (W) dibagi dengan Waktu (t). Makin singkat waktu yang dipakai untuk usaha yang sama, berarti mesinmu punya Daya (Power) yang lebih superior."
  },
  {
    id: 30,
    module: "Energi",
    moduleId: "energy",
    text: "Jika kamu menuntun sepeda dengan gaya 10 N sejauh 5 meter, berapakah Usaha yang kamu lakukan?",
    options: ["50 Joule", "2 Joule", "15 Joule", "500 Joule"],
    correct: 0,
    explanation: "Gunakan rumus Usaha: W = F × s. W = 10 N × 5 m = 50 Joule."
  },
  {
    id: 31,
    module: "Energi",
    moduleId: "energy",
    text: "Sebuah benda memiliki massa 2 kg dan berada di ketinggian 5 meter. Jika percepatan gravitasi 10 m/s², berapakah energi potensialnya?",
    options: ["100 Joule", "50 Joule", "20 Joule", "10 Joule"],
    correct: 0,
    explanation: "Ep = m × g × h = 2 × 10 × 5 = 100 Joule."
  },
  {
    id: 32,
    module: "Energi",
    moduleId: "energy",
    text: "Energi kinetik dipengaruhi oleh...",
    options: ["Massa dan kecepatan", "Gaya dan waktu", "Usaha dan daya", "Ketinggian dan massa"],
    correct: 0,
    explanation: "Rumus energi kinetik adalah Ek = 1/2 m v², jadi dipengaruhi massa dan kecepatan."
  },
  {
    id: 33,
    module: "Energi",
    moduleId: "energy",
    text: "Satuan SI untuk energi adalah...",
    options: ["Newton", "Joule", "Watt", "Pascal"],
    correct: 1,
    explanation: "Satuan energi dalam SI adalah Joule (J)."
  },
  {
    id: 34,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Hukum Newton I menyatakan bahwa benda akan...",
    options: [
      "Selalu bergerak mempercepat",
      "Diam atau bergerak lurus beraturan jika tidak ada gaya luar",
      "Selalu berhenti ketika tidak ada gaya",
      "Berubah arah secara spontan"
    ],
    correct: 1,
    explanation: "Hukum I Newton (inersia) menyatakan benda tetap diam atau GLB jika tidak ada resultan gaya."
  },
  {
    id: 35,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Rumus Hukum II Newton adalah...",
    options: ["F = m/a", "F = m × v", "F = m × a", "F = a/m"],
    correct: 2,
    explanation: "Hukum II Newton menyatakan F = m × a."
  },
  {
    id: 36,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Jika gaya total pada benda adalah 0 N, maka benda akan...",
    options: [
      "Selalu berhenti",
      "Mengalami percepatan besar",
      "Diam atau bergerak lurus beraturan",
      "Berputar cepat"
    ],
    correct: 2,
    explanation: "Resultan gaya nol berarti tidak ada percepatan, sehingga benda diam atau GLB."
  },
  {
    id: 37,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Jika benda menempuh jarak 100 meter dalam 20 detik, maka kelajuannya adalah...",
    options: ["2 m/s", "5 m/s", "10 m/s", "20 m/s"],
    correct: 1,
    explanation: "v = s/t = 100/20 = 5 m/s."
  },
  {
    id: 38,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Perbedaan utama antara jarak dan perpindahan adalah...",
    options: [
      "Jarak memiliki arah, perpindahan tidak",
      "Jarak selalu lebih kecil",
      "Jarak tanpa arah, perpindahan dengan arah",
      "Keduanya sama"
    ],
    correct: 2,
    explanation: "Jarak adalah skalar (tanpa arah), perpindahan adalah vektor (dengan arah)."
  },
  {
    id: 39,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Gerak lurus dengan kecepatan tetap disebut...",
    options: [
      "GLBB",
      "GLB",
      "Gerak parabola",
      "Gerak melingkar"
    ],
    correct: 1,
    explanation: "GLB adalah gerak dengan kecepatan tetap tanpa percepatan."
  },
  {
    id: 40,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Satuan percepatan dalam SI adalah...",
    options: ["m/s", "m/s²", "N", "J"],
    correct: 1,
    explanation: "Satuan percepatan adalah meter per sekon kuadrat (m/s²)."
  },
  {
    id: 41,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Jika kamu berjalan 10 meter ke timur lalu kembali 10 meter ke barat, maka perpindahanmu adalah...",
    options: ["20 meter", "10 meter", "0 meter", "5 meter"],
    correct: 2,
    explanation: "Karena kembali ke titik awal, perpindahan = 0 meskipun jarak 20 meter."
  },
  {
    id: 42,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Dua orang bergerak dengan kecepatan sama, tapi arah berbeda. Maka yang sama dari keduanya adalah...",
    options: ["Perpindahan", "Kelajuan", "Arah gerak", "Gaya"],
    correct: 1,
    explanation: "Kelajuan hanya besarannya saja, tidak memperhatikan arah."
  },
  {
    id: 43,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Mobil A menempuh 100 m dalam 10 s, Mobil B 100 m dalam 20 s. Yang lebih cepat adalah...",
    options: ["Mobil B", "Mobil A", "Keduanya sama", "Tidak bisa ditentukan"],
    correct: 1,
    explanation: "Mobil A lebih cepat karena waktu lebih singkat untuk jarak sama."
  },
  {
    id: 44,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Jika gaya dorong diperbesar tetapi massa tetap, maka percepatan benda akan...",
    options: ["Berkurang", "Tetap", "Bertambah", "Menjadi nol"],
    correct: 2,
    explanation: "F = m × a, jika F naik dan m tetap maka a naik."
  },
  {
    id: 45,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Mengapa benda yang didorong di lantai akhirnya berhenti?",
    options: [
      "Karena gaya gravitasi hilang",
      "Karena ada gaya gesek yang melawan gerak",
      "Karena massa berubah",
      "Karena tidak ada energi"
    ],
    correct: 1,
    explanation: "Gaya gesek melawan arah gerak sehingga benda melambat dan berhenti."
  },
  {
    id: 46,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Jika tidak ada gaya bekerja pada benda yang bergerak, maka benda akan...",
    options: [
      "Berhenti langsung",
      "Berubah arah",
      "Tetap bergerak lurus dengan kecepatan tetap",
      "Melambat perlahan"
    ],
    correct: 2,
    explanation: "Hukum I Newton: benda mempertahankan geraknya jika tidak ada gaya luar."
  },
  {
    id: 47,
    module: "Energi",
    moduleId: "energy",
    text: "Jika ketinggian benda ditambah 2 kali lipat, maka energi potensialnya akan...",
    options: ["Tetap", "Berkurang", "Menjadi 2 kali lipat", "Menjadi 4 kali lipat"],
    correct: 2,
    explanation: "Ep = mgh, jika h naik 2x maka Ep juga naik 2x."
  },
  {
    id: 48,
    module: "Energi",
    moduleId: "energy",
    text: "Benda diam memiliki energi kinetik sebesar...",
    options: ["Maksimum", "Tidak bisa ditentukan", "Nol", "Sama dengan energi potensial"],
    correct: 2,
    explanation: "Ek = 1/2 m v², jika v = 0 maka Ek = 0."
  },
  {
    id: 49,
    module: "Energi",
    moduleId: "energy",
    text: "Jika usaha bernilai negatif, itu berarti gaya bekerja...",
    options: [
      "Searah perpindahan",
      "Berlawanan arah perpindahan",
      "Tidak ada gerakan",
      "Tidak ada gaya"
    ],
    correct: 1,
    explanation: "Usaha negatif terjadi jika gaya berlawanan dengan arah perpindahan."
  },
  {
    id: 50,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Sebuah benda bergerak dengan kecepatan tetap tetapi berubah arah terus, ini berarti...",
    options: [
      "GLB",
      "GLBB",
      "Gerak melingkar",
      "Tidak bergerak"
    ],
    correct: 2,
    explanation: "Gerak dengan arah berubah terus meskipun cepat tetap adalah gerak melingkar."
  },
  {
    id: 51,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Jika jarak yang ditempuh sama tetapi waktu A lebih kecil dari B, maka...",
    options: [
      "A lebih lambat dari B",
      "A lebih cepat dari B",
      "A dan B sama cepat",
      "Tidak bisa dibandingkan"
    ],
    correct: 1,
    explanation: "Kecepatan = jarak/waktu, waktu lebih kecil berarti lebih cepat."
  },
  {
    id: 52,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Jika benda bergerak lurus tetapi kecepatannya berubah-ubah, maka jenis geraknya adalah...",
    options: ["GLB", "GLBB", "Gerak diam", "Gerak statis"],
    correct: 1,
    explanation: "Perubahan kecepatan menandakan GLBB."
  },
  {
    id: 53,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Ketika mobil mulai dari diam lalu semakin cepat, maka percepatannya...",
    options: ["Negatif", "Nol", "Positif", "Tidak ada"],
    correct: 2,
    explanation: "Kecepatan meningkat berarti percepatan positif."
  },
  {
    id: 54,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Seseorang berjalan 5 m ke utara lalu 5 m ke selatan dalam waktu sama, maka kelajuannya...",
    options: ["0", "Tidak bisa dihitung", "Ada, tetapi perpindahan nol", "Sama dengan kecepatan"],
    correct: 2,
    explanation: "Kelajuan tetap ada karena jarak ditempuh, walau perpindahan nol."
  },
  {
    id: 55,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Jika massa benda diperbesar 2 kali tetapi gaya tetap, maka percepatan...",
    options: ["Naik 2 kali", "Turun 2 kali", "Tetap", "Menjadi nol"],
    correct: 1,
    explanation: "F = m × a → jika m naik, a turun."
  },
  {
    id: 56,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Mengapa tubuh kita terdorong ke belakang saat bus tiba-tiba berhenti?",
    options: [
      "Karena gaya gravitasi",
      "Karena inersia",
      "Karena gaya magnet",
      "Karena massa berkurang"
    ],
    correct: 1,
    explanation: "Inersia membuat tubuh mempertahankan gerak."
  },
  {
    id: 57,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Gaya aksi-reaksi selalu memiliki sifat...",
    options: [
      "Bekerja pada benda yang sama",
      "Besarnya sama arah sama",
      "Besarnya sama arah berlawanan",
      "Selalu menghasilkan gerak"
    ],
    correct: 2,
    explanation: "Hukum III Newton: aksi-reaksi sama besar berlawanan arah."
  },
  {
    id: 58,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Jika resultan gaya tidak nol, maka benda akan...",
    options: [
      "Diam selamanya",
      "Bergerak dengan kecepatan tetap",
      "Mengalami percepatan",
      "Menghilang"
    ],
    correct: 2,
    explanation: "Resultan gaya ≠ 0 → ada percepatan."
  },
  {
    id: 59,
    module: "Energi",
    moduleId: "energy",
    text: "Energi tidak dapat diciptakan atau dimusnahkan, tetapi hanya...",
    options: [
      "Dihilangkan",
      "Diubah bentuknya",
      "Dihentikan",
      "Dikurangi"
    ],
    correct: 1,
    explanation: "Hukum kekekalan energi: energi hanya berubah bentuk."
  },
  {
    id: 60,
    module: "Energi",
    moduleId: "energy",
    text: "Jika kecepatan benda naik 2 kali, maka energi kinetiknya menjadi...",
    options: ["2 kali", "4 kali", "8 kali", "Tetap"],
    correct: 1,
    explanation: "Ek ∝ v² → 2² = 4 kali."
  },
  {
    id: 61,
    module: "Energi",
    moduleId: "energy",
    text: "Lampu menyala mengubah energi listrik menjadi...",
    options: [
      "Energi kimia",
      "Energi cahaya dan panas",
      "Energi mekanik",
      "Energi nuklir"
    ],
    correct: 1,
    explanation: "Lampu mengubah listrik menjadi cahaya + panas."
  },
  {
    id: 62,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Grafik kecepatan terhadap waktu yang datar menunjukkan...",
    options: [
      "Percepatan tetap",
      "Kecepatan berubah",
      "Kecepatan konstan",
      "Benda diam"
    ],
    correct: 2,
    explanation: "Garis datar pada v-t berarti kecepatan tetap."
  },
  {
    id: 63,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Jika kecepatan awal nol dan benda bergerak dipercepat, maka geraknya termasuk...",
    options: ["GLB", "GLBB", "Gerak diam", "Gerak acak"],
    correct: 1,
    explanation: "Mulai dari diam dengan percepatan → GLBB."
  },
  {
    id: 64,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Semakin besar gaya gesek, maka gerak benda akan...",
    options: [
      "Semakin cepat",
      "Semakin lambat",
      "Tidak berubah",
      "Berputar"
    ],
    correct: 1,
    explanation: "Gaya gesek melawan gerak sehingga memperlambat."
  },
  {
    id: 65,
    module: "Energi",
    moduleId: "energy",
    text: "Satuan daya dalam SI adalah...",
    options: ["Joule", "Newton", "Watt", "Pascal"],
    correct: 2,
    explanation: "Daya (power) dalam SI adalah Watt."
  },
  {
    id: 66,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Jika dua benda menempuh jarak yang sama, tetapi benda A lebih cepat sampai, maka...",
    options: [
      "Benda A memiliki waktu lebih besar",
      "Benda A memiliki waktu lebih kecil",
      "Benda A tidak bergerak",
      "Tidak bisa dibandingkan"
    ],
    correct: 1,
    explanation: "Waktu lebih kecil → kecepatan lebih besar (v = s/t)."
  },
  {
    id: 67,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Perpindahan bisa bernilai nol jika benda...",
    options: [
      "Bergerak sangat cepat",
      "Tidak bergerak sama sekali",
      "Kembali ke titik awal",
      "Berjalan lurus"
    ],
    correct: 2,
    explanation: "Jika kembali ke titik awal, perpindahan = 0."
  },
  {
    id: 68,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Kecepatan akan bernilai negatif jika benda bergerak...",
    options: [
      "Lebih cepat",
      "Ke arah yang berlawanan dengan acuan",
      "Diam",
      "Membentuk lingkaran"
    ],
    correct: 1,
    explanation: "Negatif menunjukkan arah berlawanan dari acuan."
  },
  {
    id: 69,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Jika grafik posisi terhadap waktu berbentuk garis lurus miring, maka gerak benda adalah...",
    options: ["GLB", "GLBB", "Diam", "Tidak teratur"],
    correct: 0,
    explanation: "Garis lurus pada s-t → kecepatan konstan (GLB)."
  },
  {
    id: 70,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Jika gaya total searah dengan gerak benda, maka benda akan...",
    options: [
      "Melambat",
      "Berhenti",
      "Mempercepat",
      "Diam"
    ],
    correct: 2,
    explanation: "Gaya searah gerak → kecepatan meningkat."
  },
  {
    id: 71,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Mengapa benda di ruang angkasa bisa terus bergerak tanpa didorong?",
    options: [
      "Karena gravitasi besar",
      "Karena tidak ada gaya gesek",
      "Karena massa nol",
      "Karena energi habis"
    ],
    correct: 1,
    explanation: "Tidak ada gaya gesek → benda tetap bergerak (inersia)."
  },
  {
    id: 72,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Jika gaya yang bekerja sama besar tetapi berlawanan arah, maka resultan gaya adalah...",
    options: ["Maksimum", "Nol", "Negatif", "Tidak bisa ditentukan"],
    correct: 1,
    explanation: "Gaya seimbang → resultan nol."
  },
  {
    id: 73,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Semakin besar massa benda, maka benda akan...",
    options: [
      "Lebih mudah dipercepat",
      "Lebih sulit dipercepat",
      "Tidak bisa bergerak",
      "Selalu berhenti"
    ],
    correct: 1,
    explanation: "Massa besar → inersia besar → sulit dipercepat."
  },
  {
    id: 74,
    module: "Energi",
    moduleId: "energy",
    text: "Energi potensial paling besar dimiliki benda saat...",
    options: [
      "Di tanah",
      "Di ketinggian paling tinggi",
      "Diam di lantai",
      "Bergerak cepat"
    ],
    correct: 1,
    explanation: "Ep = mgh → makin tinggi makin besar."
  },
  {
    id: 75,
    module: "Energi",
    moduleId: "energy",
    text: "Jika usaha nol, maka kemungkinan yang terjadi adalah...",
    options: [
      "Tidak ada gaya sama sekali",
      "Tidak ada perpindahan",
      "Kecepatan besar",
      "Massa berubah"
    ],
    correct: 1,
    explanation: "W = F × s → jika s = 0 maka usaha = 0."
  },
  {
    id: 76,
    module: "Energi",
    moduleId: "energy",
    text: "Seseorang menaiki tangga, maka energi yang paling dominan meningkat adalah...",
    options: [
      "Energi kinetik",
      "Energi potensial",
      "Energi listrik",
      "Energi kimia hilang"
    ],
    correct: 1,
    explanation: "Naik ketinggian → energi potensial naik."
  },
  {
    id: 77,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Jika kecepatan berubah secara teratur setiap detik, maka gerak disebut...",
    options: ["GLB", "GLBB", "Diam", "Acak"],
    correct: 1,
    explanation: "Perubahan kecepatan teratur → GLBB."
  },
  {
    id: 78,
    module: "Kinematika",
    moduleId: "kinematics",
    text: "Mobil yang berhenti mendadak membuat penumpang terdorong ke depan karena...",
    options: [
      "Gaya magnet",
      "Inersia",
      "Gaya listrik",
      "Gravitasi"
    ],
    correct: 1,
    explanation: "Tubuh mempertahankan gerak → inersia."
  },
  {
    id: 79,
    module: "Dinamika",
    moduleId: "dynamics",
    text: "Jika percepatan bernilai negatif, maka benda sedang...",
    options: [
      "Mempercepat",
      "Melambat",
      "Diam",
      "Berputar"
    ],
    correct: 1,
    explanation: "Percepatan negatif berarti perlambatan."
  },
  {
    id: 80,
    module: "Energi",
    moduleId: "energy",
    text: "Semakin besar usaha yang dilakukan, maka...",
    options: [
      "Energi berkurang",
      "Perpindahan selalu nol",
      "Energi yang digunakan semakin besar",
      "Massa berubah"
    ],
    correct: 2,
    explanation: "Usaha berkaitan dengan energi yang dipindahkan/digunakan."
  },
  // ================= MODULE 4: FLUIDA =================
  {
    id: 81,
    module: "Fluida",
    moduleId: "fluids",
    text: "Hukum Archimedes menyatakan bahwa gaya apung pada suatu benda yang tercelup dalam fluida sebanding dengan...",
    options: [
      "Massa benda tersebut",
      "Volume fluida yang dipindahkan",
      "Berat fluida yang dipindahkan",
      "Tekanan di dasar wadah"
    ],
    correct: 2,
    explanation: "Gaya apung sama dengan berat fluida yang dipindahkan oleh volume benda yang tercelup."
  },
  {
    id: 82,
    module: "Fluida",
    moduleId: "fluids",
    text: "Tekanan hidrostatis pada dasar sebuah danau paling dipengaruhi oleh...",
    options: ["Luas permukaan danau", "Kedalaman danau", "Bentuk dasar danau", "Kecepatan aliran air"],
    correct: 1,
    explanation: "Rumus tekanan hidrostatis P = rho * g * h, sangat bergantung pada kedalaman (h)."
  },
  {
    id: 83,
    module: "Fluida",
    moduleId: "fluids",
    text: "Prinsip Bernoulli menjelaskan hubungan antara kecepatan fluida dengan...",
    options: ["Temperaturnya", "Tekanannya", "Viskositasnya", "Massa jenisnya"],
    correct: 1,
    explanation: "Menurut Prinsip Bernoulli, semakin cepat aliran fluida, maka tekanannya akan semakin menurun."
  },
  // ================= MODULE 5: GELOMBANG =================
  {
    id: 84,
    module: "Gelombang",
    moduleId: "waves",
    text: "Bunyi tidak dapat merambat melalui...",
    options: ["Udara", "Air", "Baja", "Ruang hampa"],
    correct: 3,
    explanation: "Gelombang bunyi adalah gelombang mekanik yang mutlak membutuhkan medium (zat perantara) untuk merambat."
  },
  {
    id: 85,
    module: "Gelombang",
    moduleId: "waves",
    text: "Jarak antara dua puncak bukit gelombang yang berdekatan disebut...",
    options: ["Amplitudo", "Frekuensi", "Panjang Gelombang", "Periode"],
    correct: 2,
    explanation: "Panjang gelombang (lambda) diukur dari satu puncak ke puncak berikutnya atau satu lembah ke lembah berikutnya."
  },
  // ================= MODULE 6: TERMODINAMIKA =================
  {
    id: 86,
    module: "Termodinamika",
    moduleId: "thermodynamics",
    text: "Hukum Termodinamika ke-0 membahas tentang...",
    options: ["Entropi semesta", "Kesetimbangan termal", "Kekekalan energi", "Suhu mutlak nol"],
    correct: 1,
    explanation: "Hukum ke-0 menyatakan jika dua sistem berada dalam kesetimbangan termal dengan sistem ketiga, maka ketiganya saling setimbang satu sama lain (suhunya sama)."
  },
  {
    id: 87,
    module: "Termodinamika",
    moduleId: "thermodynamics",
    text: "Proses termodinamika di mana tekanan dijaga agar selalu konstan disebut proses...",
    options: ["Isokhorik", "Isotermal", "Isobarik", "Adiabatik"],
    correct: 2,
    explanation: "Isobarik (Iso=Tetap, Bar=Tekanan). Jika Volume yang tetap disebut Isokhorik."
  },
  // ================= MODULE 7: MOMENTUM & IMPULS =================
  {
    id: 88,
    module: "Momentum",
    moduleId: "momentum",
    text: "Momentum suatu benda akan semakin besar jika...",
    options: ["Gaya yang diberikan semakin kecil", "Waktu tumbukan diperpanjang", "Massa dan kecepatannya diperbesar", "Energinya diperkecil"],
    correct: 2,
    explanation: "Momentum p = m * v, sehingga berbanding lurus dengan massa dan kecepatan benda."
  },
  {
    id: 89,
    module: "Momentum",
    moduleId: "momentum",
    text: "Sabuk pengaman dan airbag pada mobil berfungsi untuk mengurangi gaya benturan dengan cara...",
    options: ["Memperkecil momentum", "Memperpanjang waktu sentuh (waktu impuls)", "Memantulkan penumpang ke belakang", "Mengubah arah gaya"],
    correct: 1,
    explanation: "Berdasarkan I = F * dt, dengan memperpanjang waktu kontak (dt), gaya hancur (F) yang diterima penumpang akan jauh lebih kecil."
  },
  // ================= MODULE 8: KELISTRIKAN =================
  {
    id: 90,
    module: "Kelistrikan",
    moduleId: "electricity",
    text: "Jika dua muatan sejenis (misal positif dan positif) didekatkan, maka yang terjadi adalah...",
    options: ["Tarik-menarik", "Tolak-menolak", "Tidak bereaksi", "Menghasilkan api"],
    correct: 1,
    explanation: "Hukum Coulomb: muatan sejenis akan saling tolak-menolak, muatan berbeda jenis akan tarik-menarik."
  },
  {
    id: 91,
    module: "Kelistrikan",
    moduleId: "electricity",
    text: "Menurut Hukum Ohm, jika hambatan dalam suatu rangkaian listrik dinaikkan sementara tegangan tetap, maka arus akan...",
    options: ["Meningkat", "Turun", "Tetap", "Menjadi nol"],
    correct: 1,
    explanation: "V = I * R. Jika R (Hambatan) membesar dan V tetap, maka nilai I (Arus) pasti akan mengecil."
  },
  // ================= MODULE 9: GRAVITASI =================
  {
    id: 92,
    module: "Gravitasi",
    moduleId: "gravity",
    text: "Hukum Gravitasi Universal Newton menyatakan bahwa gaya tarik antar dua benda akan semakin KECIL jika...",
    options: ["Massa kedua benda diperbesar", "Jarak kedua benda dijauhkan", "Kecepatan putar benda bertambah", "Terdapat udara di antara keduanya"],
    correct: 1,
    explanation: "F = G * (m1*m2)/r^2. Gaya tarik gravitasi berbanding terbalik dengan kuadrat jarak (r). Makin jauh jaraknya, tarikannya melemah eksponensial."
  }
];
