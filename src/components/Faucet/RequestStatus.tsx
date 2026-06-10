import { Network } from "~/lib/Types";
import "./requestStatus.css";

type RequestState = {
  phase: "solving" | "submitting" | "pending" | "batched" | "confirmed" | "failed" | null;
  progress?: number;
  position?: number;
  txHash?: string;
  errorMessage?: string;
  requestId?: string;
};

const PHASE_CONFIG: Record<string, { label: string; icon: string; className: string }> = {
  solving: {
    label: "Solving proof-of-work challenge...",
    icon: "spinner",
    className: "phase-solving",
  },
  submitting: {
    label: "Submitting request...",
    icon: "spinner",
    className: "phase-submitting",
  },
  pending: {
    label: "Waiting in queue...",
    icon: "spinner",
    className: "phase-pending",
  },
  batched: {
    label: "Transaction submitted, confirming on-chain...",
    icon: "spinner",
    className: "phase-batched",
  },
  confirmed: {
    label: "Tokens sent successfully!",
    icon: "check",
    className: "phase-confirmed",
  },
  failed: {
    label: "Request failed",
    icon: "error",
    className: "phase-failed",
  },
};

const STEPS = ["solving", "submitting", "pending", "batched", "confirmed"] as const;

function getStepIndex(phase: string): number {
  const idx = STEPS.indexOf(phase as typeof STEPS[number]);
  return idx === -1 ? 0 : idx;
}

export function RequestStatus({ state, onClose, network }: { state: RequestState; onClose: () => void; network: Network }) {
  if (!state.phase) return null;

  const config = PHASE_CONFIG[state.phase];
  if (!config) return null;

  const stepIndex = getStepIndex(state.phase);
  const isFailed = state.phase === "failed";
  const isDone = state.phase === "confirmed";
  const viewerUrl = isDone && state.txHash && network.viewer
    ? `${network.viewer}/${state.txHash}`
    : null;

  return (
    <div className="request-status-overlay">
      <div className="request-status-dialog">
        <div className="request-status-header">
          <span className="request-status-title">
            {isDone ? "Request Complete" : isFailed ? "Request Failed" : "Processing Request"}
          </span>
          {(isDone || isFailed) && (
            <button className="request-status-close" onClick={onClose}>
              &times;
            </button>
          )}
        </div>

        {/* Progress steps */}
        <div className="request-status-steps">
          {STEPS.map((step, i) => {
            const isComplete = i < stepIndex || (isDone && i <= stepIndex);
            const isActive = i === stepIndex && !isFailed && !isDone;
            const stepClass = [
              "request-status-step",
              isComplete ? "step-complete" : "",
              isActive ? "step-active" : "",
              isFailed && i === stepIndex ? "step-failed" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div key={step} className={stepClass}>
                <div className="step-dot">
                  {isComplete ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isFailed && i === stepIndex ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span className="step-number">{i + 1}</span>
                  )}
                </div>
                <span className="step-label">{PHASE_CONFIG[step]?.label.replace("...", "")}</span>
              </div>
            );
          })}
        </div>

        {/* Current status */}
        <div className={`request-status-current ${config.className}`}>
          {config.icon === "spinner" && <div className="request-spinner" />}
          {config.icon === "check" && (
            <div className="request-icon-check">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12L10 17L20 7" stroke="#00b71d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          {config.icon === "error" && (
            <div className="request-icon-error">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 7L17 17M17 7L7 17" stroke="#ff3e3e" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          )}
          <span className="request-status-label">{config.label}</span>
        </div>

        {/* Details */}
        <div className="request-status-details">
          {state.phase === "solving" && state.progress !== undefined && (
            <div className="request-progress-bar">
              <div className="request-progress-fill" style={{ width: `${state.progress}%` }} />
              <span className="request-progress-text">{state.progress}%</span>
            </div>
          )}

          {state.phase === "pending" && state.position !== undefined && state.position > 1 && (
            <div className="request-detail-row">
              <span className="request-detail-label">Queue position</span>
              <span className="request-detail-value">#{state.position}</span>
            </div>
          )}

          {state.requestId && (
            <div className="request-detail-row">
              <span className="request-detail-label">Request ID</span>
              <span className="request-detail-value request-id-value">{state.requestId}</span>
            </div>
          )}

          {state.txHash && (
            <div className="request-detail-row">
              <span className="request-detail-label">Tx Hash</span>
              {viewerUrl ? (
                <a href={viewerUrl} target="_blank" rel="noopener noreferrer" className="request-detail-value request-id-value request-hash-link">
                  {state.txHash}
                </a>
              ) : (
                <span className="request-detail-value request-id-value">{state.txHash}</span>
              )}
            </div>
          )}

          {state.errorMessage && (
            <div className="request-detail-row request-error-row">
              <span className="request-detail-value">{state.errorMessage}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export type { RequestState };
