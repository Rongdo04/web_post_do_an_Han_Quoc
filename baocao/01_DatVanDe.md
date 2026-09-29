# 1. ĐẶT VẤN ĐỀ

## 1.1. Vấn đề bảo vệ bản quyền công thức nấu ăn

Trong thời đại số hóa hiện nay, việc chia sẻ công thức nấu ăn trên các nền tảng trực tuyến đã trở nên phổ biến. Tuy nhiên, điều này cũng kéo theo nhiều vấn đề nghiêm trọng về bảo vệ bản quyền:

### 1.1.1. Vấn đề copy-paste và trùng lặp nội dung

- **Copy-paste không kiểm soát**: Người dùng có thể dễ dàng copy công thức của người khác và đăng lại như của mình
- **Không có cơ chế phát hiện trùng lặp**: Hệ thống không thể tự động phát hiện khi một công thức đã được đăng ký trước đó
- **Mất quyền sở hữu**: Tác giả gốc không thể chứng minh mình là người tạo ra công thức đầu tiên

### 1.1.2. Nhu cầu chứng minh quyền sở hữu

Khi xảy ra tranh chấp về bản quyền, cần có cơ chế để:
- Chứng minh ai là người tạo ra công thức đầu tiên
- Xác định thời điểm công thức được tạo
- Xác minh tính toàn vẹn của nội dung (không bị thay đổi)

## 1.2. So sánh các phương pháp bảo vệ bản quyền

### 1.2.1. Database Timestamp

**Cách làm:**
```javascript
{
  title: "Bánh bao chay",
  createdAt: "2025-12-09T10:00:00Z",  // Timestamp
  authorId: "507f1f77bcf86cd799439011"
}
```

**Ưu điểm:**
- ✅ Đơn giản, dễ triển khai
- ✅ Nhanh, không tốn phí
- ✅ Không cần công nghệ phức tạp

**Nhược điểm:**
- ❌ Có thể giả mạo (thay đổi timestamp trong database)
- ❌ Phụ thuộc vào server của bạn
- ❌ Không thể chứng minh độc lập
- ❌ Có thể bị hack/xóa

### 1.2.2. Hash + Timestamp

**Cách làm:**
```javascript
{
  recipeHash: "79e8c1708a19ed99a35de9f83340ebfa8e7d20aa131b0bfed51c49b61a33efbd",
  createdAt: "2025-12-09T10:00:00Z",
  authorId: "507f1f77bcf86cd799439011"
}
```

**Ưu điểm:**
- ✅ Hash không thể giả mạo (nếu nội dung giống → hash giống)
- ✅ Có thể phát hiện trùng lặp
- ✅ Đơn giản hơn blockchain

**Nhược điểm:**
- ❌ Timestamp vẫn có thể giả mạo
- ❌ Phụ thuộc vào database
- ❌ Không thể chứng minh độc lập
- ❌ Có thể bị hack/xóa

### 1.2.3. Digital Signature

**Cách làm:**
```javascript
// User ký hash bằng private key
const signature = sign(recipeHash, userPrivateKey);

{
  recipeHash: "79e8c1...",
  signature: "0xabc123...",  // Chữ ký số
  timestamp: "2025-12-09T10:00:00Z"
}
```

**Ưu điểm:**
- ✅ Có thể verify chữ ký (chứng minh ai đã ký)
- ✅ Không thể giả mạo (cần private key)
- ✅ Có thể verify độc lập

**Nhược điểm:**
- ❌ Phức tạp hơn (cần xử lý chữ ký)
- ❌ Vẫn phụ thuộc nơi lưu signature
- ❌ User phải quản lý private key
- ❌ Có thể bị hack/xóa database

### 1.2.4. Third-party Timestamping Service

**Cách làm:**
```javascript
// Gửi hash lên dịch vụ timestamp
const timestamp = await timestampingService.stamp(recipeHash);
// Trả về: { timestamp: "2025-12-09T10:00:00Z", certificate: "..." }

{
  recipeHash: "79e8c1...",
  timestampCertificate: "...",  // Certificate từ bên thứ 3
}
```

**Ưu điểm:**
- ✅ Có bên thứ 3 xác nhận
- ✅ Certificate có thể verify
- ✅ Tương đối tin cậy

**Nhược điểm:**
- ❌ Tốn phí (phải trả cho dịch vụ)
- ❌ Phụ thuộc vào dịch vụ bên thứ 3
- ❌ Có thể dịch vụ đóng cửa
- ❌ Vẫn cần lưu certificate

### 1.2.5. Blockchain (Phương pháp được chọn)

**Cách làm:**
```solidity
// Lưu trên blockchain
recipes["79e8c1..."] = {
  author: "0x1D71...",
  timestamp: 1702051200,
  blockNumber: 10
}
```

**Ưu điểm:**
- ✅ Bất biến (không thể thay đổi/xóa)
- ✅ Phi tập trung (không phụ thuộc server của bạn)
- ✅ Có thể verify công khai
- ✅ Không thể giả mạo (cần private key)
- ✅ Lịch sử vĩnh viễn
- ✅ Minh bạch

**Nhược điểm:**
- ❌ Tốn phí gas (trên mainnet)
- ❌ Phức tạp hơn (cần smart contract, Web3)
- ❌ Phụ thuộc mạng blockchain
- ❌ Chậm hơn database

## 1.3. Bảng so sánh tổng hợp

| Tiêu chí | Database | Hash + Timestamp | Digital Signature | Timestamping Service | **Blockchain** |
|----------|----------|-------------------|-------------------|---------------------|----------------|
| **Độ tin cậy** | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Bất biến** | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| **Phi tập trung** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Có thể verify độc lập** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Chi phí** | Miễn phí | Miễn phí | Miễn phí | Tốn phí | Tốn phí (mainnet) |
| **Độ phức tạp** | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Tốc độ** | ⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡ |
| **Không thể giả mạo** | ❌ | ⚠️ | ✅ | ✅ | ✅ |

## 1.4. Lý do chọn Blockchain

### 1.4.1. Tính bất biến (Immutable)

- **Không thể thay đổi**: Một khi đã được ghi lên blockchain, dữ liệu không thể bị sửa đổi
- **Không thể xóa**: Dữ liệu tồn tại vĩnh viễn trên blockchain
- **Lịch sử đầy đủ**: Tất cả các thay đổi đều được ghi lại và có thể truy vết

### 1.4.2. Phi tập trung (Decentralized)

- **Không phụ thuộc server**: Dữ liệu không chỉ lưu trên server của bạn
- **Phân tán**: Dữ liệu được lưu trên hàng nghìn node
- **Khả năng chịu lỗi cao**: Nếu một node bị lỗi, các node khác vẫn hoạt động

### 1.4.3. Có thể verify công khai

- **Minh bạch**: Bất kỳ ai cũng có thể verify thông tin trên blockchain
- **Không cần quyền truy cập**: Không cần phải có quyền truy cập vào database của bạn
- **Độc lập**: Có thể verify mà không cần phụ thuộc vào hệ thống của bạn

### 1.4.4. Chứng minh quyền sở hữu

- **Timestamp chính xác**: Block number và timestamp không thể giả mạo
- **Xác định tác giả**: Wallet address gắn liền với private key, không thể giả mạo
- **Chứng cứ pháp lý**: Có thể sử dụng làm chứng cứ trong tranh chấp bản quyền

### 1.4.5. Phù hợp với mục tiêu dự án

Dự án này tập trung vào việc bảo vệ bản quyền công thức nấu ăn, do đó blockchain là lựa chọn phù hợp nhất vì:
- Cung cấp cơ chế bảo vệ bản quyền mạnh mẽ
- Tạo niềm tin cho người dùng
- Ngăn chặn copy-paste và trùng lặp nội dung
- Chứng minh quyền sở hữu một cách rõ ràng

## 1.5. Kết luận

Vấn đề bảo vệ bản quyền công thức nấu ăn là một thách thức thực tế trong thời đại số. Trong khi các phương pháp truyền thống như database timestamp hay hash + timestamp có ưu điểm về độ đơn giản và tốc độ, chúng không đủ mạnh để bảo vệ bản quyền một cách hiệu quả.

Blockchain, mặc dù phức tạp hơn và có chi phí cao hơn, nhưng cung cấp các tính năng quan trọng như tính bất biến, phi tập trung, và khả năng verify công khai, khiến nó trở thành lựa chọn tốt nhất cho mục tiêu bảo vệ bản quyền của dự án.

Trong các phần tiếp theo, chúng ta sẽ đi sâu vào cách triển khai blockchain trong dự án này, bao gồm Smart Contract, Ganache, Web3, và MetaMask.












