import { useEffect, useState } from "react";
import { Check, ShieldCheck, Sparkles, X } from "lucide-react";

export interface MembershipModalProps {
  open: boolean;
  onClose: () => void;
}

type PlanId = "free" | "quarter" | "annual";

interface MembershipPlan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const plans: MembershipPlan[] = [
  {
    id: "free",
    name: "免费版",
    price: "0",
    period: "长期可用",
    description: "适合先体验核心刷题流程",
    features: ["每日精选练习", "基础错题记录", "模拟考试体验"],
  },
  {
    id: "quarter",
    name: "冲刺季卡",
    price: "79",
    period: "90 天",
    description: "适合考前集中复习与强化",
    features: ["完整题库练习", "智能错题巩固", "阶段模考与解析"],
    recommended: true,
  },
  {
    id: "annual",
    name: "全年会员",
    price: "129",
    period: "365 天",
    description: "适合系统备考与长期学习",
    features: ["完整题库练习", "全年模考更新", "学习进度分析"],
  },
];

export function MembershipModal({ open, onClose }: MembershipModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handlePlanAction = (plan: MembershipPlan) => {
    setSelectedPlan(plan.id);
    setNotice(
      plan.id === "free"
        ? "已选择免费版，可直接体验基础功能。"
        : `已登记${plan.name}内测意向，我们会在正式开放时通知你。`,
    );
  };

  return (
    <div
      className="membership-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="membership-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="membership-modal-title"
        aria-describedby="membership-modal-description"
      >
        <button
          className="membership-modal-close"
          type="button"
          aria-label="关闭会员方案"
          onClick={onClose}
        >
          <X aria-hidden="true" size={20} />
        </button>

        <header className="membership-modal-header">
          <span className="membership-modal-eyebrow">
            <Sparkles aria-hidden="true" size={16} />
            执药备考工具会员
          </span>
          <h2 id="membership-modal-title">选择适合你的备考节奏</h2>
          <p id="membership-modal-description">
            先免费体验，也可以登记内测会员意向。以下价格均为内测阶段的产品假设。
          </p>
        </header>

        <div className="membership-plan-grid">
          {plans.map((plan) => (
            <article
              className={`membership-plan-card${plan.recommended ? " membership-plan-card--recommended" : ""}${
                selectedPlan === plan.id ? " membership-plan-card--selected" : ""
              }`}
              key={plan.id}
            >
              {plan.recommended && (
                <span className="membership-plan-badge">推荐</span>
              )}
              <h3>{plan.name}</h3>
              <p className="membership-plan-description">{plan.description}</p>
              <div className="membership-plan-price" aria-label={`${plan.price}元，${plan.period}`}>
                <span className="membership-plan-currency">¥</span>
                <strong>{plan.price}</strong>
                <span className="membership-plan-period">/{plan.period}</span>
              </div>
              <span className="membership-plan-assumption">内测价格假设</span>

              <ul className="membership-plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check aria-hidden="true" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`membership-plan-action${plan.recommended ? " membership-plan-action--primary" : ""}`}
                type="button"
                onClick={() => handlePlanAction(plan)}
              >
                {plan.id === "free" ? "选择免费版" : "登记内测意向"}
              </button>
            </article>
          ))}
        </div>

        {notice && (
          <p className="membership-modal-notice" role="status">
            {notice}
          </p>
        )}

        <footer className="membership-modal-footer">
          <ShieldCheck aria-hidden="true" size={17} />
          演示版暂未接入真实支付，页面操作不会产生任何扣款。
        </footer>
      </section>
    </div>
  );
}

export default MembershipModal;
