# SmartFood — Nền tảng Thương mại điện tử Thực phẩm Tích hợp AI

<p align="center">
	<img src="app/assets/images/logo.png" alt="SmartFood Logo" width="120" />
</p>

<p align="center">
	<b>Hệ thống bán lẻ thực phẩm trực tuyến hoàn chỉnh với AI Chatbot & Gợi ý sản phẩm</b><br/>
	Dự án Tốt nghiệp (DATN) - Tối ưu trải nghiệm mua sắm, tích hợp thanh toán và vận chuyển tự động.
</p>

<p align="center">
	<img src="https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white" alt="Nuxt" />
	<img src="https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
	<img src="https://img.shields.io/badge/Python-FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
	<img src="https://img.shields.io/badge/MongoDB-Vector_Search-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
	<img src="https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai&logoColor=white" alt="OpenAI" />
</p>

---

## 📑 Mục lục

- [🎯 Giới thiệu dự án](#-giới-thiệu-dự-án)
- [✨ Tính năng cốt lõi & AI](#-tính-năng-cốt-lõi--ai)
- [🧱 Kiến trúc hệ thống & Công nghệ](#-kiến-trúc-hệ-thống--công-nghệ)
- [⚙️ Hướng dẫn cài đặt](#️-hướng-dẫn-cài-đặt)
- [🗂️ Liên kết các Repository](#️-liên-kết-các-repository)
- [🖼️ Hình ảnh và video minh họa](#️-hình-ảnh-và-video-minh-họa)

---

## 🎯 Giới thiệu dự án

SmartFood là hệ thống thương mại điện tử chuyên cung cấp thực phẩm sạch. Dự án được xây dựng theo kiến trúc Microservices cơ bản, tách biệt giữa Frontend (Client/Admin), Backend RESTful API và Recommendation Service. Điểm nhấn của dự án là việc ứng dụng Trí tuệ nhân tạo (AI) để nâng cao trải nghiệm khách hàng.

---

## ✨ Tính năng cốt lõi & AI

### 🤖 Tích hợp AI & Dữ liệu
- **AI Agent Chatbot:** Sử dụng OpenAI `gpt-4o-mini` kết hợp với kĩ thuật **Function Calling** và pipeline **RAG** (Retrieval-Augmented Generation) thông qua MongoDB Atlas Vector Search và Redis cache. Chatbot có khả năng tư vấn sản phẩm, tra cứu đơn hàng và trả về kết quả theo luồng thời gian thực (SSE - Server-Sent Events).
- **Hệ thống gợi ý (Recommendation Engine):** Dịch vụ độc lập viết bằng Python/FastAPI, sử dụng thuật toán **TF-IDF** và **Cosine Similarity** để gợi ý các sản phẩm liên quan dựa trên nội dung.
- **AI Content & Moderation (Admin):** Tích hợp AI để hỗ trợ quản trị viên tự động viết nội dung bài đăng/mô tả sản phẩm và tự động kiểm duyệt đánh giá của khách hàng.

### 🛍️ Tính năng Thương mại điện tử
- **Real-Time Order Tracking:** Theo dõi trạng thái đơn hàng theo thời gian thực (sử dụng Socket.IO), tự động cập nhật tiến trình giao hàng ngay lập tức mà không cần tải lại trang.
- **Thanh toán & Vận chuyển:** Tích hợp cổng thanh toán **PayOS** (chuyển khoản VietQR tự động) và API vận chuyển **Giao Hàng Nhanh (GHN)**.
- **Xác thực & Phân quyền:** Hỗ trợ đăng nhập xã hội (OAuth 2.0 với Google, Facebook), xác thực bảo mật qua JWT và phân quyền người dùng (RBAC).
- **Mua sắm thông minh:** Tìm kiếm, lọc sản phẩm, quản lý giỏ hàng, áp dụng mã giảm giá (Voucher).

### 📊 Quản trị hệ thống (Admin Dashboard)
- Quản lý toàn diện dữ liệu (CRUD) cho Sản phẩm, Đơn hàng, Danh mục, Người dùng, Voucher.
- Thống kê và phân tích doanh thu trực quan bằng **Chart.js**.
- Xuất báo cáo dữ liệu ra file Excel.

---

## 🧱 Kiến trúc hệ thống & Công nghệ

Dự án được cấu thành từ 3 module chính:

1. **Frontend (Website Khách hàng & Admin):**
   - Framework: Nuxt 3 / Vue 3
   - Styling & UI: Tailwind CSS v4, PrimeVue
   - State Management: Pinia, TanStack Vue Query

2. **Backend (RESTful API):**
   - Framework: Node.js, Express 5
   - Database: MongoDB (Mongoose), Redis (Caching)
   - Real-time & Auth: Socket.IO, JWT, Passport.js
   - Storage: Cloudinary

3. **Recommendation Service:**
   - Framework: Python, FastAPI
   - Machine Learning: Scikit-learn (TF-IDF, Cosine Similarity)

---

## 🗂️ Liên kết các Repository

Hệ thống được chia làm 3 repository riêng biệt. *(Bạn đang ở repository Frontend)*:

- **Frontend (Web):** [https://github.com/Van-long123/fresh-food-web](https://github.com/Van-long123/fresh-food-web)
- **Backend (API):** [https://github.com/Van-long123/food-ecommerce-api](https://github.com/Van-long123/food-ecommerce-api)
- **Recommendation Service:** [https://github.com/Van-long123/food-recommendation-service](https://github.com/Van-long123/food-recommendation-service)

---

## ⚙️ Hướng dẫn cài đặt (Frontend)

### 1) Yêu cầu môi trường
- Node.js 20+
- npm 10+

### 2) Cài đặt project
```bash
git clone https://github.com/Van-long123/fresh-food-web.git
cd fresh-food-web
npm install
```

### 3) Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc:
```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8017
# Thêm các key khác theo cấu hình của bạn
```

### 4) Khởi chạy dự án
```bash
npm run dev
```
Truy cập tại: `http://localhost:3000`

---

## 🖼️ Hình ảnh và video minh họa

<img width="1897" height="866" alt="image" src="https://github.com/user-attachments/assets/9ae632e4-937c-47fd-a9a5-426598f0099f" />

