# Production PM2 — no domain (open by server IP)

Replace `SERVER_IP` with the VPS public IP before building the Next apps.

| App | Port |
|---|---|
| Website | **3018** |
| Dashboard | **3019** |
| API | **3020** |

```bash
# --- once on the server ---
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2
# MongoDB must already be running on 127.0.0.1:27017

git clone https://github.com/Besher-Hamze/al-sharqiya.git
cd al-sharqiya

# --- backend ---
cd sharqiya_backend
cp .env.example .env
nano .env
# PORT=3020
# MONGODB_URI=mongodb://127.0.0.1:27017/sharqiya
# JWT_ACCESS_SECRET / JWT_REFRESH_SECRET = long random hex
# COOKIE_SECURE=false
# CORS_ORIGINS=http://SERVER_IP:3018,http://SERVER_IP:3019
mkdir -p logs
npm ci
npm run seed
npm run build

# --- website (NEXT_PUBLIC_* are baked at build time) ---
cd ../sharqiya_website
cat > .env.production <<'EOF'
API_URL=http://127.0.0.1:3020
NEXT_PUBLIC_API_URL=http://SERVER_IP:3020
NEXT_PUBLIC_ASSET_URL=http://SERVER_IP:3020
NEXT_PUBLIC_SITE_URL=http://SERVER_IP:3018
EOF
# then replace SERVER_IP
nano .env.production
mkdir -p logs
npm ci
npm run build

# --- dashboard ---
cd ../sharqiya_dashboard
cat > .env.production <<'EOF'
NEXT_PUBLIC_API_URL=http://SERVER_IP:3020/api/v1
NEXT_PUBLIC_ASSET_URL=http://SERVER_IP:3020
NEXT_PUBLIC_WEBSITE_URL=http://SERVER_IP:3018/en
EOF
nano .env.production
mkdir -p logs
npm ci
npm run build

# --- start all three ---
cd ..
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Open firewall ports `3018`, `3019`, `3020`.

- Website: `http://SERVER_IP:3018/en`
- Dashboard: `http://SERVER_IP:3019`
- API docs: `http://SERVER_IP:3020/api/docs`
- Login: `admin@alsharqiya.ae` / `Sharqiya#2026`

If you change `NEXT_PUBLIC_*`, rebuild that app then `pm2 restart sharqiya-website` / `sharqiya-dashboard`.
