import React from "react";
import { Check } from "lucide-react";

const steps = ["Giỏ hàng", "Giao hàng", "Hoàn tất"];

export default function CheckoutStepper({ currentStep = 1 }) {
  return (
    <div className="flex items-center rounded-[1.4rem] border border-[#d8c0a7] bg-white/65 p-2 shadow-[0_12px_30px_rgba(90,62,54,0.10)] backdrop-blur">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2 px-1.5 sm:px-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  isCompleted || isCurrent
                    ? "bg-[#7b1e2b] text-white shadow-[0_8px_18px_rgba(123,30,43,0.22)]"
                    : "border border-[#dcc8b1] bg-[#f5eadc] text-[#8a7568]"
                }`}
              >
                {isCompleted ? <Check size={16} /> : stepNumber}
              </div>
              <span
                className={`hidden text-xs font-semibold sm:block ${
                  isCurrent ? "text-[#7b1e2b]" : "text-[#806c60]"
                }`}
              >
                {step}
              </span>
            </div>
            {stepNumber < steps.length && (
              <span className="h-px w-4 bg-[#d4baa0] sm:w-8" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
