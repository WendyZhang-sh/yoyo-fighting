"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFFDF7] to-[#FFF3E0]">
      {/* ===== Decorative Background Shapes ===== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#FF6B6B]/10" />
        <div className="absolute right-10 top-20 h-24 w-24 rounded-full bg-[#4ECDC4]/15" />
        <div className="absolute left-1/4 top-1/3 h-16 w-16 rounded-full bg-[#FFE66D]/20" />
        <div className="absolute bottom-32 right-1/4 h-32 w-32 rounded-full bg-[#FF6B6B]/8" />
        <div className="absolute bottom-10 left-16 h-20 w-20 rounded-full bg-[#4ECDC4]/10" />
        <div className="absolute left-1/2 top-10 h-12 w-12 rounded-full bg-[#FFD93D]/25" />
        <div className="absolute right-20 top-1/2 h-10 w-10 rounded-full bg-[#FF6B6B]/12" />
        <div className="absolute bottom-48 left-1/3 h-8 w-8 rounded-full bg-[#4ECDC4]/20" />
      </div>

      {/* ===== Main Content ===== */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-8">
        {/* --- Streak Counter (top-right) --- */}
        <div className="flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold shadow-md backdrop-blur-sm"
          >
            🔥 连续学习 3 天
          </motion.div>
        </div>

        {/* --- Title Area --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl">
            🌈 Grammar Friends
          </h1>
          <p className="mt-2 text-xl font-medium text-gray-500">语法小伙伴</p>
        </motion.div>

        {/* --- Mascot Area --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex flex-col items-center"
        >
          <div className="animate-float text-7xl sm:text-8xl">🦒</div>
          <div className="relative mt-4 rounded-2xl bg-white px-6 py-4 shadow-lg">
            {/* Speech bubble triangle */}
            <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />
            <p className="relative text-center text-base font-medium text-gray-700 sm:text-lg">
              Let&apos;s learn English grammar together!
              <br />
              <span className="text-gray-500">一起来学英语语法吧！</span>
            </p>
          </div>
        </motion.div>

        {/* --- Level Selection Cards --- */}
        <div className="stagger-children mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Level 1 Card */}
          <Link href="/level/1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer rounded-3xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] p-6 text-white shadow-xl transition-shadow hover:shadow-2xl"
            >
              <div className="text-5xl">📖</div>
              <h2 className="mt-3 text-2xl font-bold">Level 1</h2>
              <p className="mt-1 text-sm font-medium text-white/80">
                Book 1 · 基础入门
              </p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-white/90">
                  <span>进度</span>
                  <span>60%</span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-white/90"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>

              {/* Stars */}
              <div className="mt-3 flex gap-1 text-xl">
                <span>⭐</span>
                <span>⭐</span>
                <span className="opacity-30">⭐</span>
              </div>
            </motion.div>
          </Link>

          {/* Level 2 Card */}
          <Link href="/level/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer rounded-3xl bg-gradient-to-br from-[#4ECDC4] to-[#6EE7DE] p-6 text-white shadow-xl transition-shadow hover:shadow-2xl"
            >
              <div className="text-5xl">📗</div>
              <h2 className="mt-3 text-2xl font-bold">Level 2</h2>
              <p className="mt-1 text-sm font-medium text-white/80">
                Book 2 · 进阶提升
              </p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-white/90">
                  <span>进度</span>
                  <span>20%</span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-white/90"
                    style={{ width: "20%" }}
                  />
                </div>
              </div>

              {/* Stars */}
              <div className="mt-3 flex gap-1 text-xl">
                <span>⭐</span>
                <span className="opacity-30">⭐</span>
                <span className="opacity-30">⭐</span>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* --- Teacher Upload Button --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="mt-8"
        >
          <Link href="/upload">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-4 text-center font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <span className="text-2xl">📝</span>
              <span className="text-lg">上传作业 · 提取原题</span>
            </motion.div>
          </Link>
        </motion.div>

        {/* --- Bottom Navigation Buttons --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-4 grid grid-cols-2 gap-4"
        >
          <Link href="/review">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-center font-semibold text-gray-700 shadow-md transition-shadow hover:shadow-lg"
            >
              <span className="text-2xl">📖</span>
              <span className="text-base">错题本</span>
            </motion.div>
          </Link>
          <Link href="/achievements">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-center font-semibold text-gray-700 shadow-md transition-shadow hover:shadow-lg"
            >
              <span className="text-2xl">🏆</span>
              <span className="text-base">我的成就</span>
            </motion.div>
          </Link>
        </motion.div>

        {/* --- Footer --- */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 pb-8 text-center text-sm text-gray-400"
        >
          Grammar Friends 语法小伙伴 · 快乐学语法
        </motion.footer>
      </div>
    </div>
  );
}
