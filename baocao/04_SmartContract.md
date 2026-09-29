# 4. SMART CONTRACT

## 4.1. Giới thiệu Smart Contract

### 4.1.1. Smart Contract là gì?

Smart Contract là một chương trình chạy tự động trên blockchain, được viết bằng ngôn ngữ lập trình Solidity (cho Ethereum). Nó có các đặc điểm:

- **Tự động thực thi**: Chạy tự động khi được gọi, không cần can thiệp thủ công
- **Bất biến**: Mã nguồn không thể thay đổi sau khi deploy (trừ khi có upgrade mechanism)
- **Minh bạch**: Mã nguồn công khai, ai cũng có thể xem
- **Phi tập trung**: Chạy trên tất cả các node trong mạng blockchain

### 4.1.2. Vai trò trong dự án

Smart Contract `RecipeRegistry` đóng vai trò là **sổ cái bất biến** để lưu trữ:
- Hash của công thức (SHA256)
- Wallet address của tác giả
- Timestamp (thời điểm đăng ký)
- Block number (số block chứa transaction)

## 4.2. Smart Contract RecipeRegistry.sol

### 4.2.1. Vị trí file

```
backend/contracts/RecipeRegistry.sol
```

### 4.2.2. Cấu trúc tổng quan

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RecipeRegistry {
    // Struct để lưu thông tin công thức
    struct RecipeInfo {
        address author;
        uint256 timestamp;
        bool exists;
    }

    // Mapping từ hash đến RecipeInfo
    mapping(string => RecipeInfo) public recipes;

    // Events
    event RecipeRegistered(...);
    event RecipeUpdated(...);

    // Functions
    function registerRecipe(...) public returns (bool);
    function verifyRecipe(...) public view returns (...);
    function updateRecipe(...) public returns (bool);
    function getRecipeInfo(...) public view returns (...);
}
```

## 4.3. Cấu trúc dữ liệu

### 4.3.1. Struct RecipeInfo

```solidity
struct RecipeInfo {
    address author;        // Địa chỉ ví của tác giả
    uint256 timestamp;     // Thời điểm đăng ký (Unix timestamp)
    bool exists;           // Kiểm tra hash đã tồn tại chưa
}
```

**Giải thích:**
- `author`: Wallet address của người đăng ký công thức (ví dụ: `0x1D7107c7ac42fdb28b10aa3badc08020248dce16`)
- `timestamp`: Thời điểm đăng ký, lấy từ `block.timestamp` (Unix timestamp)
- `exists`: Flag để kiểm tra hash đã được đăng ký chưa

### 4.3.2. Mapping recipes

```solidity
mapping(string => RecipeInfo) public recipes;
```

**Giải thích:**
- `mapping`: Cấu trúc dữ liệu key-value trong Solidity
- Key: `string` (hash SHA256 của công thức)
- Value: `RecipeInfo` (thông tin công thức)
- `public`: Tự động tạo getter function `recipes(string)`

**Ví dụ:**
```solidity
// Lưu
recipes["79e8c1708a19ed99a35de9f83340ebfa8e7d20aa..."] = RecipeInfo({
    author: 0x1D7107c7ac42fdb28b10aa3badc08020248dce16,
    timestamp: 1702051200,
    exists: true
});

// Đọc
RecipeInfo memory recipe = recipes["79e8c1708a19ed99a35de9f83340ebfa8e7d20aa..."];
```

## 4.4. Events

### 4.4.1. Event RecipeRegistered

```solidity
event RecipeRegistered(
    string indexed hash,
    address indexed author,
    uint256 timestamp,
    uint256 blockNumber
);
```

**Mục đích:** Emit khi một công thức mới được đăng ký thành công.

**Tham số:**
- `hash`: Hash của công thức (indexed để có thể filter)
- `author`: Wallet address của tác giả (indexed)
- `timestamp`: Thời điểm đăng ký
- `blockNumber`: Số block chứa transaction

**Sử dụng:**
- Frontend có thể listen event để cập nhật UI
- Backend có thể query events để lấy lịch sử đăng ký

### 4.4.2. Event RecipeUpdated

```solidity
event RecipeUpdated(
    string indexed oldHash,
    string indexed newHash,
    address indexed author,
    uint256 timestamp
);
```

**Mục đích:** Emit khi một công thức được cập nhật (tạo version mới).

**Tham số:**
- `oldHash`: Hash cũ của công thức
- `newHash`: Hash mới của công thức
- `author`: Wallet address của tác giả
- `timestamp`: Thời điểm cập nhật

## 4.5. Các hàm chính

### 4.5.1. registerRecipe

**Chức năng:** Đăng ký hash công thức mới lên blockchain.

```solidity
function registerRecipe(string memory hash, address author) 
    public 
    returns (bool) 
{
    require(bytes(hash).length > 0, "Hash cannot be empty");
    require(author != address(0), "Author address cannot be zero");
    require(!recipes[hash].exists, "Recipe hash already registered");

    recipes[hash] = RecipeInfo({
        author: author,
        timestamp: block.timestamp,
        exists: true
    });

    emit RecipeRegistered(
        hash,
        author,
        block.timestamp,
        block.number
    );

    return true;
}
```

**Tham số:**
- `hash`: Hash SHA256 của công thức (string)
- `author`: Wallet address của tác giả (address)

**Validation:**
1. `require(bytes(hash).length > 0)`: Hash không được rỗng
2. `require(author != address(0))`: Author address không được là address(0)
3. `require(!recipes[hash].exists)`: Hash chưa được đăng ký

**Logic:**
1. Kiểm tra các điều kiện validation
2. Lưu `RecipeInfo` vào mapping `recipes[hash]`
3. Emit event `RecipeRegistered`
4. Trả về `true`

**Revert cases:**
- Hash rỗng → "Hash cannot be empty"
- Author = address(0) → "Author address cannot be zero"
- Hash đã tồn tại → "Recipe hash already registered"

### 4.5.2. verifyRecipe

**Chức năng:** Xác minh hash công thức có tồn tại trên blockchain không.

```solidity
function verifyRecipe(string memory hash) 
    public 
    view 
    returns (
        bool exists,
        address author,
        uint256 timestamp
    ) 
{
    RecipeInfo memory recipe = recipes[hash];
    return (
        recipe.exists,
        recipe.author,
        recipe.timestamp
    );
}
```

**Tham số:**
- `hash`: Hash cần kiểm tra

**Trả về:**
- `exists`: `true` nếu hash đã được đăng ký
- `author`: Wallet address của tác giả
- `timestamp`: Thời điểm đăng ký

**Đặc điểm:**
- `view`: Chỉ đọc dữ liệu, không thay đổi state, không tốn gas
- Có thể gọi từ bất kỳ đâu (public)
- Không tốn phí gas (vì là view function)

**Ví dụ sử dụng:**
```javascript
// Backend gọi qua Web3.js
const result = await contract.methods.verifyRecipe(hash).call();
// result = {
//   exists: true,
//   author: "0x1D7107c7ac42fdb28b10aa3badc08020248dce16",
//   timestamp: "1702051200"
// }
```

### 4.5.3. updateRecipe

**Chức năng:** Cập nhật công thức (tạo version mới với hash mới).

```solidity
function updateRecipe(
    string memory oldHash,
    string memory newHash,
    address author
) public returns (bool) {
    require(recipes[oldHash].exists, "Old recipe hash does not exist");
    require(recipes[oldHash].author == author, "Only author can update recipe");
    require(!recipes[newHash].exists, "New recipe hash already exists");
    require(bytes(newHash).length > 0, "New hash cannot be empty");

    recipes[newHash] = RecipeInfo({
        author: author,
        timestamp: block.timestamp,
        exists: true
    });

    emit RecipeUpdated(
        oldHash,
        newHash,
        author,
        block.timestamp
    );

    return true;
}
```

**Tham số:**
- `oldHash`: Hash cũ của công thức
- `newHash`: Hash mới của công thức (sau khi chỉnh sửa)
- `author`: Wallet address của tác giả (phải là tác giả của hash cũ)

**Validation:**
1. Hash cũ phải tồn tại
2. Chỉ tác giả mới có thể update
3. Hash mới chưa được đăng ký
4. Hash mới không được rỗng

**Logic:**
1. Kiểm tra các điều kiện validation
2. Lưu `RecipeInfo` mới với `newHash`
3. Emit event `RecipeUpdated`
4. Trả về `true`

**Lưu ý:**
- Hash cũ vẫn tồn tại trên blockchain (bất biến)
- Chỉ tạo entry mới với hash mới
- Không xóa hash cũ

### 4.5.4. getRecipeInfo

**Chức năng:** Lấy thông tin chi tiết của công thức.

```solidity
function getRecipeInfo(string memory hash) 
    public 
    view 
    returns (
        address author,
        uint256 timestamp,
        bool exists
    ) 
{
    RecipeInfo memory recipe = recipes[hash];
    return (
        recipe.author,
        recipe.timestamp,
        recipe.exists
    );
}
```

**Tham số:**
- `hash`: Hash của công thức

**Trả về:**
- `author`: Wallet address của tác giả
- `timestamp`: Thời điểm đăng ký
- `exists`: `true` nếu hash đã được đăng ký

**So sánh với verifyRecipe:**
- `verifyRecipe`: Trả về `(exists, author, timestamp)`
- `getRecipeInfo`: Trả về `(author, timestamp, exists)` (thứ tự khác)

## 4.6. Deploy Contract

### 4.6.1. Quy trình deploy

1. **Compile Contract**
   - Sử dụng Remix IDE hoặc Solidity compiler
   - Lấy ABI và bytecode

2. **Deploy lên Ganache**
   - Kết nối Remix với Ganache (RPC: `http://127.0.0.1:7545`)
   - Chọn account có ETH (từ Ganache)
   - Deploy contract
   - Lấy contract address

3. **Lưu Contract Address**
   - Copy contract address
   - Thêm vào `.env`: `RECIPE_REGISTRY_ADDRESS=0x...`

### 4.6.2. Contract Address

**Ví dụ:**
```
RECIPE_REGISTRY_ADDRESS=0x06B6b1FAe3EB1198ca81aBc540cbB67100Ed0540
```

**Lưu ý:**
- Address là duy nhất cho mỗi lần deploy
- Nếu deploy lại, address sẽ khác
- Cần update `.env` mỗi khi deploy mới

### 4.6.3. ABI (Application Binary Interface)

ABI là interface để tương tác với contract từ JavaScript.

**Vị trí:** `backend/config/blockchain.js`

```javascript
contractABI: [
  {
    inputs: [
      { internalType: "string", name: "hash", type: "string" },
      { internalType: "address", name: "author", type: "address" },
    ],
    name: "registerRecipe",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // ... các function khác
]
```

**Cách lấy ABI:**
1. Compile contract trong Remix IDE
2. Copy ABI từ tab "Compilation Details"
3. Paste vào `blockchain.js`

## 4.7. Tương tác với Contract

### 4.7.1. Từ Backend (Web3.js)

```javascript
// Khởi tạo contract instance
const contract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

// Gọi function (write - tốn gas)
const method = contract.methods.registerRecipe(hash, author);
const tx = await method.send({
  from: web3.eth.defaultAccount,
  gas: 300000
});

// Gọi function (read - không tốn gas)
const result = await contract.methods.verifyRecipe(hash).call();
```

### 4.7.2. Từ Frontend (MetaMask)

```javascript
// Kết nối MetaMask
const provider = window.ethereum;
const web3 = new Web3(provider);

// Tạo contract instance
const contract = new web3.eth.Contract(ABI, contractAddress);

// Gọi function (user phải approve transaction)
await contract.methods.registerRecipe(hash, author).send({
  from: userAccount
});
```

**Lưu ý:** Trong dự án này, frontend không gọi contract trực tiếp. Tất cả tương tác đều qua backend.

## 4.8. Gas và Chi phí

### 4.8.1. Gas cho các function

| Function | Type | Gas (ước tính) |
|----------|------|----------------|
| `registerRecipe` | Write | ~100,000 - 150,000 |
| `verifyRecipe` | View | 0 (không tốn gas) |
| `updateRecipe` | Write | ~100,000 - 150,000 |
| `getRecipeInfo` | View | 0 (không tốn gas) |

### 4.8.2. Trên Ganache

- **Miễn phí**: Ganache không tính phí gas
- **Unlimited**: Có thể gửi transaction không giới hạn
- **Nhanh**: Block time = 0 (instant)

### 4.8.3. Trên Mainnet

- **Tốn phí**: Mỗi transaction tốn gas fee
- **Gas price**: Phụ thuộc vào network congestion
- **Chậm hơn**: Cần đợi block confirmation (12-15 giây)

## 4.9. Bảo mật

### 4.9.1. Các biện pháp bảo mật

1. **Input Validation**
   - Kiểm tra hash không rỗng
   - Kiểm tra author address hợp lệ
   - Kiểm tra hash chưa tồn tại

2. **Access Control**
   - `updateRecipe`: Chỉ tác giả mới có thể update
   - Không có admin override (tính phi tập trung)

3. **Reentrancy Protection**
   - Không có external call trong contract
   - Không cần reentrancy guard

### 4.9.2. Hạn chế

- **Không có upgrade mechanism**: Contract không thể upgrade sau khi deploy
- **Không có pause mechanism**: Không thể tạm dừng contract
- **Gas limit**: Cần đảm bảo gas limit đủ cho transaction

## 4.10. Kết luận

Smart Contract `RecipeRegistry` là trái tim của hệ thống blockchain trong dự án. Nó cung cấp:
- Lưu trữ bất biến hash công thức
- Xác minh quyền sở hữu
- Phát hiện trùng lặp tự động
- Minh bạch và có thể verify công khai

Contract được thiết kế đơn giản, an toàn và phù hợp với mục tiêu bảo vệ bản quyền của dự án.

