```bash
bansimplified-boilerplate-using-react/
│
├─ public/                 # Static files
│   └── vite.svg           # Vite logo/placeholder image
├─ src/                    # Source code
│   ├─ app/               # Page components for routing (using React Router with file-based routing)
│   │   ├─ NotFound.tsx
│   │   ├─ (auth)/        # Auth-related pages (LoginAccount.tsx, SignUpAccount.tsx, AuthCallback.tsx)
│   │   ├─ (dashboard)/   # Dashboard pages (e.g., admin/Dashboard.tsx)
│   │   ├─ (infromation)/ # Information pages
│   │   └─ (root)/        # Root pages (e.g., AboutUs.tsx, ContactUs.tsx, Menu.tsx)
│   ├─ assets/            # Static assets (images, icons, fonts)
│   │   └── react.svg
│   ├─ components/        # Reusable UI components (Button, Card, Modal, etc.)
│   │   ├─ layout/
│   │   └─ ui/
│   ├─ contexts/          # React contexts for state management
│   │   └── TanstackProvider.tsx
│   ├─ db/                # Database-related code and API definitions
│   │   └─ api/
│   │       └── auth.api.ts
│   ├─ hooks/             # Custom React hooks
│   │   ├─ use-mobile.ts
│   │   ├─ useLogout.tsx
│   │   └─ useToken.ts
│   ├─ lib/               # Library utilities and configurations
│   │   ├─ socket.ts
│   │   ├─ supabase.ts    # Supabase client configuration
│   ├─ middleware/        # Middleware for routing and auth
│   │   └── authMiddleware.ts
│   ├─ routes/            # Routing configuration
│   │   ├─ _root.tsx
│   │   └─ routers/
│   │       ├─ dash.routes.ts
│   │       └─ root.route.ts
│   ├─ services/          # API services (fetch/axios calls, API integration)
│   │   ├─ appUrl..ts
│   │   └─ axios.ts
│   ├─ styles/            # Application styling
│   ├─ types/             # Global TypeScript type definitions
│   │   ├─ app.types.ts
│   │   ├─ app/
│   │   │   └── auth.type.ts
│   │   └─ lib-defs/
│   │       └── env.d.ts
│   ├─ utils/             # General utility functions (helpers, formatters)
│   │   ├─ redirect.ts
│   │   ├─ redirectByRole.ts
│   │   └─ utils.ts       # Library-specific utilities
│   ├─ validators/        # Validation schemas (e.g., using Zod)
│   │   └── auth.validator.ts
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

    *   **`contexts/`**: React contexts for global state management, such as Tanstack (React Query) provider.

    *   **`db/`**: Database API definitions and queries, e.g., auth-related API calls.

    *   **`hooks/`**: Custom React hooks for logic reuse, including mobile detection, logout, and token management.

    *   **`lib/`**: Library initializations and utilities, including Supabase client in `supabase.ts` and socket connections.

    *   **`middleware/`**: Custom middleware for authentication and routing guards.

    *   **`routes/`**: Routing setup using React Router, with root and dashboard routes.

    *   **`services/`**: API service layers using Axios for backend interactions.

    *   **`styles/`**: Centralized styling files and configurations.

    *   **`types/`**: TypeScript type definitions for app, auth, and environment.

    *   **`utils/`**: Utility functions for redirects, formatting, and general helpers.

    *   **`validators/`**: Zod-based validation schemas, e.g., for auth forms.

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
   Ensure `src/lib/supabase.ts` exists with the following content to set up the Supabase client:
   ```ts
   import { createClient } from '@supabase/supabase-js';

   // Pull Supabase credentials from environment variables
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   // Create the Supabase client
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
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

7. **Set Up Google OAuth**
   To integrate Google OAuth with Supabase:

   a. **In Google Cloud Console:**
      1. Go to [Google Cloud Console](https://console.cloud.google.com/).
      2. Create a new project or select an existing one.
      3. Enable the Google+ API (or relevant APIs) if needed.
      4. Navigate to **APIs & Services > Credentials**.
      5. Configure the OAuth consent screen (app name, user support email, developer contact).
      6. Click **Create Credentials > OAuth 2.0 Client ID**.
      7. Select **Web application**.
      8. Add **Authorized JavaScript origins** (e.g., `http://localhost:5173` for dev).
      9. Add **Authorized redirect URIs** using your Supabase project's auth callback: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
      10. Note the generated **Client ID** and **Client Secret** (generate secret if not provided).

   b. **In Supabase Dashboard:**
      1. Go to your Supabase project dashboard.
      2. Navigate to **Authentication > Providers**.
      3. Enable **Google** provider.
      4. Paste the **Client ID** and **Client Secret** from Google.
      5. Save changes.

   c. **Update .env:**
      Add to your `.env` file:
      ```env
      VITE_GOOGLE_CLIENT_ID=your_generated_client_id
      VITE_GOOGLE_CLIENT_SECRET=your_generated_client_secret
      ```

8. **Set Up GitHub OAuth**
   To integrate GitHub OAuth with Supabase:

   a. **In GitHub Developer Settings:**
      1. Go to [GitHub Settings](https://github.com/settings/developers).
      2. Navigate to **Developer settings > OAuth Apps**.
      3. Click **New OAuth App**.
      4. Provide **Application name** (e.g., your app name).
      5. Set **Homepage URL** (e.g., `http://localhost:5173` for dev).
      6. Set **Authorization callback URL** to your Supabase project's auth callback: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
      7. Click **Register application**.
      8. Copy the **Client ID** and generate/click **Generate a new client secret** to get the **Client Secret**.

   b. **In Supabase Dashboard:**
      1. Go to your Supabase project dashboard.
      2. Navigate to **Authentication > Providers**.
      3. Enable **GitHub** provider.
      4. Paste the **Client ID** and **Client Secret** from GitHub.
      5. Save changes.

   c. **Update .env:**
      Add to your `.env` file:
      ```env
      VITE_GITHUB_CLIENT_ID=your_generated_client_id
      VITE_GITHUB_CLIENT_SECRET=your_generated_client_secret
      ```

9. **Test the Setup**
   Run the development server:
   ```bash
   npm run dev
   ```
   Verify Supabase connection, Google, and GitHub OAuth by testing login flows, checking browser console for errors, and ensuring redirects work with the Supabase callback.
