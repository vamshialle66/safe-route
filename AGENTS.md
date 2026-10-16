<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- The frontend talks to the external SafeRoute Express backend (POST /location, /location/segments) via src/lib/saferouteApi.ts; server URL is user-configurable in Settings and falls back to src/lib/demoAnalysis.ts when unreachable — keeps the app usable without the backend running.
- Maps use Leaflet loaded only in the browser through src/components/map/RouteMap.tsx — Leaflet breaks during server rendering.
- Live route/place scoring runs in-app via src/lib/engine.functions.ts (server fns) + engine.server.ts using Google Routes/Places through the connector gateway; a custom external SafeRoute server URL in Settings overrides it, and any failure falls back to src/lib/demoAnalysis.ts marked as sample data — keeps the app public-ready without a separate server.
- Signed-in users' trips, saved routes, profile and emergency contacts live in Lovable Cloud tables (RLS: own rows only); src/lib/analysisStore.ts keeps localStorage as the device cache and syncs to the account on sign-in (src/routes/__root.tsx listener) — signed-out use still works device-only.
- Keep expanded route assessment in the browser-safe routeAssessment module, separate from the legacy open-percentage score; persist its versioned evidence with each route and exclude unknown factors rather than fabricating them, so old trips remain readable and recommendations remain explainable.
- Require account authentication for built-in Google Routes and Places calls, preserving bounded batches and caches, because those connector requests are billable; signed-out fallback remains explicitly labelled sample data.
- Community concern classification uses authenticated server functions and AI Gateway Responses; alerts stay owner-readable unverified drafts/pending review, never public or inputs to route scores, because AI classification is not event verification.
- Persist AI access/billing blocks in the server-only ai_feature_state table; only an explicit owner action after restored access may clear them, preventing automatic billed retries across restarts.
