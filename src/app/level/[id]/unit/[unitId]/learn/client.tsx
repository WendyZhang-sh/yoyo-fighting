"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getUnit } from "@/data/units";

/* ------------------------------------------------------------------ */
/*  Demo card content for Unit 1: I'm / My name's                     */
/* ------------------------------------------------------------------ */

interface ExampleLine {
  en: React.ReactNode;
  cn: string;
  type?: "correct" | "wrong";
}

interface GrammarCard {
  icon: string;
  title: string;
  bg: string;
  intro?: React.ReactNode;
  examples?: ExampleLine[];
  bullets?: React.ReactNode[];
  footer?: React.ReactNode;
}

function buildCards(color: string): GrammarCard[] {
  const hl = (text: string) => (
    <span className="font-extrabold" style={{ color }}>
      {text}
    </span>
  );

  return [
    /* ---- Card 1: Rule Introduction ---- */
    {
      icon: "📖",
      title: "语法规则",
      bg: "#F0FFF4",
      intro: (
        <>
          用 &quot;{hl("I'm")}&quot; 来说&ldquo;我是...&rdquo;
          <br />
          <span className="text-base text-gray-500">
            {hl("I'm")} 是 <span className="font-semibold">I am</span> 的缩写
          </span>
        </>
      ),
      examples: [
        {
          en: (
            <>
              {hl("I'm")} Tom.
            </>
          ),
          cn: "我是汤姆。",
          type: "correct",
        },
        {
          en: (
            <>
              {hl("I'm")} a student.
            </>
          ),
          cn: "我是一个学生。",
          type: "correct",
        },
      ],
    },

    /* ---- Card 2: More Examples ---- */
    {
      icon: "📖",
      title: "语法规则",
      bg: "#F0FFF4",
      intro: (
        <>
          用 &quot;{hl("My name's")}&quot; 来说&ldquo;我的名字是...&rdquo;
          <br />
          <span className="text-base text-gray-500">
            {hl("name's")} 是{" "}
            <span className="font-semibold">name is</span> 的缩写
          </span>
        </>
      ),
      examples: [
        {
          en: (
            <>
              {hl("My name's")} Lucy.
            </>
          ),
          cn: "我的名字是露西。",
          type: "correct",
        },
        {
          en: (
            <>
              {hl("My name's")} Tom.
            </>
          ),
          cn: "我的名字是汤姆。",
          type: "correct",
        },
      ],
    },

    /* ---- Card 3: Common Mistakes ---- */
    {
      icon: "⚠️",
      title: "小心别犯错！",
      bg: "#FFFBEB",
      examples: [
        {
          en: <>I am Tom.</>,
          cn: "太正式了",
          type: "wrong",
        },
        {
          en: (
            <>
              {hl("I'm")} Tom.
            </>
          ),
          cn: "口语中用缩写更好",
          type: "correct",
        },
        {
          en: <>My name Tom.</>,
          cn: "缺少 is！",
          type: "wrong",
        },
        {
          en: (
            <>
              {hl("My name's")} Tom.
            </>
          ),
          cn: "",
          type: "correct",
        },
      ],
    },

    /* ---- Card 4: Tips ---- */
    {
      icon: "💡",
      title: "小贴士",
      bg: "#EBF8FF",
      bullets: [
        <>
          说话的时候，我们常用 {hl("I'm")}，不用 I am
        </>,
        <>
          注意：<span className="font-extrabold" style={{ color }}>I</span>{" "}
          永远大写！
        </>,
        <>
          {hl("My name's")} 和 {hl("I'm")} 意思差不多
          <br />
          <span className="ml-4 text-gray-500">都是介绍自己</span>
        </>,
      ],
      footer: (
        <div className="mt-6 text-center text-xl">
          🦒 你学会了吗？来做练习吧！
        </div>
      ),
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Slide animation variants                                          */
/* ------------------------------------------------------------------ */

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function LearnPageClient({
  id,
  unitId,
}: {
  id: string;
  unitId: string;
}) {
  const unit = getUnit(Number(id), Number(unitId));

  const accentColor = unit?.color ?? "#FF6B6B";
  const cards = buildCards(accentColor);

  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = forward, -1 = backward

  const goNext = () => {
    if (currentCard < cards.length - 1) {
      setDirection(1);
      setCurrentCard((c) => c + 1);
    }
  };

  const goPrev = () => {
    if (currentCard > 0) {
      setDirection(-1);
      setCurrentCard((c) => c - 1);
    }
  };

  const card = cards[currentCard];
  const isLast = currentCard === cards.length - 1;
  const isFirst = currentCard === 0;

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-[#FFFDF7] to-[#FFF3E0]">
      {/* ===== Top Bar ===== */}
      <header className="flex items-center gap-3 px-5 pb-2 pt-5">
        {/* Back button */}
        <Link
          href={`/level/${id}/unit/${unitId}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-md transition-transform active:scale-95"
        >
          ←
        </Link>

        {/* Title */}
        <h1 className="flex-1 text-center text-lg font-bold text-gray-700">
          语法讲解
        </h1>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {cards.map((_, i) => (
            <span
              key={i}
              className="inline-block h-2.5 w-2.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  i === currentCard ? accentColor : "#D1D5DB",
                transform: i === currentCard ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </header>

      {/* ===== Card Area ===== */}
      <div className="relative flex flex-1 items-stretch overflow-hidden px-5 py-4">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentCard}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex w-full flex-col rounded-3xl p-8 shadow-xl"
            style={{ backgroundColor: card.bg }}
          >
            {/* Card header */}
            <div className="mb-5 text-center">
              <span className="text-4xl">{card.icon}</span>
              <h2
                className="mt-2 text-2xl font-extrabold"
                style={{ color: accentColor }}
              >
                {card.title}
              </h2>
            </div>

            {/* Intro text */}
            {card.intro && (
              <div className="mb-6 text-center text-lg font-semibold leading-relaxed text-gray-700">
                {card.intro}
              </div>
            )}

            {/* Example sentences */}
            {card.examples && (
              <div className="flex flex-col gap-4">
                {card.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white/70 px-5 py-4 shadow-sm"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-lg">
                        {ex.type === "correct" ? "✅" : "❌"}
                      </span>
                      <div>
                        <p className="text-xl font-bold leading-snug text-gray-800">
                          {ex.en}
                        </p>
                        {ex.cn && (
                          <p className="mt-1 text-sm text-gray-500">
                            {ex.cn}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bullet points (tips card) */}
            {card.bullets && (
              <div className="flex flex-col gap-4 text-lg font-semibold leading-relaxed text-gray-700">
                {card.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Footer (e.g. mascot message) */}
            {card.footer && (
              <div className="mt-auto pt-4 text-lg font-bold text-gray-600">
                {card.footer}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ===== Navigation Buttons ===== */}
      <nav className="flex items-center gap-4 px-5 pb-6 pt-2">
        {/* Previous */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={goPrev}
          disabled={isFirst}
          className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-white text-lg font-bold shadow-md transition-colors disabled:opacity-30"
          style={{ color: accentColor }}
        >
          上一页
        </motion.button>

        {/* Next / Practice */}
        {isLast ? (
          <Link
            href={`/level/${id}/unit/${unitId}/practice`}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md transition-transform active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            ✏️ 来练一练！
          </Link>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            下一页
          </motion.button>
        )}
      </nav>
    </div>
  );
}
