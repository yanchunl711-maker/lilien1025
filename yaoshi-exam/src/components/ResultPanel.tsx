import {
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Home,
  Lightbulb,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

import { demoQuestions } from "../data/questions";
import type { ExamResult, Question } from "../types";

export interface ResultPanelProps {
  result: ExamResult;
  questions?: Question[];
  onBackHome: () => void;
  onRetry: () => void;
}

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} 秒`;
  }

  return `${minutes} 分 ${remainingSeconds.toString().padStart(2, "0")} 秒`;
};

const answersMatch = (userAnswer: string[], correctAnswer: string[]) => {
  if (userAnswer.length !== correctAnswer.length) {
    return false;
  }

  const userAnswerSet = new Set(userAnswer);
  return correctAnswer.every((answer) => userAnswerSet.has(answer));
};

const formatAnswer = (question: Question, answerKeys: string[]) => {
  if (answerKeys.length === 0) {
    return "未作答";
  }

  return answerKeys
    .map((key) => {
      const option = question.options.find((item) => item.key === key);
      return option ? `${option.key}. ${option.text}` : key;
    })
    .join("；");
};

const getSuggestion = (score: number, weakKnowledge: string[]) => {
  if (score >= 90) {
    return "基础掌握扎实，建议继续保持节奏，并通过限时套题训练答题稳定性。";
  }

  if (score >= 70) {
    return weakKnowledge.length > 0
      ? `整体表现良好，建议优先复习${weakKnowledge.slice(0, 2).join("、")}，再用同类题巩固。`
      : "整体表现良好，建议复盘犹豫题，并继续进行分科强化练习。";
  }

  return weakKnowledge.length > 0
    ? `当前需要重点补强${weakKnowledge.slice(0, 2).join("、")}，建议先回顾知识点，再完成一组针对性练习。`
    : "建议先梳理核心知识点，再通过小组题逐步巩固，暂时不必追求答题速度。";
};

export function ResultPanel({
  result,
  questions = demoQuestions,
  onBackHome,
  onRetry,
}: ResultPanelProps) {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(result.score)));
  const questionResults = questions.map((question) => {
    const userAnswer = result.answers[question.id] ?? [];
    return {
      question,
      userAnswer,
      isCorrect: answersMatch(userAnswer, question.answer),
    };
  });
  const weakKnowledge = Array.from(
    new Set(
      questionResults
        .filter(({ isCorrect }) => !isCorrect)
        .map(({ question }) => question.knowledge),
    ),
  );
  const suggestion = getSuggestion(normalizedScore, weakKnowledge);

  return (
    <main className="result-panel" aria-labelledby="result-title">
      <section className="result-panel__hero">
        <div className="result-panel__eyebrow">
          <Trophy aria-hidden="true" size={20} />
          <span>本次练习已完成</span>
        </div>

        <div className="result-panel__score-block">
          <p className="result-panel__score" aria-label={`本次得分 ${normalizedScore} 分`}>
            <strong>{normalizedScore}</strong>
            <span>分</span>
          </p>
          <div>
            <h1 id="result-title">成绩报告</h1>
            <p>每一次复盘，都会让下一次作答更有把握。</p>
          </div>
        </div>

        <dl className="result-panel__metrics" aria-label="考试数据概览">
          <div className="result-panel__metric">
            <dt>
              <CheckCircle2 aria-hidden="true" size={19} />
              答对
            </dt>
            <dd>{result.correct} 题</dd>
          </div>
          <div className="result-panel__metric">
            <dt>
              <Target aria-hidden="true" size={19} />
              总题数
            </dt>
            <dd>{result.total} 题</dd>
          </div>
          <div className="result-panel__metric">
            <dt>
              <Clock3 aria-hidden="true" size={19} />
              用时
            </dt>
            <dd>{formatDuration(result.elapsedSeconds)}</dd>
          </div>
        </dl>
      </section>

      <section className="result-panel__suggestion" aria-labelledby="result-suggestion-title">
        <div className="result-panel__section-icon">
          <Lightbulb aria-hidden="true" size={22} />
        </div>
        <div>
          <h2 id="result-suggestion-title">学习建议</h2>
          <p>{suggestion}</p>
          {weakKnowledge.length > 0 && (
            <ul className="result-panel__knowledge-tags" aria-label="待加强知识点">
              {weakKnowledge.map((knowledge) => (
                <li key={knowledge}>{knowledge}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="result-review" aria-labelledby="result-review-title">
        <header className="result-review__header">
          <div>
            <p className="result-review__kicker">
              <BookOpenCheck aria-hidden="true" size={19} />
              逐题复盘
            </p>
            <h2 id="result-review-title">答案与解析</h2>
          </div>
          <p>{questionResults.length} 道题</p>
        </header>

        {questionResults.length > 0 ? (
          <ol className="result-review__list">
            {questionResults.map(({ question, userAnswer, isCorrect }, index) => (
              <li
                className={`result-review__item ${
                  isCorrect ? "result-review__item--correct" : "result-review__item--incorrect"
                }`}
                key={question.id}
              >
                <article aria-labelledby={`review-question-${question.id}`}>
                  <header className="result-review__question-header">
                    <div>
                      <span className="result-review__number">第 {index + 1} 题</span>
                      <span className="result-review__subject">{question.subject}</span>
                    </div>
                    <span className={`result-review__status result-review__status--${isCorrect ? "correct" : "incorrect"}`}>
                      {isCorrect ? (
                        <CheckCircle2 aria-hidden="true" size={18} />
                      ) : (
                        <XCircle aria-hidden="true" size={18} />
                      )}
                      {isCorrect ? "回答正确" : "回答错误"}
                    </span>
                  </header>

                  <h3 id={`review-question-${question.id}`}>{question.prompt}</h3>

                  <dl className="result-review__answers">
                    <div>
                      <dt>你的答案</dt>
                      <dd className={isCorrect ? "result-review__answer--correct" : "result-review__answer--incorrect"}>
                        {formatAnswer(question, userAnswer)}
                      </dd>
                    </div>
                    <div>
                      <dt>正确答案</dt>
                      <dd className="result-review__answer--correct">{formatAnswer(question, question.answer)}</dd>
                    </div>
                  </dl>

                  <div className="result-review__knowledge">
                    <span>知识点</span>
                    <strong>{question.knowledge}</strong>
                  </div>

                  <div className="result-review__explanation">
                    <h4>题目解析</h4>
                    <p>{question.explanation}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <p className="result-review__empty">本次暂无可展示的题目解析。</p>
        )}
      </section>

      <footer className="result-panel__actions">
        <button className="button button--primary" type="button" onClick={onRetry}>
          <RotateCcw aria-hidden="true" size={19} />
          针对薄弱点再练一组
        </button>
        <button className="button button--secondary" type="button" onClick={onBackHome}>
          <Home aria-hidden="true" size={19} />
          返回首页
        </button>
      </footer>
    </main>
  );
}

export default ResultPanel;
