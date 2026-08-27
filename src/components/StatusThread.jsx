import React from "react";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

export default function StatusThread({ stage }) {
  // stage: 0 = Applied, 1 = Reviewed, 2 = Accepted, or "rejected"
  const steps = ["Applied", "Reviewed", stage === "rejected" ? "Rejected" : "Accepted"];
  const activeIndex = stage === "rejected" ? 2 : stage;

  return (
    <div className="flex items-center w-full">
      {steps.map((label, i) => {
        const isDone = i < activeIndex;
        const isCurrent = i === activeIndex;
        const isRejected = stage === "rejected" && i === 2;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center" style={{ minWidth: 64 }}>
              {isRejected ? (
                <XCircle size={20} className="text-red-500" />
              ) : isDone || isCurrent ? (
                <CheckCircle2 size={20} className="text-green" fill={isDone ? "#E7F3ED" : "transparent"} />
              ) : (
                <Circle size={20} className="text-gray-300" />
              )}
              <span
                className={`font-display text-[11px] mt-1.5 ${
                  isRejected ? "text-red-500 font-bold" : isCurrent ? "text-ink font-bold" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mb-4 ${i < activeIndex ? "bg-green" : "bg-line"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}