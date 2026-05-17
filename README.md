# OpCertMS — Operation Certificate Management System

## Deploy lên Vercel (5 phút)

### Bước 1: Tạo tài khoản JSONBin.io (lưu data)
1. Vào https://jsonbin.io → Sign Up (miễn phí)
2. Dashboard → **API Keys** → Copy **X-Master-Key**
3. Nhấn **+ Create Bin** → tên "OpCertMS" → nội dung `{}` → Create
4. Copy **Bin ID** từ URL (VD: `64abc123def456789`)

### Bước 2: Deploy lên Vercel
1. Push folder này lên GitHub (repo mới)
2. Vào https://vercel.com → New Project → Import repo
3. **Framework Preset**: Other
4. **Output Directory**: `public`
5. Deploy!

### Bước 3: Cấu hình trong app
1. Mở URL Vercel vừa deploy
2. Đăng nhập: `admin` / `admin123`
3. Vào **Cài đặt → Đồng bộ dữ liệu**
4. Nhập Bin ID + API Key → Lưu → Đẩy dữ liệu

## Tài khoản mặc định
| Username | Password | Quyền |
|----------|----------|-------|
| admin | admin123 | 👑 Toàn quyền |
| trainer | trainer123 | ✏ Cấp CC + Gia hạn |
| viewer | viewer123 | 👁 Chỉ xem |

## Cấu trúc project
```
opcertms/
├── public/
│   └── index.html     ← Web app
├── api/
│   ├── sync.js        ← API đồng bộ data
│   └── photo.js       ← API đồng bộ ảnh
├── vercel.json
└── package.json
```
