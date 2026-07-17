import { ArrowLeft, BookOpenCheck, Check, Clock3, FileQuestion } from "lucide-react";
import type { Track } from "../types";

export interface ExamConfig {
  subject: string;
  count: number;
  mode: "practice" | "exam";
}

interface ExamSetupProps {
  track: Track;
  subjects: Array<{ name: string; count: number }>;
  config: ExamConfig;
  onChange: (config: ExamConfig) => void;
  onStart: () => void;
  onBack: () => void;
}

const countOptions = [10, 20, 50, 100];

export function ExamSetup({ track, subjects, config, onChange, onStart, onBack }: ExamSetupProps) {
  const available = config.subject === "all"
    ? subjects.reduce((sum, subject) => sum + subject.count, 0)
    : subjects.find((subject) => subject.name === config.subject)?.count ?? 0;

  return (
    <div className="exam-setup-page">
      <button className="setup-back" onClick={onBack}><ArrowLeft size={18} /> 返回学习概览</button>
      <header className="setup-heading">
        <span>{config.mode === "exam" ? "SIMULATED EXAM" : "FOCUSED PRACTICE"}</span>
        <h1>{config.mode === "exam" ? "模拟考试组卷" : "专项练习设置"}</h1>
        <p>选择科目和题量，系统将从本机题库随机组卷。</p>
      </header>

      <div className="setup-layout">
        <section className="setup-panel">
          <div className="setup-section-title"><BookOpenCheck size={20} /><div><strong>选择科目</strong><small>{track === "western" ? "执业西药师" : "执业中药师"}</small></div></div>
          <div className="setup-subject-grid">
            <button className={config.subject === "all" ? "selected" : ""} onClick={() => onChange({ ...config, subject: "all" })}>
              <span>全部科目随机</span><small>{subjects.reduce((sum, subject) => sum + subject.count, 0)} 道可选</small>{config.subject === "all" && <Check size={17} />}
            </button>
            {subjects.map((subject) => (
              <button key={subject.name} className={config.subject === subject.name ? "selected" : ""} onClick={() => onChange({ ...config, subject: subject.name })}>
                <span>{subject.name}</span><small>{subject.count} 道可选</small>{config.subject === subject.name && <Check size={17} />}
              </button>
            ))}
          </div>
        </section>

        <section className="setup-panel setup-count-panel">
          <div className="setup-section-title"><FileQuestion size={20} /><div><strong>选择题量</strong><small>最多不超过当前科目题数</small></div></div>
          <div className="setup-count-grid">
            {countOptions.map((count) => (
              <button key={count} disabled={available < count} className={config.count === count ? "selected" : ""} onClick={() => onChange({ ...config, count })}>
                <strong>{count}</strong><span>题</span>
              </button>
            ))}
          </div>
          <div className="setup-summary">
            <Clock3 size={19} />
            <div><span>预计用时</span><strong>约 {Math.max(10, Math.round(config.count * 1.2))} 分钟</strong></div>
          </div>
          <button className="setup-start" onClick={onStart}>开始{config.mode === "exam" ? "模拟考试" : "专项练习"}</button>
          <p>题库完全保存在本机，无需登录，也不需要联网。</p>
        </section>
      </div>
    </div>
  );
}
