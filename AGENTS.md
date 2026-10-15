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
