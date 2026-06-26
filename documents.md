# Task Management System - System Documentation

This document contains the core architectural, database, and API documentation for the Task Management System (TMS), as required by the Software Requirements Specification (SRS).

---

## 1. Entity-Relationship (ER) Diagram

The ER diagram illustrates the database tables and their relationships. 
- **Users** can manage multiple **Projects**.
- **Projects** contain multiple **Tasks**.
- **Tasks** can be assigned to multiple **Users** via the **TaskAssignment** junction table.
- **Tasks** can have multiple **Comments** and **Attachments**.
- **Users** receive **Notifications**.

```mermaid
erDiagram
    USER ||--o{ PROJECT : "creates/manages"
    USER ||--o{ TASK : "creates"
    USER ||--o{ TASK_ASSIGNMENT : "assigned_to"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ ATTACHMENT : "uploads"
    USER ||--o{ NOTIFICATION : "receives"
    
    PROJECT ||--o{ TASK : "contains"
    
    TASK ||--o{ TASK_ASSIGNMENT : "has"
    TASK ||--o{ COMMENT : "has"
    TASK ||--o{ ATTACHMENT : "has"

    USER {
        uuid id PK
        string name
        string email UK
        string password_hash
        enum role "admin, project_manager, collaborator"
        boolean is_active
        boolean must_reset_password
        datetime created_at
        datetime updated_at
    }

    PROJECT {
        uuid id PK
        string name
        string description
        string status
        uuid manager_id FK
        datetime created_at
        datetime updated_at
    }

    TASK {
        uuid id PK
        string title
        string description
        enum status "todo, in_progress, completed"
        enum priority "low, medium, high"
        datetime due_date
        uuid created_by FK
        uuid project_id FK
        datetime created_at
        datetime updated_at
    }

    TASK_ASSIGNMENT {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        datetime assigned_at
    }

    COMMENT {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        string content
        datetime created_at
    }

    ATTACHMENT {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        string file_name
        string file_path
        string file_type
        int file_size
        datetime created_at
    }

    NOTIFICATION {
        uuid id PK
        uuid user_id FK
        string type
        string message
        boolean is_read
        datetime created_at
    }
```

---

## 2. Class Diagram

This diagram represents the domain models (Prisma models) mapped as Object-Oriented classes, highlighting properties and structural relationships.

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String password_hash
        +Role role
        +Boolean is_active
        +Boolean must_reset_password
        +DateTime created_at
        +DateTime updated_at
        +createProject()
        +assignTask()
        +addComment()
    }

    class Project {
        +String id
        +String name
        +String description
        +String status
        +String manager_id
        +DateTime created_at
        +DateTime updated_at
    }

    class Task {
        +String id
        +String title
        +String description
        +Status status
        +Priority priority
        +DateTime due_date
        +String created_by
        +String project_id
        +DateTime created_at
        +DateTime updated_at
    }

    class TaskAssignment {
        +String id
        +String task_id
        +String user_id
        +DateTime assigned_at
    }

    class Comment {
        +String id
        +String task_id
        +String user_id
        +String content
        +DateTime created_at
    }

    class Attachment {
        +String id
        +String task_id
        +String user_id
        +String file_name
        +String file_path
        +String file_type
        +Int file_size
        +DateTime created_at
    }

    class Notification {
        +String id
        +String user_id
        +String type
        +String message
        +Boolean is_read
        +DateTime created_at
    }

    User "1" *-- "*" Project : manages
    Project "1" *-- "*" Task : contains
    Task "1" *-- "*" TaskAssignment : has assignments
    User "1" *-- "*" TaskAssignment : assigned to
    Task "1" *-- "*" Comment : has
    User "1" *-- "*" Comment : authors
    Task "1" *-- "*" Attachment : has
    User "1" *-- "*" Notification : receives
```

---

## 3. Database Design

### Overview
The system uses **PostgreSQL** as its relational database management system, interfaced via **Prisma ORM**.

### Key Design Decisions
1. **Primary Keys:** UUIDs (Universally Unique Identifiers) are used for all primary keys (`id` fields) instead of auto-incrementing integers. This prevents ID enumeration attacks and ensures global uniqueness.
2. **Referential Integrity:** 
   - Cascade deletes are implemented. For example, deleting a `Project` automatically deletes its associated `Tasks`. Deleting a `Task` deletes its `Comments`, `Attachments`, and `TaskAssignments`.
3. **Data Integrity (Enums):**
   - `Role`: Restricted to `admin`, `project_manager`, `collaborator`.
   - `Status`: Restricted to `todo`, `in_progress`, `completed`.
   - `Priority`: Restricted to `low`, `medium`, `high`.
4. **Junction Tables:** A `TaskAssignment` table is used to properly resolve the many-to-many relationship between Users and Tasks.
5. **Security:** Passwords are never stored in plain text. They are hashed securely using `bcrypt` and stored in the `password_hash` column.

---

## 4. Deployment Diagram

This diagram visualizes the physical deployment architecture of the system across cloud infrastructure.

```mermaid
graph TD
    subgraph ClientEnvironment ["Client Environment"]
        Browser[Web Browser / User]
    end

    subgraph FrontendHosting ["Frontend Hosting (e.g., AWS S3 / Vercel)"]
        UI[React.js Single Page Application]
    end

    subgraph BackendCloudServer ["Backend Cloud Server (e.g., AWS EC2 / Render)"]
        NodeServer[Node.js + Express.js Server]
        SocketIO[Socket.io Server]
        Multer[Local Volume / uploads dir]
    end

    subgraph DatabaseHosting ["Database Hosting (e.g., Supabase / AWS RDS)"]
        PostgreSQL[(PostgreSQL Database)]
    end

    Browser -- "1. HTTP GET (Static Files)" --> UI
    Browser -- "2. REST API Calls (HTTPS)" --> NodeServer
    Browser -- "3. WebSockets (WSS) Real-time" <--> SocketIO
    
    NodeServer -- "Reads/Writes Files" --> Multer
    NodeServer -- "Prisma ORM (TCP)" --> PostgreSQL
    SocketIO -- "Triggers Events" --> NodeServer
```

---

## 5. API Documentation

The backend exposes a RESTful API. All protected endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

### 5.1 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/login` | Authenticates user and returns JWT. | Public |
| POST | `/register` | Self-registers a new collaborator. | Public |
| POST | `/reset-password` | Resets password on first login. | Auth Required |

### 5.2 Users (`/api/users`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Retrieves list of all users. | Admin, Manager |
| POST | `/` | Creates a new user. | Admin |
| GET | `/:id` | Retrieves a specific user by ID. | Admin |
| PUT | `/:id` | Updates user details. | Admin |
| PATCH | `/:id/deactivate` | Deactivates a user account. | Admin |
| PATCH | `/:id/activate` | Activates a user account. | Admin |
| PATCH | `/:id/role` | Changes user role. | Admin |

### 5.3 Projects (`/api/projects`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all projects. | Auth Required |
| POST | `/` | Create a new project. | Manager |
| GET | `/:id` | Get project details. | Auth Required |
| PUT | `/:id` | Update project details. | Manager |
| DELETE| `/:id` | Delete a project. | Manager |

### 5.4 Tasks (`/api/tasks`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all tasks. | Auth Required |
| POST | `/` | Create a new task. | Manager |
| GET | `/:id` | Get task details. | Auth Required |
| PUT | `/:id` | Update task details. | Manager |
| DELETE| `/:id` | Delete a task. | Manager |
| PATCH | `/:id/status` | Update task status (e.g. to Done). | Manager, Collaborator|
| POST | `/:id/assign` | Assign users to a task. | Manager |
| POST | `/:id/comments` | Add a comment to a task. | Auth Required |
| GET | `/:id/comments` | Retrieve comments for a task. | Auth Required |
| POST | `/:id/attachments`| Upload a file attachment. | Auth Required |
| DELETE| `/:id/attachments/:attachmentId`| Remove an attachment. | Auth Required |

### 5.5 Notifications (`/api/notifications`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get user's notifications. | Auth Required |
| PATCH | `/:id/read` | Mark a specific notification as read.| Auth Required |
| PATCH | `/read-all` | Mark all notifications as read. | Auth Required |
