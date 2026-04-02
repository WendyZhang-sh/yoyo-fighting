"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Achievement {
  emoji: string;
  name: string;
  nameCn: string;
  description: string;
  unlocked: boolean;
  progress?: { current: number; total: number };
  gradient: string;
  glowColor: string;
}

const achievements: Achievement[] = [
  {
    emoji: "\u{1F463}",
    name: "First Step",
    nameCn: "\u7B2C\u4E00\u6B65",
    description: "\u5B8C\u6210\u7B2C\u4E00\u9053\u7EC3\u4E60",
    unlocked: true,
    gradient: "from-[#a8e6cf] to-[#dcedc1]",
    glowColor: "rgba(81, 207, 102, 0.35)",
  },
  {
    emoji: "\u{1F4AF}",
    name: "Perfect Unit",
    nameCn: "\u6EE1\u5206\u5355\u5143",
    description: "\u67D0\u4E2A Unit \u5168\u90E8\u7B54\u5BF9",
    unlocked: true,
    gradient: "from-[#ffd3a5] to-[#fd6585]",
    glowColor: "rgba(253, 101, 133, 0.35)",
  },
  {
    emoji: "\u{1F31F}",
    name: "Grammar Star",
    nameCn: "\u8BED\u6CD5\u4E4B\u661F",
    description: "\u7D2F\u8BA1\u83B7\u5F97 50 \u9897\u661F",
    unlocked: false,
    progress: { current: 45, total: 50 },
    gradient: "from-[#ffecd2] to-[#fcb69f]",
    glowColor: "rgba(252, 182, 159, 0.35)",
  },
  {
    emoji: "\u{1F525}",
    name: "Week Warrior",
    nameCn: "\u575A\u6301\u4E00\u5468",
    description: "\u8FDE\u7EED\u5B66\u4E60 7 \u5929",
    unlocked: false,
    progress: { current: 3, total: 7 },
    gradient: "from-[#ff9a9e] to-[#fad0c4]",
    glowColor: "rgba(255, 154, 158, 0.35)",
  },
  {
    emoji: "\u{1F451}",
    name: "Level Master",
    nameCn: "\u7EA7\u522B\u5927\u5E08",
    description: "\u5B8C\u6210\u4E00\u4E2A Level \u5168\u90E8 Unit",
    unlocked: false,
    gradient: "from-[#c3cfe2] to-[#f5f7fa]",
    glowColor: "rgba(195, 207, 226, 0.35)",
  },
  {
    emoji: "\u{1F3AF}",
    name: "Mistake Hunter",
    nameCn: "\u9519\u9898\u730E\u4EBA",
    description: "\u9519\u9898\u672C\u4E2D\u7684\u9898\u5168\u90E8\u7B54\u5BF9",
    unlocked: false,
    gradient: "from-[#e0c3fc] to-[#8ec5fc]",
    glowColor: "rgba(142, 197, 252, 0.35)",
  },
  {
    emoji: "\u26A1",
    name: "Speed Runner",
    nameCn: "\u95EA\u7535\u4FA0",
    description: "\u6D4B\u9A8C\u4E2D 2 \u5206\u949F\u5185\u5B8C\u6210",
    unlocked: true,
    gradient: "from-[#f093fb] to-[#f5576c]",
    glowColor: "rgba(245, 87, 108, 0.35)",
  },
  {
    emoji: "\u{1F5FA}\uFE0F",
    name: "Explorer",
    nameCn: "\u63A2\u7D22\u5BB6",
    description: "\u5B66\u4E60\u4E86\u6240\u6709\u8BED\u6CD5\u8BB2\u89E3",
    unlocked: false,
    gradient: "from-[#89f7fe] to-[#66a6ff]",
    glowColor: "rgba(102, 166, 255, 0.35)",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

const sparkleVariants = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export default function AchievementsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFFDF7] via-[#FFF8ED] to-[#FFF3E0]">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-[#FFE66D]/20" />
        <div className="absolute right-6 top-16 h-28 w-28 rounded-full bg-[#FF6B6B]/10" />
        <div className="absolute bottom-20 left-12 h-24 w-24 rounded-full bg-[#4ECDC4]/12" />
        <div className="absolute bottom-40 right-10 h-16 w-16 rounded-full bg-[#f093fb]/15" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-6 pb-12">
        {/* ===== Top Bar ===== */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-lg shadow-md backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
          >
            &larr;
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
            {"🏆 我的成就"}
          </h1>
        </motion.div>

        {/* ===== Stats Summary Cards ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          {[
            { icon: "\u2B50", label: "\u603B\u661F\u661F", value: "45" },
            { icon: "\u{1F525}", label: "\u8FDE\u7EED", value: "3\u5929" },
            { icon: "\u{1F4DD}", label: "\u5DF2\u5B8C\u6210", value: "15\u9898" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl bg-white/80 px-3 py-4 shadow-md backdrop-blur-sm"
            >
              <span className="text-2xl">{stat.icon}</span>
              <span className="mt-1 text-xs font-medium text-gray-500">
                {stat.label}
              </span>
              <span className="text-lg font-extrabold text-gray-800">
                {stat.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ===== Achievements Grid ===== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {achievements.map((badge) => {
            const isLocked = !badge.unlocked;

            return (
              <motion.div
                key={badge.name}
                variants={cardVariants}
                whileHover={{ scale: 1.04, y: -4 }}
                className={`relative flex flex-col items-center overflow-hidden rounded-2xl p-5 text-center shadow-lg transition-shadow ${
                  isLocked
                    ? "bg-gray-100/80 backdrop-blur-sm"
                    : `bg-gradient-to-br ${badge.gradient}`
                }`}
                style={
                  isLocked
                    ? undefined
                    : { boxShadow: `0 4px 24px ${badge.glowColor}` }
                }
              >
                {/* Sparkle decorations for unlocked badges */}
                {!isLocked && (
                  <>
                    <motion.span
                      variants={sparkleVariants}
                      animate="animate"
                      className="pointer-events-none absolute right-2 top-2 text-xs"
                    >
                      {"\u2728"}
                    </motion.span>
                    <motion.span
                      variants={sparkleVariants}
                      animate="animate"
                      className="pointer-events-none absolute bottom-2 left-2 text-xs"
                      style={{ animationDelay: "0.6s" }}
                    >
                      {"\u2728"}
                    </motion.span>
                  </>
                )}

                {/* Lock overlay */}
                {isLocked && (
                  <div className="pointer-events-none absolute inset-0 flex items-start justify-end p-2">
                    <span className="text-lg opacity-50">{"\u{1F512}"}</span>
                  </div>
                )}

                {/* Emoji icon */}
                <span
                  className={`text-4xl sm:text-5xl ${
                    isLocked ? "grayscale" : ""
                  }`}
                >
                  {badge.emoji}
                </span>

                {/* Name */}
                <h3
                  className={`mt-2 text-sm font-bold leading-tight sm:text-base ${
                    isLocked ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  {badge.name}
                </h3>
                <p
                  className={`text-xs font-semibold ${
                    isLocked ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {badge.nameCn}
                </p>

                {/* Description */}
                <p
                  className={`mt-1 text-[11px] leading-snug sm:text-xs ${
                    isLocked ? "text-gray-400" : "text-gray-600/90"
                  }`}
                >
                  {badge.description}
                </p>

                {/* Progress bar for locked badges with progress */}
                {isLocked && badge.progress && (
                  <div className="mt-3 w-full">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FFD43B] to-[#FF922B] transition-all"
                        style={{
                          width: `${
                            (badge.progress.current / badge.progress.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] font-semibold text-gray-400">
                      {badge.progress.current}/{badge.progress.total}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===== Footer ===== */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 text-center text-sm text-gray-400"
        >
          {"继续努力，解锁更多成就！"}
        </motion.p>
      </div>
    </div>
  );
}
