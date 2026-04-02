"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { getUnit } from "@/data/units";

/* ================================================================
   Exercise Types & Data
   ================================================================ */

type ExerciseType =
  | "multiple-choice"
  | "fill-blank"
  | "true-false"
  | "word-order";

interface BaseExercise {
  type: ExerciseType;
  question: string;
  explanation: string;
  accentColor: string;
}

interface MultipleChoiceExercise extends BaseExercise {
  type: "multiple-choice";
  options: string[];
  correct: string;
}

interface FillBlankExercise extends BaseExercise {
  type: "fill-blank";
  answer: string;
  hint: string;
  sentenceBefore: string;
  sentenceAfter: string;
}

interface TrueFalseExercise extends BaseExercise {
  type: "true-false";
  sentence: string;
  correct: boolean;
  correctedSentence: string;
}

interface WordOrderExercise extends BaseExercise {
  type: "word-order";
  shuffledWords: string[];
  correctOrder: string[];
}

type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | TrueFalseExercise
  | WordOrderExercise;

const exercises: Exercise[] = [
  {
    type: "multiple-choice",
    question: "He ___ a student.",
    options: ["am", "is", "are", "be"],
    correct: "is",
    explanation: "他是一个学生。He 后面用 is。",
    accentColor: "#FF6B6B",
  },
  {
    type: "fill-blank",
    question: "___ name's Lucy.",
    answer: "My",
    hint: "M___",
    sentenceBefore: "",
    sentenceAfter: " name's Lucy.",
    explanation: "My name's Lucy. 我的名字是露西。",
    accentColor: "#45B7D1",
  },
  {
    type: "true-false",
    question: "判断下面这句话对不对：",
    sentence: "He can flies.",
    correct: false,
    correctedSentence: "He can fly.",
    explanation: "can 后面用动词原形，不加 s！",
    accentColor: "#FF8E53",
  },
  {
    type: "multiple-choice",
    question: "___ am a girl.",
    options: ["He", "She", "I", "You"],
    correct: "I",
    explanation: "I am a girl. 我是一个女孩。am 前面用 I。",
    accentColor: "#7C5CFC",
  },
  {
    type: "word-order",
    question: "把单词排成正确的句子：",
    shuffledWords: ["is", "a", "This", "cat", "."],
    correctOrder: ["This", "is", "a", "cat", "."],
    explanation: "This is a cat. 这是一只猫。",
    accentColor: "#51CF66",
  },
  {
    type: "multiple-choice",
    question: "There ___ two cats.",
    options: ["is", "are", "am", "be"],
    correct: "are",
    explanation: "两只猫是复数，用 are。There are two cats.",
    accentColor: "#FFB347",
  },
];

/* ================================================================
   Animation Variants
   ================================================================ */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

const feedbackVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const bounceIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 15,
      delay: 0.1,
    },
  },
};

const confettiEmojis = ["🎉", "⭐", "✨", "🌟", "💫", "🎊"];

/* ================================================================
   Main Practice Page
   ================================================================ */

export default function PracticePage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = React.use(params);
  const unit = getUnit(Number(id), Number(unitId));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Answer state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fillBlankInput, setFillBlankInput] = useState("");
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);
  const [wordOrderSelected, setWordOrderSelected] = useState<string[]>([]);
  const [wordOrderRemaining, setWordOrderRemaining] = useState<string[]>(
    () => exercises[0].type === "word-order" ? [...exercises[0].shuffledWords] : []
  );

  // Feedback state
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Progress state
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(
    () => new Array(exercises.length).fill(false)
  );
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const totalExercises = exercises.length;
  const currentExercise = exercises[currentIndex];
  const unitColor = unit?.color ?? "#FF6B6B";

  /* ---------- Helpers ---------- */

  const hasAnswer = useCallback((): boolean => {
    switch (currentExercise.type) {
      case "multiple-choice":
        return selectedAnswer !== null;
      case "fill-blank":
        return fillBlankInput.trim().length > 0;
      case "true-false":
        return trueFalseAnswer !== null;
      case "word-order":
        return (
          wordOrderSelected.length ===
          (currentExercise as WordOrderExercise).correctOrder.length
        );
      default:
        return false;
    }
  }, [
    currentExercise,
    selectedAnswer,
    fillBlankInput,
    trueFalseAnswer,
    wordOrderSelected,
  ]);

  const checkAnswer = useCallback((): boolean => {
    switch (currentExercise.type) {
      case "multiple-choice":
        return selectedAnswer === currentExercise.correct;
      case "fill-blank":
        return (
          fillBlankInput.trim().toLowerCase() ===
          currentExercise.answer.toLowerCase()
        );
      case "true-false":
        return trueFalseAnswer === currentExercise.correct;
      case "word-order":
        return (
          JSON.stringify(wordOrderSelected) ===
          JSON.stringify(currentExercise.correctOrder)
        );
      default:
        return false;
    }
  }, [
    currentExercise,
    selectedAnswer,
    fillBlankInput,
    trueFalseAnswer,
    wordOrderSelected,
  ]);

  const handleSubmit = () => {
    if (!hasAnswer()) return;
    const correct = checkAnswer();
    setIsCorrect(correct);
    setShowResult(true);
    setShowExplanation(true);
    if (correct) {
      setScore((prev) => prev + 1);
    }
    setCompleted((prev) => {
      const next = [...prev];
      next[currentIndex] = true;
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < totalExercises - 1) {
      const nextIndex = currentIndex + 1;
      setDirection(1);
      resetAnswerState();
      // Initialize word order for next exercise
      const nextExercise = exercises[nextIndex];
      if (nextExercise.type === "word-order") {
        setWordOrderRemaining([...nextExercise.shuffledWords]);
        setWordOrderSelected([]);
      }
      setCurrentIndex(nextIndex);
    } else {
      setShowResults(true);
    }
  };

  const resetAnswerState = () => {
    setSelectedAnswer(null);
    setFillBlankInput("");
    setTrueFalseAnswer(null);
    setWordOrderSelected([]);
    setWordOrderRemaining([]);
    setShowResult(false);
    setShowExplanation(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setDirection(-1);
    setScore(0);
    setCompleted(new Array(exercises.length).fill(false));
    setShowResults(false);
    resetAnswerState();
    // Initialize word order for first exercise
    if (exercises[0].type === "word-order") {
      setWordOrderRemaining([...exercises[0].shuffledWords]);
      setWordOrderSelected([]);
    }
  };

  /* ---------- Word Order Handlers ---------- */

  const handleWordSelect = (word: string, index: number) => {
    if (showResult) return;
    setWordOrderSelected((prev) => [...prev, word]);
    setWordOrderRemaining((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const handleWordDeselect = (word: string, index: number) => {
    if (showResult) return;
    setWordOrderRemaining((prev) => [...prev, word]);
    setWordOrderSelected((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  /* ---------- Not Found ---------- */

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

  /* ---------- Results Screen ---------- */

  if (showResults) {
    const stars = score === totalExercises ? 3 : score >= 4 ? 2 : score >= 2 ? 1 : 0;
    const messages = [
      { min: 6, text: "太厉害了！满分！", emoji: "🏆" },
      { min: 4, text: "非常棒！继续加油！", emoji: "🎉" },
      { min: 2, text: "不错哦，再练习一下！", emoji: "💪" },
      { min: 0, text: "加油，多练习就会进步！", emoji: "📚" },
    ];
    const message = messages.find((m) => score >= m.min)!;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FFFDF7] to-[#FFF3E0] px-6">
        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confettiEmojis.map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              initial={{
                x: `${15 + i * 14}%`,
                y: "-10%",
                rotate: 0,
                opacity: 0,
              }}
              animate={{
                y: "110%",
                rotate: 360 * (i % 2 === 0 ? 1 : -1),
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3 + i * 0.4,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeIn",
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="text-7xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
              delay: 0.2,
            }}
          >
            {message.emoji}
          </motion.div>

          <motion.h2
            className="mt-4 text-2xl font-extrabold text-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            练习完成！
          </motion.h2>

          <motion.p
            className="mt-2 text-lg font-semibold text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {message.text}
          </motion.p>

          {/* Score display */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span
              className="text-5xl font-extrabold"
              style={{ color: unitColor }}
            >
              {score}
            </span>
            <span className="text-2xl font-bold text-gray-400">
              / {totalExercises}
            </span>
          </motion.div>

          {/* Stars */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[1, 2, 3].map((s) => (
              <motion.span
                key={s}
                className="text-4xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: s <= stars ? 1 : 0.6,
                  rotate: 0,
                  opacity: s <= stars ? 1 : 0.3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 12,
                  delay: 0.9 + s * 0.15,
                }}
              >
                ⭐
              </motion.span>
            ))}
          </motion.div>

          {/* Progress bar showing score */}
          <motion.div
            className="mx-auto mt-6 h-3 w-48 overflow-hidden rounded-full bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: unitColor }}
              initial={{ width: 0 }}
              animate={{ width: `${(score / totalExercises) * 100}%` }}
              transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <button
              onClick={handleRetry}
              className="min-h-14 rounded-2xl px-8 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: unitColor }}
            >
              🔄 再做一次
            </button>
            <Link
              href={`/level/${id}/unit/${unitId}`}
              className="flex min-h-14 items-center justify-center rounded-2xl bg-gray-100 px-8 text-lg font-bold text-gray-600 shadow-md transition-all hover:scale-105 hover:bg-gray-200 active:scale-95"
            >
              ← 返回
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ---------- Main Exercise UI ---------- */

  const progressPercent =
    (completed.filter(Boolean).length / totalExercises) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFFDF7] to-[#FFF8F0]">
      {/* ===== Top bar ===== */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3">
          <Link
            href={`/level/${id}/unit/${unitId}`}
            className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-200 active:scale-95"
          >
            <span className="text-lg leading-none">←</span>
            <span className="hidden sm:inline">返回</span>
          </Link>

          <h2 className="text-base font-extrabold text-gray-700">
            Unit {unit.unitNumber} · 练习
          </h2>

          <span
            className="rounded-full px-3.5 py-1.5 text-sm font-extrabold text-white"
            style={{ backgroundColor: unitColor }}
          >
            {currentIndex + 1}/{totalExercises}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <motion.div
            className="h-full rounded-r-full"
            style={{ backgroundColor: unitColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ===== Exercise Area ===== */}
      <div className="relative mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        {/* Exercise type badge */}
        <motion.div
          key={`badge-${currentIndex}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2"
        >
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: currentExercise.accentColor }}
          >
            {currentExercise.type === "multiple-choice"
              ? "选择题"
              : currentExercise.type === "fill-blank"
                ? "填空题"
                : currentExercise.type === "true-false"
                  ? "判断题"
                  : "排序题"}
          </span>
          <span className="text-sm font-semibold text-gray-400">
            第 {currentIndex + 1} 题
          </span>
        </motion.div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Render current exercise */}
            {currentExercise.type === "multiple-choice" && (
              <MultipleChoiceUI
                exercise={currentExercise}
                selected={selectedAnswer}
                onSelect={setSelectedAnswer}
                showResult={showResult}
                isCorrect={isCorrect}
              />
            )}
            {currentExercise.type === "fill-blank" && (
              <FillBlankUI
                exercise={currentExercise}
                input={fillBlankInput}
                onInputChange={setFillBlankInput}
                showResult={showResult}
                isCorrect={isCorrect}
                showHint={showHint}
                onToggleHint={() => setShowHint((h) => !h)}
              />
            )}
            {currentExercise.type === "true-false" && (
              <TrueFalseUI
                exercise={currentExercise}
                selected={trueFalseAnswer}
                onSelect={setTrueFalseAnswer}
                showResult={showResult}
                isCorrect={isCorrect}
              />
            )}
            {currentExercise.type === "word-order" && (
              <WordOrderUI
                exercise={currentExercise}
                selectedWords={wordOrderSelected}
                remainingWords={wordOrderRemaining}
                onWordSelect={handleWordSelect}
                onWordDeselect={handleWordDeselect}
                showResult={showResult}
                isCorrect={isCorrect}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ===== Feedback Banner ===== */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              variants={feedbackVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-6 overflow-hidden rounded-2xl shadow-lg"
              style={{
                backgroundColor: isCorrect ? "#F0FFF4" : "#FFFAF0",
                borderLeft: `4px solid ${isCorrect ? "#38A169" : "#DD6B20"}`,
              }}
            >
              <div className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <motion.span
                    variants={bounceIn}
                    initial="hidden"
                    animate="visible"
                    className="text-2xl"
                  >
                    {isCorrect ? "🎉" : "🤔"}
                  </motion.span>
                  <span
                    className="text-lg font-extrabold"
                    style={{ color: isCorrect ? "#38A169" : "#DD6B20" }}
                  >
                    {isCorrect ? "太棒了!" : "再想想"}
                  </span>
                </div>
                <p className="mt-2 text-base font-semibold leading-relaxed text-gray-600">
                  {currentExercise.explanation}
                </p>
                {!isCorrect && currentExercise.type === "true-false" && (
                  <p className="mt-1 text-sm font-bold text-green-600">
                    正确的句子：{currentExercise.correctedSentence}
                  </p>
                )}
                {!isCorrect && currentExercise.type === "word-order" && (
                  <p className="mt-1 text-sm font-bold text-green-600">
                    正确顺序：{currentExercise.correctOrder.join(" ")}
                  </p>
                )}
                {!isCorrect && currentExercise.type === "multiple-choice" && (
                  <p className="mt-1 text-sm font-bold text-green-600">
                    正确答案：{currentExercise.correct}
                  </p>
                )}
                {!isCorrect && currentExercise.type === "fill-blank" && (
                  <p className="mt-1 text-sm font-bold text-green-600">
                    正确答案：{currentExercise.answer}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Bottom Buttons ===== */}
      <div className="sticky bottom-0 z-20 border-t border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-center px-5 py-4">
          {!showResult ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!hasAnswer()}
              className="min-h-14 w-full max-w-sm rounded-2xl text-lg font-extrabold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: hasAnswer()
                  ? currentExercise.accentColor
                  : "#CBD5E0",
              }}
            >
              确认
            </motion.button>
          ) : currentIndex < totalExercises - 1 ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="min-h-14 w-full max-w-sm rounded-2xl text-lg font-extrabold text-white shadow-lg"
              style={{ backgroundColor: unitColor }}
            >
              下一题 →
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="min-h-14 w-full max-w-sm rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-lg font-extrabold text-white shadow-lg"
            >
              查看成绩 📊
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Exercise Components
   ================================================================ */

/* ---------- Multiple Choice ---------- */

function MultipleChoiceUI({
  exercise,
  selected,
  onSelect,
  showResult,
  isCorrect,
}: {
  exercise: MultipleChoiceExercise;
  selected: string | null;
  onSelect: (v: string) => void;
  showResult: boolean;
  isCorrect: boolean;
}) {
  return (
    <div>
      {/* Question */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <p className="text-center text-2xl font-extrabold leading-relaxed text-gray-800">
          {exercise.question.split("___").map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && (
                <span
                  className="mx-1 inline-block min-w-16 border-b-4 px-2"
                  style={{
                    borderColor: selected
                      ? exercise.accentColor
                      : "#CBD5E0",
                  }}
                >
                  {selected && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: exercise.accentColor }}
                    >
                      {selected}
                    </motion.span>
                  )}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>

      {/* Options 2x2 grid */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {exercise.options.map((option) => {
          const isSelected = selected === option;
          const isCorrectAnswer = option === exercise.correct;
          let bg = "bg-white";
          let border = "border-2 border-gray-200";
          let textColor = "text-gray-700";
          let extraClass = "";

          if (showResult) {
            if (isCorrectAnswer) {
              bg = "bg-green-50";
              border = "border-3 border-green-400";
              textColor = "text-green-700";
            } else if (isSelected && !isCorrect) {
              bg = "bg-red-50";
              border = "border-3 border-red-400";
              textColor = "text-red-600";
            } else {
              bg = "bg-gray-50";
              border = "border-2 border-gray-200";
              textColor = "text-gray-400";
            }
          } else if (isSelected) {
            border = "border-3";
            extraClass = "shadow-md";
          }

          return (
            <motion.button
              key={option}
              whileHover={!showResult ? { scale: 1.04 } : {}}
              whileTap={!showResult ? { scale: 0.96 } : {}}
              onClick={() => !showResult && onSelect(option)}
              disabled={showResult}
              className={`relative min-h-14 rounded-2xl ${bg} ${border} ${textColor} ${extraClass} px-4 py-4 text-lg font-bold transition-all`}
              style={
                isSelected && !showResult
                  ? {
                      borderColor: exercise.accentColor,
                      backgroundColor: `${exercise.accentColor}10`,
                    }
                  : {}
              }
            >
              <span className="relative z-10">{option}</span>

              {/* Correct check icon */}
              {showResult && isCorrectAnswer && (
                <motion.span
                  variants={bounceIn}
                  initial="hidden"
                  animate="visible"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-green-500"
                >
                  ✓
                </motion.span>
              )}

              {/* Wrong X icon */}
              {showResult && isSelected && !isCorrect && !isCorrectAnswer && (
                <motion.span
                  variants={bounceIn}
                  initial="hidden"
                  animate="visible"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-red-500"
                >
                  ✗
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Confetti on correct */}
      <AnimatePresence>
        {showResult && isCorrect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {confettiEmojis.slice(0, 4).map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                style={{ left: `${20 + i * 20}%`, top: "30%" }}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: -80,
                  scale: [0, 1.2, 0.8],
                  rotate: [0, i % 2 === 0 ? 30 : -30],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Fill in the Blank ---------- */

function FillBlankUI({
  exercise,
  input,
  onInputChange,
  showResult,
  isCorrect,
  showHint,
  onToggleHint,
}: {
  exercise: FillBlankExercise;
  input: string;
  onInputChange: (v: string) => void;
  showResult: boolean;
  isCorrect: boolean;
  showHint: boolean;
  onToggleHint: () => void;
}) {
  const inputBorderColor = showResult
    ? isCorrect
      ? "#38A169"
      : "#E53E3E"
    : "#CBD5E0";

  return (
    <div>
      {/* Sentence with inline input */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <div className="flex flex-wrap items-baseline justify-center gap-1 text-2xl font-extrabold leading-relaxed text-gray-800">
          <span>{exercise.sentenceBefore}</span>
          <span className="relative inline-flex flex-col items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => !showResult && onInputChange(e.target.value)}
              disabled={showResult}
              placeholder="___"
              className="w-28 border-b-3 bg-transparent pb-1 text-center text-2xl font-extrabold outline-none transition-colors"
              style={{
                borderColor: inputBorderColor,
                borderStyle: "dashed",
                color: showResult
                  ? isCorrect
                    ? "#38A169"
                    : "#E53E3E"
                  : exercise.accentColor,
              }}
              autoFocus
            />
            {showResult && (
              <motion.span
                variants={bounceIn}
                initial="hidden"
                animate="visible"
                className="absolute -right-7 top-0 text-xl"
              >
                {isCorrect ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
              </motion.span>
            )}
          </span>
          <span>{exercise.sentenceAfter}</span>
        </div>
      </div>

      {/* Hint button */}
      {!showResult && (
        <motion.div
          className="mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={onToggleHint}
            className="rounded-full bg-yellow-50 px-5 py-2.5 text-sm font-bold text-yellow-600 shadow-sm transition-all hover:bg-yellow-100 active:scale-95"
          >
            💡 {showHint ? "隐藏提示" : "需要提示？"}
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {showHint && !showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden text-center"
          >
            <span className="inline-block rounded-xl bg-yellow-50 px-4 py-2 text-lg font-bold tracking-widest text-yellow-600">
              {exercise.hint}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- True or False ---------- */

function TrueFalseUI({
  exercise,
  selected,
  onSelect,
  showResult,
  isCorrect,
}: {
  exercise: TrueFalseExercise;
  selected: boolean | null;
  onSelect: (v: boolean) => void;
  showResult: boolean;
  isCorrect: boolean;
}) {
  return (
    <div>
      {/* Question prompt */}
      <p className="mb-3 text-center text-base font-bold text-gray-500">
        {exercise.question}
      </p>

      {/* Sentence card */}
      <motion.div
        className="rounded-2xl bg-white p-8 text-center shadow-md"
        style={{
          borderLeft: `4px solid ${exercise.accentColor}`,
        }}
      >
        <p className="text-2xl font-extrabold leading-relaxed text-gray-800">
          &ldquo;{exercise.sentence}&rdquo;
        </p>
      </motion.div>

      {/* True / False buttons */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* True button */}
        {(() => {
          const isSelectedTrue = selected === true;
          const isCorrectTrue = exercise.correct === true;

          let bg = "bg-green-50";
          let border = "border-2 border-green-200";
          let textColor = "text-green-600";

          if (showResult) {
            if (isCorrectTrue) {
              bg = "bg-green-100";
              border = "border-3 border-green-500";
            } else if (isSelectedTrue && !isCorrect) {
              bg = "bg-red-50";
              border = "border-3 border-red-400";
              textColor = "text-red-500";
            } else {
              bg = "bg-gray-50";
              border = "border-2 border-gray-200";
              textColor = "text-gray-400";
            }
          } else if (isSelectedTrue) {
            bg = "bg-green-100";
            border = "border-3 border-green-500";
          }

          return (
            <motion.button
              whileHover={!showResult ? { scale: 1.04 } : {}}
              whileTap={!showResult ? { scale: 0.96 } : {}}
              onClick={() => !showResult && onSelect(true)}
              disabled={showResult}
              className={`min-h-16 rounded-2xl ${bg} ${border} ${textColor} px-4 py-4 text-xl font-extrabold transition-all`}
            >
              <span className="mr-1">✓</span> 正确
              {showResult && isCorrectTrue && (
                <motion.span
                  variants={bounceIn}
                  initial="hidden"
                  animate="visible"
                  className="ml-2"
                >
                  ✅
                </motion.span>
              )}
            </motion.button>
          );
        })()}

        {/* False button */}
        {(() => {
          const isSelectedFalse = selected === false;
          const isCorrectFalse = exercise.correct === false;

          let bg = "bg-red-50";
          let border = "border-2 border-red-200";
          let textColor = "text-red-500";

          if (showResult) {
            if (isCorrectFalse) {
              bg = "bg-green-100";
              border = "border-3 border-green-500";
              textColor = "text-green-600";
            } else if (isSelectedFalse && !isCorrect) {
              bg = "bg-red-100";
              border = "border-3 border-red-400";
            } else {
              bg = "bg-gray-50";
              border = "border-2 border-gray-200";
              textColor = "text-gray-400";
            }
          } else if (isSelectedFalse) {
            bg = "bg-red-100";
            border = "border-3 border-red-500";
          }

          return (
            <motion.button
              whileHover={!showResult ? { scale: 1.04 } : {}}
              whileTap={!showResult ? { scale: 0.96 } : {}}
              onClick={() => !showResult && onSelect(false)}
              disabled={showResult}
              className={`min-h-16 rounded-2xl ${bg} ${border} ${textColor} px-4 py-4 text-xl font-extrabold transition-all`}
            >
              <span className="mr-1">✗</span> 错误
              {showResult && isCorrectFalse && (
                <motion.span
                  variants={bounceIn}
                  initial="hidden"
                  animate="visible"
                  className="ml-2"
                >
                  ✅
                </motion.span>
              )}
            </motion.button>
          );
        })()}
      </div>

      {/* Show corrected sentence */}
      <AnimatePresence>
        {showResult && !exercise.correct && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl bg-green-50 px-5 py-3 text-center"
          >
            <p className="text-sm font-bold text-gray-500">正确的句子：</p>
            <p className="mt-1 text-lg font-extrabold text-green-600">
              {exercise.correctedSentence}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Word Order ---------- */

function WordOrderUI({
  exercise,
  selectedWords,
  remainingWords,
  onWordSelect,
  onWordDeselect,
  showResult,
  isCorrect,
}: {
  exercise: WordOrderExercise;
  selectedWords: string[];
  remainingWords: string[];
  onWordSelect: (word: string, index: number) => void;
  onWordDeselect: (word: string, index: number) => void;
  showResult: boolean;
  isCorrect: boolean;
}) {
  const sentenceBorderColor = showResult
    ? isCorrect
      ? "#38A169"
      : "#E53E3E"
    : "#E2E8F0";

  return (
    <div>
      {/* Question */}
      <p className="mb-3 text-center text-base font-bold text-gray-500">
        {exercise.question}
      </p>

      {/* Sentence area (where selected words appear) */}
      <LayoutGroup>
        <div
          className="min-h-20 rounded-2xl bg-white p-4 shadow-md transition-colors"
          style={{ border: `3px solid ${sentenceBorderColor}` }}
        >
          <div className="flex min-h-12 flex-wrap items-center gap-2">
            {selectedWords.length === 0 && (
              <span className="text-base font-semibold text-gray-300">
                点击下面的单词来组成句子...
              </span>
            )}
            <AnimatePresence mode="popLayout">
              {selectedWords.map((word, idx) => (
                <motion.button
                  key={`selected-${word}-${idx}`}
                  layoutId={`word-${word}-${idx}-selected`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  onClick={() => onWordDeselect(word, idx)}
                  disabled={showResult}
                  className="rounded-xl px-4 py-2.5 text-lg font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: exercise.accentColor }}
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Result indicator */}
            {showResult && (
              <motion.span
                variants={bounceIn}
                initial="hidden"
                animate="visible"
                className="ml-auto text-2xl"
              >
                {isCorrect ? "✓" : "✗"}
              </motion.span>
            )}
          </div>
        </div>

        {/* Word bank (remaining words) */}
        <div className="mt-6">
          <p className="mb-2 text-center text-sm font-semibold text-gray-400">
            可用单词
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <AnimatePresence mode="popLayout">
              {remainingWords.map((word, idx) => (
                <motion.button
                  key={`remaining-${word}-${idx}`}
                  layoutId={`word-${word}-${idx}-remaining`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  onClick={() => onWordSelect(word, idx)}
                  disabled={showResult}
                  className="rounded-xl border-2 bg-white px-5 py-3 text-lg font-bold shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95"
                  style={{
                    borderColor: `${exercise.accentColor}60`,
                    color: exercise.accentColor,
                  }}
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>

      {/* Show correct order on wrong answer */}
      <AnimatePresence>
        {showResult && !isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl bg-green-50 px-5 py-3 text-center"
          >
            <p className="text-sm font-bold text-gray-500">正确顺序：</p>
            <p className="mt-1 text-lg font-extrabold text-green-600">
              {exercise.correctOrder.join(" ")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
