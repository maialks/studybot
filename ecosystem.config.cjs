module.exports = {
  apps: [
    {
      name: 'studybot',
      script: 'dist/main.js',
      watch: '.',
      env: {
        NODE_ENV: 'dev',
      },
    },
  ],
};
