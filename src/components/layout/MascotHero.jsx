import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const POSES = [
  "/mascot-3.png",
  "/mascot-4.png",
  "/mascot-2.png",
  "/mascot-1.png",
];

export default function MascotHero() {
  const ref = useRef(null);
  const [poseIndex, setPoseIndex] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const interval = setInterval(() => {
      setPoseIndex((prev) => (prev + 1) % POSES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-h-[580px] md:min-h-[640px] flex items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Background foto gedung OJK */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: bgScale, y: bgY }}
        initial={{ scale: 1.15 }}
        animate={{ scale: loaded ? 1.05 : 1.15 }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        <img
          src="/ojk-jember.jpg"
          alt="Gedung OJK Jember"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Overlay gradasi gelap bawah ke atas */}
      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.05) 100%)" }} />

      {/* Cahaya merah pojok kiri atas */}
      <div className="absolute inset-0 z-10"
        style={{ background: "radial-gradient(ellipse at 10% 10%, rgba(214,40,40,0.4) 0%, transparent 50%)" }} />

      {/* Cahaya biru pojok kanan */}
      <div className="absolute inset-0 z-10"
        style={{ background: "radial-gradient(ellipse at 90% 20%, rgba(59,130,246,0.2) 0%, transparent 45%)" }} />

      {/* Gelap sisi kiri biar teks terbaca */}
      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }}/>

      {/* Floating dots dekoratif */}
      <motion.div className="absolute top-16 left-1/3 w-2 h-2 bg-red-500 rounded-full z-20 opacity-60"
        animate={{ y: [0, -18, 0] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.div className="absolute bottom-32 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full z-20 opacity-40"
        animate={{ y: [0, 12, 0] }} transition={{ duration: 4.5, repeat: Infinity }} />

      {/* MAIN CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row items-end md:items-center gap-0 md:gap-8">

          {/* ===== KIRI: Maskot floating di atas teks ===== */}
          <div className="relative flex-shrink-0 flex flex-col items-center md:items-start">

            {/* Glassmorphism card di belakang maskot */}
            <motion.div
              className="relative"
              style={{
                transform: `perspective(1000px) rotateY(${mouse.x * 6}deg) rotateX(${-mouse.y * 6}deg)`,
                transition: "transform 0.15s ease-out",
              }}
            >
              {/* Glass card */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                  transform: "scale(0.85) translateY(10%)",
                }}
              />

              {/* Mascot image */}
              <motion.div
                className="relative w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(214,40,40,0.3)) drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
                }}
              >
                {POSES.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt="Maskot KOJBNews"
                    className="absolute inset-0 w-full h-full object-contain select-none transition-opacity duration-700"
                    style={{ opacity: i === poseIndex ? 1 : 0 }}
                  />
                ))}
              </motion.div>

              {/* Glow bawah maskot */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-red-500/25 blur-xl rounded-full" />
            </motion.div>
          </div>

          {/* ===== KANAN: Teks sejajar pinggang maskot ===== */}
          <motion.div
            style={{ y: textY }}
            className="flex-1 pb-4 md:pb-0"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-widest"
            >
              KOJBNews
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-none mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="text-white">Info & Berita</span>
<br />
<span style={{
  background: "linear-gradient(90deg, #ef4444 0%, #f97316 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
  display: "inline-block",
}}>
  OJK Jember
</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/60 text-sm md:text-base max-w-sm leading-relaxed mb-5"
            >
              Update terbaru langsung dari sumber resmi, biar kamu gak ketinggalan info penting seputar keuangan Jember.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex gap-3 flex-wrap"
            >
              <a href="#berita"
                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-600/40 text-sm">
                Baca Berita
              </a>
              <a href="https://ojk-jember-edukasi.vercel.app/" target="_blank" rel="noopener noreferrer"
                className="border border-white/25 text-white hover:border-white/50 hover:bg-white/10 font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 text-sm backdrop-blur-sm">
                Pengajuan Edukasi
              </a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}