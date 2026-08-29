# Production PM2 — http://217.76.56.247 (no domain)

| App | Port | URL |
|---|---|---|
| Website | **3070** | http://217.76.56.247:3070/en |
| Dashboard | **3071** | http://217.76.56.247:3071 |
| API | **3072** | http://217.76.56.247:3072/api/docs |

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
# set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET (long random hex)
# CORS is already set for 217.76.56.247
mkdir -p logs
npm ci
npm run seed
npm run build

# --- website (NEXT_PUBLIC_* are baked at build time) ---
cd ../sharqiya_website
cp .env.production.example .env.production
mkdir -p logs
npm ci
npm run build

# --- dashboard ---
cd ../sharqiya_dashboard
cp .env.production.example .env.production
mkdir -p logs
npm ci
npm run build

# --- start all three ---
cd ..
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Open firewall ports `3070`, `3071`, `3072`.

Login: `admin@alsharqiya.ae` / `Sharqiya#2026`

If you change `NEXT_PUBLIC_*`, rebuild that app then `pm2 restart sharqiya-website` / `sharqiya-dashboard`.
