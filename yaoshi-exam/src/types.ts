export type Track = "western" | "traditional";

export interface Question {
  id: string;
  track: Track | "shared";
  subject: string;
  knowledge: string;
  type: "single" | "multiple";
  prompt: string;
  options: Array<{ key: string; text: string }>;
  answer: string[];
  explanation: string;
}

export interface QuestionBankPayload {
  generatedAt: string;
  total: number;
  questions: Question[];
}

export interface ExamResult {
  score: number;
  correct: number;
  total: number;
  elapsedSeconds: number;
  answers: Record<string, string[]>;
  questionIds: string[];
  completedAt: string;
}
