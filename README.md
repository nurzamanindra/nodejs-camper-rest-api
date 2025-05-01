
# 🚀 Node.js + Express + MongoDB REST API

Backend REST API development using **Node.js**, **Express**, and **MongoDB**.

> This project is currently under active development. Features are being built and improved continuously. Stay tuned!
>
> This API uses an external maps API to convert addresses into geocode points and vice versa. I use the Google Maps API, but you can use any maps provider API you prefer (see the Configuration section).
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

GEOCODER_PROVIDER=
GEOCODER_API_KEY=

MAX_FILE_UPLOAD=1000000
FILE_UPLOAD_PATH=./public/uploads

JWT_SECRET=ldsfjldskfjdslfjlsdfkjdsl
JWT_EXPIRE=20d
JWT_COOKIE_EXPIRE=20


SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=
FROM_EMAIL=noreplay@gmail.com
FROM_NAME=noreplay
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

## 📮 API Documentation

This project provides a Postman collection to easily test all REST API endpoints.

- 📂 Postman Collection: [`_docs/local-dev.devcamper-api.postman_collection.json`](./_docs/local-dev.devcamper-api.postman_collection.json)
- ⚙️ Postman Environment: [`_docs/local-dev.devcamper-api.postman_environment.json`](./_docs/local-dev.devcamper-api.postman_environment.json)
- 📘 Full API Reference: [`API.md`](./API.md)

To use it:
1. Open Postman.
2. Click **Import** → Select the `.json` file.
3. Set the base URL and environment (if needed).
