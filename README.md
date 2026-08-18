# Rinny Shop — Full Stack Discord Store 🌷

> A complete, production-ready Discord-based e-commerce platform with admin dashboard, user authentication via Discord OAuth2, and SQLite database.

## ✨ Features

- 🔐 **Discord OAuth2 Authentication** - Secure login via Discord
- 👥 **Customer Management** - Browse products, create orders, view order history
- ⚙️ **Admin Dashboard** - Manage products, view orders, change order status
- 💾 **SQLite Database** - Lightweight, file-based database
- 🎨 **Responsive UI** - Works on desktop and mobile devices
- 🚀 **Production-Ready** - Deployed on Render with HTTPS & monitoring

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite with better-sqlite3
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Authentication**: Discord OAuth2
- **Deployment**: Render.com (Free tier)

## 📦 What's Included

### Customer Features
- Login with Discord
- Browse available products
- Create orders
- View order history
- Logout

### Admin Features
- Admin-only dashboard
- Add/edit/delete products
- View all orders
- Change order status (pending → paid → processing → completed)
- View shop statistics (orders, sales, customers, pending)
- Invite Discord bot to server (future feature)

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+ and npm
- Discord Application (create at https://discord.com/developers)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/himweb700-sketch/rinny-shop.git
   cd rinny-shop
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Setup Discord Application
   - Visit https://discord.com/developers/applications
   - Click "New Application" and name it
   - Go to OAuth2 → General
   - Save your **Client ID** and **Client Secret**
   - Add Redirect URI: `http://localhost:3000/auth/discord/callback`

4. Create `.env` file
   ```bash
   cp .env.example .env
   ```

5. Fill in `.env` with your Discord credentials
   ```env
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_CLIENT_SECRET=your_client_secret
   DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
   SESSION_SECRET=your_random_secret_here
   ADMIN_DISCORD_IDS=your_discord_id
   SHOP_DISCORD_INVITE=your_discord_invite_link
   ```

6. Get your Discord User ID
   - Open Discord
   - User Settings → Advanced → Enable Developer Mode
   - Right-click your username → Copy User ID
   - Paste it in `ADMIN_DISCORD_IDS`

7. Start the server
   ```bash
   npm start
   ```

8. Open http://localhost:3000 in your browser

## 🌐 Deployment on Render (Free!)

See **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** for complete step-by-step instructions.

### Quick Summary
1. Create Discord OAuth Application
2. Sign up on Render.com with GitHub
3. Connect your GitHub repository
4. Set Environment Variables
5. Deploy!

## 📱 Mobile Access

After deploying to Render, access your shop from any phone:

**iPhone/iPad:**
1. Open Safari → Your Render URL
2. Tap Share button → Add to Home Screen
3. Install as app

**Android:**
1. Open Chrome → Your Render URL
2. Menu (⋮) → Add to Home Screen
3. Install as app

## 📝 API Endpoints

### Public Routes
- `GET /health` - Server health check
- `GET /api/products` - List all active products
- `GET /api/me` - Current user info
- `GET /auth/discord` - Start Discord OAuth login
- `GET /auth/discord/callback` - Discord OAuth callback
- `POST /auth/logout` - Logout

### Protected Routes (Login Required)
- `POST /api/orders` - Create new order
- `GET /api/my-orders` - Get user's orders

### Admin Routes (Admin Only)
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/:id` - Update order status
- `POST /api/admin/products` - Add new product
- `PATCH /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/stats` - Get shop statistics

## 🔒 Security

- ✅ Session-based authentication
- ✅ HTTPS on production (Render provides free SSL)
- ✅ CSRF protection via SameSite cookies
- ✅ Input validation on all endpoints
- ✅ Admin verification via Discord ID
- ✅ No secrets committed to Git (.env is in .gitignore)

## ⚠️ Important Notes

- **Payment**: This system doesn't handle actual payments yet. Orders are created but not charged. To accept payments, integrate a payment gateway like Stripe or Promptpay.
- **Database**: Using SQLite means data is stored in a file. In production, consider migrating to PostgreSQL for scalability.
- **Admin ID**: Update `ADMIN_DISCORD_IDS` in Render dashboard to change admins
- **Invite Link**: Optional - set `SHOP_DISCORD_INVITE` to guide customers to your Discord server

## 🐛 Troubleshooting

### "Redirect URI mismatch" error
- Make sure `DISCORD_REDIRECT_URI` in `.env` matches the redirect URI in Discord Application settings
- For Render: `https://your-app-name.onrender.com/auth/discord/callback`

### No products showing
- Products are seeded automatically on first run
- Check database file: `rinny-shop.db` should exist
- Use Admin panel to add products manually if needed

### Admin dashboard not accessible
- Verify your Discord ID is correct in `ADMIN_DISCORD_IDS`
- Make sure Discord IDs are comma-separated if multiple admins
- Clear browser cache and login again

## 📚 Project Structure

```
rinny-shop/
├── server.js           # Express server with all API routes
├── index.html          # Customer homepage
├── account.html        # Customer account page
├── admin.html          # Admin dashboard
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── Procfile            # Heroku/Render configuration
├── render.yaml         # Render.com deployment config
├── DEPLOY_GUIDE.md     # Step-by-step deployment guide
└── README.md           # This file
```

## 📈 Future Features

- [ ] Payment gateway integration (Stripe/Promptpay)
- [ ] Email notifications for orders
- [ ] Discord bot for order notifications
- [ ] Customer support tickets
- [ ] Product categories
- [ ] Customer reviews/ratings
- [ ] Inventory management
- [ ] Analytics dashboard

## 💡 Tips

- **Development**: Use `npm run dev` with auto-reload (install nodemon)
- **Database**: SQLite database persists in `rinny-shop.db`
- **Logs**: Check Render dashboard Logs tab for errors
- **Performance**: Database has indexes for faster queries

## 📧 Support

For issues or questions:
1. Check the [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) Troubleshooting section
2. Review GitHub Issues
3. Check Render dashboard logs for error messages

## 📄 License

MIT

## 🎉 Credits

Built with ❤️ for Rinny's Discord Shop

---

**Ready to deploy?** → [Go to DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
