import express from "express";
import session from "express-session";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const db = new Database("rinny-shop.db");
const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// Trust proxy for HTTPS detection
if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files
app.use(express.static(__dirname, { 
  maxAge: isProduction ? "1d" : "0",
  etag: false 
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "dev-only-change-me-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, 
    sameSite: "lax", 
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/"
  },
  name: "rinny_session"
}));

// Database initialization
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS products(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '',
 price INTEGER NOT NULL DEFAULT 0,
 icon TEXT NOT NULL DEFAULT '✨',
 active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS orders(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id TEXT NOT NULL,
 username TEXT NOT NULL,
 product_id INTEGER NOT NULL,
 product_name TEXT NOT NULL,
 price INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
`);

// Seed initial products
const count = db.prepare("SELECT COUNT(*) AS c FROM products").get();
if (count.c === 0) {
  const add = db.prepare(`
    INSERT INTO products (name, description, price, icon)
    VALUES (?, ?, ?, ?)
  `);
  const products = [
    ["Kawaii Server", "เซิร์ฟเวอร์น่ารัก พร้อมคอมมูนิตี้อบอุ่น", 150, "✨"],
    ["Gaming Server", "เซิร์ฟเวอร์สายเกม พร้อมห้องกิจกรรม", 800, "🎮"],
    ["Chill Community", "พื้นที่พูดคุยชิล ๆ หาเพื่อนและทำกิจกรรม", 300, "🌿"],
    ["Server Setup", "ช่วยจัดหมวด ห้อง และพื้นฐานเซิร์ฟเวอร์", 399, "🛠️"]
  ];
  for (const product of products) add.run(...product);
}

// Helpers
const adminIds = () => (process.env.ADMIN_DISCORD_IDS || "").split(",").map(x => x.trim()).filter(Boolean);
const isAdmin = req => !!req.session.user && adminIds().includes(req.session.user.id);
const requireLogin = (req, res, next) => req.session.user ? next() : res.status(401).json({ error: "กรุณาเข้าสู่ระบบด้วย Discord" });
const requireAdmin = (req, res, next) => isAdmin(req) ? next() : res.status(403).json({ error: "เฉพาะแอดมินเท่านั้น" });

// Error handler wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Routes
app.get("/health", (req, res) => res.json({ status: "ok", env: NODE_ENV }));

app.get("/auth/discord", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID || "",
    response_type: "code",
    redirect_uri: process.env.DISCORD_REDIRECT_URI || "",
    scope: "identify"
  });
  res.redirect("https://discord.com/oauth2/authorize?" + params.toString());
});

app.get("/auth/discord/callback", asyncHandler(async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect("/?login=cancelled");
  
  try {
    const body = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID || "",
      client_secret: process.env.DISCORD_CLIENT_SECRET || "",
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI || ""
    });
    
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    
    const token = await tokenRes.json();
    if (!token.access_token) throw new Error("Discord OAuth token failed");
    
    const meRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });
    
    const me = await meRes.json();
    req.session.user = { 
      id: me.id, 
      username: me.username, 
      global_name: me.global_name, 
      avatar: me.avatar 
    };
    res.redirect(isAdmin(req) ? "/admin.html" : "/account.html");
  } catch (e) {
    console.error("OAuth error:", e.message);
    res.redirect("/?login=error");
  }
}));

app.post("/auth/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ ok: true });
  });
});

app.get("/api/me", (req, res) => {
  res.json({ user: req.session.user || null, admin: isAdmin(req) });
});

app.get("/api/products", asyncHandler(async (req, res) => {
  const products = db.prepare("SELECT * FROM products WHERE active=1 ORDER BY id DESC").all();
  res.json(products);
}));

app.post("/api/orders", requireLogin, asyncHandler(async (req, res) => {
  const id = Number(req.body.productId);
  const p = db.prepare("SELECT * FROM products WHERE id=? AND active=1").get(id);
  if (!p) return res.status(404).json({ error: "ไม่พบสินค้า" });
  
  const result = db.prepare(`
    INSERT INTO orders(user_id,username,product_id,product_name,price,created_at,updated_at)
    VALUES(?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
  `).run(req.session.user.id, req.session.user.username, p.id, p.name, p.price);
  
  res.json({ ok: true, orderId: result.lastInsertRowid, discordInvite: process.env.SHOP_DISCORD_INVITE });
}));

app.get("/api/my-orders", requireLogin, asyncHandler(async (req, res) => {
  const orders = db.prepare("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC").all(req.session.user.id);
  res.json(orders);
}));

app.get("/api/admin/orders", requireAdmin, asyncHandler(async (req, res) => {
  const orders = db.prepare("SELECT * FROM orders ORDER BY id DESC").all();
  res.json(orders);
}));

app.patch("/api/admin/orders/:id", requireAdmin, asyncHandler(async (req, res) => {
  const allowed = ["pending", "paid", "processing", "completed", "cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "สถานะไม่ถูกต้อง" });
  
  db.prepare("UPDATE orders SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").run(req.body.status, Number(req.params.id));
  res.json({ ok: true });
}));

app.post("/api/admin/products", requireAdmin, asyncHandler(async (req, res) => {
  const { name, description = "", price = 0, icon = "✨" } = req.body;
  if (!name || name.length < 2) return res.status(400).json({ error: "ต้องมีชื่อสินค้า (อย่างน้อย 2 ตัวอักษร)" });
  if (price < 0) return res.status(400).json({ error: "ราคาต้องเป็นจำนวนบวก" });
  
  const r = db.prepare(`
    INSERT INTO products(name,description,price,icon,created_at,updated_at)
    VALUES(?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
  `).run(name, description, Math.max(0, Number(price) || 0), icon);
  
  res.json(db.prepare("SELECT * FROM products WHERE id=?").get(r.lastInsertRowid));
}));

app.patch("/api/admin/products/:id", requireAdmin, asyncHandler(async (req, res) => {
  const p = db.prepare("SELECT * FROM products WHERE id=?").get(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "ไม่พบสินค้า" });
  
  const name = req.body.name ?? p.name;
  const description = req.body.description ?? p.description;
  const price = Math.max(0, Number(req.body.price ?? p.price) || 0);
  const icon = req.body.icon ?? p.icon;
  
  if (name.length < 2) return res.status(400).json({ error: "ชื่อสินค้าต้องมีอย่างน้อย 2 ตัวอักษร" });
  
  db.prepare("UPDATE products SET name=?,description=?,price=?,icon=?,updated_at=CURRENT_TIMESTAMP WHERE id=?")
    .run(name, description, price, icon, p.id);
  
  res.json(db.prepare("SELECT * FROM products WHERE id=?").get(p.id));
}));

app.delete("/api/admin/products/:id", requireAdmin, asyncHandler(async (req, res) => {
  db.prepare("UPDATE products SET active=0, updated_at=CURRENT_TIMESTAMP WHERE id=?").run(Number(req.params.id));
  res.json({ ok: true });
}));

app.get("/api/admin/stats", requireAdmin, asyncHandler(async (req, res) => {
  const orders = db.prepare("SELECT COUNT(*) c FROM orders").get().c;
  const sales = db.prepare("SELECT COALESCE(SUM(price),0) s FROM orders WHERE status IN ('paid','processing','completed')").get().s;
  const customers = db.prepare("SELECT COUNT(DISTINCT user_id) c FROM orders").get().c;
  const pending = db.prepare("SELECT COUNT(*) c FROM orders WHERE status='pending'").get().c;
  res.json({ orders, sales, customers, pending });
}));

app.get("/invite/bot", (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID || "";
  if (!clientId) return res.status(500).json({ error: "DISCORD_CLIENT_ID is not configured" });
  
  const permissions = String(req.query.permissions || process.env.DISCORD_BOT_PERMISSIONS || "0");
  const params = new URLSearchParams({
    client_id: clientId,
    scope: "bot applications.commands",
    permissions
  });
  res.redirect("https://discord.com/oauth2/authorize?" + params.toString());
});

// 404 handler
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ error: "Endpoint not found" });
  } else {
    res.status(404).sendFile(path.join(__dirname, "index.html"));
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  if (req.path.startsWith("/api/")) {
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  } else {
    res.status(err.status || 500).send("Internal server error");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Rinny Shop running on port ${PORT} (${NODE_ENV})`);
});
