# TASK BOARD (Backend)

A RESTful backend for a task/board management app. Built with **Node.js**, **Express**, **TypeScript**, and **MySQL**, featuring **JWT authentication**, user-owned resources (boards/tasks), and clean API design.

## Features
- ✅ User authentication (JWT)
- ✅ Boards CRUD (user-owned)
- ✅ Tasks CRUD inside boards (user-owned + authorized)
- ✅ Input validation + consistent error responses
- ✅ MySQL with parameterized queries (SQL injection safe)
- ✅ Structured route organization (scales as the app grows)

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MySQL
- **Auth:** JWT (Bearer token)
- **Driver:** mysql2

## Project Structure
```txt
src/
  db/
    init.ts
    pool.ts
  middleware/
    requireAuth.ts
  routes/
    auth.ts
    boards.ts
    tasks.ts
  types/
    auth.ts
  index.ts
```

## Getting Started
### 1. Clone
```bash
git clone https://github.com/francis15-0/Board-Backend.git
cd board-backend
```