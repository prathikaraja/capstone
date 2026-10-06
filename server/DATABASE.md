# Database Architecture & Storage Plan - SaaS Platform

## 1. Database Management System (DBMS) Selection
- **Development Environment:** SQLite (`database.sqlite`) via Sequelize ORM for zero-configuration, rapid local testing, and offline resilience.
- **Production Environment:** Managed PostgreSQL (Render / Supabase / AWS RDS) for ACID compliance, concurrent read/write scaling, and connection pooling.
- **ORM Layer:** Sequelize with migration scripts to maintain schema parity between SQLite and PostgreSQL.

---

## 2. Entity Relational Schema & Data Models

### Users Table
- `id`: UUID (Primary Key, default UUIDv4)
- `name`: VARCHAR(255), Not Null
- `email`: VARCHAR(255), Unique, Indexed, Not Null
- `password`: VARCHAR(255), Hashed with bcrypt, Not Null
- `role`: ENUM('admin', 'member'), Default 'member'
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP

### Projects Table
- `id`: UUID (Primary Key)
- `title`: VARCHAR(255), Not Null
- `description`: TEXT
- `ownerId`: UUID (Foreign Key -> Users.id, ON DELETE CASCADE)
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP

### Tasks Table
- `id`: UUID (Primary Key)
- `title`: VARCHAR(255), Not Null
- `description`: TEXT
- `status`: ENUM('todo', 'in-progress', 'done'), Default 'todo'
- `priority`: ENUM('low', 'medium', 'high'), Default 'medium'
- `projectId`: UUID (Foreign Key -> Projects.id, ON DELETE CASCADE)
- `assigneeId`: UUID (Foreign Key -> Users.id, ON DELETE SET NULL)
- `dueDate`: DATE
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP

---

## 3. Data Retrieval & Performance Optimization
- **Indexing:** Indexes on `Users(email)`, `Projects(ownerId)`, and composite index on `Tasks(projectId, status)`.
- **Eager Loading & Projections:** Sequelize associations using `include` statements with explicit attribute projections (excluding sensitive fields like `password`).
- **Pagination:** Cursor-based or `limit`/`offset` query pagination on high-volume task listing routes.

---

## 4. File & Asset Storage Architecture
- **Object Storage Service:** Cloudinary / AWS S3.
- **Workflow:**
  1. Client sends multipart upload via Express backend (`multer`).
  2. File stream piped to cloud storage with signed authenticated requests.
  3. Cloud URL returned and persisted in database (e.g., `user.avatarUrl` or `task.attachmentUrl`).

---

## 5. Data Backup & Disaster Recovery Plan
- **Automated Snapshots:** Daily automated SQLite file snapshots locally; nightly managed pg_dump backups in production.
- **Point-In-Time Recovery (PITR):** Production write-ahead log (WAL) archiving enabled with 7-day retention.
- **Failover Strategy:** Database health checks with automated restart triggers managed via container orchestrator.