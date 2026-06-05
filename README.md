# MindLaunch — AI-Powered Startup Learning Platform

MindLaunch is a premium, full-stack startup learning platform for entrepreneurs. It features a curated 30-module curriculum, an interactive AI Pitch Coach (powered by Anthropic Claude API), Stripe payments for unlocking premium curriculum tracks, and client-side exports of deliverables to PDF and MS Word (DOCX).

Designed with a sleek, premium **dark theme** and **glassmorphism-lite** card elements, it adapts its curriculum field requirements and guidelines to the specific country/region selected by the founder.

---

## Technical Stack
- **Frontend**: React.js, Vite, React Router, Lucide Icons, jsPDF, docx.js, Vanilla CSS.
- **Backend**: Node.js, Express, Mongoose, Stripe SDK, Anthropic SDK.
- **Database**: MongoDB (with automatic local file-based JSON fallback if MongoDB is not installed).

---

## Project Structure

```
/client
  /src
    /components      # Protected routes, Sidebar, Navigation layouts
    /context         # AuthContext (state, login, register, profile update, mock checks)
    /pages           # Landing Page, Login, Register, Onboarding, Dashboard, Module details, Pitch Coach, Startup Brief, Document Hub, Profile, Subscription
    index.css        # Global CSS dark design tokens
    main.jsx         # App bootstrap
    App.jsx          # Route mappings
  package.json
/server
  /middleware        # JWT verification middleware
  /models            # Mongoose schemas (User, Module, Progress, PitchSession)
  /routes            # Auth, Modules, Pitch Coach, Profile, Documents, Payments
  /seed              # Seed curriculum JSON records
  server.js          # Main express app bootstrapper
  db.js              # Database connection wrapper with JSON file mock fallback
  seed.js            # Curriculum database seeder
  package.json
.env                 # Project environment variables
.gitignore           # Git ignore patterns
```

---

## Database Fallback (Zero-Configuration Mode)
If you do not have MongoDB running locally, **MindLaunch will automatically switch to a local JSON-based mock database file-store** located in `/server/data/`.
This means:
- The app requires **zero database installation** to run, test, and demonstrate.
- All registrations, completions, and chat histories are saved locally as `.json` files in the server folder.
- You can run the database seeder (`npm run seed`) and it will populate the JSON file-store automatically.

---

## Getting Started

### 1. Environment Configuration
Create a `.env` file at the root of the project (pre-configured for local testing):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mindlaunch
JWT_SECRET=super_secret_jwt_token_key_12345
CLIENT_URL=http://localhost:5173

# API Credentials (Optional fallbacks provided)
# For full functionality, replace with active keys:
ANTHROPIC_API_KEY=placeholder_claude_api_key
STRIPE_SECRET_KEY=placeholder_stripe_secret
STRIPE_WEBHOOK_SECRET=placeholder_stripe_webhook_secret
```

### 2. Install Dependencies
Run the installation command inside both the server and client folders:

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 3. Seed Curriculum Modules
Seed all 30 modules across the 5 learning tracks (Foundations, Finance, Operations, Marketing, Fundraising) into the database (MongoDB or local JSON fallback):

```bash
cd server
npm run seed
```

### 4. Start the Application

Start the backend server:
```bash
cd server
npm run dev
```

Start the Vite React development server:
```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Key Features & Mock Utilities

1. **Curriculum Modules (Demo vs. Premium)**
   - Under the **Free plan** (default on register), Module 1 ("Customer Discovery") is unlocked. The other 29 modules are locked behind an amber upgrade CTA.
   - Completing Module 1 updates the progress status. Under the **Premium plan**, all 30 modules across all tracks are unlocked.

2. **AI Pitch Coach**
   - The Pitch Coach chat system loads the founder's startup idea + category into the Anthropic system prompt as context.
   - If `ANTHROPIC_API_KEY` is not provided, the route automatically executes a **Mock AI engine** that answers questions, challenges assumptions, and compiles a realistic structured Pitch Feedback Report when requested.

3. **Mock Upgrade Trigger**
   - If Stripe credentials are not present, visiting `/subscription` will show a **Local Developer Demo Upgrade** card. Clicking this upgrades the user plan to premium in the database instantly, unlocking all modules.

4. **Document Exports**
   - **My Startup Brief**: Compiles all completed module deliverables into a single, sleek PDF dossier using `jsPDF`.
   - **My Documents**: Generates individual module worksheets or the full brief in Microsoft Word (`.docx`) format using the `docx.js` library.
