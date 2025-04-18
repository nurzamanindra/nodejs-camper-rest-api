# 📮 REST API Documentation

This document provides a reference for the REST API endpoints available in this project.

## 📁 Postman Collection

You can use the provided Postman collection to test all endpoints:

- 📦 **Collection**: [`_docs/local-dev.devcamper-api.postman_collection.json`](./_docs/local-dev.devcamper-api.postman_collection.json)
- ⚙️ **Environment**: [`_docs/local-dev.devcamper-api.postman_environment.json`](./_docs/local-dev.devcamper-api.postman_environment.json)

> 💡 Open Postman → Import → Choose File → Select the JSON file

---

## 📌 Base URL
http://localhost:5000

Adjust the port and URL as needed depending on your development environment.

---

## 📘 Endpoints Overview
| Method | Endpoint                          | Description              | Auth Required  |
|--------|-----------------------------------|--------------------------|----------------|
| GET    | `/api/v1/bootcamps`               | Get all bootcamps        | ✅             |
| GET    | `/api/v1/bootcamps/:id`           | Get single bootcamp by ID| ✅             |
| POST   | `/api/v1/bootcamps`               | Create new bootcamp      | ✅             |
| PUT    | `/api/v1/bootcamps/:id`           | Update bootcamp          | ✅             |
| DELETE | `/api/v1/bootcamps/:id`           | Delete bootcamp          | ✅             |

---

## 🔐 Authorization

Some endpoints require a valid **JWT token** in the `Authorization` header (in development)

