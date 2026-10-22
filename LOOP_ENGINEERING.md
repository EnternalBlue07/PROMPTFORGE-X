# Loop Engineering — PROMPTFORGE-X

## Goal
Iteratively improve a prompt against an explicit goal and acceptance criteria, with a hard stop and a report of each attempt.

## Workflow
1. Define one concrete goal and at least one acceptance criterion.
2. Generate an improved candidate.
3. Evaluate every criterion and record evidence.
4. Feed failed criteria and diagnoses into the next iteration.
5. Stop on a passed gate, cancellation, timeout, provider/validation error, or the iteration limit.
6. Report the actual stop reason and retain the attempt history.

## Guardrails
- Default limit: 5 iterations; hard maximum: 10.
- Default timeout: 120 seconds.
- Missing, duplicated, or unexpected criterion results fail validation.
- Empty evidence cannot pass a criterion.
- A model's assertion is not proof that tests, builds, or shell commands ran.
- The current implementation is a prompt-refinement loop with a model-based gate, not an autonomous repository editor.
- Never execute model-generated shell commands directly. Any future coding-agent adapter must use an allowlist, sandbox, timeouts, and explicit approval for destructive actions.
- Do not commit API keys or expose credentials in browser bundles.

## Known limitation
The existing app currently calls Gemini from the browser using a Vite-defined API key. Vite client bundles are inspectable, so this is not suitable for a private production key. Before public production use, move Gemini calls behind a server-side endpoint and keep the key in server-only environment variables.

## Manual verification
- `npm install`
- `npm run build`
- Manually test successful criteria, failed criteria, malformed model output, missing API key, cancellation, timeout, and maximum iterations.
- Add deterministic test/build adapters before claiming code-level verification.
