module.exports = {
    apps: [
      {
        name: "Fireberry-leader",
        script: './dist/server.js',
        env: {
          NODE_ENV: 'development',
          dotenv: './.env',
        },
        env_production: {
          NODE_ENV: 'production',
          dotenv: './.env',
        },
      },
    ],
  };
  