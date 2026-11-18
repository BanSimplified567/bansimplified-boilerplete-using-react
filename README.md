```bash
bansimplified-react-boilerplate/
│
├─ public/                 # Static files
│   ├── vite.svg           # Vite logo/placeholder image
│   └── website(img)/      # Auth & dashboard images
│       ├── createaccount.png
│       ├── loginaccount.png
│       └── tmp-dashboard.png
├─ src/                    # Source code
│   ├─ App.tsx             # Main App component
│   ├─ index.css           # Global CSS styles (includes Tailwind directives)
│   ├─ main.tsx            # Application entry point (renders React to DOM)
│   ├─ assets/             # Static assets (images, icons, fonts)
│   │   └── react.svg
│   ├─ components/         # Reusable UI components (Button, Card, Modal, etc.)
│   │   ├─ layout/
│   │   │   └── LoadingPage.tsx
│   │   └─ ui/
│   ├─ contexts/           # React contexts for state management
│   │   └── TanstackProvider.tsx  # TanStack Query provider
│   ├─ hooks/              # Custom React hooks
│   │   ├─ use-mobile.ts
│   │   ├─ useLogout.tsx
│   ├─ lib/                # Library utilities and configurations
│   │   ├─ socket.ts
│   │   ├─ supabase.ts     # Supabase client configuration
│   │   └─ supebase.ts     # (Possible duplicate/typo of supabase.ts)
│   ├─ middleware/         # Middleware for routing and auth
│   │   └── authMiddleware.ts
│   ├─ pages/              # Page components for routing (using TanStack React Router with file-based routing)
│   │   ├─ NotFound.tsx
│   │   ├─ (auth)/         # Auth-related pages
│   │   ├─ (dashboard)/    # Dashboard pages
│   │   ├─ (information)/  # Information pages (corrected from 'infromation')
│   │   └─ (root)/         # Root pages
│   ├─ routes/             # Routing configuration (TanStack React Router)
│   │   ├─ _root.tsx
│   │   └─ routers/
│   │       ├─ dash.routes.ts
│   │       └─ root.route.ts
│   ├─ styles/             # Application styling
│   ├─ types/              # Global TypeScript type definitions
│   │   ├─ app/
│   │   │   └── auth.type.ts
│   │   └─ lib-defs/
│   │       └── env.d.ts
│   └─ utils/              # General utility functions (helpers, formatters)
│       ├─ redirect.ts
│       └─ utils.ts
├─ .gitignore              # Git ignore rules
├─ components.json         # UI component registry (for shadcn/ui)
├─ eslint.config.js        # ESLint configuration
├─ index.html              # HTML entry point
├─ package-lock.json       # NPM dependency lock file
├─ package.json            # Project dependencies and scripts
├─ postcss.config.js       # PostCSS configuration (processes Tailwind CSS)
├─ tailwind.config.js      # Tailwind CSS configuration
├─ tsconfig.app.json       # TypeScript config for application code
├─ tsconfig.json           # Main TypeScript configuration
├─ tsconfig.node.json      # TypeScript config for Node/bundler code
└── vite.config.ts         # Vite build tool configuration
```

## Folder Structure Explained

Here's a breakdown of what each folder in the project is for:

*   **`public/`**: This directory contains static assets that are not processed by the build tool. Files here are served at the root path. It's suitable for assets like `robots.txt` or web manifest files.

    *   **`public/website(img)/`**: Contains UI images used in the authentication and dashboard pages.
        *   `loginaccount.png` - Login account illustration/image used on the login page.
        *   `createaccount.png` - Sign up account illustration/image used on the sign up page.
        *   `tmp-dashboard.png` - Temporary dashboard preview image.

    ### Images

    #### loginaccount.png
    ![Login Account](public/website(img)/loginaccount.png)
    This image is displayed on the **Login** page (`src/pages/(auth)/LoginAccount.tsx`). It serves as a visual illustration/hero graphic for the user authentication login form, helping to brand the login experience and guide users to enter their credentials.

    #### createaccount.png
    ![Create Account](public/website(img)/createaccount.png)
    This image is displayed on the **Sign Up** page (`src/pages/(auth)/SignUpAccount.tsx`). It serves as a visual illustration/hero graphic for the user registration form, welcoming new users and reinforcing the account creation flow.

    #### tmp-dashboard.png
    ![Temporary Dashboard](public/website(img)/tmp-dashboard.png)
    This is a temporary placeholder/preview image used during dashboard development (`src/pages/(dashboard)/Dashboard.tsx`). It provides a visual scaffold for the dashboard layout before the final content is implemented.

*   **`src/`**: This is where all your application's source code lives.

    *   **`App.tsx`**: Main application component that sets up providers and routing.

    *   **`assets/`**: For static assets like images, icons, and fonts that you import directly into your components. These assets are processed and bundled by Vite.

    *   **`components/`**: Holds reusable UI components (e.g., `Button`, `Card`, `Modal` from shadcn/ui). Subfolders include `layout/` for layout components like `LoadingPage.tsx` and `ui/` for primitive UI elements.

    *   **`contexts/`**: React contexts for global state management, including `TanstackProvider.tsx` for TanStack Query (React Query).

    *   **`hooks/`**: Custom React hooks for logic reuse, including `use-mobile.ts` for mobile detection, `useLogout.tsx` for logout functionality.

    *   **`lib/`**: Library initializations and utilities, including `supabase.ts` for Supabase client configuration and `socket.ts` for socket connections.

    *   **`middleware/`**: Middleware for routing and authentication, such as `authMiddleware.ts`.

    *   **`pages/`**: Contains the main page components for your application using TanStack React Router with file-based routing. Subfolders like `(auth)/`, `(dashboard)/`, `(information)/`, `(root)/` group related pages.

    *   **`routes/`**: Routing configuration using TanStack React Router, including `_root.tsx` and subfolder `routers/` with `dash.routes.ts` and `root.route.ts`.

    *   **`styles/`**: Centralized application styling files.

    *   **`types/`**: Global TypeScript type definitions, including `app/auth.type.ts` for auth types and `lib-defs/env.d.ts` for environment types.

    *   **`utils/`**: General utility functions, such as `redirect.ts` for navigation helpers and `utils.ts` for general helpers.


## Tech Stack

This project is built using the following technologies (versions from package.json):

- **Frontend Framework**: React (v19.2.0) with TypeScript (TSX files)
- **Build Tool**: Vite (v7.2.4)
- **Styling**: Tailwind CSS (v3.4.18) with PostCSS and Autoprefixer
- **Routing**: TanStack React Router (v1.140.1) with file-based routing (react-router-dom v7.10.1 as fallback/secondary)
- **Data Management**: TanStack Query (v5.90.12) for server-state management and caching
- **Backend & Authentication**: Supabase (@supabase/supabase-js v2.86.2)
- **Real-time**: Socket.io-client (v4.8.1)
- **HTTP Client**: Axios (v1.13.2)
- **Icons**: Lucide React (v0.555.0)
- **UI Components**: shadcn/ui (based on components.json)
- **Utilities**: clsx (v2.1.1), tailwind-merge (v3.4.0), class-variance-authority (v0.7.1), tailwindcss-animate (v1.0.7)
- **Development Tools**: ESLint (v9.39.1), TypeScript (v5.9.3), PostCSS (v8.5.6), @tailwindcss/vite (v4.1.17)

# Project Setup with Supabase and Google OAuth

## Todo List for Setting Up the Project

1. **Clone the Repository**
   Run the following command to download the project code to your local machine:
   ```bash
   git clone https://github.com/BanSimplified567/bansimplified-react-boilerplate.git
   ```
   Replace the URL with your actual Git repository if different.

2. **Navigate to the Project Directory**
   ```bash
   cd bansimplified-react-boilerplate
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install all required Node.js packages listed in `package.json`.

4. **Verify Supabase Connection File**
   The file `src/lib/supabase.ts` should exist with content to set up the Supabase client (update if needed):
   ```ts
   import { createClient } from '@supabase/supabase-js';

   // Pull Supabase credentials from environment variables
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

   // Create the Supabase client
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

5. **Create Environment Variables Example File**
   Create a `.env.example` file in the root directory (if not present) with placeholder values for Supabase and Google OAuth configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   VITE_GITHUB_CLIENT_ID=your_github_client_id_here
   VITE_GITHUB_CLIENT_SECRET=your_github_client_secret_here
   ```

6. **Set Up Environment Variables**
   Copy `.env.example` to `.env` (create if needed) and fill in your actual keys:
   ```bash
   copy .env.example .env
   ```
   (Use `copy` on Windows; adjust for your OS.)

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
   Open http://localhost:5173 (default Vite port). Verify Supabase connection, TanStack Query setup in contexts, routing with TanStack React Router, Google and GitHub OAuth by testing login flows, checking browser console for errors, and ensuring redirects/auth middleware work with the Supabase callback.
