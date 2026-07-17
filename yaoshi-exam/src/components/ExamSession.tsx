import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileCheck2,
  Info,
} from "lucide-react";
import type { ExamResult, Question } from "../types";

interface ExamSessionProps {
  questions: Question[];
  mode?: "practice" | "exam";
  onSubmit: (result: ExamResult) => void;
  onExit: () => void;
}

function sameAnswers(actual: string[] = [], expected: string[]) {
  return [...actual].sort().join("|") === [...expected].sort().join("|");
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

export function ExamSession({ questions, mode = "exam", onSubmit, onExit }: ExamSessionProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [revealed, setRevealed] = useState<string[]>([]);
  const question = questions[current];
  const selected = answers[question.id] ?? [];
  const isRevealed = revealed.includes(question.id);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const answeredCount = useMemo(
    () => questions.filter((item) => (answers[item.id]?.length ?? 0) > 0).length,
    [answers, questions],
  );

  function selectOption(key: string) {
    if (isRevealed) return;
    setAnswers((existing) => {
      const currentAnswers = existing[question.id] ?? [];
      const next = question.type === "single"
        ? [key]
        : currentAnswers.includes(key)
          ? currentAnswers.filter((item) => item !== key)
          : [...currentAnswers, key];
      return { ...existing, [question.id]: next };
    });
  }

  function submitExam() {
    const unanswered = questions.length - answeredCount;
    if (unanswered > 0 && !window.confirm(`还有 ${unanswered} 道题未作答，仍要交卷吗？`)) return;
    const correct = questions.filter((item) => sameAnswers(answers[item.id], item.answer)).length;
    onSubmit({
      score: Math.round((correct / questions.length) * 100),
      correct,
      total: questions.length,
      elapsedSeconds,
      answers,
      questionIds: questions.map((item) => item.id),
      completedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="exam-page">
      <header className="exam-topbar">
        <button className="icon-text-button" onClick={onExit}><ArrowLeft size={19} /> 退出练习</button>
        <div className="exam-title">
          <span>{mode === "practice" ? "专项练习 · 即时解析" : "历年真题 · 模拟考试卷"}</span>
          <small>共 {questions.length} 题 · 已答 {answeredCount} 题</small>
        </div>
        <div className="exam-clock"><Clock3 size={17} /> {formatTime(elapsedSeconds)}</div>
      </header>

      <div className="exam-progress"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>

      <main className="exam-layout">
        <section className="question-card">
          <div className="question-meta">
            <span className="question-count">{current + 1}<small> / {questions.length}</small></span>
            <span className="question-type">{question.type === "single" ? "最佳选择题" : "多项选择题"}</span>
            <span className="question-subject">{question.subject}</span>
            <button
              className={favorites.includes(question.id) ? "favorite active" : "favorite"}
              onClick={() => setFavorites((items) => items.includes(question.id) ? items.filter((id) => id !== question.id) : [...items, question.id])}
            >
              <Bookmark size={18} fill={favorites.includes(question.id) ? "currentColor" : "none"} /> 收藏
            </button>
          </div>
          <h1>{question.prompt}</h1>
          {question.type === "multiple" && <div className="question-tip"><Info size={16} /> 本题有多个正确选项，请选择全部正确答案。</div>}
          <div className="option-list">
            {question.options.map((option) => {
              const active = selected.includes(option.key);
              const correct = isRevealed && question.answer.includes(option.key);
              const incorrect = isRevealed && active && !question.answer.includes(option.key);
              return (
                <button
                  className={`answer-option${active ? " active" : ""}${correct ? " correct" : ""}${incorrect ? " incorrect" : ""}`}
                  key={option.key}
                  onClick={() => selectOption(option.key)}
                  aria-pressed={active}
                >
                  <span className="option-key">{option.key}</span>
                  <span>{option.text}</span>
                  {active && <CheckCircle2 size={21} />}
                </button>
              );
            })}
          </div>
          {mode === "practice" && isRevealed && (
            <div className="practice-explanation">
              <strong>正确答案：{question.answer.join("、")}</strong>
              <p>{question.explanation || "原资料未提供解析，请结合最新版教材复核。"}</p>
            </div>
          )}
          <footer className="question-actions">
            <button className="button button-ghost" onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>
              <ChevronLeft size={18} /> 上一题
            </button>
            {mode === "practice" && !isRevealed ? (
              <button className="button button-primary" onClick={() => setRevealed((items) => [...items, question.id])} disabled={selected.length === 0}>
                查看答案与解析
              </button>
            ) : current < questions.length - 1 ? (
              <button className="button button-primary" onClick={() => setCurrent((value) => value + 1)}>
                下一题 <ChevronRight size={18} />
              </button>
            ) : (
              <button className="button button-primary" onClick={submitExam}><FileCheck2 size={18} /> 完成并交卷</button>
            )}
          </footer>
        </section>

        <aside className="question-palette">
          <div className="palette-heading">
            <div><strong>答题卡</strong><small>{answeredCount} / {questions.length} 已完成</small></div>
            <span>{Math.round((answeredCount / questions.length) * 100)}%</span>
          </div>
          <div className="palette-grid">
            {questions.map((item, index) => (
              <button
                key={item.id}
                className={`${index === current ? "current " : ""}${answers[item.id]?.length ? "answered" : ""}`}
                onClick={() => setCurrent(index)}
                aria-label={`第 ${index + 1} 题${answers[item.id]?.length ? "，已答" : "，未答"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="palette-legend">
            <span><i className="legend-current" /> 当前</span>
            <span><i className="legend-answered" /> 已答</span>
            <span><i /> 未答</span>
          </div>
          <button className="button button-submit" onClick={submitExam}>交卷并查看报告</button>
          <p><Info size={14} /> {mode === "practice" ? "作答后可立即查看答案与解析。" : "交卷后统一查看成绩与解析。"}</p>
        </aside>
      </main>
    </div>
  );
}
