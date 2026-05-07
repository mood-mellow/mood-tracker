# Mood Tracker

A full-stack mood tracking application built with Next.js, Spring Boot, and PostgreSQL.

## 🏗️ Architecture

- **Frontend**: Next.js with TypeScript, Tailwind CSS, ShadCN
- **Backend**: Spring Boot
- **Database**: PostgreSQL
- **Authentication**: AWS Cognito
- **Containerization**: Docker & Docker Compose
- **Infra As Code**: Terraform

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Java 21+ (for local development)
- Gradle 8+ (or use included wrapper)

### Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd mood-tracker
    ```

2. **Environment Configuration**

    ```bash
    cp .env.example .env
    # Edit .env with your AWS Amplify configuration
    ```

3. **Start the application**
    ```bash
    docker compose up --build
    ```

## 🔗 Services

| Service     | URL                   | Description             |
| ----------- | --------------------- | ----------------------- |
| Frontend    | http://localhost:3000 | Next.js application     |
| Backend API | http://localhost:8080 | Spring Boot REST API    |
| Database    | http://localhost:5432 | PostgreSQL database     |
| pgAdmin     | http://localhost:5050 | Database administration |

### PgAdmin Access

- **Email**: admin@example.com
- **Password**: admin

## 📁 Project Structure

```
mood-tracker/
├── src/                   # Next.js frontend
├── Dockerfile             # Frontend container
├─┬ backend/               # Spring Boot backend
│ └── backend/Dockerfile   # Backend container
├── docker-compose.yaml    # Container orchestration
└── README.md
```

## 🛠️ Development

### 🐳 Docker Compose (Recommended)

The Docker Compose configs will set up everything needed for development. This includes:

- Next.js frontend
- Springboot backend
- PostgreSQL Database
- pgAdmin database administration

```bash
# Start all services
docker compose up

# Rebuild and start
docker compose up --build

# Stop services
docker compose down

# Remove volumes (reset database)
docker compose down -v
```

### Frontend Development

```bash
npm install
npm run dev
```

### Backend Development

```bash
cd backend

# Build the project
gradle build

# Run the project
gradle bootRun
```

### Database Commands

```bash
# Reset database
docker compose down -v # -v flag removes volumes and networks as well
docker compose up db

# View logs
docker compose logs -f backend
```

## 🔐 Authentication

This app uses AWS Cognito for authentication through the Amplify Auth npm library.

## 📊 Features

- User authentication with AWS Cognito
- Mood entry tracking
- RESTful API with Spring Boot
- Responsive UI with Tailwind CSS
- Database management with PostgreSQL

## 🎯 TO-DO

### Core Features

- [x] User authentication with AWS Cognito
- [x] Basic project structure with Next.js and Spring Boot
- [x] Database setup with PostgreSQL
- [x] Docker containerization
- [x] Mood entry tracking with timestamps
- [x] Activity tag system for categorizing moods
- [x] RESTful API endpoints for mood entries
- [x] User dashboard for viewing mood history

### Frontend Features

- [x] Responsive UI with Tailwind CSS
- [x] Mood entry form component
- [x] Mood history display
- [x] Activity tag selection interface
- [ ] Data visualization (charts/graphs)
- [x] User profile management

### DevOps & Deployment

- [x] Docker Compose for local development
- [x] AWS SAM Lambda Setup
- [x] Environment-specific configurations
- [x] Production Docker configuration

### Authentication & Security

- [x] AWS Cognito Front-end integration
- [x] User session management
- [x] Protected routes in frontend
- [x] JWT token validation in backend
- [x] Secure API endpoints

### Infra As Code

1. Login and provide a profile called AdminAccess

```
aws sso login --profile AdminAccess
```

2. Init, plan, and apply using Terraform or OpenTofu
   Switch to either the dev or prod directory based on what build you want to deploy

```bash
cd terraform/prod # or cd terraform/dev

terraform init
terraform plan
terraform apply
```
