"use client";

import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding";

export type OnboardingModalHandle = {
  open: () => void;
};

const STEPS = [
  {
    icon: "ph-hand-waving",
    title: "¡Bienvenido a Drawer!",
    body: "Tu cajón personal para notas, prompts e ideas — con copiado en un clic.",
  },
  {
    icon: "ph-note",
    title: "Crea y organiza tus notas",
    body: "Búscalas, ponles tags, y usa el botón de copiar para llevarlas a donde las necesites al instante.",
  },
  {
    icon: "ph-squares-four",
    title: "ZIP, imágenes y audio/video",
    body: "Todo corre en tu navegador — nada se sube a internet, tus archivos nunca salen de tu dispositivo.",
  },
  {
    icon: "ph-palette",
    title: "Hazla tuya",
    body: "Cambia el color desde Cuenta, y agrégala a tu pantalla de inicio para usarla como una app de verdad.",
  },
  {
    icon: "ph-check-circle",
    title: "¡Listo!",
    body: "Ya sabes lo básico. Puedes volver a ver esta guía cuando quieras con el botón de ayuda.",
  },
];

export const OnboardingModal = forwardRef<OnboardingModalHandle>(
  function OnboardingModal(_props, ref) {
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
            <h2 className="dialog-title">{current.title}</h2>
            <p className="dialog-body">{current.body}</p>
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
                Atrás
              </button>
            ) : (
              <button type="button" className="btn btn-ghost" onClick={close}>
                Saltar
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary-filled"
              onClick={isLast ? close : () => setStep((s) => s + 1)}
            >
              {isLast ? "Comenzar" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
