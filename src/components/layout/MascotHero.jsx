import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const STATS = [
  { value: "2025", label: "Tahun Berdiri" },
  { value: "100%", label: "Informasi Resmi" },
  { value: "24/7", label: "Akses Layanan" },
];

export default function MascotHero() {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ minHeight: "100vh" }}>

      {/* Background foto */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY, scale: bgScale }}
        initial={{ scale: 1.12 }}
        animate={{ scale: loaded ? 1.04 : 1.12 }}
        transition={{ duration: 9, ease: "easeOut" }}
      >
        <img
          src="/ojk-jember.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: "saturate(0.7) brightness(0.55)" }}
        />
      </motion.div>

      {/* Overlay gradasi */}
      <div className="absolute inset-0 z-10" style={{
        background: "linear-gradient(135deg, rgba(6,13,26,0.92) 0%, rgba(6,13,26,0.7) 50%, rgba(6,13,26,0.5) 100%)"
      }} />
      <div className="absolute inset-0 z-10" style={{
        background: "radial-gradient(ellipse at 8% 50%, rgba(185,28,28,0.22) 0%, transparent 55%)"
      }} />
      <div className="absolute inset-0 z-10" style={{
        background: "radial-gradient(ellipse at 92% 10%, rgba(30,64,175,0.18) 0%, transparent 50%)"
      }} />
      <div className="absolute inset-0 z-10" style={{
        background: "linear-gradient(to top, rgba(6,13,26,1) 0%, rgba(6,13,26,0.6) 30%, transparent 70%)"
      }} />

      {/* Elemen geometris dekoratif */}
      <motion.div
        className="absolute z-10"
        style={{ top: "12%", right: "8%", width: 320, height: 320 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
          background: "rgba(185,28,28,0.06)",
          border: "1px solid rgba(185,28,28,0.15)",
          backdropFilter: "blur(2px)",
        }} />
      </motion.div>

      <motion.div
        className="absolute z-10"
        style={{ top: "20%", right: "12%", width: 180, height: 180 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div style={{
          width: "100%",
          height: "100%",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        }} />
      </motion.div>

      {/* Garis tipis dekoratif */}
      <div className="absolute right-16 top-0 bottom-0 z-10" style={{
        width: 1,
        background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)"
      }} />

      {/* Konten utama */}
      <motion.div
        className="relative z-20 flex flex-col justify-center"
        style={{ minHeight: "100vh", y: textY, opacity }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="max-w-3xl pt-24 pb-32">

            {/* Label institusi */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 mb-8"
            >
              <div style={{
                width: 32,
                height: 2,
                background: "linear-gradient(90deg, #dc2626, transparent)"
              }} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                color: "rgba(248,113,113,0.9)",
                textTransform: "uppercase",
              }}>
                
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                marginBottom: "1.5rem",
              }}
            >
              Kumpulan 
              <br />
              <span style={{
                background: "linear-gradient(90deg, #f87171 0%, #fca5a5 40%, #ffffff 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}>
                Informasi & Berita
              </span>
              <br />
              <span style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.72em",
                fontWeight: 700,
              }}>
                OJK Jember
              </span>
            </motion.h1>

            {/* Deskripsi */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: "rgba(203,213,225,0.75)",
                maxWidth: 520,
                marginBottom: "2.5rem",
              }}
            >
              Sumber informasi resmi seputar regulasi, edukasi keuangan, dan
              perkembangan sektor jasa keuangan di wilayah Jember dan sekitarnya.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#berita"
                className="inline-flex items-center gap-2 text-white no-underline"
                style={{
                  padding: "14px 28px",
                  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderRadius: 10,
                  letterSpacing: "0.02em",
                  boxShadow: "0 4px 24px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  transition: "all 0.2s ease",
                }}
              >
                Baca Berita Terkini
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="https://ojk-jember-edukasi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 no-underline"
                style={{
                  padding: "14px 28px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  borderRadius: 10,
                  letterSpacing: "0.02em",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.2s ease",
                }}
              >
                Pengajuan Edukasi
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
