# System Architecture & Technical Design - SaaS Platform

## 1. Front-End Architecture (React.js + Vite)
- **Framework:** React 18 with Vite build tooling for fast HMR and bundled assets.
- **Component Design:** Atomic component pattern (`components/common`, `components/layout`, `views/dashboard`).
- **State Management:** React Context API & React Hooks (`useState`, `useEffect`, custom hooks) for auth session state and API caching.
- **Client Routing:** React Router v6 with declarative route guards for protected user dashboards.
- **HTTP Client:** Axios instance with request/response interceptors for automatic JWT token injection and error handling.

---

## 2. Back-End Architecture (Node.js & Express)
- **Architecture Pattern:** Layered MVC / Controller-Service-Repository pattern:
  - **Routing Layer:** Maps HTTP endpoints (`/api/auth`, `/api/projects`, `/api/tasks`).
  - **Middleware Layer:** JWT validation, role-based access control, request logging, and CORS handling.
  - **Controller Layer:** Request parameter validation, status code mapping, and response orchestration.
  - **Service/Data Access Layer:** Business logic separation interacting with Sequelize models.
- **Error Handling:** Centralized async error boundary returning standardized JSON envelopes (`status`, `message`, `data`).

---

## 3. Database Schema & Data Models
- **ORM:** Sequelize ORM with relational mapping.
- **Primary Entities:**
  - **User:** `id (UUID)`, `name`, `email (unique)`, `password (hashed)`, `role`, `timestamps`.
  - **Project:** `id (UUID)`, `title`, `description`, `ownerId (FK -> User.id)`, `timestamps`.
  - **Task:** `id (UUID)`, `title`, `status ('todo'|'in-progress'|'done')`, `priority ('low'|'medium'|'high')`, `projectId (FK -> Project.id)`, `assigneeId (FK -> User.id)`.
- **Relationships:**
  - `User` 1:N `Project`
  - `Project` 1:N `Task`
  - `User` 1:N `Task` (as Assignee)

---

## 4. Cloud Platform & Deployment Strategy
- **Frontend Hosting:** Vercel / Netlify (Continuous Deployment linked to GitHub `main` branch, edge CDN caching).
- **Backend Hosting:** Render / Railway (Node.js runtime container or native buildpack with automatic HTTPS).
- **Database Strategy:** SQLite for local development; managed PostgreSQL on Render / Supabase for production.
- **Container Strategy:** Single or multi-stage Docker build via `Dockerfile` for environment parity across host OS platforms.

---

## 5. Third-Party APIs & External Services
- **Authentication Security:** JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` encryption.
- **Email Notifications (Future Integration):** SendGrid / Resend API for invite links and password resets.
- **Storage Services:** Cloudinary / AWS S3 for profile avatars and file attachments.
- **Monitoring & Telemetry:** Morgan logging, Sentry error tracking.