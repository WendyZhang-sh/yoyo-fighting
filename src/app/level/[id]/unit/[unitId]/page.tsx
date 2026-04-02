"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getUnit } from "@/data/units";

const cardStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
} as const;

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
} as const;

export default function UnitPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = React.use(params);
  const unit = getUnit(Number(id), Number(unitId));

  if (!unit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <div className="text-6xl">😢</div>
          <p className="mt-4 text-xl font-bold text-gray-700">
            找不到这个单元
          </p>
          <Link
            href={`/level/${id}`}
            className="mt-4 inline-block rounded-full bg-gray-200 px-6 py-2 font-semibold text-gray-600 transition hover:bg-gray-300"
          >
            ← 返回
          </Link>
        </div>
      </div>
    );
  }

  const actions = [
    {
      key: "learn",
      icon: "📚",
      title: "语法讲解",
      subtitle: "学习这个单元的语法规则",
      href: `/level/${id}/unit/${unitId}/learn`,
      bg: "#F0FFF4",
      accent: "#38A169",
      arrowBg: "#C6F6D5",
      extra: null,
    },
    {
      key: "practice",
      icon: "✏️",
      title: "练习",
      subtitle: "做练习巩固语法 · 12题",
      href: `/level/${id}/unit/${unitId}/practice`,
      bg: "#EBF8FF",
      accent: "#3182CE",
      arrowBg: "#BEE3F8",
      extra: (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs font-semibold" style={{ color: "#3182CE" }}>
            已完成 8/12
          </span>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-blue-400"
              style={{ width: "66.7%" }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "quiz",
      icon: "🏆",
      title: "单元测验",
      subtitle: "测试你的掌握程度",
      href: `/level/${id}/unit/${unitId}/practice`,
      bg: "#F3E8FF",
      accent: "#7C3AED",
      arrowBg: "#E9D5FF",
      extra: (
        <div className="mt-2">
          <span
            className="text-xs font-semibold"
            style={{ color: "#7C3AED" }}
          >
            最佳成绩: ⭐⭐⭐
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFFDF7] to-[#FFF3E0]">
      {/* ===== Decorative Background Shapes ===== */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-15"
          style={{ backgroundColor: unit.color }}
        />
        <div
          className="absolute right-8 top-24 h-24 w-24 rounded-full opacity-10"
          style={{ backgroundColor: unit.color }}
        />
        <div
          className="absolute bottom-32 left-1/4 h-32 w-32 rounded-full opacity-8"
          style={{ backgroundColor: unit.color }}
        />
      </div>

      {/* ===== Main Content ===== */}
      <div className="relative z-10 mx-auto max-w-2xl px-5 pb-10 pt-6">
        {/* ===== Top Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl shadow-lg"
          style={{ backgroundColor: unit.bgColor }}
        >
          <div className="px-6 pb-6 pt-5">
            {/* Back button & badge row */}
            <div className="flex items-center justify-between">
              <Link
                href={`/level/${id}`}
                className="flex items-center gap-1.5 rounded-full bg-white/60 px-3.5 py-1.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white/80"
                style={{ color: unit.color }}
              >
                <span className="text-lg">←</span>
                <span>返回</span>
              </Link>
              <span
                className="rounded-full px-4 py-1.5 text-xs font-extrabold tracking-wide text-white"
                style={{ backgroundColor: unit.color }}
              >
                Unit {unit.unitNumber}
              </span>
            </div>

            {/* Icon + Title */}
            <div className="mt-5 flex items-center gap-4">
              <div
                className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-white/70 text-5xl shadow-sm"
              >
                {unit.icon}
              </div>
              <div className="min-w-0">
                <h1
                  className="text-2xl font-extrabold leading-tight"
                  style={{ color: unit.color }}
                >
                  {unit.title}
                </h1>
                <p className="mt-1 text-base font-semibold text-gray-500">
                  {unit.titleCn}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== Mascot Speech Bubble ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="mt-6 flex items-start gap-3"
        >
          <div className="flex-shrink-0 text-5xl">🦒</div>
          <div className="relative rounded-2xl bg-white px-5 py-4 shadow-md">
            {/* Speech bubble triangle */}
            <div className="absolute left-[-8px] top-5 h-4 w-4 rotate-45 bg-white" />
            <p className="relative text-base font-semibold leading-relaxed text-gray-700">
              Let&apos;s learn about{" "}
              <span style={{ color: unit.color }}>{unit.title}</span>!
              <br />
              <span className="text-gray-500">
                我们来学习{unit.titleCn}吧！
              </span>
            </p>
          </div>
        </motion.div>

        {/* ===== Action Cards ===== */}
        <motion.div
          className="mt-8 flex flex-col gap-4"
          variants={cardStagger}
          initial="hidden"
          animate="show"
        >
          {actions.map((action) => (
            <motion.div key={action.key} variants={cardItem}>
              <Link href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 rounded-2xl p-5 shadow-md transition-shadow hover:shadow-lg"
                  style={{ backgroundColor: action.bg }}
                >
                  {/* Icon */}
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white/80 text-3xl shadow-sm">
                    {action.icon}
                  </div>

                  {/* Text content */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className="text-lg font-extrabold"
                      style={{ color: action.accent }}
                    >
                      {action.title}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-gray-500">
                      {action.subtitle}
                    </p>
                    {action.extra}
                  </div>

                  {/* Arrow button */}
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: action.accent }}
                  >
                    →
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== Bottom Stats Bar ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.45 }}
          className="mt-8 flex items-center justify-around rounded-2xl bg-white px-6 py-4 shadow-md"
        >
          <div className="text-center">
            <p className="text-2xl font-extrabold text-gray-800">85%</p>
            <p className="mt-0.5 text-xs font-semibold text-gray-400">
              练习正确率
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-gray-800">8 ⭐</p>
            <p className="mt-0.5 text-xs font-semibold text-gray-400">
              已获星星
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
