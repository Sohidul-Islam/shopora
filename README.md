# Shopora — Enterprise Full-Stack E-commerce System

Shopora is a modern, premium, production-ready full-stack e-commerce platform designed using a clean, scalable, enterprise-grade architecture. It encapsulates customer-facing storefront screens, a minimal inventory-focused admin panel, fully normalized MySQL schemas, and containerized Docker environments.

---

## 🚀 Local Development Setup

You can run Shopora locally either using **Docker (Recommended)** or **Manually (Without Docker)**.

### Method A: Running with Docker (Recommended)

#### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [Docker Compose](https://docs.docker.com/compose/install/)

#### Step-by-Step Run
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sohidul-Islam/shopora.git
   cd shopora
   ```
2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   *The default values in `.env.example` are pre-configured to link database containers out-of-the-box.*
3. **Spin up the stack:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```
   *This single command builds and starts:*
   - **Next.js Web App** (running on `http://localhost:3000`)
   - **MySQL 8.0 Database** (running on port `3306`)
   - **phpMyAdmin DB Portal** (accessible on `http://localhost:8080`)
   - **Redis caching container** (running on port `6379`)
   - **Auto-Migration Runner** (creates database tables automatically)
   - **Auto-Seeder** (populates products, warehouses, and test accounts automatically)

---

### Method B: Running Manually (Without Docker)

#### Prerequisites
- Install [Node.js v20+](https://nodejs.org/)
- Install [MySQL 8.0](https://dev.mysql.com/downloads/installer/) and create a database named `shopora`.

#### Step-by-Step Run
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mysql://your_db_user:your_db_password@127.0.0.1:3306/shopora
   PORT=3000
   ```
3. **Generate and push Drizzle migrations:**
   ```bash
   npx drizzle-kit generate
   npm run db:migrate
   ```
4. **Seed the database:**
   ```bash
   npm run db:seed
   ```
5. **Start the local Next.js development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to view the storefront.

---

## 🌐 Production VPS Server Deployment Guide

To deploy Shopora to a production Virtual Private Server (VPS) running Linux (Ubuntu 22.04 LTS / 24.04 LTS):

### Step 1: Install Docker and Nginx on the VPS
Connect to your VPS via SSH and install required utilities:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx
sudo systemctl enable --now docker
sudo systemctl enable --now nginx
```

### Step 2: Configure Environment Variables
1. Clone your repository to `/var/www/shopora` or your preferred location.
2. Edit the `.env` file for production settings:
   ```env
   NODE_ENV=production
   APP_URL=https://yourdomain.com
   DATABASE_URL=mysql://shopora_prod:secure_db_pass@mysql:3306/shopora
   
   # MySQL Container Credentials
   MYSQL_ROOT_PASSWORD=highly_secure_root_pass
   MYSQL_DATABASE=shopora
   MYSQL_USER=shopora_prod
   MYSQL_PASSWORD=secure_db_pass
   ```

### Step 3: Run the Production Docker Compose Stack
Launch the containers in detached (background) mode:
```bash
docker compose -f docker-compose.yml up -d --build
```
This boots up the production container stack. The web app is now listening on port `3000` inside the Docker network.

### Step 4: Configure Nginx as a Reverse Proxy
Create an Nginx configuration file for your domain:
```bash
sudo nano /etc/nginx/sites-available/shopora
```

Paste the following server block (replacing `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site configuration and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/shopora /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Secure with SSL (Let's Encrypt)
Run Certbot to generate and configure a free SSL certificate automatically:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
*Select option `2` to automatically redirect all HTTP traffic to HTTPS.*

---

## 🛠️ Handy Docker Commands

- **Stop all services:**
  ```bash
  docker compose down
  ```
- **View runtime logs:**
  ```bash
  docker compose logs -f
  ```
- **Inspect DB via phpMyAdmin:**
  Open `http://localhost:8080` (Local) or map it securely behind a VPN for production administration.
