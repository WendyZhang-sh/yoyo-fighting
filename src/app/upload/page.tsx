"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  getApiKey,
  setApiKey,
  getBaseUrl,
  setBaseUrl,
  getModel,
  setModel,
  generateExercises,
  getPracticeSets,
  deletePracticeSet,
  type GeneratedPracticeSet,
} from "@/lib/openai";
import { extractContent, getFileType } from "@/lib/document-parser";

/* ================================================================
   Upload Page
   ================================================================ */

export default function UploadPage() {
  const router = useRouter();

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyState] = useState("");
  const [baseUrl, setBaseUrlState] = useState("");
  const [model, setModelState] = useState("");

  // Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedPreview, setExtractedPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  // History
  const [practiceSets, setPracticeSets] = useState<GeneratedPracticeSet[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load settings and history on mount
  useEffect(() => {
    setApiKeyState(getApiKey());
    setBaseUrlState(getBaseUrl());
    setModelState(getModel());
    setPracticeSets(getPracticeSets());
  }, []);

  // Auto-show settings if no API key
  useEffect(() => {
    if (!getApiKey()) setShowSettings(true);
  }, []);

  /* ---------- Settings Handlers ---------- */

  const handleSaveSettings = () => {
    setApiKey(apiKey);
    setBaseUrl(baseUrl);
    setModel(model);
    setShowSettings(false);
  };

  /* ---------- File Handlers ---------- */

  const handleFileSelect = useCallback(async (file: File) => {
    const type = getFileType(file);
    if (!type) {
      setError(`不支持的文件格式。请上传 Word (.docx)、PDF 或图片文件。`);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setExtractedPreview(null);
    setImagePreview(null);

    try {
      const content = await extractContent(file);
      if (content.text) {
        setExtractedPreview(content.text);
      }
      if (content.imageBase64) {
        setImagePreview(content.imageBase64);
      }
    } catch (err) {
      setError(`文件读取失败: ${err instanceof Error ? err.message : "未知错误"}`);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  /* ---------- Generate Exercises ---------- */

  const handleGenerate = async () => {
    if (!selectedFile) return;
    if (!getApiKey()) {
      setShowSettings(true);
      setError("请先设置 API Key");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress("正在读取文件...");

    try {
      const content = await extractContent(selectedFile);
      const result = await generateExercises(content, setProgress);

      // Refresh the list
      setPracticeSets(getPracticeSets());

      // Navigate to practice page
      router.push(`/upload/practice?id=${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setIsGenerating(false);
      setProgress("");
    }
  };

  /* ---------- Delete History ---------- */

  const handleDelete = (id: string) => {
    deletePracticeSet(id);
    setPracticeSets(getPracticeSets());
  };

  /* ---------- File type labels ---------- */

  const fileTypeLabels: Record<string, { icon: string; label: string }> = {
    word: { icon: "📄", label: "Word 文档" },
    pdf: { icon: "📑", label: "PDF 文档" },
    image: { icon: "🖼️", label: "图片" },
  };

  /* ---------- Render ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF7] to-[#FFF3E0]">
      {/* ===== Header ===== */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-200 active:scale-95"
          >
            <span className="text-lg leading-none">←</span>
            <span>首页</span>
          </Link>

          <h1 className="text-lg font-extrabold text-gray-700">
            📝 上传作业
          </h1>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-full bg-gray-100 px-3.5 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-200 active:scale-95"
          >
            ⚙️ 设置
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-6">
        {/* ===== Settings Panel ===== */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-2xl border-2 border-blue-100 bg-blue-50/50 p-5">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-gray-700">
                  ⚙️ API 设置
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  需要 OpenAI API Key 来提取和转换题目。支持兼容 OpenAI 格式的第三方 API。
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-600">
                      API Key *
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKeyState(e.target.value)}
                      placeholder="sk-..."
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium outline-none transition focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-600">
                      API Base URL
                    </label>
                    <input
                      type="text"
                      value={baseUrl}
                      onChange={(e) => setBaseUrlState(e.target.value)}
                      placeholder="https://api.openai.com/v1"
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium outline-none transition focus:border-blue-400"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      默认 OpenAI，可改为其他兼容服务地址
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-600">
                      模型
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModelState(e.target.value)}
                      placeholder="gpt-4o"
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium outline-none transition focus:border-blue-400"
                    />
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    className="mt-2 rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-600 active:scale-95"
                  >
                    保存设置
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Upload Area ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-3xl border-3 border-dashed p-8 text-center transition-all ${
              isDragging
                ? "border-orange-400 bg-orange-50 scale-[1.02]"
                : selectedFile
                  ? "border-green-300 bg-green-50/50"
                  : "border-gray-300 bg-white hover:border-orange-300 hover:bg-orange-50/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleInputChange}
              accept=".docx,.pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp"
              className="hidden"
            />

            {!selectedFile ? (
              <>
                <div className="text-6xl">📤</div>
                <p className="mt-4 text-lg font-bold text-gray-700">
                  拖拽文件到这里，或点击选择文件
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  支持 Word (.docx)、PDF、图片 (JPG/PNG)
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl">
                  {fileTypeLabels[getFileType(selectedFile) || ""]?.icon || "📎"}
                </div>
                <p className="mt-3 text-lg font-bold text-gray-700">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-400">
                  {fileTypeLabels[getFileType(selectedFile) || ""]?.label || ""}{" "}
                  · {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
                <p className="mt-2 text-xs text-blue-500 font-medium">
                  点击可重新选择文件
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* ===== Image Preview ===== */}
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 overflow-hidden rounded-2xl border-2 border-orange-200 bg-white"
          >
            <div className="px-4 py-2.5 bg-orange-50 border-b border-orange-200 flex items-center gap-2">
              <span className="text-base">📋</span>
              <span className="text-sm font-bold text-orange-700">原题内容</span>
            </div>
            <div className="p-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="原题"
                className="max-h-[480px] rounded-lg object-contain"
              />
            </div>
          </motion.div>
        )}

        {/* ===== Text Preview ===== */}
        {extractedPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 overflow-hidden rounded-2xl border-2 border-orange-200 bg-white"
          >
            <div className="px-4 py-2.5 bg-orange-50 border-b border-orange-200 flex items-center gap-2">
              <span className="text-base">📋</span>
              <span className="text-sm font-bold text-orange-700">原题内容</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                {extractedPreview}
              </p>
            </div>
          </motion.div>
        )}

        {/* ===== Error ===== */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-3"
            >
              <p className="text-sm font-bold text-red-600">❌ {error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Generate Button ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <button
            onClick={handleGenerate}
            disabled={!selectedFile || isGenerating}
            className="w-full rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-4 text-lg font-extrabold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-3">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="inline-block text-2xl"
                >
                  ⏳
                </motion.span>
                {progress}
              </span>
            ) : (
              <span>🚀 提取原题 · 开始练习</span>
            )}
          </button>
        </motion.div>

        {/* ===== History ===== */}
        {practiceSets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10"
          >
            <h2 className="mb-4 text-lg font-extrabold text-gray-700">
              📋 历史练习
            </h2>
            <div className="space-y-3">
              {practiceSets.map((set) => (
                <motion.div
                  key={set.id}
                  layout
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                    📝
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-700 truncate">
                      {set.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {set.fileName} · {set.exercises.length} 题 ·{" "}
                      {new Date(set.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/upload/practice?id=${set.id}`}
                      className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                    >
                      开始练习
                    </Link>
                    <button
                      onClick={() => handleDelete(set.id)}
                      className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-bold text-gray-500 transition hover:bg-red-100 hover:text-red-500 active:scale-95"
                    >
                      删除
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== Tips ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 rounded-2xl bg-yellow-50/80 p-5 border-2 border-yellow-100"
        >
          <h3 className="flex items-center gap-2 font-bold text-gray-700">
            💡 使用提示
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-500">
            <li>
              • 上传 Grammar Friends 课本的作业页，AI 会自动识别并提取原题
            </li>
            <li>• 支持 Word 文档、PDF 文件和拍照/截图的图片</li>
            <li>• 原题会被转换为选择、填空、判断、排序等交互题型，保持原题内容不变</li>
            <li>• 可以使用 OpenAI 或其他兼容 API（如 Deepseek 等）</li>
            <li>• 做题时可随时点击「📋 原题」按钮查看原始文档</li>
          </ul>
        </motion.div>

        {/* ===== Footer spacer ===== */}
        <div className="h-8" />
      </div>
    </div>
  );
}
