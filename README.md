# UDA Smart Assistant – Trợ lý ảo Đại học Đông Á

<p align="center">
  <strong>Nghiên cứu và triển khai mô hình Cloud Computing trên AWS</strong>
</p>

<p align="center">
  Ứng dụng trợ lý ảo hỗ trợ tra cứu thông tin học vụ và tuyển sinh UDA
</p>

---

## 1. Giới thiệu dự án

**UDA Smart Assistant** là ứng dụng trợ lý ảo được xây dựng nhằm hỗ trợ người dùng tra cứu thông tin tuyển sinh, học phí, ngành đào tạo và các thông tin học vụ của Trường Đại học Đông Á.

Dự án ứng dụng công nghệ AI kết hợp với mô hình điện toán đám mây AWS nhằm cung cấp hệ thống có khả năng truy cập trực tuyến, xử lý câu hỏi và phản hồi thông tin thông qua giao diện website.

Đây là đồ án môn học **Điện toán đám mây (Cloud Computing)**, tập trung vào việc nghiên cứu, xây dựng và triển khai ứng dụng trên nền tảng Amazon Web Services (AWS).

## 2. Mục tiêu dự án

- Xây dựng website hỗ trợ tra cứu thông tin tuyển sinh và học vụ.
- Tích hợp trợ lý AI để tiếp nhận và trả lời câu hỏi bằng ngôn ngữ tự nhiên.
- Xây dựng backend xử lý yêu cầu và quản lý dữ liệu hỏi đáp.
- Triển khai ứng dụng trên AWS EC2.
- Sử dụng Nginx để phục vụ giao diện và chuyển tiếp yêu cầu API.
- Sử dụng PM2 để quản lý tiến trình backend.
- Kiểm tra khả năng vận hành và truy cập ứng dụng trên môi trường đám mây.

## 3. Chức năng chính

### 3.1. Trang chủ

- Giới thiệu UDA Smart Assistant.
- Thanh tìm kiếm thông tin.
- Các khu vực truy cập nhanh.
- Hiển thị trạng thái kết nối backend.

### 3.2. Hỗ trợ tuyển sinh

- Tra cứu thông tin tuyển sinh.
- Tìm hiểu phương thức xét tuyển.
- Tra cứu ngành đào tạo và tổ hợp xét tuyển.
- Tìm hiểu hồ sơ và quy trình đăng ký.
- Hỗ trợ giải đáp các câu hỏi thường gặp.

### 3.3. Hỗ trợ học vụ và sinh viên

- Tra cứu thông tin học phí.
- Tìm hiểu chương trình đào tạo.
- Hỗ trợ thông tin tín chỉ và học phần.
- Tra cứu các thông tin học vụ được cung cấp trong cơ sở dữ liệu dự án.

### 3.4. Trợ lý AI

- Tiếp nhận câu hỏi từ người dùng.
- Phân tích nội dung câu hỏi.
- Kết hợp dữ liệu FAQ và Gemini API để tạo phản hồi.
- Trả lời trực tiếp trên giao diện chat.
- Hỗ trợ các câu hỏi liên quan đến tuyển sinh và học vụ UDA.

## 4. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| AI | Google Gemini API |
| Dữ liệu hỏi đáp | JSON |
| Cloud Platform | Amazon Web Services |
| Cloud Server | Amazon EC2 |
| Web Server / Reverse Proxy | Nginx |
| Process Manager | PM2 |
| Version Control | Git, GitHub |

## 5. Kiến trúc hệ thống

Hệ thống được triển khai theo mô hình Client – Server trên nền tảng AWS.

```text
                 USER
                   |
                   v
             WEB BROWSER
                   |
                   v
             AWS EC2 INSTANCE
                   |
                   v
                NGINX
              /       \
             /         \
            v           v
       FRONTEND       BACKEND
       HTML/CSS/JS   Node.js/Express
                         |
                +--------+--------+
                |                 |
                v                 v
             FAQ JSON        GEMINI API
                |                 |
                +--------+--------+
                         |
                         v
                   AI RESPONSE
                         |
                         v
                    USER
```

### Mô tả kiến trúc

- **Amazon EC2:** Cung cấp máy chủ ảo để triển khai ứng dụng.
- **Nginx:** Phục vụ giao diện website và reverse proxy các yêu cầu API đến backend.
- **Node.js / Express:** Xử lý các yêu cầu từ frontend và quản lý logic chatbot.
- **FAQ JSON:** Lưu trữ dữ liệu câu hỏi và câu trả lời phục vụ tra cứu.
- **Gemini API:** Hỗ trợ xử lý và tạo phản hồi cho câu hỏi của người dùng.
- **PM2:** Quản lý tiến trình backend và hỗ trợ khôi phục ứng dụng sau khi máy chủ khởi động lại.

## 6. Cấu trúc thư mục

```text
tuyensinhaws/
│
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── categories.json
│   │   │   └── faq.json
│   │   │
│   │   ├── routes/
│   │   │   └── chat.js
│   │   │
│   │   └── server.js
│   │
│   ├── validate-data.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── frontend/
│   ├── assets/
│   │   └── udapng.png
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── database/
│
├── docs/
│
├── .gitignore
└── README.md
```

*Lưu ý: Cấu trúc trên mô tả các thành phần chính của dự án; thư mục `docs` và `database` có thể được bổ sung tài liệu trong quá trình hoàn thiện.*

## 7. Triển khai trên AWS

### 7.1. Môi trường triển khai

- Cloud Provider: Amazon Web Services (AWS).
- Compute Service: Amazon EC2.
- Operating System: Ubuntu Server 24.04 LTS.
- Instance Type: t3.micro.
- Web Server: Nginx.
- Backend Runtime: Node.js.
- Process Manager: PM2.

### 7.2. Quy trình triển khai

1. Tạo EC2 Instance trên AWS.
2. Kết nối máy chủ thông qua SSH.
3. Cài đặt Node.js, npm, Git và Nginx.
4. Clone source code từ GitHub.
5. Cấu hình biến môi trường cho backend.
6. Cài đặt các dependencies.
7. Khởi chạy backend bằng PM2.
8. Cấu hình Nginx phục vụ frontend và reverse proxy API.
9. Kiểm tra khả năng truy cập website và API.
10. Cấu hình PM2 để khôi phục tiến trình sau khi máy chủ khởi động lại.

### 7.3. Các endpoint chính

| Endpoint | Chức năng |
|---|---|
| `/` | Giao diện website |
| `/api/health` | Kiểm tra trạng thái backend |
| `/api/chat` | Tiếp nhận và xử lý câu hỏi chatbot |

## 8. Cài đặt và chạy dự án local

### Yêu cầu môi trường

- Node.js và npm.
- Git.
- Google Gemini API Key.

### Bước 1: Clone repository

```bash
git clone https://github.com/LilwuyenakaKinggMeow/tuyensinhaws.git

cd tuyensinhaws
```

### Bước 2: Cài đặt backend

```bash
cd backend
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo file `.env` trong thư mục `backend`:

```env
PORT=3000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=YOUR_CONFIGURED_GEMINI_MODEL
```

Thay các giá trị mẫu bằng thông tin cấu hình hợp lệ của bạn.

**Lưu ý:** Không chia sẻ API Key và không commit file `.env` lên GitHub.

### Bước 4: Khởi chạy backend

```bash
npm start
```

Hoặc chạy chế độ phát triển:

```bash
npm run dev
```

### Bước 5: Truy cập frontend

Mở file `frontend/index.html` bằng trình duyệt hoặc sử dụng một local web server để chạy giao diện.

Đảm bảo frontend được cấu hình gọi API đúng địa chỉ backend đang chạy.

## 9. Kiểm thử hệ thống

Các nội dung kiểm thử chính:

- Kiểm tra website có thể truy cập từ trình duyệt.
- Kiểm tra trạng thái backend thông qua `/api/health`.
- Gửi câu hỏi đến `/api/chat`.
- Kiểm tra khả năng trả lời các câu hỏi tuyển sinh và học vụ.
- Kiểm tra Nginx reverse proxy.
- Kiểm tra tiến trình backend thông qua PM2.
- Kiểm tra khả năng khôi phục dịch vụ sau khi EC2 khởi động lại.

## 10. Bảo mật

- Sử dụng Security Group để kiểm soát các cổng truy cập.
- Giới hạn SSH theo địa chỉ IP được phép.
- Không công khai cổng backend 3000 ra Internet.
- Sử dụng biến môi trường để lưu API Key.
- Không đưa thông tin xác thực hoặc file `.env` lên GitHub.
- Sử dụng Nginx làm điểm tiếp nhận các yêu cầu HTTP/HTTPS.

## 11. Hạn chế và hướng phát triển

### Hạn chế

- Dữ liệu tra cứu hiện tại chủ yếu được lưu trữ dưới dạng JSON.
- Nội dung phản hồi phụ thuộc vào dữ liệu cung cấp và dịch vụ AI bên ngoài.
- Hệ thống chưa triển khai chức năng quản lý tài khoản và hồ sơ tuyển sinh cá nhân.
- Khả năng chịu tải phụ thuộc vào cấu hình tài nguyên EC2.

### Hướng phát triển

- Mở rộng cơ sở dữ liệu tuyển sinh và học vụ.
- Bổ sung trang thông tin tuyển sinh riêng.
- Phát triển chức năng tư vấn chọn ngành theo sở thích và tổ hợp môn.
- Tích hợp hệ quản trị cơ sở dữ liệu khi cần quản lý dữ liệu người dùng.
- Bổ sung HTTPS và tên miền riêng.
- Nghiên cứu khả năng mở rộng hệ thống bằng các dịch vụ AWS khác.

## 12. Thành viên thực hiện

**Thành viên:**
- Nguyên đẹp trai số 1 thế giới
- Hoàng đẹp trai số 2 thế giới

**Môn học:** Điện toán đám mây (Cloud Computing)

**Đề tài:** Nghiên cứu và triển khai mô hình Cloud Computing trên AWS: Ứng dụng trợ lý ảo hỗ trợ tra cứu thông tin học vụ và tuyển sinh UDA.

---

<p align="center">
  <strong>UDA SMART ASSISTANT</strong><br>
  Hỗ trợ tra cứu thông tin học vụ và tuyển sinh Đại học Đông Á.
</p>
