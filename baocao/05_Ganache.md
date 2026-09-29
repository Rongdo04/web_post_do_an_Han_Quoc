# 5. GANACHE

## 5.1. Giới thiệu Ganache

### 5.1.1. Ganache là gì?

Ganache là một công cụ phát triển blockchain local, cho phép tạo một mạng Ethereum riêng trên máy tính của bạn. Nó được phát triển bởi Truffle Suite và cung cấp:

- **Local Blockchain Network**: Mạng blockchain chạy trên localhost
- **Pre-funded Accounts**: Tự động tạo accounts với ETH để test
- **Fast Block Time**: Block time = 0 (instant confirmation)
- **No Gas Cost**: Miễn phí gas, không tốn phí thật

### 5.1.2. Các phiên bản Ganache

1. **Ganache GUI**: Giao diện đồ họa, dễ sử dụng
2. **Ganache CLI**: Command line interface, phù hợp cho automation

**Dự án này sử dụng:** Ganache GUI (dễ setup và debug)

## 5.2. Vai trò của Ganache trong dự án

### 5.2.1. Local Blockchain Network

Ganache đóng vai trò là **blockchain network** cho môi trường development:

- **Thay thế Mainnet**: Không cần kết nối Ethereum mainnet (tốn phí)
- **Thay thế Testnet**: Không cần đợi đồng bộ testnet
- **Nhanh chóng**: Block time = 0, transaction confirm ngay lập tức
- **Kiểm soát hoàn toàn**: Có thể reset, tạo accounts mới bất cứ lúc nào

### 5.2.2. Development và Testing

- **Deploy Smart Contract**: Deploy contract lên Ganache để test
- **Test Transactions**: Gửi transaction không tốn phí
- **Debug**: Dễ dàng debug với Ganache UI
- **Reset**: Có thể reset blockchain về trạng thái ban đầu

## 5.3. Cài đặt và cấu hình

### 5.3.1. Cài đặt Ganache GUI

1. **Download:**
   - Truy cập: https://trufflesuite.com/ganache/
   - Download Ganache GUI cho Windows/Mac/Linux

2. **Cài đặt:**
   - Chạy installer
   - Khởi động Ganache GUI

3. **Tạo Workspace mới:**
   - Click "New Workspace"
   - Đặt tên workspace (ví dụ: "Recipe Registry")
   - Chọn port: `7545` (mặc định) hoặc `8545`
   - Click "Save Workspace"

### 5.3.2. Cấu hình cơ bản

**Workspace Settings:**
```
Server:
  Hostname: 127.0.0.1
  Port: 7545 (hoặc 8545)
  Network ID: 5777 (mặc định)

Accounts & Keys:
  Number of accounts: 10 (mặc định)
  Default balance: 100 ETH
  Automatically generate accounts: ✓
```

**Lưu ý:**
- **Port 7545**: Ganache GUI mặc định
- **Port 8545**: Ganache CLI mặc định (hoặc có thể config trong GUI)
- **Network ID**: 5777 (mặc định) hoặc có thể tùy chỉnh

### 5.3.3. Accounts

Ganache tự động tạo 10 accounts với:
- **Balance**: 100 ETH mỗi account
- **Private Key**: Hiển thị trong tab "Accounts" (click icon key)
- **Address**: Địa chỉ ví (bắt đầu với `0x`)

**Ví dụ Account:**
```
Address: 0x1D7107c7ac42fdb28b10aa3badc08020248dce16
Private Key: 0x1234567890abcdef... (lấy từ Ganache UI)
Balance: 100 ETH
```

## 5.4. Kết nối với Backend

### 5.4.1. Cấu hình trong Backend

**File:** `backend/config/blockchain.js`

```javascript
export const blockchainConfig = {
  // URL kết nối Ganache
  ganacheUrl: process.env.GANACHE_URL || "http://127.0.0.1:7545",
  
  // Network ID
  networkId: process.env.GANACHE_NETWORK_ID || 5777,
  
  // Private key của account dùng để gửi transaction
  privateKey: process.env.GANACHE_PRIVATE_KEY || "",
  
  // Contract address (sẽ được set sau khi deploy)
  contractAddress: process.env.RECIPE_REGISTRY_ADDRESS || "",
  
  // Gas limit
  gasLimit: 300000,
};
```

### 5.4.2. Environment Variables

**File:** `backend/.env`

```env
# Ganache Configuration
GANACHE_URL=http://127.0.0.1:7545
GANACHE_NETWORK_ID=5777
GANACHE_PRIVATE_KEY=0x1234567890abcdef... (lấy từ Ganache UI)

# Contract Address (sau khi deploy)
RECIPE_REGISTRY_ADDRESS=0x06B6b1FAe3EB1198ca81aBc540cbB67100Ed0540
```

**Cách lấy Private Key:**
1. Mở Ganache GUI
2. Tab "Accounts"
3. Click icon key bên cạnh account
4. Copy private key
5. Paste vào `.env`

### 5.4.3. Kiểm tra kết nối

**Backend code:** `backend/services/blockchainService.js`

```javascript
async function initializeBlockchain() {
  // Khởi tạo Web3 instance
  web3 = new Web3(blockchainConfig.ganacheUrl);
  
  // Kiểm tra kết nối
  const isConnected = await web3.eth.net.isListening();
  if (!isConnected) {
    throw new Error("Cannot connect to Ganache");
  }
  
  // Lấy account từ private key
  const account = web3.eth.accounts.privateKeyToAccount(
    blockchainConfig.privateKey
  );
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  
  return { success: true, account: account.address };
}
```

## 5.5. Deploy Smart Contract lên Ganache

### 5.5.1. Sử dụng Remix IDE

1. **Mở Remix IDE:**
   - Truy cập: https://remix.ethereum.org/
   - Tạo file mới: `RecipeRegistry.sol`
   - Copy code từ `backend/contracts/RecipeRegistry.sol`

2. **Compile:**
   - Tab "Solidity Compiler"
   - Compiler version: `0.8.0` hoặc `0.8.20`
   - EVM version: `istanbul` hoặc `berlin` (quan trọng!)
   - Click "Compile RecipeRegistry.sol"

3. **Deploy:**
   - Tab "Deploy & Run Transactions"
   - Environment: "Injected Provider - MetaMask" hoặc "Web3 Provider"
   - Nếu dùng Web3 Provider: URL = `http://127.0.0.1:7545`
   - Chọn account (từ Ganache)
   - Click "Deploy"
   - Copy contract address

4. **Lưu Contract Address:**
   - Thêm vào `.env`: `RECIPE_REGISTRY_ADDRESS=0x...`

### 5.5.2. Sử dụng Script (Node.js)

**File:** `backend/scripts/deploy-contract.js`

```javascript
import { Web3 } from "web3";
import fs from "fs";
import path from "path";

const ganacheUrl = "http://127.0.0.1:7545";
const privateKey = process.env.GANACHE_PRIVATE_KEY;

// Load contract bytecode và ABI
const contractPath = path.join(process.cwd(), "contracts", "RecipeRegistry.sol");
// ... compile và deploy

console.log("Contract deployed at:", contractAddress);
```

## 5.6. Cấu hình MetaMask

### 5.6.1. Thêm Ganache Network vào MetaMask

1. **Mở MetaMask:**
   - Click icon MetaMask
   - Click "Settings" > "Networks" > "Add Network"

2. **Thông tin Network:**
   ```
   Network Name: Ganache Local
   RPC URL: http://127.0.0.1:7545
   Chain ID: 5777
   Currency Symbol: ETH
   ```

3. **Import Account:**
   - Click "Import Account"
   - Paste private key từ Ganache
   - Account sẽ xuất hiện với balance 100 ETH

### 5.6.2. Lưu ý

- **Chain ID**: Phải khớp với Network ID trong Ganache (5777)
- **RPC URL**: Phải khớp với port Ganache đang chạy
- **Private Key**: Chỉ dùng cho development, không dùng trên mainnet!

## 5.7. Troubleshooting

### 5.7.1. Lỗi "Cannot connect to Ganache"

**Nguyên nhân:**
- Ganache chưa chạy
- Port không đúng
- Firewall chặn

**Giải pháp:**
1. Kiểm tra Ganache đang chạy
2. Kiểm tra port trong `.env` khớp với Ganache
3. Thử kết nối: `curl http://127.0.0.1:7545`

### 5.7.2. Lỗi "Gas estimation failed"

**Nguyên nhân:**
- EVM version không khớp
- Contract chưa được deploy
- Private key sai

**Giải pháp:**
1. Kiểm tra EVM version trong Remix (dùng `istanbul` hoặc `berlin`)
2. Đảm bảo contract đã được deploy
3. Kiểm tra private key trong `.env`

### 5.7.3. Lỗi "Invalid opcode"

**Nguyên nhân:**
- EVM version quá mới (ví dụ: 0.8.30)
- Ganache không hỗ trợ opcode mới

**Giải pháp:**
- Đổi EVM version trong Remix về `istanbul` hoặc `berlin`
- Hoặc nâng cấp Ganache lên phiên bản mới hơn

### 5.7.4. Transaction không confirm

**Nguyên nhân:**
- Ganache bị treo
- Gas limit quá thấp

**Giải pháp:**
1. Restart Ganache
2. Tăng gas limit trong config
3. Kiểm tra logs trong Ganache UI

## 5.8. So sánh với Mainnet/Testnet

### 5.8.1. Bảng so sánh

| Tiêu chí | Ganache | Testnet | Mainnet |
|----------|---------|---------|---------|
| **Chi phí** | Miễn phí | Miễn phí | Tốn phí |
| **Tốc độ** | ⚡⚡⚡ Instant | ⚡⚡ 12-15s | ⚡⚡ 12-15s |
| **Block Time** | 0s | ~12s | ~12s |
| **Gas Price** | 0 | Thấp | Cao |
| **Stability** | ✅ Ổn định | ⚠️ Có thể down | ✅ Ổn định |
| **Reset** | ✅ Có thể | ❌ Không | ❌ Không |
| **Accounts** | ✅ Tự tạo | ⚠️ Cần faucet | ❌ Cần mua ETH |

### 5.8.2. Khi nào dùng Ganache?

**Nên dùng Ganache khi:**
- ✅ Development và testing
- ✅ Cần test nhanh
- ✅ Không muốn tốn phí
- ✅ Cần reset blockchain

**Không nên dùng Ganache khi:**
- ❌ Production (dùng mainnet)
- ❌ Cần test với nhiều node
- ❌ Cần test network congestion

## 5.9. Best Practices

### 5.9.1. Development Workflow

1. **Khởi động Ganache trước khi chạy backend**
2. **Deploy contract một lần**, lưu address vào `.env`
3. **Reset Ganache** khi cần test lại từ đầu
4. **Backup private keys** nếu cần giữ lại accounts

### 5.9.2. Security

- **Không commit private keys** vào git
- **Dùng `.env`** để lưu sensitive data
- **Không dùng Ganache accounts** trên mainnet
- **Reset Ganache** trước khi demo

### 5.9.3. Performance

- **Ganache nhanh**, nhưng vẫn có giới hạn
- **Không nên gửi quá nhiều transaction** cùng lúc
- **Reset Ganache** nếu blockchain quá lớn

## 5.10. Kết luận

Ganache là công cụ không thể thiếu trong quá trình phát triển dự án blockchain. Nó cung cấp:
- Môi trường development an toàn và miễn phí
- Tốc độ nhanh cho testing
- Kiểm soát hoàn toàn blockchain network
- Dễ dàng debug và troubleshoot

Trong dự án này, Ganache đóng vai trò là nền tảng blockchain để test và phát triển tính năng bảo vệ bản quyền công thức trước khi deploy lên mainnet.

