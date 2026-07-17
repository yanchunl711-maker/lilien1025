import { ArrowRight, BookX, RotateCcw } from "lucide-react";
import type { Question } from "../types";

interface WrongBookProps {
  questions: Question[];
  onPractice: () => void;
}

export function WrongBook({ questions, onPractice }: WrongBookProps) {
  return (
    <div className="simple-page">
      <div className="simple-page-heading">
        <span className="section-kicker">REVIEW</span>
        <h1>错题本</h1>
        <p>错题不是负担，而是下一轮提分最短的路径。</p>
      </div>
      {questions.length === 0 ? (
        <div className="empty-state panel">
          <span><BookX size={34} /></span>
          <h2>还没有错题记录</h2>
          <p>完成一次诊断模考后，答错的题目会自动出现在这里。</p>
          <button className="button button-primary" onClick={onPractice}>开始第一次模考 <ArrowRight size={18} /></button>
        </div>
      ) : (
        <div className="wrong-list">
          {questions.map((question, index) => (
            <article className="wrong-card panel" key={question.id}>
              <span className="wrong-index">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <small>{question.subject} · {question.knowledge}</small>
                <h2>{question.prompt}</h2>
                <p>正确答案：{question.answer.join("、")}</p>
              </div>
            </article>
          ))}
          <button className="button button-primary" onClick={onPractice}><RotateCcw size={18} /> 重新练习这组题</button>
        </div>
      )}
    </div>
  );
}
