# Frontend Implementation

## 1. Setup Phase
- **Initialize Next.js 15 (App Router) with Bun Runtime**
  - Use `npx create-next-app@latest --typescript` to set up a new Next.js project.
  - Switch the runtime to Bun by following the instructions from the Bun documentation.
  - Success Criteria: A fresh Next.js project is initialized and configured with Bun.

- **Configure Tailwind CSS (v4 preferred) for a dark "Forge" aesthetic**
  - Install Tailwind CSS using `npm install -D tailwindcss postcss autoprefixer`.
  - Initialize Tailwind by running `npx tailwindcss init`.
  - Configure the `tailwind.config.js` file to use the dark mode and define custom Forge styles.
  - Create base styles in `/styles/globals.css` and import them into `_app.tsx`.
  - Success Criteria: Tailwind CSS is configured and applied with a dark theme.

## 2. State Management (Zustand)
- **Define `useForgeStore` to handle task lifecycle (ID, status, real-time logs)**
  - Install Zustand by running `npm install zustand`.
  - Create `/app/store/forgeStore.ts` and define the store with slices for task ID, status, and logs.
  - Success Criteria: `useForgeStore` is implemented and can manage task state effectively.

- **Define `useStatsStore` for global monitoring (GPU load, Worker availability)**
  - In the same `/app/store/forgeStore.ts`, define a second store or create `/app/store/statsStore.ts`.
  - Add slices for GPU load and Worker availability.
  - Success Criteria: `useStatsStore` is implemented and can monitor global statistics.

## 3. Real-time Layer
- **Implementation of a WebSocket service/hook to consume messages from `/api/ws/task/{task_id}`**
  - Create a new file `/app/hooks/useWebSocket.ts`.
  - Implement the hook to establish a connection to the WebSocket server.
  - Handle incoming messages and dispatch them to the appropriate Zustand store slices.
  - Success Criteria: The WebSocket service is implemented and connected to the API.

- **Logic for routing WS events (`log`, `progress`, `success`) directly to the Zustand store**
  - In `/app/hooks/useWebSocket.ts`, add logic to handle different types of WebSocket messages.
  - Dispatch logs to `useForgeStore`, progress updates to `useForgeStore`, and success notifications as needed.
  - Success Criteria: WS events are routed correctly and update the Zustand stores.

## 4. UI Components
- **Forge Terminal:** A dedicated component to display live logs in a CLI-style window
  - Create `/app/components/ForgeTerminal.tsx`.
  - Use Tailwind CSS to style the terminal window.
  - Connect to `useForgeStore` to receive real-time logs and display them.
  - Success Criteria: The Forge Terminal displays live logs in a styled CLI window.

- **Control Panel:** Dynamic forms for Sonic-Forge (AudioGen parameters)
  - Create `/app/components/ControlPanel.tsx`.
  - Use Tailwind CSS to style the form elements.
  - Implement input fields and controls for AudioGen parameters.
  - Connect to `useForgeStore` to update task state based on user input.
  - Success Criteria: The Control Panel is interactive and updates task settings.

- **Stats Dashboard:** Visual widgets for GPU/VRAM monitoring
  - Create `/app/components/StatsDashboard.tsx`.
  - Use Tailwind CSS to style the dashboard components.
  - Connect to `useStatsStore` to receive and display GPU load and Worker availability data.
  - Success Criteria: The Stats Dashboard displays real-time statistics in a visual format.