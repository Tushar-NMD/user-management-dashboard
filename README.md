# UserFlow — Production-Quality User Management Dashboard & Theming Engine

A modern, high-craft B2B SaaS dashboard built with **React 19 + TypeScript + Vite** and connected to an **Express + MongoDB Atlas** backend. Features a real, client-side dynamic theming engine with color presets, hexadecimal custom color picker with WCAG contrast calculation, and custom typography font upload.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Backend Setup & Run

The backend provides a RESTful API with MongoDB Atlas integration.

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Seed sample users into the database (optional)
npm run seed

# Start development server on http://localhost:5000
npm run dev
```

> **Backend API Base URL**: `http://localhost:5000/api`

### 2. Frontend Setup & Run

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Copy environment example
cp .env.example .env

# Run type check (TypeScript)
npm run typecheck

# Run linter (oxlint)
npm run lint

# Start Vite development server
npm run dev
```

> **Frontend Dashboard URL**: `http://localhost:5173/`

### 3. Production Build
```bash
cd frontend
npm run build
npm run preview
```

---
## AI Tools Used

- **ChatGPT:** Used for technical guidance, debugging assistance, and resolving implementation issues during development.
- **Antigravity:** Used for assistance with implementing the custom theming engine, including theme management, custom font upload, and applying theme changes across the application.

All AI-generated suggestions were reviewed and adapted as needed during implementation.

## 🎨 Architecture & Engineering Highlights

### 1. Custom Client-Side Theming Engine
- **No external UI library used for theming**: Built purely with CSS Custom Properties and React Context.
- **4 Curated Presets**:
  - **Indigo**: `#4F46E5` (Modern B2B standard)
  - **Teal**: `#0D9488` (Ocean corporate)
  - **Emerald**: `#16A34A` (Fintech trust)
  - **Violet**: `#C026D3` (Creative innovation)
- **Custom Hex Color Picker**:
  - Interactive HTML5 native color picker & hexadecimal string input with strict validation regex.
  - **Automated WCAG 2.1 Contrast Calculation**: Computes luminance and automatically sets button text to either white (`#FFFFFF`) or dark slate (`#0F172A`) for optimal accessibility.
  - Dynamic derivation of hover shade and focus ring color.
  - Single-click **Reset to Preset** action.
- **Dynamic Font Upload**:
  - Supports `.woff2`, `.woff`, `.ttf`, and `.otf` formats up to 2.5 MB.
  - Persists file as Base64 Data URL in `localStorage` with graceful quota overflow handling.
  - Injects dynamic `@font-face` rules into the DOM on-the-fly.
  - Live typography specimen and **Reset to System Font** action.
- **Client Persistence**: All settings (`preset`, `customColor`, `customFont`) persist across reloads in `localStorage`.

### 2. Live Dashboard Overview
- **Real Backend Statistics** from `GET /api/users/stats`:
  - Total Users
  - Active Users (with active percentage indicator)
  - Inactive Users
  - Users Added This Week (last 7 days window)
- **Recent Users Table**: Displays the most recent signups with roles, statuses, and quick action shortcuts.
- **System Health Diagnostics**: Real-time status for Express server and MongoDB Atlas connectivity.

### 3. Full User Management (CRUD)
- Connected to real backend endpoints:
  - `GET /api/users` — List all registered users
  - `POST /api/users` — Create user with duplicate email prevention (409) and validation (400)
  - `GET /api/users/:id` — Retrieve user by MongoDB ObjectId
  - `PUT /api/users/:id` — Update profile, role, and status
  - `DELETE /api/users/:id` — Destructive removal with confirmation dialog
- **Instant Search**: Search by name or email with quick clear button.
- **Role & Status Filters**: Filter by Admin / User, Active / Inactive, or All.
- **Accessible Modals**: Focus-trapped, keyboard navigation (Escape to close), and prevents accidental close during in-flight network requests.
- **Destructive Deletion Confirmation**: Explicit dialog displaying user's name and email with irreversible warning.
- **Client-Side Pagination**: Clean 8-item paging with range indicator.

---

## 📂 Project Directory Structure

```
user-management-dashboard/
├── backend/
│   ├── config/          # MongoDB Atlas connection
│   ├── controllers/     # Express route controllers
│   ├── middleware/      # Error & 404 handlers
│   ├── models/          # Mongoose User schema & validation
│   ├── routes/          # REST endpoints (/api/users, /api/users/stats)
│   ├── scripts/         # Database seed script
│   └── server.js        # Server entry point (port 5000)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/  # Sidebar, TopNav, AppShell
    │   │   └── ui/      # Button, Input, Select, Modal, ConfirmDialog, Badge, Card, Toast, Spinner, EmptyState
    │   ├── features/
    │   │   ├── dashboard/  # DashboardPage, StatCard
    │   │   ├── users/      # UsersPage, UserTable, UserModal, UserFilterBar
    │   │   └── theme/      # ThemeSettingsPage, PresetSelector, CustomColorPicker, FontUploader, ThemeLivePreview
    │   ├── services/    # apiClient.ts, userService.ts
    │   ├── styles/      # theme.css (CSS variables), index.css
    │   ├── theme/       # ThemeContext, useTheme, colorUtils, fontManager, themeTokens
    │   ├── types/       # TypeScript declarations (user, theme, api)
    │   └── utils/       # formatters, validators
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.js
```
