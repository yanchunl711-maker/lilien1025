import { ArrowRight, BrainCircuit, ChartNoAxesCombined, Target } from "lucide-react";
import type { ExamResult } from "../types";

interface ReportOverviewProps {
  latestResult: ExamResult | null;
  onPractice: () => void;
}

export function ReportOverview({ latestResult, onPractice }: ReportOverviewProps) {
  const score = latestResult?.score ?? 68;
  return (
    <div className="simple-page">
      <div className="simple-page-heading">
        <span className="section-kicker">INSIGHTS</span>
        <h1>学习报告</h1>
        <p>用数据决定下一次练什么，而不是只看做了多少题。</p>
      </div>
      <div className="report-grid">
        <article className="report-score panel">
          <span>最近一次诊断分</span>
          <strong>{score}<small>分</small></strong>
          <p>{latestResult ? "已根据刚才的模考更新" : "完成模考后将生成真实结果"}</p>
        </article>
        <article className="report-card panel"><Target /><span><small>优势模块</small><strong>用药指导与沟通</strong><p>建议保持每周 2 次巩固</p></span></article>
        <article className="report-card panel"><BrainCircuit /><span><small>优先补强</small><strong>药事管理与法规</strong><p>建议先完成 10 题专项</p></span></article>
        <article className="report-card panel"><ChartNoAxesCombined /><span><small>本周趋势</small><strong>稳定上升 18%</strong><p>连续学习比单日突击更有效</p></span></article>
      </div>
      <div className="recommendation panel">
        <div><span className="section-kicker">NEXT STEP</span><h2>你的下一步：法规薄弱点专项</h2><p>系统将优先安排处方审核、药品安全监测与患者隐私保护。</p></div>
        <button className="button button-primary" onClick={onPractice}>开始专项训练 <ArrowRight size={18} /></button>
      </div>
    </div>
  );
}
