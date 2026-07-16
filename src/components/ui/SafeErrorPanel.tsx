import type { RefObject } from "react";
import type { AssessmentErrorViewModel } from "@/lib/assessment-error";

type SafeErrorPanelProps = {
  error: AssessmentErrorViewModel;
  focusRef: RefObject<HTMLDivElement | null>;
};

export function SafeErrorPanel({ error, focusRef }: SafeErrorPanelProps) {
  return (
    <div
      ref={focusRef}
      className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-base text-rose-950 outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={-1}
      data-error-kind={error.kind}
    >
      <p className="font-semibold">{error.title}</p>
      <p className="mt-3 leading-8">{error.message}</p>
      {error.fieldErrors.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {error.fieldErrors.map((fieldError) => (
            <li id={fieldError.descriptionId} key={fieldError.field}>
              <span className="font-medium">{fieldError.label}</span>: {fieldError.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
