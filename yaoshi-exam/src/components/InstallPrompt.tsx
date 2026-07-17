import { CheckCircle2, Download, Share2, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const isIOS = useMemo(() => {
    const appleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const touchMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return appleMobile || touchMac;
  }, []);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(standalone);

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const markInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallEvent(null);
  }

  if (installed) {
    return (
      <section className="install-card install-card--installed">
        <CheckCircle2 size={22} />
        <div><strong>手机版已安装</strong><span>可从手机主屏幕打开，学习记录保存在本机。</span></div>
      </section>
    );
  }

  return (
    <section className="install-card">
      <span className="install-card__icon"><Smartphone size={24} /></span>
      <div className="install-card__copy">
        <strong>安装手机版，离线也能刷题</strong>
        {isIOS ? (
          <span><Share2 size={14} /> iPhone：点 Safari“分享”→“添加到主屏幕”→开启“打开为 Web App”。</span>
        ) : (
          <span>Android：安装后会生成桌面图标，可全屏打开。</span>
        )}
      </div>
      {installEvent ? <button onClick={install}><Download size={17} /> 立即安装</button> : <small>{isIOS ? "按上面的步骤安装" : "请用手机浏览器菜单选择“安装应用”"}</small>}
    </section>
  );
}
