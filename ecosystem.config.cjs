module.exports = {
  apps: [
    {
      name: 'studybot',
      script: 'dist/main.js',
      watch: false,
      env: {
        NODE_ENV: 'dev',
      },
    },
  ],
};
