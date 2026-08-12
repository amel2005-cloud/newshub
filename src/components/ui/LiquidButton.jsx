import { motion } from "framer-motion";

export default function LiquidButton({
  children,
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{
        scale: 0.97,
      }}
      className={`
        relative
        overflow-hidden
        rounded-full
        px-5
        py-2
        text-sm
        font-semibold
        text-white

        backdrop-blur-2xl
        bg-red-600/70
        border border-white/30

        shadow-[0_8px_30px_rgba(0,0,0,.25)]
        transition-all
        duration-300

        before:absolute
        before:top-0
        before:left-0
        before:w-full
        before:h-1/2
        before:bg-white/25
        before:rounded-full
        before:content-['']

        hover:bg-red-500/80
        hover:border-white/50

        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}