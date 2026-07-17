import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpenCheck,
  ChartNoAxesCombined,
  ChevronDown,
  CircleUserRound,
  ClipboardCheck,
  Crown,
  Database,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { ExamSession } from "./components/ExamSession";
import { ActivationScreen } from "./components/ActivationScreen";
import { ExamSetup, type ExamConfig } from "./components/ExamSetup";
import { ReportOverview } from "./components/ReportOverview";
import { ResultPanel } from "./components/ResultPanel";
import { StudyDashboard } from "./components/StudyDashboard";
import { WrongBook } from "./components/WrongBook";
import { InstallPrompt } from "./components/InstallPrompt";
import { QuestionBankManager } from "./components/QuestionBankManager";
import { demoQuestions } from "./data/questions";
import { loadSavedQuestionBank } from "./lib/questionBankStorage";
import type { ExamResult, Question, QuestionBankPayload, Track } from "./types";
import type { LicenseStatus } from "./desktop";

type Page = "dashboard" | "setup" | "exam" | "result" | "wrong" | "report" | "bank";

const resultKey = "yaokao-latest-result";
const trackKey = "yaokao-track";
const commercialDistribution = import.meta.env.VITE_DISTRIBUTION === "commercial";

function readStoredResult(): ExamResult | null {
  try {
    const raw = localStorage.getItem(resultKey);
    return raw ? JSON.parse(raw) as ExamResult : null;
  } catch {
    return null;
  }
}

const navItems = [
  { id: "dashboard", label: "学习概览", icon: LayoutDashboard },
  { id: "practice", label: "专项训练", icon: BookOpenCheck },
  { id: "exam", label: "模拟考试", icon: ClipboardCheck },
  { id: "wrong", label: "错题本", icon: FileQuestion },
  { id: "report", label: "学习报告", icon: ChartNoAxesCombined },
  { id: "bank", label: "我的题库", icon: Database },
] as const;

export default function App() {
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(() => window.desktopApp ? null : {
    activated: true,
    deviceCode: "WEB-PREVIEW",
    message: "浏览器预览模式",
  });
  const [page, setPage] = useState<Page>("dashboard");
  const [track, setTrack] = useState<Track>(() => localStorage.getItem(trackKey) === "traditional" ? "traditional" : "western");
  const [latestResult, setLatestResult] = useState<ExamResult | null>(readStoredResult);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [questionBank, setQuestionBank] = useState<Question[]>(demoQuestions);
  const [questionBankSource, setQuestionBankSource] = useState<"demo" | "built-in" | "imported">("demo");
  const [examConfig, setExamConfig] = useState<ExamConfig>({ subject: "all", count: 20, mode: "exam" });

  useEffect(() => {
    window.desktopApp?.getLicenseStatus().then(setLicenseStatus).catch(() => setLicenseStatus({
      activated: false,
      deviceCode: "读取失败",
      message: "无法读取本机授权信息，请重新启动软件",
    }));
  }, []);

  useEffect(() => {
    if (!licenseStatus?.activated) return;
    let active = true;
    loadSavedQuestionBank()
      .then((saved) => {
        if (!active) return;
        if (saved?.length) {
          setQuestionBank(saved);
          setQuestionBankSource("imported");
          return;
        }
        if (commercialDistribution) return;
        return fetch("./data/question-bank.json")
      .then((response) => {
        if (!response.ok) throw new Error("题库加载失败");
        return response.json() as Promise<QuestionBankPayload>;
      })
      .then((payload) => {
          if (active && payload.questions.length > 0) {
            setQuestionBank(payload.questions);
            setQuestionBankSource("built-in");
          }
        });
      })
      .catch(() => {
        // 离线打开时继续使用内置原创演示题，避免页面不可用。
      });
    return () => { active = false; };
  }, [licenseStatus?.activated]);

  const examQuestions = useMemo(
    () => questionBank
      .filter((question) => question.track === track || question.track === "shared")
      .filter((question) => examConfig.subject === "all" || question.subject === examConfig.subject)
      .map((question) => ({ question, order: Math.random() }))
      .sort((left, right) => left.order - right.order)
      .slice(0, examConfig.count)
      .map(({ question }) => question),
    [examConfig, questionBank, track],
  );

  const subjectCounts = useMemo(() => questionBank.reduce<Record<string, number>>((counts, question) => {
    counts[question.subject] = (counts[question.subject] ?? 0) + 1;
    return counts;
  }, {}), [questionBank]);

  const setupSubjects = useMemo(() => {
    const names = track === "western"
      ? ["药学专业知识（一）", "药学专业知识（二）", "药学综合知识与技能", "药事管理与法规"]
      : ["中药学专业知识（一）", "中药学专业知识（二）", "中药学综合知识与技能", "药事管理与法规"];
    return names.map((name) => ({ name, count: subjectCounts[name] ?? 0 }));
  }, [subjectCounts, track]);

  const wrongQuestions = useMemo(() => {
    if (!latestResult) return [];
    const resultQuestionIds = new Set(latestResult.questionIds ?? Object.keys(latestResult.answers));
    return questionBank.filter((question) => resultQuestionIds.has(question.id)).filter((question) => {
      const actual = [...(latestResult.answers[question.id] ?? [])].sort().join("|");
      const expected = [...question.answer].sort().join("|");
      return actual !== expected;
    });
  }, [latestResult, questionBank]);

  const resultQuestions = useMemo(() => {
    if (!latestResult) return examQuestions;
    const byId = new Map(questionBank.map((question) => [question.id, question]));
    return (latestResult.questionIds ?? Object.keys(latestResult.answers))
      .map((id) => byId.get(id))
      .filter((question): question is Question => Boolean(question));
  }, [examQuestions, latestResult, questionBank]);

  function changeTrack(nextTrack: Track) {
    setTrack(nextTrack);
    localStorage.setItem(trackKey, nextTrack);
  }

  function startExam() {
    setPage("exam");
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openExamSetup(mode: ExamConfig["mode"]) {
    setExamConfig((current) => ({ ...current, mode, subject: "all" }));
    setPage("setup");
    setMobileMenuOpen(false);
  }

  function navigate(id: string) {
    if (id === "exam") openExamSetup("exam");
    else if (id === "practice") openExamSetup("practice");
    else setPage(id as Page);
    setMobileMenuOpen(false);
  }

  function completeExam(result: ExamResult) {
    setLatestResult(result);
    localStorage.setItem(resultKey, JSON.stringify(result));
    setPage("result");
    window.scrollTo({ top: 0 });
  }

  function useImportedBank(questions: Question[]) {
    setQuestionBank(questions);
    setQuestionBankSource("imported");
    setLatestResult(null);
    localStorage.removeItem(resultKey);
  }

  function resetQuestionBank() {
    setQuestionBank(demoQuestions);
    setQuestionBankSource("demo");
    setLatestResult(null);
    localStorage.removeItem(resultKey);
  }

  if (!licenseStatus) {
    return <main className="activation-page"><div className="license-loading"><span /><strong>正在读取本机授权…</strong></div></main>;
  }

  if (!licenseStatus.activated) {
    return <ActivationScreen status={licenseStatus} onActivated={setLicenseStatus} />;
  }

  if (page === "exam") {
    return <ExamSession questions={examQuestions} mode={examConfig.mode} onSubmit={completeExam} onExit={() => setPage("dashboard")} />;
  }

  if (page === "setup") {
    return <ExamSetup track={track} subjects={setupSubjects} config={examConfig} onChange={setExamConfig} onStart={startExam} onBack={() => setPage("dashboard")} />;
  }

  if (page === "result" && latestResult) {
    return (
      <ResultPanel
        result={latestResult}
        questions={resultQuestions}
        onBackHome={() => setPage("dashboard")}
        onRetry={startExam}
      />
    );
  }

  return (
    <div className="app-shell">
      <aside className={mobileMenuOpen ? "sidebar mobile-open" : "sidebar"}>
        <div className="brand">
          <span className="brand-mark"><GraduationCap size={25} /></span>
          <span><strong>执药备考工具</strong><small>执业药师智能备考</small></span>
          <button className="mobile-close" aria-label="关闭菜单" onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
        </div>
        <nav className="side-nav" aria-label="主导航">
          <span className="nav-label">学习中心</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.id || (item.id === "dashboard" && page === "result");
            return <button key={item.id} className={active ? "active" : ""} onClick={() => navigate(item.id)}><Icon size={19} /> {item.label}{item.id === "wrong" && wrongQuestions.length > 0 && <b>{wrongQuestions.length}</b>}</button>;
          })}
        </nav>
        <div className="sidebar-upgrade">
          <span><Crown size={21} /></span>
          <strong>离线题库已启用</strong>
          <p>{questionBank.length.toLocaleString("zh-CN")} 道题 · 无需联网</p>
          <button disabled>进度自动保存在本机</button>
        </div>
        <div className="sidebar-user">
          <span className="avatar">药</span>
          <span><strong>备考学员</strong><small>本机离线使用</small></span>
          <ChevronDown size={17} />
        </div>
      </aside>

      {mobileMenuOpen && <button className="menu-backdrop" aria-label="关闭菜单" onClick={() => setMobileMenuOpen(false)} />}

      <div className="main-area">
        <header className="main-header">
          <button className="mobile-menu" aria-label="打开菜单" onClick={() => setMobileMenuOpen(true)}><Menu size={22} /></button>
          <div><span>学习中心</span><strong>{page === "dashboard" ? "总览" : page === "wrong" ? "错题本" : page === "bank" ? "我的题库" : "学习报告"}</strong></div>
          <div className="header-actions">
            <div className="header-track-switch">
              <button className={track === "western" ? "active" : ""} onClick={() => changeTrack("western")}>西药</button>
              <button className={track === "traditional" ? "active" : ""} onClick={() => changeTrack("traditional")}>中药</button>
            </div>
            <button className="header-icon" aria-label="消息通知"><Bell size={19} /><i /></button>
            <button className="header-profile"><CircleUserRound size={22} /><span>备考学员</span></button>
          </div>
        </header>

        <div className="page-content">
          {page === "dashboard" && (
            <>
              <InstallPrompt />
              <StudyDashboard
                track={track}
                onTrackChange={changeTrack}
                onStartExam={startExam}
                onNavigate={(next) => setPage(next)}
                latestScore={latestResult?.score}
                questionCount={questionBank.length}
                subjectCounts={subjectCounts}
              />
            </>
          )}
          {page === "wrong" && <WrongBook questions={wrongQuestions} onPractice={startExam} />}
          {page === "report" && <ReportOverview latestResult={latestResult} onPractice={startExam} />}
          {page === "bank" && <QuestionBankManager count={questionBank.length} source={questionBankSource} onImported={useImportedBank} onReset={resetQuestionBank} />}
        </div>
      </div>

      <nav className="mobile-bottom-nav" aria-label="手机底部导航">
        <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}><LayoutDashboard /><span>概览</span></button>
        <button onClick={startExam}><BookOpenCheck /><span>练习</span></button>
        <button className="mobile-exam-action" onClick={startExam}><span><Sparkles /></span><small>模考</small></button>
        <button className={page === "wrong" ? "active" : ""} onClick={() => setPage("wrong")}><FileQuestion /><span>错题</span></button>
        <button className={page === "bank" ? "active" : ""} onClick={() => setPage("bank")}><Database /><span>题库</span></button>
      </nav>

    </div>
  );
}
