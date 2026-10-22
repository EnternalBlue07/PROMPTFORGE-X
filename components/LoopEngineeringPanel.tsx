import { useState } from "react";
import {
  runLoopEngineering,
  type LoopEvent,
  type LoopReport,
} from "../services/loopEngineeringService";

const DEFAULT_CRITERIA = [
  "The rewritten prompt preserves the original intent.",
  "The instructions are specific and unambiguous.",
  "The output format and constraints are explicit.",
].join("\n");

export function LoopEngineeringPanel() {
  const [goal, setGoal] = useState("");
  const [initialPrompt, setInitialPrompt] = useState("");
  const [criteriaText, setCriteriaText] = useState(DEFAULT_CRITERIA);
  const [report, setReport] = useState<LoopReport | null>(null);
  const [progress, setProgress] = useState<LoopEvent | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  async function startLoop() {
    const criteria = criteriaText.split("\n").map((item) => item.trim()).filter(Boolean);
    if (!goal.trim() || !initialPrompt.trim() || criteria.length === 0) {
      setError("Enter a goal, an initial prompt, and at least one acceptance criterion.");
      return;
    }

    const abortController = new AbortController();
    setController(abortController);
    setBusy(true);
    setError("");
    setReport(null);
    setProgress(null);
    setCopied(false);

    try {
      const result = await runLoopEngineering({
        goal,
        initialPrompt,
        acceptanceCriteria: criteria,
        maxIterations: 5,
        timeoutMs: 120_000,
        signal: abortController.signal,
        onProgress: setProgress,
      });
      setReport(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Loop failed unexpectedly.");
    } finally {
      setBusy(false);
      setController(null);
    }
  }

  async function copyCandidate() {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report.finalPrompt);
      setCopied(true);
    } catch {
      setError("Clipboard access failed. Select and copy the candidate manually.");
    }
  }

  const statusColor = report?.status === "completed"
    ? "text-emerald-400"
    : "text-amber-300";

  return (
    <section className="my-10 rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100 shadow-xl sm:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
            PROMPTFORGE-X / LOOP ENGINEERING
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Give AI a goal. Verify the result.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            A bounded improve-check-repeat workflow with attempt history and explicit stop conditions.
          </p>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
          MAX 5 ITERATIONS
        </span>
      </div>

      <div className="grid gap-4">
        <label className="block text-sm font-semibold">
          Goal
          <textarea
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            disabled={busy}
            rows={2}
            placeholder="Example: Turn this into a precise, reusable prompt for a coding assistant."
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-normal text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
          />
        </label>

        <label className="block text-sm font-semibold">
          Initial prompt
          <textarea
            value={initialPrompt}
            onChange={(event) => setInitialPrompt(event.target.value)}
            disabled={busy}
            rows={5}
            placeholder="Paste the prompt you want to improve..."
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm font-normal leading-6 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
          />
        </label>

        <label className="block text-sm font-semibold">
          Acceptance criteria <span className="font-normal text-slate-400">(one per line)</span>
          <textarea
            value={criteriaText}
            onChange={(event) => setCriteriaText(event.target.value)}
            disabled={busy}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-normal leading-6 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startLoop}
            disabled={busy}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Loop running…" : "Start loop"}
          </button>
          {busy && (
            <button
              type="button"
              onClick={() => controller?.abort()}
              className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {progress && (
        <div aria-live="polite" className="mt-5 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold">Iteration {progress.iteration} / 5</p>
            <span className="text-xs uppercase tracking-widest text-indigo-300">{progress.phase}</span>
          </div>
          <p className="mt-1 text-sm text-slate-400">{progress.message}</p>
        </div>
      )}

      {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-300">{error}</p>}

      {report && (
        <div className="mt-7 space-y-4">
          <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Run report</p>
            <p className={`mt-2 text-lg font-black ${statusColor}`}>{report.status.replaceAll("_", " ").toUpperCase()}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{report.summary}</p>
            <p className="mt-2 text-xs text-slate-500">Attempts recorded: {report.iterationsUsed}</p>
          </div>

          {report.attempts.map((attempt) => (
            <article key={attempt.iteration} className="rounded-lg border border-slate-700 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold">Iteration {attempt.iteration}</h3>
                <span className={`text-xs font-bold uppercase ${attempt.passed ? "text-emerald-400" : "text-amber-300"}`}>
                  {attempt.passed ? "Gate passed" : "Needs refinement"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{attempt.diagnosis}</p>
              <ul className="mt-4 space-y-3">
                {attempt.checks.map((check, index) => (
                  <li key={`${attempt.iteration}-${index}`} className="text-sm">
                    <p className={check.passed ? "text-emerald-300" : "text-amber-200"}>
                      {check.passed ? "✓" : "✗"} {check.criterion}
                    </p>
                    <p className="mt-1 pl-5 leading-5 text-slate-400">{check.evidence}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <label className="block text-sm font-semibold">
            Best available candidate
            <textarea
              readOnly
              rows={8}
              value={report.finalPrompt}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm font-normal leading-6 text-slate-200"
            />
          </label>
          <button
            type="button"
            onClick={copyCandidate}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold transition hover:bg-slate-800"
          >
            {copied ? "Copied" : "Copy candidate"}
          </button>
          <p className="text-xs leading-5 text-slate-500">
            The current gate is model-based. It does not run external tests or prove that code builds.
          </p>
        </div>
      )}
    </section>
  );
}
