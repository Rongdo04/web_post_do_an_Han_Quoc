# 3. TỔNG QUAN VỀ BLOCKCHAIN TRONG DỰ ÁN

## 3.1. Tổng quan về blockchain

### 3.1.1. Blockchain là gì?

Blockchain là một công nghệ sổ cái phân tán (distributed ledger) cho phép lưu trữ dữ liệu một cách:

- **Bất biến (Immutable)**: Dữ liệu đã được ghi không thể thay đổi hoặc xóa
- **Phi tập trung (Decentralized)**: Dữ liệu được lưu trên nhiều node, không phụ thuộc vào một server trung tâm
- **Minh bạch (Transparent)**: Tất cả các giao dịch đều công khai và có thể verify
- **Bảo mật (Secure)**: Sử dụng mã hóa và consensus mechanism để đảm bảo tính toàn vẹn

### 3.1.2. Các thành phần cơ bản

1. **Block**: Chứa một tập hợp các giao dịch
2. **Chain**: Các block được liên kết với nhau bằng hash
3. **Node**: Máy tính tham gia vào mạng blockchain
4. **Consensus**: Cơ chế đồng thuận để xác nhận giao dịch
5. **Smart Contract**: Mã chạy tự động trên blockchain

## 3.2. Mục đích sử dụng blockchain trong dự án

### 3.2.1. Bảo vệ bản quyền công thức

**Vấn đề:**

- Công thức nấu ăn dễ bị copy-paste
- Khó chứng minh ai là người tạo ra công thức đầu tiên
- Không có cơ chế phát hiện trùng lặp tự động

**Giải pháp với blockchain:**

- Lưu hash của công thức lên blockchain
- Gắn liền với wallet address của tác giả
- Timestamp không thể giả mạo (block number và block timestamp)
- Phát hiện trùng lặp tự động (hash giống → nội dung giống)

### 3.2.2. Minh bạch và có thể verify

- Bất kỳ ai cũng có thể verify công thức đã được đăng ký
- Không cần quyền truy cập vào database của hệ thống
- Có thể sử dụng làm chứng cứ trong tranh chấp bản quyền

### 3.2.3. Bất biến

- Một khi đã được ghi lên blockchain, hash không thể bị thay đổi
- Lịch sử đầy đủ: Tất cả các thay đổi đều được ghi lại
- Không thể xóa: Dữ liệu tồn tại vĩnh viễn

## 3.3. Kiến trúc tích hợp blockchain

### 3.3.1. Sơ đồ kiến trúc

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  useMetaMask Hook                               │   │
│  │  - Kết nối MetaMask                             │   │
│  │  - Lấy wallet address                           │   │
│  │  - Gửi walletAddress lên backend                │   │
│  └──────────────────────────────────────────────────┘   │
│                         ↓                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Recipe Form                                     │   │
│  │  - User điền thông tin công thức                 │   │
│  │  - Kết nối MetaMask (optional)                   │   │
│  │  - Submit: { recipeData, walletAddress }          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP POST /api/recipes
┌─────────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Recipe Controller                               │   │
│  │  - Nhận request từ frontend                      │   │
│  │  - Validate data                                 │   │
│  └──────────────────────────────────────────────────┘   │
│                         ↓                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Recipe Repository                               │   │
│  │  - Lưu vào MongoDB                                │   │
│  │  - Tính hash SHA256 (hashUtils.js)               │   │
│  │  - Gọi blockchainService                         │   │
│  └──────────────────────────────────────────────────┘   │
│                         ↓                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Blockchain Service (Web3.js)                    │   │
│  │  - Kết nối Ganache                               │   │
│  │  - Tạo contract instance                         │   │
│  │  - Gọi Smart Contract function                   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓ Web3 RPC
┌─────────────────────────────────────────────────────────┐
│              Ganache (Local Blockchain)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Smart Contract (RecipeRegistry.sol)            │   │
│  │  - registerRecipe(hash, author)                 │   │
│  │  - verifyRecipe(hash)                           │   │
│  │  - updateRecipe(oldHash, newHash, author)       │   │
│  └──────────────────────────────────────────────────┘   │
│                         ↓                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Blockchain Storage                             │   │
│  │  mapping(string => RecipeInfo) recipes         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3.3.2. Các thành phần chính

#### Frontend Layer

- **MetaMask Integration**: Lấy wallet address từ user
- **UI Components**: Hiển thị trạng thái verify, transaction hash
- **API Calls**: Gửi recipe data + walletAddress lên backend

#### Backend Layer

- **Recipe Repository**: Business logic, tính hash, gọi blockchain service
- **Blockchain Service**: Tương tác với blockchain qua Web3.js
- **Hash Utils**: Tính SHA256 hash từ recipe data

#### Blockchain Layer

- **Ganache**: Local blockchain network (development)
- **Smart Contract**: Logic lưu trữ và verify hash
- **Web3.js**: JavaScript library để tương tác với blockchain

## 3.4. Flow đăng ký công thức lên blockchain

### 3.4.1. Flow chi tiết

```
┌─────────────────────────────────────────────────────────┐
│ Bước 1: User điền thông tin công thức                    │
│ - Title, ingredients, steps, tags, ...                  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 2: User kết nối MetaMask (optional)               │
│ - Click "Kết nối MetaMask"                              │
│ - MetaMask popup yêu cầu permission                     │
│ - User approve → Lấy wallet address                     │
│   Ví dụ: 0x1D7107c7ac42fdb28b10aa3badc08020248dce16    │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 3: User submit công thức                           │
│ Frontend gửi POST /api/recipes:                         │
│ {                                                       │
│   title: "Bánh bao chay",                              │
│   ingredients: [...],                                  │
│   steps: [...],                                         │
│   walletAddress: "0x1D71..." (nếu có)                  │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 4: Backend nhận request                           │
│ - Validate data                                         │
│ - Lưu vào MongoDB (Recipe model)                        │
│ - Tính hash SHA256 từ recipe data                       │
│   hash = generateRecipeHash({                           │
│     title, summary, content,                            │
│     ingredients, steps, tags,                            │
│     category, prepTime, cookTime, servings              │
│   })                                                    │
│   Ví dụ: "79e8c1708a19ed99a35de9f83340ebfa8e7d20aa..." │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 5: Kiểm tra wallet address                         │
│ if (walletAddress) {                                     │
│   // Có wallet → Đăng ký blockchain                    │
│ } else {                                                │
│   // Không có wallet → Lưu với isVerified = false       │
│   // verificationReason = "no_wallet_address"          │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                    ↓ (nếu có walletAddress)
┌─────────────────────────────────────────────────────────┐
│ Bước 6: Backend gọi blockchainService                   │
│ blockchainService.registerRecipeHash(                   │
│   recipeHash,                                           │
│   authorWalletAddress                                   │
│ )                                                       │
│                                                         │
│ - Kết nối Ganache qua Web3.js                          │
│ - Tạo contract instance                                 │
│ - Gọi method: contract.methods.registerRecipe(...)     │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 7: Smart Contract xử lý                            │
│ function registerRecipe(string hash, address author) {  │
│   require(!recipes[hash].exists, "Hash already exists");│
│   recipes[hash] = RecipeInfo({                          │
│     author: author,                                     │
│     timestamp: block.timestamp,                         │
│     exists: true                                        │
│   });                                                   │
│   emit RecipeRegistered(...);                           │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 8: Backend nhận kết quả                            │
│ {                                                       │
│   success: true,                                         │
│   transactionHash: "0xabc123...",                       │
│   blockNumber: 10,                                      │
│   timestamp: new Date()                                 │
│ }                                                       │
│                                                         │
│ - Lưu vào MongoDB:                                      │
│   recipe.blockchain = {                                 │
│     recipeHash: "...",                                  │
│     authorWalletAddress: "0x1D71...",                   │
│     transactionHash: "0xabc123...",                     │
│     blockNumber: 10,                                    │
│     timestamp: ...,                                     │
│     isVerified: true                                    │
│   }                                                     │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 9: Frontend hiển thị kết quả                       │
│ - Badge "Verified on Blockchain"                        │
│ - Transaction Hash: 0xabc123...                         │
│ - Block Number: 10                                      │
│ - Timestamp: 09/12/2025                                │
└─────────────────────────────────────────────────────────┘
```

### 3.4.2. Flow xử lý lỗi

```
┌─────────────────────────────────────────────────────────┐
│ Trường hợp 1: Hash đã tồn tại                           │
│                                                         │
│ Smart Contract revert:                                  │
│ "Recipe hash already registered"                        │
│                                                         │
│ Backend catch error → Set:                              │
│ - isVerified: false                                    │
│ - verificationReason: "hash_already_exists"              │
│                                                         │
│ Frontend hiển thị:                                      │
│ "Công thức trùng lặp"                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Trường hợp 2: Không có wallet address                   │
│                                                         │
│ Backend skip blockchain registration → Set:             │
│ - isVerified: false                                    │
│ - verificationReason: "no_wallet_address"              │
│                                                         │
│ Frontend hiển thị:                                      │
│ "Chưa kết nối MetaMask"                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Trường hợp 3: Blockchain error (Ganache down, etc.)    │
│                                                         │
│ Backend catch error → Set:                              │
│ - isVerified: false                                    │
│ - verificationReason: "blockchain_error"                 │
│                                                         │
│ Frontend hiển thị:                                      │
│ "Chưa xác minh trên Blockchain"                        │
│                                                         │
│ Lưu ý: Recipe vẫn được lưu vào MongoDB                 │
│ (Graceful degradation)                                 │
└─────────────────────────────────────────────────────────┘
```

## 3.5. So sánh với các phương pháp khác

### 3.5.1. Database Timestamp vs Blockchain

| Tiêu chí           | Database Timestamp    | Blockchain            |
| ------------------ | --------------------- | --------------------- |
| **Bất biến**       | ❌ Có thể thay đổi    | ✅ Không thể thay đổi |
| **Phi tập trung**  | ❌ Phụ thuộc server   | ✅ Phân tán           |
| **Verify độc lập** | ❌ Cần quyền truy cập | ✅ Công khai          |
| **Chi phí**        | Miễn phí              | Tốn phí (mainnet)     |
| **Tốc độ**         | ⚡⚡⚡ Nhanh          | ⚡ Chậm hơn           |

### 3.5.2. Khi nào nên dùng blockchain?

**Nên dùng blockchain khi:**

- ✅ Cần chứng minh quyền sở hữu
- ✅ Cần tính bất biến
- ✅ Cần verify công khai
- ✅ Có ngân sách cho gas fee (hoặc dùng testnet/local)

**Không nên dùng blockchain khi:**

- ❌ Chỉ cần lưu trữ đơn giản
- ❌ Cần tốc độ cao
- ❌ Không có ngân sách cho gas fee
- ❌ Dữ liệu cần thay đổi thường xuyên

## 3.6. Lợi ích và hạn chế

### 3.6.1. Lợi ích

1. **Bảo vệ bản quyền mạnh mẽ**

   - Hash không thể giả mạo
   - Timestamp chính xác (block number)
   - Chứng minh quyền sở hữu rõ ràng

2. **Phát hiện trùng lặp tự động**

   - Smart Contract tự động reject hash trùng
   - Không cần query database để kiểm tra

3. **Minh bạch và tin cậy**

   - Bất kỳ ai cũng có thể verify
   - Không phụ thuộc vào hệ thống của bạn

4. **Graceful Degradation**
   - Hệ thống vẫn hoạt động nếu blockchain fail
   - Recipe vẫn được lưu vào MongoDB

### 3.6.2. Hạn chế

1. **Chi phí**

   - Trên mainnet: Tốn phí gas cho mỗi transaction
   - Giải pháp: Dùng Ganache (local) hoặc testnet (development)

2. **Tốc độ**

   - Chậm hơn database (cần đợi block confirmation)
   - Giải pháp: Ganache nhanh hơn mainnet

3. **Độ phức tạp**

   - Cần hiểu Smart Contract, Web3.js
   - Cần setup Ganache, MetaMask
   - Debug khó hơn database

4. **Không thể update trực tiếp**
   - Blockchain bất biến → Update tạo hash mới
   - Cần logic phức tạp để quản lý version

## 3.7. Kết luận

Blockchain trong dự án này đóng vai trò quan trọng trong việc bảo vệ bản quyền công thức nấu ăn. Mặc dù có một số hạn chế về chi phí và độ phức tạp, nhưng các lợi ích về tính bất biến, minh bạch và khả năng verify công khai khiến nó trở thành lựa chọn phù hợp cho mục tiêu của dự án.

Trong các phần tiếp theo, chúng ta sẽ đi sâu vào từng thành phần cụ thể:

- **Smart Contract**: Logic lưu trữ và verify hash
- **Ganache**: Local blockchain network
- **Web3.js**: Tương tác với blockchain từ backend
- **MetaMask**: Lấy wallet address từ user
