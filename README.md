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

### 2. Install Dependencies
```bash
npm install
```

### 3. Create env file
```env
DB_HOST=hostname
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=taskboard
JWT_SECRET=super_secret_key
DB_PORT=3306
```
Modify valriable values with the right values

### 4. Run Server
```bash
npm run dev
```
### 5. Authentication
Authentication
This API uses JWT Bearer tokens.
After login/register, include the token in requests:
```txt
Authorization: Bearer <token>
```

### 5. Api Endpoints

####  Auth
|Method   |Endpoint | Description
|---      | ---- | ----|
|POST    |/register | Creates a new user|
|POST    |/login | Login and recieve jwt tokens|

#### Board
|Method   |Endpoint| Description
|---      | ----   | ----|
|GET      |/boards | Gets all board from the logged in user|
|POST     |/boards | Create new board for the logged in user|
|GET      |/boards:boardId | Gets specific board (Authorized)|
|PATCH    |/boards:boardId |update a board (Authorized)|
|DELETE   |/boards:boardId |deletes a board (Authorized)|


#### Task
|Method   |Endpoint | Description
|---      | ---- | ----|
|GET    |/boards/:boardId/task |Get task for a specific user and board number |
|POST    |/boards/:boardId/task |Creates new task for a specific user and board |
|DELETE|/task/:taskId |Delete  task for a specific user and board |

### Authorization Model

All resources are user-owned: A user can only access boards where boards user_id = req.user.userId
Tasks are only accessible if the user owns the parent board
(enforced via SQL checks / joins)
This prevents users from creating/deleting tasks in boards they don’t own.


### Example Request

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@email.com","password":"password123"}'
```