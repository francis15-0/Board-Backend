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

#### Auth

| Method | Endpoint  | Description                  |
| ------ | --------- | ---------------------------- |
| POST   | `/register` | Creates a new user           |
| POST   | `/login`  | Login and recieve jwt tokens |

#### Board

| Method | Endpoint          | Description                             |
| ------ | ----------------- | --------------------------------------- |
| GET    | `/boards`         | Gets all board from the logged in user  |
| POST   | `/boards`         | Create new board for the logged in user |
| GET    | `/boards:boardId` | Gets specific board (Authorized)        |
| PATCH  | `/boards:boardId` | update a board (Authorized)             |
| DELETE | `/boards:boardId` | deletes a board (Authorized)            |

#### Task

| Method | Endpoint              | Description                                    |
| ------ | --------------------- | ---------------------------------------------- |
| GET    | `/boards/:boardId/task` | Get task for a specific user and board number  |
| POST   | `/boards/:boardId/task` | Creates new task for a specific user and board |
| DELETE | `/task/:taskId`         | Delete task for a specific user and board      |

### Authorization Model

All resources are user-owned:

- A user can only access boards where boards `user_id = req.user.userId`
- Tasks are only accessible if the user owns the parent board
  (enforced via SQL checks / joins)

This prevents users from creating/deleting tasks in boards they don’t own.

### Example Request

##### Register

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@email.com","password":"password123"}'
```

##### Login

```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@email.com","password":"password123"}'

```

##### Create Board

```bash
curl -X POST http://localhost:5000/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My Board"}'
```

##### Error handeling

Errors returnJSONin a consistent format

```json
{
  "message": "Reason for the error"
}
```

###### Common status codes:

- `400` Bad request (invalid input)
- `401` Unauthorized (missing/invalid token)
- `403` Forbidden (not allowed)
- `404` Not found
- `500` Internal server error

#### Roadmap / Improvements

- [ ] Add request validation middleware (zod or express-validator)

- [ ] Add pagination for tasks

- [ ] Add sorting + filtering (status, due date, priority)

- [ ] Add tests (Jest + Supertest)

- [x] Dockerize (MySQL + API)

# Development Setup

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### 2. Configure Environment Variables

Create a `.env.docker` file in the root directory with your environment variables:

```bash
# Database Configuration
DB_HOST=db
DB_PORT=3306
DB_NAME=boards
DB_USER=appuser
DB_PASSWORD=apppass

# Application Configuration
NODE_ENV=development
PORT=3000
```

### 3. Build and Start the Development Environment

```bash
docker-compose up --build
```

The application will be available at:
- **Application**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8082
- **MySQL Database**: localhost:3006

### 4. Stop the Development Environment

```bash
docker-compose down
```

To stop and remove volumes (this will delete your database data):

```bash
docker-compose down -v
```

## Common Development Commands

### Rebuild Containers

If you've made changes to the Dockerfile or dependencies:

```bash
docker-compose up --build
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f db
```

### Execute Commands Inside Container

```bash
# Access app container shell
docker-compose exec app sh

# Run npm commands
docker-compose exec app npm install <package-name>
docker-compose exec app npm run test
```

### Database Management

**Access MySQL CLI:**

```bash
docker-compose exec db mysql -u appuser -p boards
# Password: apppass
```

**Access phpMyAdmin:**

Navigate to http://localhost:8082 and login with:
- **Server**: db
- **Username**: appuser
- **Password**: apppass

### Reset Database

```bash
docker-compose down -v
docker-compose up --build
```

## Services Overview

| Service | Description | Port |
|---------|-------------|------|
| app | Node.js application (v25.1.0) | 3000 |
| db | MySQL database | 3006 |
| phpmyadmin | Database management interface | 8082 |

## Volumes

- `dbdata`: Persists MySQL database data
- `.:/app`: Syncs local code with container for hot-reloading
- `/app/node_modules`: Prevents local node_modules from overwriting container's

## Troubleshooting

### Database Connection Issues

If the app can't connect to the database, ensure:
1. The database health check is passing: `docker-compose ps`
2. Your `.env.docker` file has the correct credentials
3. Wait a few seconds after startup for MySQL to be fully ready

### Port Already in Use

If you see port conflicts:

```bash
# Check what's using the port
lsof -i :3000  # or :3006, :8082

# Use different ports by modifying docker-compose.yml
ports:
  - "3001:3000"  # Maps host port 3001 to container port 3000
```

### Changes Not Reflecting

1. Make sure volume mounting is working
2. Restart the container: `docker-compose restart app`
3. Rebuild if needed: `docker-compose up --build

### Clean Start

Remove all containers, volumes, and images:

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Development Workflow

1. Make code changes in your local editor
2. Changes are automatically synced to the container via volume mounting
3. The dev server (npm run dev) should hot-reload automatically
4. View logs with `docker-compose logs -f app`
5. Access database via phpMyAdmin or MySQL CLI as needed