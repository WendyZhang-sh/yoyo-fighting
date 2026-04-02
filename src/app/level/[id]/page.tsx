"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getUnits, GrammarUnit } from "@/data/units";

// Fake progress data: first 3 units 80-100%, next 2 at 30-60%, rest at 0%
function getUnitProgress(unitIndex: number): number {
  if (unitIndex < 3) return [100, 90, 80][unitIndex];
  if (unitIndex < 5) return [55, 35][unitIndex - 3];
  return 0;
}

function getStars(progress: number): number {
  if (progress >= 90) return 3;
  if (progress >= 60) return 2;
  if (progress >= 30) return 1;
  return 0;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function LevelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const levelNum = Number(id);
  const units = getUnits(levelNum);

  const subtitle = levelNum === 1 ? "基础入门" : "进阶提升";

  // Calculate overall progress
  const totalProgress = Math.round(
    units.reduce((sum, _, i) => sum + getUnitProgress(i), 0) / units.length
  );

  // Find first incomplete unit for the floating button
  const firstIncompleteUnit = units.find((_, i) => getUnitProgress(i) < 100);
  const firstIncompleteLink = firstIncompleteUnit
    ? `/level/${id}/unit/${firstIncompleteUnit.unitNumber}`
    : `/level/${id}/unit/1`;

  // Header gradient
  const headerGradient =
    levelNum === 1
      ? "from-red-400 via-orange-400 to-yellow-400"
      : "from-teal-400 via-emerald-400 to-cyan-400";

  return (
    <div className="min-h-screen bg-[var(--background)] pb-28">
      {/* ===== Top Bar / Header ===== */}
      <header className={`bg-gradient-to-r ${headerGradient} relative overflow-hidden`}>
        {/* Decorative bubbles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute bottom-2 left-10 w-16 h-16 rounded-full bg-white/10" />

        <div className="max-w-5xl mx-auto px-4 py-5">
          {/* Back + Progress row */}
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-white/90 hover:text-white text-lg font-semibold transition-colors active:scale-95"
            >
              <span className="text-2xl leading-none">←</span>
              <span className="hidden sm:inline">返回</span>
            </Link>

            {/* Overall progress badge */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <span className="text-white text-sm font-bold">
                {totalProgress}%
              </span>
              <div className="w-20 h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Level {id}
            </h1>
            <p className="text-white/80 text-base sm:text-lg font-semibold mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* ===== Unit Grid ===== */}
      <main className="max-w-5xl mx-auto px-4 pt-6">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {units.map((unit, index) => {
            const progress = getUnitProgress(index);
            const stars = getStars(progress);
            const isLocked = progress === 0;

            return (
              <motion.div key={unit.id} variants={cardVariants}>
                <UnitCard
                  unit={unit}
                  levelId={id}
                  progress={progress}
                  stars={stars}
                  isLocked={isLocked}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* ===== Floating "开始学习" Button ===== */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <Link
          href={firstIncompleteLink}
          className="pointer-events-auto"
        >
          <motion.div
            className={`
              bg-gradient-to-r ${headerGradient}
              text-white font-extrabold text-lg
              px-10 py-4 rounded-full
              shadow-lg shadow-black/15
              hover:shadow-xl hover:scale-105
              active:scale-95
              transition-all duration-200
            `}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 18 }}
          >
            🚀 开始学习
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

/* ============================
   Unit Card Component
   ============================ */
function UnitCard({
  unit,
  levelId,
  progress,
  stars,
  isLocked,
}: {
  unit: GrammarUnit;
  levelId: string;
  progress: number;
  stars: number;
  isLocked: boolean;
}) {
  return (
    <Link href={`/level/${levelId}/unit/${unit.unitNumber}`} className="block">
      <div
        className={`
          relative rounded-2xl p-4 sm:p-5
          transition-all duration-200
          hover:scale-105 hover:-translate-y-1
          active:scale-100
          cursor-pointer select-none
          ${isLocked ? "opacity-60 grayscale-[30%]" : ""}
        `}
        style={{
          backgroundColor: unit.bgColor,
          boxShadow: isLocked
            ? "0 2px 10px rgba(0,0,0,0.06)"
            : `0 4px 20px ${unit.color}25`,
        }}
      >
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/30 backdrop-blur-[1px] z-10">
            <span className="text-3xl sm:text-4xl opacity-70">🔒</span>
          </div>
        )}

        {/* Unit number badge */}
        <div
          className="inline-block text-xs font-bold text-white px-2.5 py-0.5 rounded-full mb-2"
          style={{ backgroundColor: unit.color }}
        >
          Unit {unit.unitNumber}
        </div>

        {/* Icon */}
        <div className="text-4xl sm:text-5xl mb-2 leading-none">
          {unit.icon}
        </div>

        {/* Title */}
        <h3
          className="text-sm sm:text-base font-extrabold leading-tight mb-0.5 line-clamp-2"
          style={{ color: unit.color }}
        >
          {unit.title}
        </h3>
        <p className="text-xs text-gray-500 font-semibold mb-3">
          {unit.titleCn}
        </p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: unit.color,
            }}
          />
        </div>

        {/* Stars */}
        <div className="flex gap-0.5">
          {[1, 2, 3].map((starNum) => (
            <span
              key={starNum}
              className={`text-base sm:text-lg leading-none ${
                starNum <= stars ? "text-star-gold" : "text-gray-300"
              }`}
            >
              {starNum <= stars ? "⭐" : "☆"}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
