"use client";

import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding";
import { useLanguage } from "./language-provider";

export type OnboardingModalHandle = {
  open: () => void;
};

const STEPS = [
  { icon: "ph-hand-waving", titleKey: "onboarding.step1.title", bodyKey: "onboarding.step1.body" },
  { icon: "ph-note", titleKey: "onboarding.step2.title", bodyKey: "onboarding.step2.body" },
  { icon: "ph-squares-four", titleKey: "onboarding.step3.title", bodyKey: "onboarding.step3.body" },
  { icon: "ph-palette", titleKey: "onboarding.step4.title", bodyKey: "onboarding.step4.body" },
  { icon: "ph-check-circle", titleKey: "onboarding.step5.title", bodyKey: "onboarding.step5.body" },
] as const;

export const OnboardingModal = forwardRef<OnboardingModalHandle>(
  function OnboardingModal(_props, ref) {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
      if (!hasSeenOnboarding()) {
        setOpen(true);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      open: () => {
        setStep(0);
        setOpen(true);
      },
    }));

    function close() {
      markOnboardingSeen();
      setOpen(false);
    }

    if (!open) return null;

    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    return (
      <div className="dialog-backdrop">
        <div className="dialog">
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent)]">
              <i className={`ph ${current.icon}`} style={{ fontSize: 24 }} />
            </div>
            <h2 className="dialog-title">{t(current.titleKey)}</h2>
            <p className="dialog-body">{t(current.bodyKey)}</p>
          </div>

          <div className="flex items-center justify-center gap-1.5 py-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? 18 : 6,
                  background:
                    i === step
                      ? "var(--accent)"
                      : "color-mix(in srgb, var(--foreground) 20%, transparent)",
                }}
              />
            ))}
          </div>

          <div className="dialog-actions">
            {step > 0 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep((s) => s - 1)}
              >
                {t("onboarding.back")}
              </button>
            ) : (
              <button type="button" className="btn btn-ghost" onClick={close}>
                {t("onboarding.skip")}
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary-filled"
              onClick={isLast ? close : () => setStep((s) => s + 1)}
            >
              {isLast ? t("onboarding.start") : t("onboarding.next")}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
