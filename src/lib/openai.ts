/**
 * OpenAI API integration for exercise generation.
 * Uses the user-provided API key stored in localStorage.
 */

import type { ExtractedContent } from "./document-parser";

/* ----------------------------------------------------------------
   Types
   ---------------------------------------------------------------- */

export type ExerciseType =
  | "multiple-choice"
  | "fill-blank"
  | "true-false"
  | "word-order";

export interface GeneratedMultipleChoice {
  type: "multiple-choice";
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface GeneratedFillBlank {
  type: "fill-blank";
  question: string;
  sentenceBefore: string;
  sentenceAfter: string;
  answer: string;
  hint: string;
  explanation: string;
}

export interface GeneratedTrueFalse {
  type: "true-false";
  question: string;
  sentence: string;
  correct: boolean;
  correctedSentence: string;
  explanation: string;
}

export interface GeneratedWordOrder {
  type: "word-order";
  question: string;
  shuffledWords: string[];
  correctOrder: string[];
  explanation: string;
}

export type GeneratedExercise =
  | GeneratedMultipleChoice
  | GeneratedFillBlank
  | GeneratedTrueFalse
  | GeneratedWordOrder;

export interface GeneratedPracticeSet {
  id: string;
  title: string;
  fileName: string;
  createdAt: string;
  exercises: GeneratedExercise[];
  /** Original extracted text from Word/PDF */
  originalText?: string;
  /** Original image as base64 data URL */
  originalImage?: string;
}

/* ----------------------------------------------------------------
   API Key Management
   ---------------------------------------------------------------- */

const API_KEY_STORAGE_KEY = "gf_openai_api_key";
const API_BASE_URL_STORAGE_KEY = "gf_openai_base_url";
const API_MODEL_STORAGE_KEY = "gf_openai_model";

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function getBaseUrl(): string {
  if (typeof window === "undefined") return "https://api.openai.com/v1";
  return (
    localStorage.getItem(API_BASE_URL_STORAGE_KEY) ||
    "https://api.openai.com/v1"
  );
}

export function setBaseUrl(url: string): void {
  localStorage.setItem(API_BASE_URL_STORAGE_KEY, url || "https://api.openai.com/v1");
}

export function getModel(): string {
  if (typeof window === "undefined") return "gpt-4o";
  return localStorage.getItem(API_MODEL_STORAGE_KEY) || "gpt-4o";
}

export function setModel(model: string): void {
  localStorage.setItem(API_MODEL_STORAGE_KEY, model || "gpt-4o");
}

/* ----------------------------------------------------------------
   Generated Practice Sets Storage
   ---------------------------------------------------------------- */

const PRACTICE_SETS_KEY = "gf_generated_practice_sets";

export function getPracticeSets(): GeneratedPracticeSet[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PRACTICE_SETS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function savePracticeSet(set: GeneratedPracticeSet): void {
  const sets = getPracticeSets();
  sets.unshift(set);
  localStorage.setItem(PRACTICE_SETS_KEY, JSON.stringify(sets));
}

export function getPracticeSetById(
  id: string
): GeneratedPracticeSet | undefined {
  return getPracticeSets().find((s) => s.id === id);
}

export function deletePracticeSet(id: string): void {
  const sets = getPracticeSets().filter((s) => s.id !== id);
  localStorage.setItem(PRACTICE_SETS_KEY, JSON.stringify(sets));
}

/* ----------------------------------------------------------------
   Exercise Generation Prompt
   ---------------------------------------------------------------- */

const SYSTEM_PROMPT = `You are an English grammar exercise converter for elementary school students (小学生) in China, based on the Grammar Friends textbook.

Your job is to EXTRACT the original exercises/questions from the uploaded homework document and CONVERT them into a structured interactive format. Do NOT invent new questions — faithfully preserve the original content.

## Conversion rules

For each original question in the document, choose the best matching type:

1. "multiple-choice" — Use when the original has options (a/b/c/d), or is a fill-in-the-blank that can naturally become a choice question. Provide 4 options including the correct answer.
2. "fill-blank" — Use when the original asks the student to write/fill a word or short phrase, and no options are given.
3. "true-false" — Use when the original asks to judge correctness, tick/cross, or correct mistakes in a sentence.
4. "word-order" — Use when the original asks to reorder words or make a sentence from given words.

## Key principles

- KEEP the original sentences, vocabulary, and grammar points exactly as they appear in the document.
- If the document provides answer options, use those exact options.
- If the document numbers the questions (1, 2, 3…), extract each one as a separate exercise.
- Add a brief Chinese explanation (简体中文) for each exercise to help the student understand.
- For fill-blank "hint", take the first letter of the answer followed by "___" (e.g. "M___").
- For fill-blank "sentenceBefore" / "sentenceAfter", split the sentence at the blank position.

IMPORTANT: Return ONLY valid JSON with no markdown formatting, no code blocks, no extra text. Return a JSON object with this exact structure:
{
  "title": "练习标题 (Chinese, summarizing the grammar topic)",
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "He ___ a student.",
      "options": ["am", "is", "are", "be"],
      "correct": "is",
      "explanation": "他是一个学生。He 后面用 is。"
    },
    {
      "type": "fill-blank",
      "question": "___ name's Lucy.",
      "sentenceBefore": "",
      "sentenceAfter": " name's Lucy.",
      "answer": "My",
      "hint": "M___",
      "explanation": "My name's Lucy. 我的名字是露西。"
    },
    {
      "type": "true-false",
      "question": "判断下面这句话对不对：",
      "sentence": "He can flies.",
      "correct": false,
      "correctedSentence": "He can fly.",
      "explanation": "can 后面用动词原形，不加 s！"
    },
    {
      "type": "word-order",
      "question": "把单词排成正确的句子：",
      "shuffledWords": ["is", "a", "This", "cat", "."],
      "correctOrder": ["This", "is", "a", "cat", "."],
      "explanation": "This is a cat. 这是一只猫。"
    }
  ]
}

Extract ALL exercises from the document. Keep the original question content intact.`;

/* ----------------------------------------------------------------
   Call OpenAI API
   ---------------------------------------------------------------- */

interface ChatMessage {
  role: "system" | "user";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export async function generateExercises(
  content: ExtractedContent,
  onProgress?: (status: string) => void
): Promise<GeneratedPracticeSet> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("请先设置 API Key");

  const baseUrl = getBaseUrl();
  const model = getModel();

  onProgress?.("正在识别文档中的题目...");

  // Build messages
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (content.imageBase64) {
    // Image: use vision capability
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: "请仔细识别这张作业/试卷图片中的每一道题目，将它们逐一提取出来，转换为交互式练习格式。保持原题内容不变。",
        },
        {
          type: "image_url",
          image_url: { url: content.imageBase64 },
        },
      ],
    });
  } else if (content.text) {
    // Text content from Word/PDF
    messages.push({
      role: "user",
      content: `请从以下作业文档中提取每一道原题，将它们转换为交互式练习格式。保持原题内容不变。\n\n---\n${content.text}\n---`,
    });
  } else {
    throw new Error("文档内容为空");
  }

  onProgress?.("正在转换题目格式...");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMsg =
      errorData?.error?.message || `API 请求失败 (${response.status})`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) throw new Error("API 返回内容为空");

  onProgress?.("正在解析题目结构...");

  // Parse JSON from the response (handle potential markdown code blocks)
  let jsonStr = rawContent.trim();
  // Remove markdown code blocks if present
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  let parsed: { title: string; exercises: GeneratedExercise[] };
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("AI 返回的格式无法解析，请重试");
  }

  if (
    !parsed.exercises ||
    !Array.isArray(parsed.exercises) ||
    parsed.exercises.length === 0
  ) {
    throw new Error("AI 未生成有效的练习题，请重试");
  }

  // Assign accent colors to exercises
  const colors = [
    "#FF6B6B",
    "#45B7D1",
    "#FF8E53",
    "#7C5CFC",
    "#51CF66",
    "#FFB347",
    "#E84393",
    "#00B894",
    "#FDCB6E",
    "#6C5CE7",
  ];

  const exercises = parsed.exercises.map((ex, i) => ({
    ...ex,
    accentColor: colors[i % colors.length],
  }));

  const practiceSet: GeneratedPracticeSet = {
    id: `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: parsed.title || "自动生成的练习",
    fileName: content.fileName,
    createdAt: new Date().toISOString(),
    exercises,
    originalText: content.text ?? undefined,
    originalImage: content.imageBase64 ?? undefined,
  };

  savePracticeSet(practiceSet);
  onProgress?.("练习生成完成！");

  return practiceSet;
}
