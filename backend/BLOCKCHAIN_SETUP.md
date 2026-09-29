# Hướng Dẫn Setup Blockchain cho Bảo vệ Bản quyền Công thức

## Tổng quan

Hệ thống sử dụng blockchain (Ganache) để bảo vệ bản quyền công thức nấu ăn bằng cách:
- Lưu hash SHA256 của công thức lên blockchain
- Ghi nhận tác giả và thời điểm tạo
- Không thể chỉnh sửa hoặc xóa sau khi đã ghi

## Yêu cầu

1. **Ganache** - Local blockchain (https://www.trufflesuite.com/ganache)
2. **MetaMask** - Browser extension (https://metamask.io/)
3. **Node.js** và npm đã cài đặt

## Bước 1: Cài đặt Ganache

1. Tải và cài đặt Ganache từ: https://www.trufflesuite.com/ganache
2. Mở Ganache và tạo workspace mới
3. Đảm bảo port là **8545** (mặc định)
4. Lưu workspace và ghi nhớ mnemonic phrase

## Bước 2: Cấu hình .env

Thêm các biến sau vào file `backend/.env`:

```env
# Ganache Connection
GANACHE_URL=http://localhost:8545
GANACHE_NETWORK_ID=5777

# Private Key từ Ganache
# Lấy từ: Ganache UI > Accounts tab > Click icon key bên cạnh account đầu tiên
GANACHE_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Contract Address (sẽ được set sau khi deploy)
RECIPE_REGISTRY_ADDRESS=
```

### Lấy Private Key từ Ganache:

1. Mở Ganache
2. Vào tab **Accounts**
3. Click icon **key** (🔑) bên cạnh account đầu tiên
4. Copy private key và paste vào `.env`

## Bước 3: Deploy Smart Contract

Có 2 cách để deploy contract:

### Cách 1: Sử dụng Remix IDE (Khuyến nghị)

1. Mở https://remix.ethereum.org/
2. Tạo file mới: `RecipeRegistry.sol`
3. Copy nội dung từ `backend/contracts/RecipeRegistry.sol`
4. Chọn compiler version: **0.8.0** hoặc cao hơn
5. Click **Compile**
6. Vào tab **Deploy & Run Transactions**
7. Chọn environment: **Injected Web3** (kết nối MetaMask)
8. Hoặc chọn **Web3 Provider** và nhập: `http://localhost:8545`
9. Click **Deploy**
10. Copy **contract address** và thêm vào `.env`:
    ```
    RECIPE_REGISTRY_ADDRESS=0x...
    ```

### Cách 2: Sử dụng Script (Cần compile trước)

1. Compile contract bằng solc hoặc Remix
2. Lưu bytecode vào `backend/contracts/RecipeRegistry.bytecode`
3. Lưu ABI vào `backend/contracts/RecipeRegistry.abi.json`
4. Chạy script:
   ```bash
   node backend/scripts/deploy-contract.js
   ```

## Bước 4: Test Kết nối

Chạy script test để kiểm tra:

```bash
node backend/scripts/test-blockchain.js
```

Script sẽ kiểm tra:
- ✅ Kết nối Ganache
- ✅ Khởi tạo blockchain service
- ✅ Tạo hash công thức
- ✅ Verify contract

## Bước 5: Cấu hình MetaMask

1. Cài đặt MetaMask extension cho browser
2. Tạo account mới hoặc import account từ Ganache
3. Thêm Ganache network:
   - Network Name: `Ganache Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `5777`
   - Currency Symbol: `ETH`
4. Import account từ Ganache:
   - Ganache UI > Accounts > Click key icon
   - Copy private key
   - MetaMask > Import Account > Paste private key

## Bước 6: Khởi động Server

```bash
# Backend
cd backend
npm install  # Nếu chưa cài
npm run dev

# Frontend (terminal khác)
cd client
npm install  # Nếu chưa cài
npm run dev
```

## Sử dụng

### Tạo công thức với Blockchain

1. Đăng nhập vào website
2. Vào **Đăng công thức**
3. Điền thông tin công thức
4. Ở bước **Xem trước**, click **Kết nối MetaMask**
5. Chọn account trong MetaMask
6. Click **Gửi duyệt**
7. Hash công thức sẽ được tự động ghi lên blockchain

### Xem thông tin Blockchain

- Trên trang chi tiết công thức, nếu đã được verify sẽ hiển thị badge **"Verified on Blockchain"**
- Click vào để xem:
  - Transaction Hash
  - Block Number
  - Thời điểm đăng ký

## Troubleshooting

### Lỗi: "Cannot connect to Ganache"
- ✅ Kiểm tra Ganache đang chạy trên port 8545
- ✅ Kiểm tra `GANACHE_URL` trong `.env`

### Lỗi: "Contract instance not initialized"
- ✅ Kiểm tra `RECIPE_REGISTRY_ADDRESS` đã được set trong `.env`
- ✅ Đảm bảo contract đã được deploy

### Lỗi: "Transaction failed"
- ✅ Kiểm tra account có đủ ETH (Ganache tự động có 100 ETH)
- ✅ Kiểm tra private key đúng

### MetaMask không kết nối được
- ✅ Kiểm tra MetaMask đã cài đặt
- ✅ Kiểm tra network đã được thêm vào MetaMask
- ✅ Thử refresh trang

## Lưu ý

1. **Ganache là local blockchain** - Chỉ dùng cho development
2. **Private keys trong Ganache không bảo mật** - Chỉ dùng cho testing
3. **Graceful degradation** - Nếu blockchain fail, hệ thống vẫn lưu vào MongoDB
4. **Hash được tính tự động** - Không cần can thiệp thủ công

## Files liên quan

- `backend/contracts/RecipeRegistry.sol` - Smart Contract
- `backend/services/blockchainService.js` - Service tương tác blockchain
- `backend/config/blockchain.js` - Cấu hình blockchain
- `backend/utils/hashUtils.js` - Utility tính hash
- `client/src/hooks/useMetaMask.js` - Hook kết nối MetaMask

## Support

Nếu gặp vấn đề, kiểm tra:
1. Console logs của backend
2. MetaMask console
3. Ganache logs
4. Network tab trong browser DevTools

