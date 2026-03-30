# Booking Movie

Ứng dụng đặt vé xem phim full-stack với giao diện cho khách hàng và khu vực quản trị riêng cho admin.

## Tính năng chính

- Đăng ký, đăng nhập và duy trì phiên người dùng
- Phân quyền `user` và `admin`
- Xem danh sách phim, lọc theo tên và thể loại
- Xem chi tiết phim và chọn suất chiếu
- Thêm vé vào giỏ hàng và xác nhận đặt vé
- Xem lịch sử booking của người dùng
- Admin quản lý phim, suất chiếu và trạng thái booking
- Hỗ trợ upload poster phim hoặc dùng URL ảnh

## Công nghệ sử dụng

### Frontend

- React
- Vite
- React Router DOM
- Axios

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Multer

## Cấu trúc thư mục

```text
booking-movie/
├── backend/
│   ├── Models/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── vite.config.js
└── README.md
```

## Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <your-repo-url>
cd booking-movie
```

### 2. Cài dependencies

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

### 3. Tạo biến môi trường cho backend

Tạo file `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/BOOKING_MOVIE
TOKEN_SECRET=your-secret-key
```

## Chạy ứng dụng

Mở 2 terminal riêng:

### Backend

```bash
cd backend
npm run dev
```

Backend chạy mặc định tại `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm run dev
```

Frontend chạy mặc định tại `http://localhost:5173`.

## API chính

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Movies

- `GET /api/movies`
- `GET /api/movies/:id`
- `POST /api/movies` `admin`
- `PUT /api/movies/:id` `admin`
- `DELETE /api/movies/:id` `admin`

### Showtimes

- `GET /api/showtimes`
- `POST /api/showtimes` `admin`
- `PUT /api/showtimes/:id` `admin`
- `DELETE /api/showtimes/:id` `admin`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings/mine`
- `GET /api/bookings` `admin`
- `PATCH /api/bookings/:id/status` `admin`

## Luồng sử dụng

### Người dùng

1. Đăng ký hoặc đăng nhập
2. Xem danh sách phim
3. Chọn phim và suất chiếu
4. Thêm vé vào giỏ hàng
5. Xác nhận booking
6. Xem lịch sử booking trong mục cá nhân

### Admin

1. Đăng nhập bằng tài khoản có quyền `admin`
2. Quản lý danh sách phim
3. Quản lý suất chiếu
4. Duyệt, hủy hoặc khôi phục booking

## Dữ liệu và xác thực

- Người dùng được lưu trong MongoDB
- Token đăng nhập được backend ký bằng `crypto`
- Frontend lưu token trong `localStorage`
- Route bảo vệ phía frontend qua `ProtectedRoute`
- Route bảo vệ phía backend qua middleware `requireAuth` và `requireAdmin`

## Lưu ý hiện trạng dự án

- File `backend/seed.js` đang được comment toàn bộ, nên chưa chạy seed trực tiếp được nếu không mở comment trước
- Một số chuỗi tiếng Việt trong dự án hiện đang bị lỗi encoding và nên được dọn lại
- API frontend hiện đang gọi cố định tới `http://localhost:5000/api`

## Hướng phát triển tiếp

- Thêm `.env` cho frontend để cấu hình API base URL
- Thêm validation dữ liệu đầu vào tốt hơn
- Thêm test cho API và UI
- Chuẩn hóa encoding UTF-8 cho toàn bộ source
- Tách service và constants để dễ bảo trì hơn

## License

Dự án hiện chưa khai báo license.
