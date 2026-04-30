# 🏥 Kigali Express Hospital — CH-IKA Management System

A full-stack hospital management system built for **CH-IKA Hospital**, designed to streamline hospital operations through a clean web interface backed by a RESTful API.

---

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## About

**Kigali Express Hospital** is a web-based hospital management system for CH-IKA hospital administrators. It provides tools to efficiently manage hospital workflows including patient records, appointments, and administrative tasks — all in one place.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | HTML, CSS, JavaScript             |
| Backend   | Node.js, Express.js               |
| Database  | *(configured in backend)*         |
| Version Control | Git / GitHub               |

---

## Project Structure

```
kigali-express-hospital/
├── backend/          # Express.js REST API & server logic
├── frontend/         # Client-side HTML, CSS, and JavaScript
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Felicien407/kigali-express-hospital.git
cd kigali-express-hospital
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies** *(if applicable)*

```bash
cd ../frontend
npm install
```

### Running the App

**Start the backend server:**

```bash
cd backend
npm start
```

**Open the frontend:**

Open `frontend/index.html` in your browser, or serve it with a local server:

```bash
# Using Node.js http-server (install globally if needed)
npx http-server frontend
```

The backend API will be running at `http://localhost:PORT` (see Environment Variables).

---

## Features

- 🏥 Hospital information and admin dashboard
- 👨‍⚕️ Doctor and staff management
- 📅 Appointment scheduling and tracking
- 🗂️ Patient records management
- 🔐 Authentication and access control
- 📊 Administrative reporting

---

## Environment Variables

Create a `.env` file in the `backend/` directory and configure the following:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ for CH-IKA Hospital, Kigali 🇷🇼
</p>