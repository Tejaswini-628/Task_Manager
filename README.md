# 🚀 Full Stack Task Management System

A professional full-stack task management web application that allows users to securely manage tasks, track progress, and gain insights through a clean and responsive dashboard.

This project demonstrates full-stack development including authentication, REST API design, analytics, filtering, and performance optimizations.

---

# 🧠 Project Overview

A full-stack productivity web application where users can:

- Securely login using JWT authentication  
- Create, update, and delete tasks  
- Mark tasks as completed  
- Filter and search tasks  
- Sort tasks by priority and due date  
- View analytics of their task progress  
- Navigate tasks with pagination  
- Manage tasks through a clean dashboard UI  

---

# 🏗 System Architecture
React Frontend
↓ API Calls
Node.js + Express Backend
↓
MongoDB Atlas (Cloud Database)

---


---

# 💻 Tech Stack

### Frontend
- React.js  
- Axios  
- TailWind

### Backend
- Node.js  
- Express.js  
- JWT Authentication  
- REST APIs  

### Database
- MongoDB Atlas  

---

# 🔐 Features

## Authentication
✔ User Signup & Login  
✔ JWT-based authentication  
✔ Protected routes  

## Task Management
✔ Create tasks  
✔ Update tasks (inline editing)  
✔ Delete tasks  
✔ Mark tasks as completed  

### Task Fields
- Title  
- Description  
- Status (Todo / In Progress / Done)  
- Priority (Low / Medium / High)  
- Due Date  

## Filtering & Search
✔ Filter by status  
✔ Filter by priority  
✔ Search by title  

## Analytics
✔ Total tasks  
✔ Completed tasks  
✔ Pending tasks  
✔ Completion percentage  

## Enhancements
✔ Pagination (Prev / Next)  
✔ Sorting (Due Date / Priority)  
✔ Loading & error handling  
✔ Clean UI with badges and icons  

---

# 🔗 API Endpoints

## Authentication APIs
- **POST** `/api/auth/signup` → Register user  
- **POST** `/api/auth/login` → Login & get token  

## Task APIs (Protected)
- **GET** `/api/tasks` → Get tasks (filters, search, pagination, sorting)  
- **POST** `/api/tasks` → Create task  
- **PUT** `/api/tasks/:id` → Update task  
- **DELETE** `/api/tasks/:id` → Delete task  

## Analytics
- **GET** `/api/tasks/analytics` → Get task insights  

Authentication: JWT token required in headers  

---

# 🗄 Database Schema

## User Collection
- email : String (unique)  
- password : String (hashed)  

## Task Collection
- user : ObjectId (reference to user)  
- title : String  
- description : String  
- status : String (Todo / In Progress / Done)  
- priority : String (Low / Medium / High)  
- dueDate : Date  
- createdAt : Date  

---

# ⚙️ Installation & Setup

## 1️⃣ Clone repository
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

## 2️⃣ Backend setup
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```
Create .env file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:
```bash
npm run dev
```
## 3️⃣ Frontend setup
```bash
cd frontend
npm install
npm start
```

### Folder Structure
```
SIHive/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── pages/
│   └── App.js
```

