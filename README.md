<img width="1896" height="863" alt="image" src="https://github.com/user-attachments/assets/0d9e1cb9-f3af-46da-be97-111c8dc3533b" /><img width="433" height="622" alt="image" src="https://github.com/user-attachments/assets/e853e0a4-9055-44fd-9575-8098d448f2e7" /># SmartFood — Nền tảng Thương mại điện tử Thực phẩm Tích hợp AI

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
<img width="900" height="405" alt="image" src="https://github.com/user-attachments/assets/5c894182-0be7-4a7d-8eb2-563291e2bf70" />
<img width="900" height="385" alt="image" src="https://github.com/user-attachments/assets/ef2bd2bd-23fb-4736-8abd-6e294e872847" />
<img width="945" height="414" alt="image" src="https://github.com/user-attachments/assets/b0019aa3-e339-4523-bc35-dcd40848c0a8" />
<img width="1900" height="862" alt="image" src="https://github.com/user-attachments/assets/d2ab87e2-55b3-4983-b02a-22c9760dc606" />
<img width="945" height="405" alt="image" src="https://github.com/user-attachments/assets/434a1c7b-6387-4e74-aebf-aaa593106ca6" />
<img width="1897" height="866" alt="image" src="https://github.com/user-attachments/assets/9ae632e4-937c-47fd-a9a5-426598f0099f" />
<img width="1893" height="865" alt="image" src="https://github.com/user-attachments/assets/14071ea6-9190-41d9-a5dc-23bb1b1e9130" />
<img width="1882" height="867" alt="image" src="https://github.com/user-attachments/assets/e5e636eb-0fd7-4c2a-b23a-f65840e3f68f" />
<img width="435" height="620" alt="image" src="https://github.com/user-attachments/assets/fdf89b93-f662-4e0d-ac92-b4f3e76d67f4" />
<img width="433" height="622" alt="image" src="https://github.com/user-attachments/assets/7754bdce-3e77-42f8-9a72-aaa07b9e3a70" />
<img width="1896" height="870" alt="image" src="https://github.com/user-attachments/assets/9bf8c956-fdc4-4d90-9c33-2fff3c0240a2" />
<img width="1893" height="867" alt="image" src="https://github.com/user-attachments/assets/32e13254-fe0f-42fb-bde4-9ef7424c0ad5" />
<img width="1896" height="861" alt="image" src="https://github.com/user-attachments/assets/fd6f7f69-136d-4b7e-8795-f32e99841a31" />
<img width="1901" height="867" alt="image" src="https://github.com/user-attachments/assets/c3b56f2d-967c-411e-9f50-1f0992aaf3c3" />
<img width="1900" height="866" alt="image" src="https://github.com/user-attachments/assets/cb30b6b6-ec22-4cc7-9336-f4323e544d07" />
<img width="945" height="432" alt="image" src="https://github.com/user-attachments/assets/2f2bb393-518a-4c54-a5e2-86ded23ea422" />
<img width="945" height="414" alt="image" src="https://github.com/user-attachments/assets/005e4767-35ba-4a1b-b4d7-50f12133c4ae" />
<img width="945" height="413" alt="image" src="https://github.com/user-attachments/assets/c26fcde0-e24a-44c9-b8e5-d54902323739" />
<img width="1901" height="852" alt="image" src="https://github.com/user-attachments/assets/a6cdb528-8529-4719-a9e1-21901283e760" />
<img width="1892" height="865" alt="image" src="https://github.com/user-attachments/assets/d6ed8c52-e9ba-454d-8460-f138d9fd3b29" />
<img width="1896" height="861" alt="image" src="https://github.com/user-attachments/assets/a86613f0-cbd7-4813-8e23-6eef54f41f51" />
<img width="1895" height="862" alt="image" src="https://github.com/user-attachments/assets/8244dc21-5931-401b-a603-c893272e0ed6" />
<img width="1891" height="863" alt="image" src="https://github.com/user-attachments/assets/f860b456-83f6-460e-a6f9-46f0d63d1604" />
<img width="1896" height="863" alt="image" src="https://github.com/user-attachments/assets/72be1832-d668-46ad-92f7-e503a40338c1" />
<img width="1898" height="865" alt="image" src="https://github.com/user-attachments/assets/0ca3e145-eeed-4a04-a272-994f7c96c945" />
<img width="1893" height="712" alt="image" src="https://github.com/user-attachments/assets/bb7be19b-16a0-4f19-90fc-486e7766ce33" />
<img width="1902" height="785" alt="image" src="https://github.com/user-attachments/assets/36184046-4c34-4886-b677-4749115f304a" />
<img width="1892" height="868" alt="image" src="https://github.com/user-attachments/assets/2242d2d8-4fcc-491f-8250-23cfc1c29f1d" />
<img width="1896" height="743" alt="image" src="https://github.com/user-attachments/assets/cdd17692-2314-45d3-9169-54409f77d83c" />
<img width="945" height="433" alt="image" src="https://github.com/user-attachments/assets/bcd4b1bb-e0e4-4976-98da-a3d36ae053ae" />
<img width="945" height="429" alt="image" src="https://github.com/user-attachments/assets/e74642a8-9156-4f4f-95f0-e20776649344" />
<img width="945" height="418" alt="image" src="https://github.com/user-attachments/assets/a530cb4b-9edf-439a-955a-03540047bf5a" />
<img width="945" height="434" alt="image" src="https://github.com/user-attachments/assets/8aa1b736-25be-44ed-b114-17aef8615e9f" />
<img width="945" height="425" alt="image" src="https://github.com/user-attachments/assets/c875dd3c-ce47-400c-88b7-2f401ca4cec7" />


