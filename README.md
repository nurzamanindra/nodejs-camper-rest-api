
# 🚀 Node.js + Express REST API Boilerplate

A lightweight and simple boilerplate to kickstart your backend REST API development using **Node.js** and **Express**.

---

## 📦 Tech Stack

- **Node.js**
- **Express**
- **dotenv**
- **nodemon** (for development)

---

## 🛠️ Getting Started

### 📁 Project Setup

```bash
# Initialize project
npm init

# Install dependencies
npm install express dotenv

# Install dev dependencies
npm install -D nodemon
```

### 📄 Configuration

Create a file at:

```
./config/config.env
```

With the following content:

```env
PORT=5000
NODE_ENV=development
```

---

## 🚀 Run the Server

```bash
npm run dev
```

Make sure your `package.json` has the following script:

```json
"scripts": {
  "dev": "nodemon server.js"
}
```

Replace `server.js` with your actual entry point file if it's different.

---

## 📁 Folder Structure Suggestion

```
project-root/
│
├── config/
│   └── config.env
│
├── routes/
├── controllers/
├── models/
│
├── server.js
└── README.md
```

---

## 📌 Notes

- You can extend this boilerplate with middleware, error handling, authentication, etc.

---
