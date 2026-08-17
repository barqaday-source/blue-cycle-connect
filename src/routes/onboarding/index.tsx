import { createFileRoute } from "@tanstack/react-router";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import { useState } from "react";

/**
 * Route wrapper that manages simple step state.
 * For deeper integration, use the app's routing/stack logic.
 */
export const Route = createFileRoute("/onboarding")({
  component: OnboardingRoute,
});

function OnboardingRoute() {
  const [step, setStep] = useState(1);
  return step === 1 ? (
    <Step1 onNext={() => setStep(2)} />
  ) : step === 2 ? (
    <Step2 onBack={() => setStep(1)} onNext={() => setStep(3)} />
  ) : (
    <Step3 onBack={() => setStep(2)} />
  );
}
