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

Or view the live version of the project [here](https://jarakey-test.vercel.app/).

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

1. **Browse properties**: The Property Picker loads a paginated list (10 per page). Use **Previous** and **Next** to move between pages.
2. **Set active context**: Click **Select property** on any card. The app fetches your role from the server and updates the Action Panel.
3. **Perform a Manager action**: If your role is **Manager**, the **Perform Manager Action** button appears. Click it to trigger a gated server call. The UI hides this button for **Tenant** roles.
4. **Simulate role drift**: With a property selected, open the **Dev Simulator** panel (fixed at the bottom-left). Click **POST /dev/downgrade** to demote your role to Tenant in the mock server.
5. **Observe drift handling**: After a downgrade, try **Perform Manager Action** again (if still visible) or trigger a 403. The app updates your role without reloading, hides the gated action, shows a toast, and keeps you on the page.

## Take-Home Questions

1. **What is the minimum data the client needs to render a property-context-aware page safely?**:
   Honestly, just the unique property ID to tag onto your network requests so the server can do its job, and a fresh read of the user’s role straight from the backend when the view mounts. You should never store or trust a hardcoded role string long-term on the client side; permissions change, so the UI needs to stay dynamic.

2. **Where should the active property context live in your app, and why?**:
   In a dedicated, localized React Context provider sitting right at the top of the main layout dashboard. This keeps the active property state, request headers, and automatic permission checks flowing down cleanly to the child components. It saves you from gross prop-drilling or bloating a massive global store for something that's highly contextual.

3. **What is the most dangerous frontend RBAC bug you can imagine in a system like this?**:
   Optimistic state persistence. Basically, when the frontend blindly trusts a value in local storage or an old token to render a high-privilege action button, and then lets the user fire off mutations locally without forcing the server to double-check the X-Property-ID header and permissions on every single payload. If the server doesn't validate it on the incoming call, it's a massive security hole.

4. **What should the frontend never trust from the user, the URL, or local storage?**:
   Never trust URL route params or local storage values as absolute proof of what a user is allowed to do. Anyone can open DevTools, edit local storage, or swap an ID string in the address bar to force an admin screen to render. The client is just a display layer; the only thing you can actually trust is a fresh status code coming back from the server.

5. **How do you keep the UI from white-screening when the server returns 403 mid-session?**:
   By wrapping your API calls in clean try/catch handlers or interceptors that map response statuses straight to state updates. When a 403 hits, instead of letting the app throw an unhandled promise rejection and white-screen, you treat it as a routine state shift. You trigger an error toast to let the user know what happened and gracefully drop the restricted components out of the DOM.

6. **How did AI help you complete this challenge, and where did you intentionally hold it back?**:
   I used AI as a force multiplier to quickly knock out the repetitive tasks, generating the mock property datasets, setting up basic Tailwind layouts, and scaffolding the boilerplate for the Vitest suite. Where I drew the line and handled it myself was the architectural boundary: writing the data shape transformers (snake_case to camelCase), configuring the header injection, and designing the 403 drift logic.

7. **What is the most important test you would write first, and why?**:
   The permission drift integration test. You want to assert that when the API returns a 403 mid-session, the frontend immediately catches it, handles the state update gracefully, and hides the restricted actions without crashing. That's the core engineering constraint of this whole challenge.
