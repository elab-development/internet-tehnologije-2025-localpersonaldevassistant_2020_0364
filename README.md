# Local Personal Dev Assistant

## Overview

**Dev Assistant** is a robust, full-stack web application designed to serve as a personal coding companion. It integrates multiple AI models (Locally via `Ollama`, and on Cloud via `Groq` and `Google`) into a unified chat interface.

The application allows developers to:

- **Generate code**
- **Analyze code**
- **Debug code**
- **Save Code Snippets** for later use.
- **Visualize Monthly Usage** through a dedicated statistics dashboard.
- **Securely Login** or use the system as a Guest.

---

## Tech Stack

The project utilizes a modern, type-safe stack:

### Frontend

- **Framework:** `React 19 (Vite)`
- **Language:** `TypeScript`
- **Visualization:** `recharts` (for usage statistics)
- **Routing:** `React Router DOM`
- **Styling:** `CSS Modules`
- **HTTP Client:** `axios`

---

### Backend

- **Runtime:** `Node.js`
- **Framework:** `express.js`
- **Language:** `TypeScript`
- **Database:** `MySQL` (v8.0)
- **ORM:** `TypeORM`
- **Authentication:** `JWT (JSON Web Token)` & `bcrypt`

---

### DevOps & Tools

- **Containerization:** `Docker` & `Docker Compose`
- **Reverse Proxy:** `Nginx`
- **API Docs:** `Swagger UI`

---

## Getting Started

### Prerequisites

- `Node.js` (v20 or higher)
- `MySQL Server`
- `Docker Desktop` (optional, for containerized run - preffered for testing application)
- `XAMPP` (optional, for local running of application)

---

### Starting application locally containerized (docker-compose) 

1. Clone git project to your local machine using:  
```
git clone https://github.com/elab-development/internet-tehnologije-2025-localpersonaldevassistant_2020_0364.git
```
2. Navigate to root folder of project
3. Copy `.env.example` file and rename it to `.env`
4. Fill variables with proper values (`API keys, LLM Models, DB Credentials, Ports, etc...`)
5. Make sure `Docker Desktop` is running
6. Run command:  
```
docker-compose up -d --build
``` 
7. Wait until app is built and started
8. Navigate to `localhost:8080`
9. Enjoy!

---

### Starting application locally (XAMPP) 

1. Clone git project to your local machine using 
```
git clone https://github.com/elab-development/internet-tehnologije-2025-localpersonaldevassistant_2020_0364.git
```
2. Navigate to root folder of project
3. Copy `.env.example` file and rename it to `.env`
4. Fill variables with proper values (API keys, LLM Models, DB Credentials, Ports, etc...)
5. Start Ollama container via Docker Desktop application 
6. Make sure `XAMPP` is running and `MySQL` is running on `PORT 3306` 
7. Navigate to server directory with command 
```
cd server
``` 
8. Run command which will install neccessary dependencies: 
```
npm install
``` 
9. Run command which will run migrations and then start server 
```
npm start
```
10. Navigate to client directory with commands:
```
cd ..
``` 
and 
```
cd client
```  
11. Run command which will install dependencies, run linter, build application and then expose it at `localhost:8080`: 
```
npm start
``` 
12. Wait until command is finished
13. Navigate to `localhost:8080`
14. Enjoy!

---

## Branches

In this project three types of branches are being used:

- `master` - This branch contains production code, that is also hosted on Cloud (`Railway`). When code is added/merged to this branch it starts GitHub workflow which runs tests, builds respective Docker Images and ultimately triggers `Railway`'s redeploy command which takes most recent images from Docker Hub and redeploy them.
- `develop` - Pre-production branch which is meant to be used for final testing of features in local before merging to production (`master`) branch
- `feature/feature_name` - Each feature starts lifecycle at it's feature branch. It gets implemented, tested locally on respective branch and after it's creator thinks it ready to merge, he opens `pull request` which is available for other contributors to review. 

> [!NOTE]
> After each code `push` or `pull request` on GitHub, action (workflow) starts. Depending of which folder has changes; either `backend` or `frontend` or `both` workflow(s) starts. 
> 
> User will not be able to merge code until all steps in workflow pass!
