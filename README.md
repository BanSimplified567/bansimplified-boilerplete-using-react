```bash
bansimplified-boilerplate-using-react/
│
├─ public/                 # Static files
│   └── vite.svg           # Vite logo/placeholder image
├─ src/                    # Source code
│   ├─ app/               # Page components for routing (often used with React Router)
│   │   ├─ Terms.tsx
│   │   ├─ admin/
│   │   │   └── Dashboard.tsx
│   │   ├─ auth/
│   │   │   ├─ AuthCallback.tsx
│   │   │   ├─ LoginAccount.tsx
│   │   │   └── SignUpAccount.tsx
│   │   └─ user/
│   │       └── Index.tsx
│   ├─ assets/            # Static assets (images, icons, fonts)
│   │   └── react.svg
│   ├─ components/        # Reusable UI components (Button, Card, Modal, etc.)
│   │   ├─ layout/
│   │   ├─ shared/
│   │   └─ ui/
│   │       ├─ card.tsx
│   │       ├─ skeleton.tsx
│   │       └─ table.tsx
│   ├─ hooks/             # Custom React hooks (useAuth, useLocalStorage, etc.)
│   │   └── useLogout.tsx
│   ├─ lib/               # Library utilities and configurations
│   │   ├─ supebase.ts    # Supabase client configuration
│   │   └── utils.ts       # Library-specific utilities
│   ├─ services/          # API services (fetch/axios calls, API integration)
│   │   └── axios.ts
│   ├─ styles/            # Style Where The Styling is happening
│   ├─ types/             # Global TypeScript type definitions
│   ├─ utils/             # General utility functions (helpers, formatters)
│   │   ├─ redirectByRole.ts
│   │   └─ utils.ts
│   ├─ App.tsx            # Root React component
│   ├─ index.css          # Global CSS styles (includes Tailwind directives)
│   └─ main.tsx           # Application entry point (renders React to DOM)
├─ .env                   # Environment variables (NOT committed to git)
├─ .env.example           # Template for environment variables with examples
├─ .gitignore            # Git ignore rules
├─ components.json       # UI component registry (often for shadcn/ui)
├─ eslint.config.js      # ESLint configuration
├─ index.html            # HTML entry point
├─ package-lock.json     # NPM dependency lock file
├─ package.json          # Project dependencies and scripts
├─ postcss.config.js     # PostCSS configuration (processes Tailwind CSS)
├─ tailwind.config.js    # Tailwind CSS configuration
├─ tsconfig.app.json     # TypeScript config for application code
├─ tsconfig.json         # Main TypeScript configuration
├─ tsconfig.node.json    # TypeScript config for Node/bundler code
└── vite.config.ts        # Vite build tool configuration
```

## Folder Structure Explained

Here's a breakdown of what each folder in the project is for:

*   **`public/`**: This directory contains static assets that are not processed by the build tool. Files here are served at the root path. It's suitable for assets like `robots.txt` or web manifest files.

*   **`src/`**: This is where all your application's source code lives.

    *   **`app/`**: Contains the main page components for your application. When using a library like React Router, each file often corresponds to a specific route or view.

    *   **`assets/`**: For static assets like images, icons, and fonts that you import directly into your components. These assets are processed and bundled by Vite.

    *   **`components/`**: Holds reusable UI components (e.g., `Button`, `Card`, `Modal`). This is often where components from UI libraries like `shadcn/ui` are placed.

    *   **`hooks/`**: Contains custom React hooks (e.g., `useAuth`, `useLocalStorage`) that encapsulate and reuse stateful logic across components.

    *   **`lib/`**: A place for library initializations and utility functions. This includes configuring third-party libraries like the Supabase client in `superbase.ts`.

    *   **`services/`**: Used for API communication logic. This is where you would put your functions for making API calls (e.g., using `fetch` or `axios`) to interact with backend services like Supabase.

    *   **'styles/'**: Dedicated to application styling and visual design assets. This directory centralizes global stylesheets, theme definitions, CSS variables, Tailwind customizations, and reusable style modules to ensure consistent visual identity and maintainable UI architecture across the entire application.

## Tech Stack

This project is built using the following technologies:

- **Frontend Framework**: React (v19.2.0) with TypeScript
- **Build Tool**: Vite (v7.2.4)
- **Styling**: Tailwind CSS (v3.4.18) with PostCSS and Autoprefixer
- **Routing**: React Router DOM (v7.10.1)
- **Backend & Authentication**: Supabase (@supabase/supabase-js v2.86.2)
- **HTTP Client**: Axios (v1.13.2)
- **Icons**: Lucide React (v0.555.0)
- **Validation**: Zod (v4.1.13)
- **UI Components**: shadcn/ui (based on components.json)
- **Utilities**: clsx, tailwind-merge, class-variance-authority, tailwindcss-animate
- **Development Tools**: ESLint, TypeScript, PostCSS

# Project Setup with Supabase and Google OAuth

## Todo List for Setting Up the Project

1. **Clone the Repository**
   Run the following command to download the project code to your local machine:
   ```bash
   git clone https://github.com/BanSimplified567/bansimplified-boilerplete-using-react.git
   ```
   Replace the URL with your actual Git repository if different.

2. **Navigate to the Project Directory**
   ```bash
   cd bansimplified-react-boilerplate
   ```
   Adjust the directory name if it differs.

3. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install all required Node.js packages listed in `package.json`.

4. **Create Supabase Connection File**
   Ensure `src/lib/superbase.ts` exists with the following content to set up the Supabase client:
   ```ts
   import { createClient } from "@supabase/supabase-js";

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
   const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```

5. **Create Environment Variables Example File**
   Create a `.env.example` file in the root directory with placeholder values for Supabase and Google OAuth configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

6. **Set Up Environment Variables**
   Copy `.env.example` to `.env` and fill in your actual keys:
   ```bash
   cp .env.example .env
   ```

7. **Set Up Google OAuth in Google Cloud Console**
   1. Go to [Google Cloud Console](https://console.cloud.google.com/).
   2. Create a new project or select an existing project.
   3. Navigate to **APIs & Services > Credentials**.
   4. Click **Create Credentials > OAuth Client ID**.
   5. Configure the consent screen with your app details.
   6. Choose **Web Application** and set the **Authorized redirect URIs** to your app's callback URL (e.g., `http://localhost:5173/auth/callback`).
   7. Copy the generated **Client ID** and **Client Secret** into your `.env` file:
      ```env
      VITE_GOOGLE_CLIENT_ID=your_generated_client_id
      VITE_GOOGLE_CLIENT_SECRET=your_generated_client_secret
      ```

8. **Test the Setup**
   Run the development server:
   ```bash
   npm run dev
   ```
   Verify that the Supabase connection and Google OAuth integration work by checking the browser console for errors and ensuring authentication flows correctly.
