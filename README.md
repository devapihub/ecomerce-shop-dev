# 🛍️ Ecomerce Backend Node.js

Backend API cho hệ thống thương mại điện tử, được viết bằng **Node.js (v20.x)** và **Express.js**, sử dụng **MongoDB** để lưu trữ dữ liệu.

---

## 🚀 Yêu cầu hệ thống

- **Node.js:** phiên bản 20.x
- **npm:** đi kèm Node.js
- **MongoDB:** ≥ 6.0 (local hoặc remote)
- **Docker:** (tùy chọn, nếu muốn chạy bằng container)

---

## 📦 Cài đặt & chạy local

### 1️⃣ Clone dự án

```bash
git clone https://github.com/yourusername/ecomerce-backend-nodejs.git
cd ecomerce-backend-nodejs
```

### 2️⃣ Cài đặt dependencies

```bash
npm install
```

### 3️⃣ Tạo file môi trường `.env`

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
```

### 4️⃣ Chạy server

#### Dev mode (auto reload khi code thay đổi)
```bash
npm run dev
```

#### Production mode
```bash
npm run prod
```

Server sẽ khởi động tại:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧱 Cấu trúc dự án

```bash
ecomerce-backend-nodejs/
├── server.js              # Entry point
├── package.json
├── .env.example
├── routes/                # Định nghĩa route Express
├── models/                # Schema Mongoose
├── controllers/           # Logic xử lý request
├── middleware/            # Auth, logging, validation...
└── utils/                 # Helper functions
```

---

## 🐳 Build & Deploy với Docker

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "prod"]
```

---

### Build image cho Ubuntu server (linux/amd64)

Vì máy Mac M1 (ARM) khác kiến trúc với Ubuntu (AMD64), bạn cần build cross-platform:

```bash
docker buildx create --use
docker buildx inspect --bootstrap

docker buildx build   --platform linux/amd64   -t trivip002/ecomerce-shop-dev:latest   --push .
```

> 📝 Image này tương thích với Ubuntu 20.04 (x86_64).

---

### Run container trên server Ubuntu

```bash
docker pull trivip002/ecomerce-shop-dev:latest

docker run -d   -p 3000:3000   --name ecomerce-backend   --env-file .env   trivip002/ecomerce-shop-dev:latest
```

---

## 🧰 Scripts có sẵn

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Chạy server ở chế độ development (watch mode) |
| `npm run prod` | Chạy server ở chế độ production |
| `npm test` | Placeholder cho unit test (chưa triển khai) |

---

## ⚙️ Dependencies chính

| Package | Mục đích |
|----------|----------|
| express | Web framework chính |
| mongoose | ORM cho MongoDB |
| bcrypt | Hash password |
| jsonwebtoken | Tạo và xác thực JWT |
| dotenv | Quản lý biến môi trường |
| helmet | Bảo mật HTTP headers |
| compression | Gzip response |
| morgan | Ghi log request |
| lodash | Tiện ích xử lý dữ liệu |

---

## 🧑‍💻 Tác giả

**Hugh Huynh**  
📧 [your.email@example.com]  
🐙 [GitHub: trivip002](https://github.com/trivip002)

---

## 📜 Giấy phép

MIT License © 2025
