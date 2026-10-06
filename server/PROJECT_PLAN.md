# Project Plan & Execution Timeline - Full-Stack SaaS Capstone

## 1. Project Overview & Milestones Breakdown

| Milestone | Scope & Deliverables | Target Phase | Status |
|---|---|---|---|
| **M1: Foundation** | Setup backend/frontend, database connection, Docker, .env, proxy | Week 1 | Completed |
| **M2: Architecture & Planning** | Requirements, system design, database schemas, and timeline | Week 2 | In Progress |
| **M3: Core Backend & Auth** | Models, bcrypt/JWT auth routes, RBAC middleware, CRUD APIs | Week 3 | Upcoming |
| **M4: Frontend Integration** | UI views, dashboard layout, React Router guards, Axios state | Week 4 | Upcoming |
| **M5: Testing & Deployment** | Integration tests, QA checklist, Docker packaging, cloud deployment | Week 5 | Upcoming |

---

## 2. Detailed Work Breakdown Structure (WBS) & Time Estimates

### Phase 1: Authentication & Authorization (12 Hours)
- User schema definition and password hashing hooks (2 hrs)
- Register/Login controller logic with JWT signing (3 hrs)
- Bearer token verification middleware (2 hrs)
- Frontend Login & Signup forms with form validation (5 hrs)

### Phase 2: Workspace & Project Management (14 Hours)
- Project model and relational associations (Sequelize) (3 hrs)
- REST endpoints (`/api/projects`) with CRUD operations (4 hrs)
- Dashboard project cards and creation modal (4 hrs)
- State synchronization via React Context / Hooks (3 hrs)

### Phase 3: Task Tracking & Board Management (16 Hours)
- Task model schema with status enum and priority tags (3 hrs)
- Task CRUD endpoints with filtering (`projectId`, `status`) (4 hrs)
- Interactive Kanban board UI (columns: Todo, In Progress, Done) (6 hrs)
- Status update handlers and UI reactivity (3 hrs)

---

## 3. Dependency & Risk Mitigation Matrix

| Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|
| **Database Sync Issues** | High | Low | Use Sequelize schema alter carefully; back up SQLite file before altering models. |
| **JWT Expiration / State Drop** | Medium | Medium | Store token securely in `localStorage`; implement automatic client logout on `401 Unauthorized`. |
| **CORS / Network Errors** | High | Low | Leverage Vite development proxy (`/api`) and explicit Express CORS origins. |
| **Scope Creep** | Medium | High | Strictly prioritize MVP features (Auth, Projects, Tasks) before adding secondary features. |

---

## 4. Testing & Quality Assurance (QA) Plan

### Unit & Integration Testing
- **API Testing:** Validate status codes (200, 201, 400, 401, 404, 500) and payload envelopes via Postman / curl.
- **Auth Guard Testing:** Ensure private endpoints reject requests missing the `Authorization: Bearer <token>` header.

### Frontend QA Verification
- **Cross-Browser Verification:** Test UI responsiveness across Chrome, Edge, and mobile viewports.
- **Error Boundary & Form Handling:** Ensure loading indicators render during API latency and field errors display inline.