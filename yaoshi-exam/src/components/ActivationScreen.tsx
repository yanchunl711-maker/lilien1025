import { useState } from "react";
import { CheckCircle2, ClipboardCopy, KeyRound, LockKeyhole, MonitorCheck, ShieldCheck } from "lucide-react";
import type { LicenseStatus } from "../desktop";

interface ActivationScreenProps {
  status: LicenseStatus;
  onActivated: (status: LicenseStatus) => void;
}

export function ActivationScreen({ status, onActivated }: ActivationScreenProps) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(status.message ?? "");
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyDeviceCode() {
    await window.desktopApp?.copyText(status.deviceCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function activate() {
    if (!code.trim() || !window.desktopApp) return;
    setWorking(true);
    const result = await window.desktopApp.activateLicense(code);
    setWorking(false);
    if (result.activated) onActivated(result);
    else setMessage(result.message || "激活失败，请核对激活码");
  }

  return (
    <main className="activation-page">
      <section className="activation-card">
        <div className="activation-brand"><span><KeyRound size={26} /></span><div><strong>执药备考工具</strong><small>离线题库桌面版</small></div></div>
        <div className="activation-heading">
          <span><ShieldCheck size={22} /> 一机一码授权</span>
          <h1>激活后开始学习</h1>
          <p>软件和学习记录保存在本机，无需注册账号，也不需要联网。</p>
        </div>

        <div className="device-code-box">
          <div><MonitorCheck size={22} /><span><small>本机设备码</small><strong>{status.deviceCode}</strong></span></div>
          <button onClick={copyDeviceCode}>{copied ? <CheckCircle2 size={17} /> : <ClipboardCopy size={17} />}{copied ? "已复制" : "复制设备码"}</button>
        </div>

        <ol className="activation-steps">
          <li><b>1</b><span>购买后，把上面的设备码发送给卖家。</span></li>
          <li><b>2</b><span>收到激活码后粘贴到下方，每台电脑单独激活。</span></li>
        </ol>

        <label className="activation-input">
          <span>激活码</span>
          <textarea value={code} onChange={(event) => setCode(event.target.value)} placeholder="请粘贴以 ZYK1- 开头的激活码" rows={4} spellCheck={false} />
        </label>
        {message && <p className="activation-message">{message}</p>}
        <button className="button button-primary activation-submit" onClick={activate} disabled={working || !code.trim()}>
          <LockKeyhole size={18} /> {working ? "正在验证…" : "立即激活"}
        </button>
        <p className="activation-disclaimer">第三方学习辅助工具，与考试主管机构及教材出版方无隶属或合作关系。</p>
      </section>
    </main>
  );
}
