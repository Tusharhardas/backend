# Knowledge Sharing Platform - Backend

## Approach
### Architecture Overview
- **Node.js & Express**: Core application framework.
- **Sequelize ORM**: For database management and migrations.
- **MySQL**: Relational database for persistent storage.
- **JWT**: Token-based authentication for secure API access.

### Folder Structure
- `src/config`: Database and environment configurations.
- `src/controllers`: Request handling logic for Users, Articles, and AI features.
- `src/middleware`: Custom middleware for Auth protection and Global Error handling.
- `src/models`: Sequelize model definitions.
- `src/routes`: API endpoint definitions.
- `src/services`: Service layer for AI logic (Integrated with **Pollinations.AI** for real-time generation).
- `src/scripts`: Database initialization and maintenance scripts.

### Key Design Decisions
- **Real-Time Analytics**: Implemented a view-count tracking system that increments on article retrieval.
- **Async Handling**: Used `express-async-handler` to simplify error management in async routes.
- **Service Layer**: Decoupled AI logic using a pluggable bridge architecture, now powered by Pollinations.AI.
- **Security**: Password hashing using `bcryptjs` and route protection with JWT.

## AI Usage
### Tools Used
- **Cursor AI / Antigravity Agent**: Assisted in boilerplate generation, middleware logic, and database schema design.

### Impact Areas
- **Code Generation**: Generated Sequelize models and initial Express router logic.
- **Refactoring**: Suggested decoupling the AI logic into a separate service layer.
- **API Design**: Automated the creation of standard RESTful CRUD endpoints.

### Manual Corrections
- Verified JWT expiration logic and manual check of Sequelize associations (User-Article).

## Setup Instructions
### Prerequisites
- Node.js installed.
- MySQL Server running.

### Environment Variables (.env)
```env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=knowledge_platform
JWT_SECRET=your_jwt_secret
```

### Setup
1. `cd backend`
2. `npm install`
3. Create the database `knowledge_platform` in MySQL.
4. `npm start` (or `npm run dev` if nodemon is used)
