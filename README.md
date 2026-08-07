# Rinny Shop — Full Stack Starter 🌷

สิ่งที่มี:
- ลูกค้าล็อกอินด้วย Discord OAuth2
- ลูกค้าดูสินค้า / สร้างออเดอร์ / ดูประวัติออเดอร์
- กดสั่งซื้อแล้วเปิด Discord ร้าน
- แอดมินล็อกอินด้วย Discord และตรวจสิทธิ์จาก Discord User ID
- Admin dashboard
- แอดมินเพิ่ม / แก้ชื่อ / แก้รายละเอียด / แก้ราคา / ลบสินค้า
- แอดมินเปลี่ยนสถานะออเดอร์
- SQLite เก็บสินค้าและออเดอร์
- Session login

## วิธีเริ่ม

1. ติดตั้ง Node.js 20+ (แนะนำ)
2. เปิด terminal ในโฟลเดอร์นี้ แล้วรัน:
   npm install
3. คัดลอก `.env.example` เป็น `.env`
4. สร้าง Discord Application และเปิด OAuth2
5. ตั้ง Redirect URI ให้ตรงกับ:
   http://localhost:3000/auth/discord/callback
6. ใส่ Client ID / Client Secret ใน `.env`
7. ใส่ Discord User ID ของรินใน `ADMIN_DISCORD_IDS`
8. รัน:
   npm start
9. เปิด:
   http://localhost:3000

## สำคัญก่อนขึ้นเว็บจริง

- เปลี่ยน `SESSION_SECRET` เป็นค่าสุ่มยาว ๆ
- ใช้ HTTPS ตอน deploy จริง
- ตั้ง cookie `secure:true` เมื่อเว็บเป็น HTTPS
- อย่าเอา `DISCORD_CLIENT_SECRET` ขึ้น GitHub หรือส่งให้คนอื่น
- ระบบนี้ยังไม่มี payment gateway จริง; ออเดอร์จะถูกสร้างและพาไป Discord
- ถ้าจะรับเงินจริง ควรเชื่อม payment gateway ที่รองรับในประเทศ/บัญชีของร้าน และตรวจ webhook ฝั่ง server


### แอดมินที่ตั้งไว้ในตัวอย่างนี้
Discord User ID: `1533794186241773775`
