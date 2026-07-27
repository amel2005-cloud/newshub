import { useRef, useState, useEffect } from "react";

const POSES = [
  "/mascot-3.png",
  "/mascot-4.png",
  "/mascot-2.png",
  "/mascot-1.png",
];

export default function MascotHero() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [poseIndex, setPoseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoseIndex((prev) => (prev + 1) % POSES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const rotateY = tilt.x * 6;
  const rotateX = -tilt.y * 6;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
      <div
        className="relative rounded-3xl overflow-hidden py-10 md:py-16 px-4"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, #d62828 0%, transparent 45%), radial-gradient(circle at 75% 80%, #12335f 0%, transparent 55%), linear-gradient(160deg, #0b2545 0%, #061426 100%)",
        }}
      >
        <div style={{ perspective: "1400px" }} className="mx-auto max-w-4xl">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 0.15s ease-out",
            }}
          >
            <div className="bg-black rounded-2xl p-3 md:p-4 shadow-2xl">
              <div className="bg-navy rounded-lg overflow-hidden relative min-h-[220px] md:min-h-[280px] flex items-center">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative flex items-center justify-between w-full px-6 md:px-10 py-6">
                  <div className="max-w-md">
                    <span className="badge-cat inline-block mb-3">
                      KOJBNews
                    </span>
                    <h2 className="text-white font-extrabold text-2xl md:text-4xl leading-tight mb-2">
                      Info & Berita Seputar OJK Jember
                    </h2>
                    <p className="text-blue-200 text-sm md:text-base">
                      Update terbaru langsung dari sumber resmi, biar kamu gak
                      ketinggalan info.
                    </p>
                  </div>

                  <div className="hidden sm:block mascot-float relative w-52 md:w-80 h-52 md:h-80">
                    {POSES.map((src, i) => (
                      <img
                        key={src + i}
                        src={src}
                        alt="Maskot KOJBNews"
                        className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl select-none transition-opacity duration-700"
                        style={{
                          opacity: i === poseIndex ? 1 : 0,
                          transform: "translateZ(30px)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-24 md:w-32 h-4 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-md" />
            </div>
            <div className="flex justify-center">
              <div className="w-40 md:w-56 h-2 bg-gray-700 rounded-full shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
