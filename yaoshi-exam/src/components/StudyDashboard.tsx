import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Lightbulb,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { subjectsByTrack } from "../data/questions";
import type { Track } from "../types";

interface StudyDashboardProps {
  track: Track;
  onTrackChange: (track: Track) => void;
  onStartExam: () => void;
  onNavigate: (page: "wrong" | "report") => void;
  latestScore?: number;
  questionCount: number;
  subjectCounts: Record<string, number>;
}

const weeklyMinutes = [32, 46, 28, 58, 42, 70, 51];
const weekLabels = ["一", "二", "三", "四", "五", "六", "日"];

function getDaysUntilExam() {
  const target = new Date("2026-10-31T00:00:00+08:00").getTime();
  return Math.max(0, Math.ceil((target - Date.now()) / 86_400_000));
}

export function StudyDashboard({
  track,
  onTrackChange,
  onStartExam,
  onNavigate,
  latestScore,
  questionCount,
  subjectCounts,
}: StudyDashboardProps) {
  const subjects = subjectsByTrack[track].map((subject) => ({
    ...subject,
    questions: subjectCounts[subject.name] ?? 0,
  }));
  const daysLeft = getDaysUntilExam();

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={15} /> 你的 2026 备考驾驶舱</span>
          <h1>早上好，今天把薄弱点<br />再缩小一点。</h1>
          <p>系统已根据最近练习，为你安排 28 分钟的高效训练。</p>
          <div className="hero-actions">
            <button className="button button-primary button-large" onClick={onStartExam}>
              <Play size={18} fill="currentColor" /> 继续今日训练
            </button>
            <button className="button button-ghost" onClick={() => onNavigate("report")}>
              查看学习报告 <ArrowRight size={17} />
            </button>
          </div>
          <div className="trust-row">
            <span><Check size={14} /> 已收录 {questionCount.toLocaleString("zh-CN")} 道题</span>
            <span><Check size={14} /> 自动记录错题</span>
            <span><Check size={14} /> 离线桌面练习</span>
          </div>
        </div>

        <div className="hero-metrics" aria-label="备考概况">
          <div className="countdown-card">
            <div className="metric-icon"><CalendarDays size={21} /></div>
            <span>距 2026 执业药师考试</span>
            <strong>{daysLeft}<small>天</small></strong>
            <p>计划日期：10 月 31 日</p>
          </div>
          <div className="readiness-card">
            <div className="readiness-ring" style={{ "--progress": "68%" } as React.CSSProperties}>
              <div><strong>{latestScore ?? 68}</strong><small>%</small></div>
            </div>
            <div>
              <span>当前掌握度</span>
              <strong>{latestScore ? "已更新" : "稳步提升中"}</strong>
              <p>再提高 4 分进入稳妥区</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-heading-row">
        <div>
          <span className="section-kicker">TODAY</span>
          <h2>今日学习路径</h2>
          <p>按顺序完成，比漫无目的刷题更有效。</p>
        </div>
        <div className="streak-pill"><Flame size={18} /> 已连续学习 <strong>6 天</strong></div>
      </section>

      <section className="today-grid">
        <article className="plan-card plan-card-active">
          <div className="plan-index">01</div>
          <div className="plan-icon"><Target size={21} /></div>
          <span>优先任务 · 约 12 分钟</span>
          <h3>法规薄弱点专项</h3>
          <p>处方审核与药品安全监测</p>
          <div className="plan-footer">
            <div><b>0</b> / 10 题</div>
            <button aria-label="开始法规薄弱点专项" onClick={onStartExam}><ArrowRight size={18} /></button>
          </div>
        </article>
        <article className="plan-card">
          <div className="plan-index">02</div>
          <div className="plan-icon plan-icon-warm"><BookOpenCheck size={21} /></div>
          <span>巩固任务 · 约 8 分钟</span>
          <h3>昨日错题回炉</h3>
          <p>用药指导与特殊人群</p>
          <div className="plan-footer">
            <div><b>3</b> 道待复习</div>
            <button aria-label="查看错题" onClick={() => onNavigate("wrong")}><ArrowRight size={18} /></button>
          </div>
        </article>
        <article className="plan-card">
          <div className="plan-index">03</div>
          <div className="plan-icon plan-icon-blue"><Clock3 size={21} /></div>
          <span>收尾任务 · 约 8 分钟</span>
          <h3>限时速度训练</h3>
          <p>20 道题，模拟机考节奏</p>
          <div className="plan-footer">
            <div><b>90</b> 秒 / 题</div>
            <button aria-label="开始限时训练" onClick={onStartExam}><ArrowRight size={18} /></button>
          </div>
        </article>
      </section>

      <section className="content-split">
        <div className="panel subject-panel">
          <div className="panel-title-row">
            <div>
              <span className="section-kicker">SUBJECTS</span>
              <h2>科目进度</h2>
            </div>
            <div className="track-switch" aria-label="学习方向">
              <button className={track === "western" ? "active" : ""} onClick={() => onTrackChange("western")}>西药</button>
              <button className={track === "traditional" ? "active" : ""} onClick={() => onTrackChange("traditional")}>中药</button>
            </div>
          </div>
          <div className="subject-list">
            {subjects.map((subject, index) => (
              <button className="subject-row" key={subject.name} onClick={onStartExam}>
                <span className={`subject-number subject-color-${index + 1}`}>{index + 1}</span>
                <span className="subject-main">
                  <span><strong>{subject.name}</strong><small>{subject.questions} 题 · 正确率 {subject.accuracy}%</small></span>
                  <span className="progress-track"><i style={{ width: `${subject.progress}%` }} /></span>
                </span>
                <b>{subject.progress}%</b>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="right-stack">
          <div className="panel weekly-panel">
            <div className="panel-title-row compact">
              <div>
                <span className="section-kicker">THIS WEEK</span>
                <h2>学习节奏</h2>
              </div>
              <span className="up-badge">↑ 18%</span>
            </div>
            <div className="weekly-total"><strong>5.4</strong><span>小时<br />本周累计</span></div>
            <div className="bar-chart" aria-label="本周每天学习时长">
              {weeklyMinutes.map((value, index) => (
                <div className="bar-column" key={weekLabels[index]}>
                  <span className={index === 5 ? "bar active" : "bar"} style={{ height: `${value}%` }} />
                  <small>{weekLabels[index]}</small>
                </div>
              ))}
            </div>
          </div>
          <button className="insight-card" onClick={() => onNavigate("report")}>
            <span className="insight-icon"><Lightbulb size={22} /></span>
            <span><small>学习洞察</small><strong>你在“药事管理与法规”上的正确率低于平均水平 9%</strong></span>
            <ChevronRight size={20} />
          </button>
          <div className="member-strip">
            <Trophy size={24} />
            <span><strong>本地完整题库已加载</strong><small>随机组卷 · 错题记录 · 成绩报告</small></span>
            <span className="member-link">离线可用 <Check size={16} /></span>
          </div>
        </div>
      </section>
    </div>
  );
}
