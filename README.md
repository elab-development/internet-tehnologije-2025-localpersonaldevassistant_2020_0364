# Local Personal Dev Assistant

## Overview

**Dev Assistant** is a robust, full-stack web application designed to serve as a personal coding companion. It integrates multiple AI models (Local via Ollama, and Cloud via Groq and Google) into a unified chat interface.

The application allows developers to:

- **Generate code**
- **Analyze code**
- **Debug**
- **Save Code Snippets** for later use.
- **Visualize Monthly Usage** through a dedicated statistics dashboard.
- **Securely Login** or use the system as a Guest.

---

## Tech Stack

The project utilizes a modern, type-safe stack:

### Frontend

- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **Visualization:** Recharts (for usage statistics)
- **Routing:** React Router DOM
- **Styling:** CSS Modules / Custom Dark Theme
- **HTTP Client:** Axios

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL (v8.0)
- **ORM:** TypeORM
- **Authentication:** JWT (JSON Web Token) & Bcrypt

### DevOps & Tools

- **Containerization:** Docker & Docker Compose
- **Reverse Proxy:** Nginx
- **API Docs:** Swagger UI

---

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- MySQL Server
- Docker Desktop (Optional, for containerized run - preffered for testing of application)
