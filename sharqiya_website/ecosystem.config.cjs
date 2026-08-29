module.exports = {
  apps: [
    {
      name: "sharqiya-website",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3018 -H 0.0.0.0",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3018,
        HOSTNAME: "0.0.0.0",
        API_URL: "http://127.0.0.1:3020",
      },
      max_memory_restart: "768M",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      time: true,
      autorestart: true,
      watch: false,
    },
  ],
};
