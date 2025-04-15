
# 🚀 Node.js + Express + MongoDB REST API

Backend REST API development using **Node.js**, **Express**, and **MongoDB**.

---

## 📦 Tech Stack

- **Node.js**
- **Express**
- **MongoDB**
- **dotenv**
- **nodemon** (for development)

---

## 🛠️ Getting Started

### 📁 Project Setup

```bash
# Install dependencies
npm install
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
MONGO_URI=mongodb://<your-host-name>:27017/<your-db-name>
```

---

## 🚀 Run the Server

```bash
npm run dev
```

Make sure your `package.json` has the following script:

```json
"scripts": {
  "dev": "nodemon server"
}
```

Replace `server` with your actual entry point file if it's different.

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