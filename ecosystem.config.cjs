module.exports = {
  apps: [
    {
      name: 'studybot',
      script: 'dist/main.js',
      cwd: '/opt/studybot',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'dev',
      },
      env_file: '/opt/studybot/.env',
      error_file: '/opt/studybot/logs/err.log',
      out_file: '/opt/studybot/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      time: true,
    },
  ],
};
