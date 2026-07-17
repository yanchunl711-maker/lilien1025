import { Database, FileJson2, RotateCcw, ShieldCheck, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { clearSavedQuestionBank, saveQuestionBank } from "../lib/questionBankStorage";
import type { Question, QuestionBankPayload } from "../types";

interface QuestionBankManagerProps {
  count: number;
  source: "demo" | "built-in" | "imported";
  onImported(questions: Question[]): void;
  onReset(): void;
}

function isQuestion(value: unknown): value is Question {
  if (!value || typeof value !== "object") return false;
  const question = value as Partial<Question>;
  const validTrack = question.track === "western" || question.track === "traditional" || question.track === "shared";
  const validType = question.type === "single" || question.type === "multiple";
  const validOptions = Array.isArray(question.options) && question.options.length >= 2
    && question.options.every((option) => typeof option?.key === "string" && typeof option?.text === "string");
  return typeof question.id === "string"
    && validTrack
    && typeof question.subject === "string"
    && typeof question.knowledge === "string"
    && validType
    && typeof question.prompt === "string"
    && validOptions
    && Array.isArray(question.answer)
    && question.answer.length > 0
    && question.answer.every((answer) => typeof answer === "string")
    && typeof question.explanation === "string";
}

export function QuestionBankManager({ count, source, onImported, onReset }: QuestionBankManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);

  async function importFile(file: File) {
    setWorking(true);
    setMessage("");
    try {
      const parsed = JSON.parse(await file.text()) as Question[] | QuestionBankPayload;
      const values = Array.isArray(parsed) ? parsed : parsed.questions;
      if (!Array.isArray(values) || values.length === 0) throw new Error("文件里没有题目");
      if (values.length > 20000) throw new Error("单次最多导入 20000 道题");
      if (!values.every(isQuestion)) throw new Error("题库格式不正确，请使用标准 JSON 题库文件");
      const questions = [...new Map(values.map((question) => [question.id, question])).values()];
      await saveQuestionBank(questions);
      onImported(questions);
      setMessage(`已导入 ${questions.length.toLocaleString("zh-CN")} 道题，并保存在本机。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "题库导入失败");
    } finally {
      setWorking(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function reset() {
    await clearSavedQuestionBank();
    onReset();
    setMessage("已恢复为软件自带的原创演示题。");
  }

  const sourceLabel = source === "imported" ? "个人导入题库" : source === "built-in" ? "本机内置题库" : "原创演示题";

  return (
    <section className="bank-page">
      <header className="simple-page-heading">
        <span>QUESTION BANK</span>
        <h1>我的题库</h1>
        <p>手机版支持导入你本人拥有合法使用权的 JSON 题库，数据只保存在当前设备。</p>
      </header>

      <div className="bank-overview">
        <span><Database size={27} /></span>
        <div><small>当前题库</small><strong>{count.toLocaleString("zh-CN")} 道</strong><p>{sourceLabel}</p></div>
        <i><ShieldCheck size={18} /> 本机存储</i>
      </div>

      <div className="bank-import-card">
        <span className="bank-import-card__icon"><FileJson2 size={30} /></span>
        <div>
          <h2>导入个人题库</h2>
          <p>选择 JSON 文件后自动校验、去重并保存。请勿导入或传播无授权的教材、机构题库和内部资料。</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          onChange={(event) => event.target.files?.[0] && void importFile(event.target.files[0])}
          hidden
        />
        <button className="button button-primary" onClick={() => inputRef.current?.click()} disabled={working}>
          <Upload size={17} /> {working ? "正在导入…" : "选择题库文件"}
        </button>
      </div>

      <div className="bank-actions">
        <button className="button button-ghost" onClick={() => void reset()}><RotateCcw size={17} /> 恢复演示题</button>
        {message && <p role="status">{message}</p>}
      </div>
    </section>
  );
}
