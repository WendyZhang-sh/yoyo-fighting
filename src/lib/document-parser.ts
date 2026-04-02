/**
 * Document text extraction utilities.
 * Supports: Word (.docx), PDF (.pdf), Images (.jpg/.png → base64 for vision API)
 */

import mammoth from "mammoth";

/* ----------------------------------------------------------------
   Word (.docx) → plain text
   ---------------------------------------------------------------- */

export async function extractTextFromWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/* ----------------------------------------------------------------
   PDF (.pdf) → plain text
   ---------------------------------------------------------------- */

export async function extractTextFromPDF(file: File): Promise<string> {
  // Dynamic import to avoid SSR issues with pdfjs-dist
  const pdfjsLib = await import("pdfjs-dist");

  // Use the bundled worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const textParts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    textParts.push(pageText);
  }

  return textParts.join("\n\n").trim();
}

/* ----------------------------------------------------------------
   Image → base64 data URL (for OpenAI Vision API)
   ---------------------------------------------------------------- */

export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ----------------------------------------------------------------
   Detect file type and extract content
   Returns { text, imageBase64 } — one of them will be populated
   ---------------------------------------------------------------- */

export interface ExtractedContent {
  text: string | null;
  imageBase64: string | null;
  fileName: string;
  fileType: "word" | "pdf" | "image";
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
const WORD_EXTENSIONS = [".docx"];
const PDF_EXTENSIONS = [".pdf"];

export function getFileType(file: File): "word" | "pdf" | "image" | null {
  const name = file.name.toLowerCase();
  if (WORD_EXTENSIONS.some((ext) => name.endsWith(ext))) return "word";
  if (PDF_EXTENSIONS.some((ext) => name.endsWith(ext))) return "pdf";
  if (IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext))) return "image";
  if (file.type.startsWith("image/")) return "image";
  return null;
}

export async function extractContent(file: File): Promise<ExtractedContent> {
  const fileType = getFileType(file);
  if (!fileType) throw new Error(`不支持的文件格式: ${file.name}`);

  switch (fileType) {
    case "word": {
      const text = await extractTextFromWord(file);
      return { text, imageBase64: null, fileName: file.name, fileType };
    }
    case "pdf": {
      const text = await extractTextFromPDF(file);
      return { text, imageBase64: null, fileName: file.name, fileType };
    }
    case "image": {
      const imageBase64 = await imageToBase64(file);
      return { text: null, imageBase64, fileName: file.name, fileType };
    }
  }
}
