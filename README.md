# Jarakey Property Context Demo

A React + TypeScript app that demonstrates active property context, server-authoritative role checks, and graceful handling of mid-session permission drift.

## Getting Started

```bash
npm install
```

```bash
npm run dev
```

Open the URL shown in your terminal (typically `http://localhost:5173`).

Live demo: [jarakey-test.vercel.app](https://jarakey-test.vercel.app/)

## Testing

Run the integration test suite once:

```bash
npm test
```

Run Vitest in watch mode during development:

```bash
npm run test:watch
```

## How to Use & Simulate Drift

1. **Browse properties** — The Property Picker loads a paginated list (10 per page). Use **Previous** and **Next** to move between pages.
2. **Set active context** — Click any property card to select it. The app sends `X-Property-ID`, fetches your role from the server, and updates the detail panel on the right.
3. **Perform a Manager action** — If your role is **Manager**, the **Perform Manager Action** button appears. The UI hides this button for **Tenant** roles; the server enforces the gate on every call.
4. **Simulate role drift** — With a property selected, open the **Dev Simulator** panel (bottom-left). Click **Downgrade** to demote your role to Tenant, or **Upgrade** to restore Manager access in the mock server.
5. **Observe drift handling** — After a downgrade, try **Perform Manager Action** again (if still visible) or trigger a 403. The app updates your role without reloading, hides the gated action, shows a toast, and keeps you on the page.

## Take-Home Questions

1. **What is the minimum data the client needs to render a property-context-aware page safely?**  
   The active property ID (for `X-Property-ID` on context-aware requests) and a fresh role read from the server when the view loads or the property changes. The client may use role for display, but it must not treat a cached role as permanent truth.

2. **Where should the active property context live in your app, and why?**  
   In a dedicated React Context provider at the layout root (`PropertyProvider`). Active property ID, selected property details, and role state are tightly coupled to request headers and permission checks — a localized provider avoids prop drilling without overloading a global store.

3. **What is the most dangerous frontend RBAC bug you can imagine in a system like this?**  
   Treating a stale client-side role (from local storage, an old API response, or optimistic UI) as authoritative and allowing privileged actions without a fresh server check on every mutation. If the backend does not re-validate `X-Property-ID` and permissions per request, the UI gate is cosmetic.

4. **What should the frontend never trust from the user, the URL, or local storage?**  
   Permission level or role claims from any client-controlled source. URL params, local storage, and rendered UI state can all be manipulated. Only a fresh server response (status code and payload) should drive permission updates.

5. **How do you keep the UI from white-screening when the server returns 403 mid-session?**  
   Catch 403 at the API boundary, map it to a state update (e.g. set role to Tenant), show a toast, and remove restricted UI — treat it as a normal permission change, not an unhandled exception.

6. **How did AI help you complete this challenge, and where did you intentionally hold it back?**  
   AI accelerated scaffolding: seed data, Tailwind layouts, Vitest setup, and shared UI components. I kept architectural decisions manual: the snake_case ↔ camelCase transform layer, `X-Property-ID` injection, 403 drift handling, and context boundaries.

7. **What is the most important test you would write first, and why?**  
   The permission drift integration test — assert that a mid-session 403 hides the Manager action and updates UI state without crashing. That is the core constraint the challenge is designed to evaluate.
