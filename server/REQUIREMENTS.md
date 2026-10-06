# Software Requirements Specification (SRS) - SaaS Capstone

## 1. Target Audience
- **Small to Medium Business Teams:** Looking for simple project, task, and team collaboration workflows.
- **Freelancers & Solopreneurs:** Requiring unified client, billing, and progress management.
- **Developers & Tech Leads:** Seeking minimal-overhead tracking with API integrations.

---

## 2. Core Features & Functionalities
- **Authentication & RBAC:** Secure JWT-based authentication with bcrypt hashing (Admin, Member roles).
- **Workspace & Project Management:** Create, update, view, and organize custom workspaces and project boards.
- **Interactive Kanban / Task Tracking:** Task creation, assignments, status tracking (Todo, In-Progress, Done), and priority tagging.
- **RESTful API Services:** Structured backend endpoints for all CRUD operations with centralized error handling.
- **Responsive Dashboard:** Fast, component-driven client built on React and Vite.

---

## 3. User Personas & User Stories

### Persona A: Sarah (Project Manager)
- **Goal:** Track deliverables across multi-member teams without clutter.
- **Story:** *As a project manager, I want to create projects and assign tasks to team members so that we meet our weekly deadlines.*

### Persona B: Alex (Freelance Developer)
- **Goal:** Manage client milestones and update status rapidly.
- **Story:** *As a developer, I want to update my task status from "In-Progress" to "Done" so my team has immediate visibility.*

---

## 4. Technical Requirements
- **Frontend Stack:** React 18, Vite, Axios, React Router, CSS Modules.
- **Backend Stack:** Node.js, Express.js (REST API).
- **Database Layer:** SQLite with Sequelize ORM for structured relational data modeling.
- **Security:** JWT authentication headers (`Bearer <token>`), bcrypt salt rounds (10), CORS protection.
- **Environment & Deployment:** Configured `.env` secrets, Dockerfile container runtime.

---

## 5. System Architecture Outline