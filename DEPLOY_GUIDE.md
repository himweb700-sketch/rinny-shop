# 📱 คำแนะนำการ Deploy rinny-shop บน Render (ฟรี!)

ไม่มีค่าใช้จ่าย ไม่ต้องบัตรเครดิต 100% ฟรี

---

## ✅ ความพร้อม

- ✅ โปรเจกต์นี้ทำให้พร้อม Deploy แล้ว
- ✅ Procfile + render.yaml พร้อมใช้
- ✅ Production-ready configuration
- ✅ HTTPS ได้ฟรี
- ✅ URL ถาวร (ไม่เปลี่ยน)

---

## 🔥 ขั้นตอนการ Deploy (ทีละขั้นตอน)

### **ขั้นตอนที่ 1: สร้าง Discord Application**

1. ไปที่ https://discord.com/developers/applications
2. คลิก **"New Application"** → ตั้งชื่อ (เช่น "Rinny Shop") → กด **Create**
3. ไปแท็บ **OAuth2** → **General** ด้านซ้าย
4. ดู **Client ID** (จดไว้ - ต้องใช้)
5. ดู **Client Secret** (คลิก "Reset Secret" → "Yes, do it!" → จดไว้ - **อย่าเอาขึ้น GitHub**)

### **ขั้นตอนที่ 2: ตั้ง Redirect URI ใน Discord**

1. ยังอยู่ที่หน้า OAuth2 → General
2. หา **Redirects** → คลิก **Add Redirect**
3. ใส่:
   ```
   https://your-app-name.onrender.com/auth/discord/callback
   ```
   *(แทน `your-app-name` ด้วยชื่อที่จะตั้งใน Render)*
4. กด **Save Changes**

### **ขั้นตอนที่ 3: สร้าง Discord Server สำหรับลูกค้า (Optional)**

1. สร้าง Discord Server ใหม่
2. ไปการตั้งค่าและเอา Invite Link
3. จดไว้ - จะต้องใส่ใน Render ภายหลัง

### **ขั้นตอนที่ 4: หา Discord User ID ของตัวเอง**

1. เปิด Discord
2. ตั้งค่า → **Advanced** → เปิด **Developer Mode** ✓
3. ไปอีก Discord Server แล้วพิมพ์: `\\@yourself` (แล้วกด Enter)
4. คัดลอกตัวเลขที่เป็น ID ของคุณ (หรือ คลิกขวา profile → Copy User ID)
5. จดไว้

### **ขั้นต���นที่ 5: เปิด GitHub**

1. เข้า https://github.com/himweb700-sketch/rinny-shop
2. ถ้ายังไม่ได้ fork ให้คลิก **Fork** → **Create fork**
3. ตรวจสอบว่า main branch มี files ทั้งหมด (ดู README.md)

### **ขั้นตอนที่ 6: สมัครสมาชิก Render**

1. ไปที่ https://render.com
2. คลิก **Sign up**
3. เลือก **Sign up with GitHub** (ใช้ GitHub account ของคุณ)
4. Authorize Render → เลือก repo `rinny-shop` → **Install**
5. เข้าสู่ระบบ Render เสร็จ

### **ขั้นตอนที่ 7: Deploy บน Render**

#### **วิธี A: ใช้ render.yaml (ง่ายที่สุด)**
1. ไปที่ https://render.com/dashboard
2. คลิก **+ New** → **Web Service**
3. เลือก **Connect a repository** → ค้นหา `rinny-shop`
4. เลือก `rinny-shop` → **Connect**
5. ระบบจะแนะนำตั้งค่า ให้กด **Deploy**
6. รอ 1-2 นาที (ถ้า build ผิดจะบอก)
7. เมื่อสำเร็จจะได้ URL แบบ: `https://your-app-name.onrender.com`

#### **วิธี B: ตั้งเองทั้งหมด (ถ้า A ไม่ได้)**
1. ไปที่ https://render.com/dashboard
2. คลิก **+ New** → **Web Service**
3. เลือก **Build and deploy from a Git repository**
4. ใส่ URL GitHub: `https://github.com/himweb700-sketch/rinny-shop`
5. ตั้งค่าดังนี้:
   - **Name**: `rinny-shop` (หรือชื่ออื่นที่ไม่ซ้ำ)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free` ✓
6. คลิก **Advanced** → **Add Environment Variable**
7. เพิ่มตัวแปรต่อไปนี้ (ดูขั้นตอนที่ 8):
   - `NODE_ENV` = `production`
   - `DISCORD_CLIENT_ID` = *(จากขั้นตอนที่ 1)*
   - `DISCORD_CLIENT_SECRET` = *(จากขั้นตอนที่ 1)*
   - `DISCORD_REDIRECT_URI` = `https://your-app-name.onrender.com/auth/discord/callback`
   - `SESSION_SECRET` = *(สุ่มค่ายาว ดูข้างล่าง)*
   - `ADMIN_DISCORD_IDS` = *(จากขั้นตอนที่ 4)*
   - `SHOP_DISCORD_INVITE` = *(จากขั้นตอนที่ 3 - optional)*

### **ขั้นตอนที่ 8: สร้าง SESSION_SECRET**

ถ้าคุณอยู่บน Mac/Linux:
```bash
openssl rand -base64 32
```

ถ้าคุณอยู่บน Windows ให้:
1. เปิด PowerShell (คลิกขวา → "Run as administrator")
2. พิมพ์:
   ```powershell
   [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```
3. คัดลอกค่าที่ออกมา

**หรือใช้เว็บ Generator:**
1. ไปที่ https://www.uuidgenerator.net/
2. สร้าง 2 ครั้ง แล้วนำมารวม
3. ก็ได้ค่าสุ่มยาวพอ ✓

### **ขั้นตอนที่ 9: ตั้ง Environment Variables ใน Render**

*(ถ้าใช้ render.yaml ก็ข้ามไป ระบบทำให้อัตโนมัติ)*

1. ใน Render Dashboard ค้นหา Service ของคุณ
2. ไปแท็บ **Environment**
3. คลิก **Add Environment Variable** ทีละตัว:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DISCORD_CLIENT_ID` | *(จากขั้นตอนที่ 1)* |
| `DISCORD_CLIENT_SECRET` | *(จากขั้นตอนที่ 1 - ลับ!)* |
| `DISCORD_REDIRECT_URI` | `https://your-app-name.onrender.com/auth/discord/callback` |
| `SESSION_SECRET` | *(จากขั้นตอนที่ 8)* |
| `ADMIN_DISCORD_IDS` | *(จากขั้นตอนที่ 4)* |
| `SHOP_DISCORD_INVITE` | *(optional - Discord Invite URL)* |
| `PORT` | `3000` |

4. กด **Save**
5. Render จะ auto-restart service (รอ 30 วินาที)

### **ขั้นตอนที่ 10: ทดสอบ Deploy**

1. ไปที่ URL ของคุณ: `https://your-app-name.onrender.com`
2. คลิกปุ่ม **"💜 เข้าสู่ระบบ"**
3. เลือก Discord account
4. ถ้าเป็น Admin (ID ตรงกัน) → ไปหน้า `/admin.html` ✅
5. ถ้าไม่ใช่ Admin → ไปหน้า `/account.html` ✅
6. ทดลองสั่งซื้อสินค้า

### **ขั้นตอนที่ 11: ตั้ค Health Check (Optional แต่แนะนำ)**

*(ทำให้ app ไม่ sleep)*

1. ไปแท็บ **Settings** ของ Render
2. หา **Health Check Path** → ใส่: `/health`
3. กด **Save**

---

## 📱 เปิดจากโทรศัพท์

หลังจาก Deploy เสร็จ:

### **iOS (iPhone/iPad)**
1. เปิด Safari
2. ไปที่ URL ของคุณ
3. คลิกปุ่มแชร์ (ช่องล่างตรงกลาง)
4. เลื่อนลงหา **Add to Home Screen**
5. ตั้งชื่อ → **Add**
6. ปิด Safari ก็มี Shortcut บน Home Screen ✓

### **Android (โทรศัพท์สำเร็จรูป)**
1. เปิด Chrome
2. ไปที่ URL ของคุณ
3. กดปุ่มเมนู (3 จุด) ด้านบนขวา
4. เลือก **Add to Home screen**
5. ตั้งชื่อ → **Install**
6. ปิด Chrome ก็มี Shortcut บน Home Screen ✓

---

## 🔧 Troubleshooting

### ❌ Build Failed
**ปัญหา**: Deploy ไม่สำเร็จ
**วิธีแก้**:
1. ไปแท็บ **Logs**
2. อ่าน error message
3. ตรวจสอบ:
   - `package.json` มี dependencies ครบไหม
   - `server.js` syntax ถูกไหม
   - Environment Variables ครบไหม
4. คลิก **Manual Deploy** → **Deploy latest commit**

### ❌ Redirect URI not matching
**ปัญหา**: เข้าสู่ระบบแล้ว error
**วิธีแก้**:
1. ตรวจสอบ URL ที่ได้จาก Render
2. ไปแก้ใน Discord Application OAuth2 Settings
3. ตรวจสอบให้แน่ใจว่า `DISCORD_REDIRECT_URI` ตรงกัน

### ❌ 404 Not Found
**ปัญหา**: เปิด URL แล้วได้หน้าว่าง
**วิธีแก้**:
1. รอ 1-2 นาที (ให้ server start เสร็จ)
2. ตรวจสอบใน Logs ว่า Build สำเร็จหรือเปล่า
3. ถ้า `Rinny Shop running on port 3000` ขึ้นมา ก็ OK แล้ว

### ❌ Database ว่าง (ไม่มีสินค้า)
**ปัญหา**: เข้าเว็บแล้วไม่มีสินค้าแสดง
**วิธีแก้**:
1. ครั้งแรกเมื่อเปิด จะสร้างสินค้าอัตโนมัติ
2. ลองปิด browser แล้วเปิดใหม่
3. ถ้ายังไม่มี ให้ใช้ Admin Panel เพิ่มสินค้า

---

## 💡 Tips

- **URL เปลี่ยนแปลง?** ไม่ Render ให้ URL ถาวร ถ้า service ชื่อเดียวกัน
- **ต้องการชื่อ Custom?** ลงทะเบียน domain และ point ไป Render (ถ้าจ่ายค่า hosting)
- **Database ลบไปหรือเปล่า?** ดู Logs ตรวจสอบ
- **เปลี่ยน Admin ID?** ไปแก้ `ADMIN_DISCORD_IDS` ใน Render Environment Variables แล้วกด Save

---

## ✅ แล้วถ้าเทียบเสร็จแล้ว?

**ยินดีด้วย! เว็บร้านของคุณขึ้นไปแล้ว!** 🎉

ตอนนี้คุณได้:
- ✅ URL ถาวรให้เปิดได้จากโทรศัพท์
- ✅ HTTPS ฟรี
- ✅ ระบบ OAuth2 Discord ปลอดภัย
- ✅ ระบบออเดอร์ที่ทำงาน
- ✅ Admin Dashboard เต็มฟังก์ชั่น
- ✅ **ฟรี! ไม่มีค่าใช้จ่าย!**

---

## 📧 ติดต่อและการสนับสนุน

หากมีปัญหา:
- ✅ ดู Logs ใน Render Dashboard
- ✅ ตรวจสอบ Environment Variables
- ✅ ลองหา error ใน DevTools (F12 → Console)
- ✅ ลองทำความสะอาด: Settings → Delete Service → สร้างใหม่

---

**Happy deploying! 🚀🌷**
