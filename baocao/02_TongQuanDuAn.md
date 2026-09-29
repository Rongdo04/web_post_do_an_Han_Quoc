# 2. TỔNG QUAN DỰ ÁN

## 2.1. Giới thiệu dự án

### 2.1.1. Tên dự án

**Website Hướng Dẫn Nấu Món Ăn Chay với Tích hợp Blockchain**

### 2.1.2. Mô tả

Dự án xây dựng một nền tảng web chia sẻ công thức nấu ăn chay, tích hợp công nghệ blockchain để bảo vệ bản quyền công thức. Hệ thống cho phép người dùng:
- Đăng tải và chia sẻ công thức nấu ăn chay
- Tìm kiếm và lọc công thức theo nhiều tiêu chí
- Tương tác với cộng đồng (bình luận, đánh giá, yêu thích)
- Bảo vệ bản quyền công thức thông qua blockchain

### 2.1.3. Đối tượng sử dụng

- **Guest (Khách truy cập)**: Xem công thức công khai, tìm kiếm
- **User (Người dùng)**: Đăng ký, đăng tải công thức, tương tác cộng đồng
- **Admin (Quản trị viên)**: Quản lý hệ thống, duyệt nội dung, xử lý báo cáo

## 2.2. Mục tiêu và phạm vi

### 2.2.1. Mục tiêu chính

1. **Xây dựng hệ thống quản lý công thức nấu ăn chay**
   - Quản lý công thức với đầy đủ thông tin (nguyên liệu, bước làm, hình ảnh)
   - Phân loại theo danh mục, độ khó, thời gian nấu
   - Tìm kiếm và lọc nâng cao

2. **Tạo cộng đồng chia sẻ và tương tác**
   - Bình luận và đánh giá công thức
   - Bài viết cộng đồng
   - Lưu yêu thích

3. **Bảo vệ bản quyền công thức**
   - Đăng ký công thức lên blockchain
   - Xác minh quyền sở hữu
   - Phát hiện trùng lặp nội dung

4. **Hệ thống quản trị**
   - Quản lý người dùng và nội dung
   - Duyệt và kiểm duyệt công thức
   - Xử lý báo cáo vi phạm
   - Thống kê và báo cáo

### 2.2.2. Phạm vi dự án

**Chức năng:**
- Quản lý công thức (CRUD)
- Tìm kiếm và lọc
- Cộng đồng (bình luận, đánh giá, bài viết)
- Quản trị hệ thống
- Tích hợp blockchain

**Công nghệ:**
- Frontend: React 19.1.1, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Blockchain: Ganache (local), Smart Contract (Solidity), Web3.js
- Authentication: JWT

## 2.3. Kiến trúc hệ thống

### 2.3.1. Kiến trúc 3 tầng

```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│  - UI Components                        │
│  - State Management                     │
│  - API Calls                            │
│  - MetaMask Integration                 │
└─────────────────────────────────────────┘
                    ↕ HTTP/REST API
┌─────────────────────────────────────────┐
│         Backend (Node.js/Express)       │
│  - API Routes                           │
│  - Business Logic                       │
│  - Blockchain Service (Web3.js)         │
│  - Authentication (JWT)                 │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Data Layer                      │
│  - MongoDB (Recipes, Users, etc.)      │
│  - Ganache (Blockchain)                 │
│  - Smart Contract                       │
└─────────────────────────────────────────┘
```

### 2.3.2. Cấu trúc thư mục

```
project/
├── backend/
│   ├── config/          # Cấu hình (database, blockchain)
│   ├── contracts/       # Smart Contract (RecipeRegistry.sol)
│   ├── controllers/     # Logic xử lý request
│   ├── models/          # Database models (Mongoose)
│   ├── repositories/    # Business logic layer
│   ├── routes/          # API routes
│   ├── services/        # Services (blockchain, email, storage)
│   ├── utils/           # Utilities (hash, JWT)
│   └── scripts/         # Scripts (deploy, test)
│
├── client/
│   ├── src/
│   │   ├── admin/       # Admin pages
│   │   ├── user/        # User pages
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom hooks (useMetaMask)
│   │   └── services/    # API services
│   └── public/
│
└── baocao/              # Báo cáo (folder này)
```

## 2.4. Các chức năng chính

### 2.4.1. Quản lý công thức

- **Tạo công thức**: User có thể tạo công thức mới với đầy đủ thông tin
- **Xem công thức**: Xem chi tiết công thức với hình ảnh, video
- **Chỉnh sửa**: Tác giả có thể chỉnh sửa công thức của mình
- **Xóa**: Tác giả hoặc admin có thể xóa công thức
- **Tìm kiếm**: Tìm kiếm theo từ khóa, danh mục, thời gian nấu

### 2.4.2. Tích hợp Blockchain

- **Đăng ký công thức**: Lưu hash công thức lên blockchain
- **Xác minh quyền sở hữu**: Verify công thức đã được đăng ký
- **Phát hiện trùng lặp**: Tự động phát hiện khi hash đã tồn tại
- **Hiển thị trạng thái**: Hiển thị badge "Verified on Blockchain"

### 2.4.3. Cộng đồng

- **Bình luận**: User có thể bình luận trên công thức
- **Đánh giá**: Đánh giá công thức bằng sao
- **Yêu thích**: Lưu công thức vào danh sách yêu thích
- **Bài viết cộng đồng**: Tạo và chia sẻ bài viết

### 2.4.4. Quản trị

- **Quản lý người dùng**: Xem, chỉnh sửa, khóa/mở khóa user
- **Duyệt công thức**: Duyệt hoặc từ chối công thức chờ duyệt
- **Quản lý nội dung**: Quản lý công thức, bài viết, bình luận
- **Xử lý báo cáo**: Xử lý các báo cáo vi phạm
- **Thống kê**: Xem thống kê hệ thống

## 2.5. Công nghệ sử dụng

### 2.5.1. Frontend

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 19.1.1 | UI Framework |
| Vite | 4.5.14 | Build tool |
| Tailwind CSS | 3.4.1 | Styling |
| React Router | 6.30.1 | Routing |
| Axios | 1.11.0 | HTTP client |
| Web3 | 4.0.0 | Blockchain integration (frontend) |

### 2.5.2. Backend

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Node.js | - | Runtime environment |
| Express.js | 4.21.2 | Web framework |
| MongoDB | - | Database |
| Mongoose | 8.6.2 | ODM |
| JWT | 9.0.2 | Authentication |
| Web3 | 4.0.0 | Blockchain integration (backend) |
| Multer | 1.4.5 | File upload |
| Sharp | 0.32.6 | Image processing |

### 2.5.3. Blockchain

| Công nghệ | Mục đích |
|-----------|----------|
| Ganache | Local blockchain network |
| Solidity | Smart Contract language |
| Web3.js | JavaScript library để tương tác blockchain |
| MetaMask | Browser extension để quản lý wallet |

## 2.6. Flow hoạt động của hệ thống

### 2.6.1. Flow tạo công thức với Blockchain

```
┌─────────────────────────────────────────┐
│ 1. User điền thông tin công thức        │
│    (title, ingredients, steps, ...)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. User kết nối MetaMask                │
│    → Lấy wallet address                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. User submit công thức                │
│    → Frontend gửi data + walletAddress  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 4. Backend nhận request                 │
│    → Lưu vào MongoDB                    │
│    → Tính hash SHA256                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 5. Backend gọi blockchainService        │
│    → Kết nối Ganache qua Web3.js        │
│    → Gọi Smart Contract                │
│    → registerRecipe(hash, walletAddress)│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 6. Smart Contract xử lý                 │
│    → Kiểm tra hash chưa tồn tại          │
│    → Lưu vào blockchain                 │
│    → Emit event RecipeRegistered        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 7. Backend nhận kết quả                  │
│    → Lưu transactionHash, blockNumber   │
│    → Set isVerified = true              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 8. Frontend hiển thị                     │
│    → Badge "Verified on Blockchain"     │
│    → Transaction Hash, Block Number     │
└─────────────────────────────────────────┘
```

### 2.6.2. Flow xem công thức

```
User truy cập trang chi tiết công thức
    ↓
Frontend gọi API GET /api/recipes/:id
    ↓
Backend query MongoDB
    ↓
Trả về recipe với blockchain metadata
    ↓
Frontend hiển thị:
- Thông tin công thức
- Badge "Verified on Blockchain" (nếu isVerified = true)
- Transaction Hash, Block Number
- Cảnh báo nếu chưa verify hoặc trùng lặp
```

### 2.6.3. Flow phát hiện trùng lặp

```
User submit công thức trùng lặp
    ↓
Backend tính hash → Hash giống với công thức đã có
    ↓
Backend gọi Smart Contract registerRecipe()
    ↓
Smart Contract kiểm tra: recipes[hash].exists = true
    ↓
Smart Contract revert với error: "Recipe hash already registered"
    ↓
Backend catch error → Set verificationReason = "hash_already_exists"
    ↓
Frontend hiển thị: "Công thức trùng lặp"
```

## 2.7. Đặc điểm nổi bật

### 2.7.1. Graceful Degradation

Hệ thống được thiết kế để tiếp tục hoạt động ngay cả khi blockchain fail:

```javascript
// backend/repositories/recipes.repo.js
try {
  const blockchainResult = await blockchainService.registerRecipeHash(...);
  if (blockchainResult.success) {
    // Lưu với isVerified = true
  } else {
    // Lưu với isVerified = false, verificationReason = "blockchain_error"
  }
} catch (error) {
  // Vẫn lưu vào MongoDB, chỉ log error
  // Recipe vẫn được tạo, chỉ không verify trên blockchain
}
```

### 2.7.2. Tự động tính hash

Hash được tính tự động từ nội dung công thức:

```javascript
// backend/utils/hashUtils.js
const recipeHash = generateRecipeHash({
  title, summary, content,
  ingredients, steps, tags,
  category, prepTime, cookTime, servings
});
```

### 2.7.3. Phát hiện trùng lặp thông minh

Hệ thống tự động phát hiện khi công thức trùng lặp:

- So sánh hash: Nếu hash giống → nội dung giống
- Kiểm tra trên blockchain: Smart Contract reject nếu hash đã tồn tại
- Hiển thị cảnh báo: User được thông báo rõ ràng

## 2.8. Kết luận

Dự án này là một hệ thống web hoàn chỉnh để quản lý và chia sẻ công thức nấu ăn chay, với điểm nhấn đặc biệt là tích hợp blockchain để bảo vệ bản quyền. Hệ thống sử dụng kiến trúc 3 tầng hiện đại (Frontend-Backend-Database), kết hợp với blockchain để tạo ra một giải pháp mạnh mẽ và đáng tin cậy.

Trong các phần tiếp theo, chúng ta sẽ đi sâu vào phần blockchain, bao gồm Smart Contract, Ganache, Web3, và MetaMask.












