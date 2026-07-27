import { useEffect, useState } from "react";

export default function MascotCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 .. 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setTilt({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const rotateY = tilt.x * 14;
  const rotateX = -tilt.y * 14;

  return (
    <div
      className="hidden sm:block absolute -bottom-9 right-2 md:right-8 pointer-events-none select-none z-40"
      style={{ perspective: "700px" }}
    >
      {/* lapisan luar: animasi ngambang naik-turun */}
      <div className="mascot-float">
        {/* lapisan dalam: tilt 3D ngikutin mouse */}
        <div
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out",
          }}
        >
          <img
            src="/mascot.png"
            alt="Maskot KOJBNews"
            className="w-16 md:w-24 drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}