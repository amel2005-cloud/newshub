import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import { useState } from "react";

export default function NewsCard({ news, size = "normal" }) {
  const imgSrc =
    news.thumbnail ||
    `https://placehold.co/600x350/0b2545/ffffff?text=KOJBNews`;
  const date = news.published_at
    ? format(new Date(news.published_at), "d MMM yyyy", { locale: id })
    : "";
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  if (size === "small") {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        className="flex gap-3 items-start bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <img
          src={imgSrc}
          alt={news.title}
          className="w-20 h-16 object-cover rounded flex-shrink-0"
        />
        <div>
          <Link
            to={`/news/${news.slug}`}
            className="text-sm font-semibold text-navy hover:text-red transition-colors line-clamp-2"
          >
            {news.title}
          </Link>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateY(${tilt.x * 8}deg) rotateX(${-tilt.y * 8}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-black/30 transition-shadow duration-300 group"
    >
      <div className="overflow-hidden">
        <img
          src={imgSrc}
          alt={news.title}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        {news.categories && (
          <Link
            to={`/category/${news.categories.slug}`}
            className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded font-medium mb-2 hover:bg-red-500 transition-colors"
          >
            {news.categories.name}
          </Link>
        )}
        <Link to={`/news/${news.slug}`}>
          <h3 className="font-bold text-navy hover:text-red transition-colors line-clamp-2 text-sm leading-snug mb-2">
            {news.title}
          </h3>
        </Link>
        {news.short_description && (
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">
            {news.short_description}
          </p>
        )}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{news.author_name}</span>
          <span>{date}</span>
        </div>
        <Link
          to={`/news/${news.slug}`}
          className="mt-3 inline-block text-xs bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-red-500 transition-all hover:scale-105 hover:shadow-md hover:shadow-red-600/30"
        >
          Baca Selengkapnya
        </Link>
      </div>
    </motion.div>
  );
}
