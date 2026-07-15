# Shopora

Shopora is a fully containerized, production-ready enterprise Next.js application built with MySQL, phpMyAdmin, Redis, and Drizzle ORM.

## Architecture & Infrastructure Services

- **Next.js**: The core frontend/backend framework running on Node 20.
- **MySQL 8.0**: Persistent relational database configured with UTF8MB4.
- **phpMyAdmin**: Web interface for database administration.
- **Redis**: In-memory data structure store prepared for future caching and queues.
- **Drizzle ORM Migration Runner**: Ephemeral container to auto-run migrations and seeds.

---

## Getting Started

### Prerequisites

You only need:
- [Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

No local installations of Node.js, PHP, or MySQL are required.

### One-Command Startup

1. Clone the repository:
   ```bash
   git clone https://github.com/Sohidul-Islam/shopora.git
   cd shopora
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Spin up the development stack:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

To run in production mode on a VPS:
```bash
docker compose up -d --build
```

---

## Environment Configuration

Configure environment variables in `.env`:

```env
NODE_ENV=development
APP_URL=http://localhost:3000

# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=shopora
MYSQL_USER=shopora
MYSQL_PASSWORD=shopora_password
MYSQL_PORT=3306
```
