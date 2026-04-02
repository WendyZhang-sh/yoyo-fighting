"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface WrongAnswer {
  id: number;
  level: number;
  unit: number;
  question: string;
  blank: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
}

const wrongAnswers: WrongAnswer[] = [
  {
    id: 1,
    level: 1,
    unit: 3,
    question: "He ___ a teacher.",
    blank: "___",
    yourAnswer: "am",
    correctAnswer: "is",
    explanation: "He \u540E\u9762\u7528 is\uFF0C\u4E0D\u7528 am",
  },
  {
    id: 2,
    level: 1,
    unit: 6,
    question: "There ___ three books.",
    blank: "___",
    yourAnswer: "is",
    correctAnswer: "are",
    explanation: "three books \u662F\u590D\u6570\uFF0C\u7528 are",
  },
  {
    id: 3,
    level: 1,
    unit: 7,
    question: "She can ___ fast.",
    blank: "___",
    yourAnswer: "runs",
    correctAnswer: "run",
    explanation: "can \u540E\u9762\u7528\u52A8\u8BCD\u539F\u5F62",
  },
];

const tabs = ["\u5168\u90E8", "Level 1", "Level 2"] as const;
type Tab = (typeof tabs)[number];

const cardVariants = {
  hidden: { opacity: 0, x: -24, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
  exit: { opacity: 0, x: 24, scale: 0.96, transition: { duration: 0.2 } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function getFilteredAnswers(tab: Tab): WrongAnswer[] {
  if (tab === "\u5168\u90E8") return wrongAnswers;
  if (tab === "Level 1") return wrongAnswers.filter((q) => q.level === 1);
  return wrongAnswers.filter((q) => q.level === 2);
}

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>("\u5168\u90E8");
  const filtered = getFilteredAnswers(activeTab);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFFDF7] via-[#FFF8ED] to-[#FFF3E0]">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-[#FF6B6B]/10" />
        <div className="absolute right-8 top-20 h-20 w-20 rounded-full bg-[#4ECDC4]/12" />
        <div className="absolute bottom-24 left-16 h-28 w-28 rounded-full bg-[#FFE66D]/15" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-6 pb-12">
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
            {"📖 错题本"}
          </h1>
        </motion.div>

        {/* ===== Filter Tabs ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="mt-6 flex gap-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#FF6B6B] text-white shadow-md shadow-[#FF6B6B]/25"
                  : "bg-white/70 text-gray-500 shadow-sm backdrop-blur-sm hover:bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* ===== Content Area ===== */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            /* --- Empty State --- */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="mt-16 flex flex-col items-center text-center"
            >
              <span className="text-7xl">{"\u{1F389}"}</span>
              <h2 className="mt-4 text-2xl font-extrabold text-gray-800">
                {"太棒了！没有错题！"}
              </h2>
              <p className="mt-2 text-base font-medium text-gray-400">
                {"继续保持！"}
              </p>
            </motion.div>
          ) : (
            /* --- Wrong Answer Cards --- */
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-6 flex flex-col gap-4"
            >
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="overflow-hidden rounded-2xl border-l-4 border-[#FF6B6B] bg-white/90 shadow-lg backdrop-blur-sm"
                >
                  <div className="p-5">
                    {/* Unit badge */}
                    <span className="inline-block rounded-full bg-[#FF6B6B]/10 px-3 py-1 text-xs font-bold text-[#FF6B6B]">
                      Level {item.level} &middot; Unit {item.unit}
                    </span>

                    {/* Question */}
                    <p className="mt-3 text-base font-bold text-gray-800 sm:text-lg">
                      {item.question}
                    </p>

                    {/* Answers comparison */}
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6">
                      {/* Your answer (wrong) */}
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-500">
                          {"\u2717"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {"你的答案:"}
                        </span>
                        <span className="font-bold text-red-500 line-through decoration-red-300">
                          {item.yourAnswer}
                        </span>
                      </div>
                      {/* Correct answer */}
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                          {"\u2713"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {"正确答案:"}
                        </span>
                        <span className="font-bold text-green-600">
                          {item.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="mt-3 rounded-xl bg-[#FFF8E1] px-4 py-2.5">
                      <p className="text-sm font-medium text-amber-700">
                        {"\u{1F4A1}"} {item.explanation}
                      </p>
                    </div>

                    {/* Retry button */}
                    <div className="mt-4 flex justify-end">
                      <Link
                        href="#"
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] px-5 py-2 text-sm font-bold text-white shadow-md shadow-[#FF6B6B]/20 transition-transform hover:scale-105 active:scale-95"
                      >
                        {"🔄 重新练习"}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Bottom summary */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-center text-sm font-medium text-gray-400"
              >
                {"共"} {filtered.length} {"道错题"} &middot;{" "}
                {"加油复习！"}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
