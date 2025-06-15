
# KV-Audio Backend

A Node.js backend project handling user authentication with email verification using OTP (One-Time Password).

---

## 🚀 Project Overview

This project provides a secure backend API for the KV-Audio platform, featuring:

* User registration and login
* Email verification via OTP
* OTP generation and validation
* RESTful API routes
* Built with JavaScript and Express.js

---

## 📂 Project Structure
```
KV-Audio/
├── controllers/        # Request handlers and business logic
├── models/             # Database schemas and OTP model
├── routes/             # API route definitions
├── .env                # Environment variables
├── index.js            # Entry point / server setup
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```
---

## ⚙️ Setup & Installation

### 1. Clone the repo

`git clone https://github.com/Tashika-Wijesooriya/KV-Audio.git`
`cd KV-Audio`

### 2. Install dependencies

`npm install`

### 3. Create a `.env` file

Add your environment variables (e.g., database URI, email service credentials, JWT secrets):

```
PORT=your_port_number
DATABASE_URL=your_database_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
JWT_SECRET=your_jwt_secret_key
```

### 4. Start the server

`npm start`

The server should now be running on `http://localhost:<PORT>`.

---

## 📦 API Endpoints

| Method | Endpoint      | Description                |
| ------ | ------------- | -------------------------- |
| POST   | /register     | Register a new user        |
| POST   | /login        | User login                 |
| POST   | /verify-email | Verify user email with OTP |
| POST   | /resend-otp   | Resend OTP to user email   |


---

## 🤝 Contributing

Feel free to fork, improve, and send pull requests!

1. Fork it 🍴
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---



## ✨ Author

**Tashika Wijesooriya**
Full Stack Developer<br>
GitHub: [@Tashika-Wijesooriya](https://github.com/Tashika-Wijesooriya)<br>
Email: [tashikawijesooriya@gmail.com](mailto:tashikawijesooriya@gmail.com)

---

> Made with 💖 and Node.js

