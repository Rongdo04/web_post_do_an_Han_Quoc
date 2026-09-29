# 7. METAMASK

## 7.1. Giới thiệu MetaMask

### 7.1.1. MetaMask là gì?

MetaMask là một browser extension (tiện ích mở rộng trình duyệt) cho phép:
- **Quản lý Ethereum Wallet**: Tạo, import, quản lý Ethereum accounts
- **Kết nối với DApps**: Kết nối với các ứng dụng phi tập trung (Decentralized Apps)
- **Gửi Transactions**: Ký và gửi transactions lên blockchain
- **Quản lý Networks**: Chuyển đổi giữa các mạng (Mainnet, Testnet, Custom)

### 7.1.2. Vai trò trong dự án

Trong dự án này, MetaMask đóng vai trò là **wallet provider** để:
- Lấy wallet address của user (không ký transaction)
- Xác định tác giả công thức trên blockchain
- Hiển thị trạng thái kết nối cho user

**Lưu ý quan trọng:** MetaMask **KHÔNG** ký transaction hay trả phí gas trong dự án này. Tất cả transactions đều được gửi từ backend với private key của backend account.

## 7.2. Tại sao cần MetaMask?

### 7.2.1. Vấn đề với authorId (MongoDB)

**authorId trong MongoDB:**
```javascript
{
  authorId: ObjectId("507f1f77bcf86cd799439011"),  // MongoDB ObjectId
  author: {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com"
  }
}
```

**Vấn đề:**
- ❌ Có thể giả mạo (tạo user mới với thông tin giả)
- ❌ Không liên kết với blockchain
- ❌ Không thể verify công khai
- ❌ Phụ thuộc vào hệ thống của bạn

### 7.2.2. Giải pháp với authorWalletAddress

**authorWalletAddress trên blockchain:**
```javascript
{
  authorWalletAddress: "0x1D7107c7ac42fdb28b10aa3badc08020248dce16",  // Ethereum address
  blockchain: {
    recipeHash: "79e8c1...",
    transactionHash: "0xabc123...",
    blockNumber: 10
  }
}
```

**Lợi ích:**
- ✅ Không thể giả mạo (cần private key)
- ✅ Liên kết trực tiếp với blockchain
- ✅ Có thể verify công khai
- ✅ Phi tập trung, không phụ thuộc hệ thống

### 7.2.3. So sánh authorId vs authorWalletAddress

| Tiêu chí | authorId (MongoDB) | authorWalletAddress (Blockchain) |
|----------|-------------------|----------------------------------|
| **Định danh** | ObjectId | Ethereum Address |
| **Có thể giả mạo** | ✅ Có thể | ❌ Không thể (cần private key) |
| **Liên kết blockchain** | ❌ Không | ✅ Có |
| **Verify công khai** | ❌ Không | ✅ Có |
| **Phi tập trung** | ❌ Phụ thuộc server | ✅ Phi tập trung |
| **Mục đích** | Quản lý user trong hệ thống | Xác định tác giả trên blockchain |

### 7.2.4. Tại sao cần cả hai?

**authorId (MongoDB):**
- Quản lý user trong hệ thống
- Liên kết với profile, avatar, email
- Dùng cho authentication, authorization

**authorWalletAddress (Blockchain):**
- Xác định tác giả trên blockchain
- Bảo vệ bản quyền
- Verify công khai

**Kết hợp:**
```javascript
{
  authorId: ObjectId("507f1f77bcf86cd799439011"),  // User trong hệ thống
  blockchain: {
    authorWalletAddress: "0x1D71...",  // Tác giả trên blockchain
    recipeHash: "79e8c1...",
    isVerified: true
  }
}
```

## 7.3. Tích hợp MetaMask với Frontend

### 7.3.1. Custom Hook: useMetaMask

**Vị trí file:**
```
client/src/hooks/useMetaMask.js
```

**Chức năng:** Quản lý kết nối MetaMask và lấy wallet address.

### 7.3.2. State Management

```javascript
const [account, setAccount] = useState(null);
const [isConnected, setIsConnected] = useState(false);
const [isConnecting, setIsConnecting] = useState(false);
const [error, setError] = useState(null);
const [chainId, setChainId] = useState(null);

// Kiểm tra MetaMask có được cài đặt không
const isMetaMaskInstalled = typeof window !== "undefined" && 
                            typeof window.ethereum !== "undefined";
```

### 7.3.3. Kết nối MetaMask

```javascript
const connect = useCallback(async () => {
  if (!isMetaMaskInstalled) {
    // Mở link tải MetaMask
    window.open("https://metamask.io/download/", "_blank");
    return { success: false, error: "MetaMask chưa được cài đặt" };
  }

  setIsConnecting(true);
  setError(null);

  try {
    // Yêu cầu kết nối
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
      return { success: true, account: accounts[0] };
    }
  } catch (error) {
    // Xử lý lỗi
    if (error.code === 4001) {
      setError("Người dùng đã từ chối kết nối");
    } else {
      setError(error.message);
    }
    return { success: false, error: error.message };
  } finally {
    setIsConnecting(false);
  }
}, [isMetaMaskInstalled]);
```

### 7.3.4. Lắng nghe thay đổi

```javascript
useEffect(() => {
  if (isMetaMaskInstalled) {
    // Lắng nghe thay đổi account
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    
    // Lắng nghe thay đổi network
    window.ethereum.on("chainChanged", handleChainChanged);
  }

  return () => {
    // Cleanup listeners
    if (isMetaMaskInstalled) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    }
  };
}, []);
```

## 7.4. Sử dụng trong Recipe Form

### 7.4.1. Component ReviewSubmit

**Vị trí:** `client/src/user/components/submit/ReviewSubmit.jsx`

**Chức năng:** Hiển thị UI kết nối MetaMask và gửi wallet address lên backend.

### 7.4.2. UI Components

```jsx
// Kiểm tra MetaMask chưa cài đặt
{!isMetaMaskInstalled ? (
  <p className="text-xs text-emerald-700/70">
    Cài đặt MetaMask để bảo vệ công thức của bạn
  </p>
) : !isConnected ? (
  // Nút kết nối MetaMask
  <button
    type="button"
    onClick={connect}
    disabled={isConnecting}
    className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600"
  >
    {isConnecting ? "Đang kết nối..." : "Kết nối MetaMask"}
  </button>
) : (
  // Đã kết nối
  <div className="space-y-1">
    <p className="text-xs text-emerald-700">
      <FaCheckCircle className="inline mr-1" /> 
      Đã kết nối: {account?.slice(0, 6)}...{account?.slice(-4)}
    </p>
    <p className="text-[10px] text-emerald-600/70">
      Công thức sẽ được bảo vệ trên blockchain
    </p>
  </div>
)}
```

### 7.4.3. Gửi walletAddress lên Backend

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = {
    title,
    ingredients,
    steps,
    // ... other fields
    walletAddress: account,  // Gửi wallet address từ MetaMask
  };

  await onSubmit(formData);
};
```

## 7.5. Flow kết nối MetaMask

### 7.5.1. Flow chi tiết

```
┌─────────────────────────────────────────────────────────┐
│ Bước 1: User mở trang tạo công thức                      │
│ - Component ReviewSubmit render                          │
│ - useMetaMask hook kiểm tra MetaMask installed          │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 2: User click "Kết nối MetaMask"                   │
│ - Gọi connect() function                                │
│ - window.ethereum.request({ method: "eth_requestAccounts" })
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 3: MetaMask popup hiển thị                          │
│ - Yêu cầu user approve connection                       │
│ - User có thể chọn account                              │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 4: User approve                                     │
│ - MetaMask trả về accounts array                        │
│ - accounts[0] = "0x1D7107c7ac42fdb28b10aa3badc08020248dce16"
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 5: Frontend cập nhật state                         │
│ - setAccount(accounts[0])                               │
│ - setIsConnected(true)                                  │
│ - UI hiển thị: "Đã kết nối: 0x1D71...dce16"            │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 6: User submit công thức                            │
│ - Form gửi: { recipeData, walletAddress: account }      │
│ - Backend nhận walletAddress                            │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Bước 7: Backend đăng ký blockchain                      │
│ - blockchainService.registerRecipeHash(                 │
│     recipeHash,                                         │
│     authorWalletAddress  // Từ MetaMask                  │
│   )                                                     │
└─────────────────────────────────────────────────────────┘
```

### 7.5.2. Xử lý lỗi

**Lỗi 4001: User rejected**
```javascript
if (error.code === 4001) {
  setError("Người dùng đã từ chối kết nối");
}
```

**Lỗi -32002: Request pending**
```javascript
if (error.code === -32002) {
  setError("Yêu cầu kết nối đang chờ xử lý");
}
```

**MetaMask chưa cài đặt:**
```javascript
if (!isMetaMaskInstalled) {
  window.open("https://metamask.io/download/", "_blank");
}
```

## 7.6. Cấu hình Network

### 7.6.1. Thêm Ganache Network

**Từ code:**
```javascript
const switchNetwork = async (targetChainId = "0x539") => {
  // 0x539 = 1337 in decimal (Ganache default)
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetChainId }],
    });
  } catch (switchError) {
    // Nếu chain chưa được thêm, thêm nó
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: targetChainId,
          chainName: "Ganache Local",
          rpcUrls: ["http://localhost:8545"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
        }],
      });
    }
  }
};
```

**Thủ công:**
1. Mở MetaMask
2. Settings > Networks > Add Network
3. Điền thông tin:
   - Network Name: Ganache Local
   - RPC URL: http://127.0.0.1:7545
   - Chain ID: 5777
   - Currency Symbol: ETH

### 7.6.2. Import Account từ Ganache

1. Mở MetaMask
2. Click account icon > Import Account
3. Paste private key từ Ganache
4. Account sẽ xuất hiện với balance 100 ETH

## 7.7. Sự khác biệt với OAuth Provider

### 7.7.1. OAuth Provider (Google, Facebook)

**Cách hoạt động:**
```
User click "Đăng nhập bằng Google"
  ↓
Redirect đến Google OAuth
  ↓
User approve
  ↓
Google trả về: { email, name, picture }
  ↓
Backend tạo user trong MongoDB
  ↓
authorId = ObjectId("...")
```

**Đặc điểm:**
- Phụ thuộc vào Google/Facebook
- Không liên kết với blockchain
- Không có wallet address

### 7.7.2. MetaMask

**Cách hoạt động:**
```
User click "Kết nối MetaMask"
  ↓
MetaMask popup
  ↓
User approve
  ↓
MetaMask trả về: wallet address
  ↓
Frontend gửi walletAddress lên backend
  ↓
Backend lưu authorWalletAddress
```

**Đặc điểm:**
- Không phụ thuộc bên thứ 3
- Liên kết trực tiếp với blockchain
- Có wallet address để verify

### 7.7.3. So sánh

| Tiêu chí | OAuth Provider | MetaMask |
|----------|----------------|----------|
| **Mục đích** | Authentication | Wallet Provider |
| **Trả về** | Email, name, picture | Wallet address |
| **Liên kết blockchain** | ❌ Không | ✅ Có |
| **Phụ thuộc** | Google/Facebook | MetaMask (nhưng có thể thay thế) |
| **Private key** | ❌ Không có | ✅ Có (user quản lý) |

## 7.8. MetaMask không ký transaction

### 7.8.1. Trong dự án này

**MetaMask chỉ cung cấp:**
- ✅ Wallet address (để xác định tác giả)
- ✅ UI để user kết nối

**MetaMask KHÔNG:**
- ❌ Ký transaction
- ❌ Trả phí gas
- ❌ Gửi transaction lên blockchain

### 7.8.2. Ai ký transaction?

**Backend account:**
```javascript
// backend/services/blockchainService.js
const account = web3.eth.accounts.privateKeyToAccount(
  blockchainConfig.privateKey  // Private key của backend
);
web3.eth.defaultAccount = account.address;

// Backend gửi transaction
const tx = await method.send({
  from: web3.eth.defaultAccount,  // Backend account
  gas: gasEstimate,
});
```

**Lý do:**
- User không cần trả phí gas
- Backend quản lý transaction
- Đơn giản hóa UX (user chỉ cần kết nối MetaMask)

### 7.8.3. So sánh với DApp thông thường

**DApp thông thường:**
```
User kết nối MetaMask
  ↓
User approve transaction
  ↓
MetaMask ký transaction
  ↓
User trả phí gas
  ↓
Transaction được gửi
```

**Dự án này:**
```
User kết nối MetaMask (chỉ để lấy address)
  ↓
Backend gửi transaction (với backend private key)
  ↓
Backend trả phí gas
  ↓
Transaction được gửi
```

## 7.9. Best Practices

### 7.9.1. Kiểm tra MetaMask installed

```javascript
const isMetaMaskInstalled = typeof window !== "undefined" && 
                            typeof window.ethereum !== "undefined";
```

### 7.9.2. Xử lý lỗi đúng cách

```javascript
if (error.code === 4001) {
  // User rejected
} else if (error.code === -32002) {
  // Request pending
} else {
  // Other error
}
```

### 7.9.3. Cleanup listeners

```javascript
useEffect(() => {
  window.ethereum.on("accountsChanged", handleAccountsChanged);
  return () => {
    window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  };
}, []);
```

### 7.9.4. Hiển thị address ngắn gọn

```javascript
{account?.slice(0, 6)}...{account?.slice(-4)}
// "0x1D71...dce16"
```

## 7.10. Kết luận

MetaMask trong dự án này đóng vai trò là **wallet provider** để lấy wallet address của user, không phải để ký transaction hay trả phí gas. Điều này giúp:

- Xác định tác giả công thức trên blockchain
- Đơn giản hóa UX (user không cần trả phí gas)
- Tạo liên kết giữa user trong hệ thống và tác giả trên blockchain

MetaMask là công cụ quan trọng để tích hợp blockchain vào ứng dụng web, và trong dự án này, nó được sử dụng một cách hiệu quả để lấy wallet address mà không làm phức tạp trải nghiệm người dùng.

